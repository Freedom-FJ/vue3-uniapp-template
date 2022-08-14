<!--
 * @Author: Tian
 * @Date: 2022-08-04 10:30:22
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-04 16:01:49
 * @Description: 
-->
<template>
    <div class="changePass">
        <div class="oldPass">
            <input
                v-model="oldPassWord"
                class="input"
                type="text"
                password="true"
                placeholder="请输入原密码"
            >
        </div>
        <div class="newPass">
            <input
                v-model="newPassWord"
                class="input"
                type="text"
                password="true"
                placeholder="请输入新密码"
            >
            <input
                v-model="confirmPassWord"
                class="input"
                type="text"
                password="true"
                placeholder="确认新密码"
            >
        </div>
        <div class="intro">
            密码长度6~16位字符；需含字母和数字；
        </div>
        <div class="submit" @click="confirm">
            提交
        </div>
        <div v-if="showPopup" class="mask">
            <div class="popup">
                <div class="textTitle">
                    {{ pasVaildText }}
                </div>
                <div class="confirm" @click="closePop">
                    确认
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { ChangePassData, ChangePasswordRes } from './type'
import service from '@/api/service'
const data: ChangePassData = reactive({
    oldPassWord: '',
    newPassWord: '',
    confirmPassWord: '',
    showPopup: false,
    pasVaildText: ''
})
const confirm = () => {
    checkPassWord()
}
//密码校验
const checkPassWord = () => {
    const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
    if (data.newPassWord === null || data.newPassWord.length < 6 || data.newPassWord.length > 16) {
        data.pasVaildText = "请输入6~16位字符，需含字母和数字"
        data.showPopup = true
    } else if (!reg.test(data.newPassWord)) { //新密码是否满足正则表达式
        data.pasVaildText = '请输入正确格式新密码'
        data.showPopup = true
    } else if (data.newPassWord === data.oldPassWord) {
        data.pasVaildText = '新密码和原密码相同，请重新输入'
        data.showPopup = true
    } else if (data.newPassWord !== data.confirmPassWord) {
        data.pasVaildText = '新密码两次输入不同，请重新输入'
        data.showPopup = true
    } else {
        // 接口请求
        modifyPsd()
    }
}
// 密码修改
const modifyPsd = async () => {
    const res = await service<ChangePasswordRes, true>(`login/changePassword`, {
        originPassword: data.oldPassWord,
        newPassword: data.newPassWord,
        repeatPassword: data.confirmPassWord
    })
    if (res.success) {
        uni.showToast({
            icon: 'none',
            title: '密码修改成功，请重新登录',
            duration: 1000
        })
        setTimeout(() => {
            goToLogin()
        }, 1000)
    } else {
        data.pasVaildText = res.message
        data.showPopup = true
    }
}
// 密码修改完成后重新登录
const goToLogin = () => {
    uni.removeStorage({
        key: 'loginDate',
        success: (res: Record<string, string>) => {
            console.log('success', res)
            uni.reLaunch({
                url: '/pages/login/Login'
            })
            
            
        }
    })
}
// 关闭弹框
const closePop = () => {
    data.showPopup = false
}
const { oldPassWord, newPassWord, confirmPassWord, showPopup, pasVaildText } = toRefs(data)
</script>
<style lang="scss" scoped>
.changePass {
    width: 100%;
    height: 100vh;
    background: rgba(236, 240, 247, 1);
    .oldPass {
        margin-bottom: 16rpx;
        input {
            width: 100%;
            height: 96rpx;
            background: #fff;
            padding-left: 40rpx;
			box-sizing: border-box;
        }
    }
    .newPass {
        padding-left: 40rpx;
        background: #fff;
		box-sizing: border-box;
        input {
            width: 100%;
			// width: calc(100% - 40rpx);
            height: 96rpx;
            
            
            border-bottom: 1px solid #EBEEF5;
        }
    }
    .intro {
        color: #909399;
        font-size: 24rpx;
        line-height: 40rpx;
        padding: 0 40rpx;
        margin-top: 16rpx;
    }
    .submit {
        margin: 64rpx 80rpx 0 80rpx;
        background: #3296FA;
        box-shadow: 0px 4px 8px 0px rgba(50, 150, 250, 0.3);
        height: 72rpx;
        border-radius: 36rpx;
        font-size: 28rpx;
        color: #fff;
        line-height: 72rpx;
        text-align: center;
    }
    .mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        .popup {
            width: 77%;
            height: 224rpx;
            margin-left: 11.5%;
            background: #FFFFFF;
            box-shadow: 0px 2px 8px 0px rgba(40, 64, 88, 0.1);
            border-radius: 24rpx;
            font-size: 32rpx;
            text-align: center;
            .textTitle {
                color: #303133;
                height: 126rpx;
                border-bottom: 1px solid #E4E7ED;
                line-height: 126rpx;
            }
            .confirm {
                color: #3296FA;
                line-height: 96rpx;
            }
        }
    }
}
</style>