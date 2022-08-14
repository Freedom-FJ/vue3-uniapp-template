<template>
    <view class="topView">
        <view class="welcom">
            <view class="hello">
                您好，
            </view>
            <view class="wel">
                欢迎来到水站运维V2.0.0
            </view>
        </view>
        <div class="loginBox">
            <view ref="loginView" class="loginView">
                <view class="countText">
                    账号登录
                </view>
                <input v-model="userName" class="input" type="text" focus placeholder="请输入用户名">
                <div class="password">
                    <u-input
                        v-model="passWord"
                        class="input"
                        type="password"
                        :password-icon="true"
                        password="true"
                        placeholder="请输入密码"
                        placeholder-style="{
                        color: '#909399'
                    }"
                    />
                    <image v-if="passWord" class="close" src="@/static/images/login/clear.png" @click="clearPassword"></image>
                </div>
                <button class="loginBtn" @click="login()">
                    登录
                </button>
            </view>
            <div class="autologin">
                <u-checkbox-group>
                    <u-checkbox v-model="isAutoLogin">
                        自动登录
                    </u-checkbox>
                </u-checkbox-group>
            </div>
        </div>
        
        <view v-if="false" class="fingerprint">
            <image src="@/static/images/login/fingerprint.png" style="width: 148rpx;height: 148rpx" mode="scaleToFill" @click="fingerAuth"></image>
            <view>使用指纹后自动输入用户名密码</view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import config from '@/api/config'
import service from '@/api/service'
import md5 from 'js-md5'
import type { userDataTs } from '@/types/common'
import { checkFingerPrint } from './auth'
import { systemMenuInit } from '@/utils/systemInit'

const data = reactive({
    userName: '',
    passWord: '',
    isAutoLogin: false
})

// onMounted(() => {})
/**
 * @name 登录请求
 */
const login = async () => {
    uni.showLoading({})
    // const url = getApp().globalData?.url ?? ''
    const md5Data = {
        userName: data.userName,
        passWord: data.passWord,
    }
    // md5Data.passWord = md5(md5Data.passWord)
    try {
        const res = await service<userDataTs>('login/loginIn', md5Data)
        uni.hideLoading()
        if (res.data && Number(res.code) === 200) {
            if (getApp().globalData) {
                (getApp().globalData as record).token = res.data.token;
                (getApp().globalData as record).useName = res.data.userName;
                (getApp().globalData as record).useId = res.data.userId
            }
            const storeData = {
                ...res.data,
                isAutoLogin: data.isAutoLogin
            }
            uni.setStorage({
                key: 'loginDate',
                data: storeData,
                success: function () {
                    //
                }
            })
            systemMenuInit()
            try {
                uni.setStorage({
                    key: 'token',
                    data: res.data.token,
                })
                config.token = res.data.token
                uni.reLaunch({
                    url: '/pages/realTime/RealTime'
                })
            } catch (e) {
                alert(e)
            }
        } else {
            uni.showToast({
                icon: 'none',
                title: res.message,
                duration: 2000
            })
        }
    } catch (e) {
        console.log('login error', e)
        uni.hideLoading()
        uni.showToast({
            icon: 'none',
            title: '登录失败',
            duration: 2000
        })
    }
}
const fingerAuth = () => {
    //指纹认证
    // checkFingerPrint()
}
/**
 * 清除密码
 */
const clearPassword = () => {
    data.passWord = ''
}
const { userName, passWord, isAutoLogin } = toRefs(data)
</script>

<style lang="scss" scoped>
.topView {
    width: 100%;
    height: 100vh;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url(@/static/images/login/bg.png);
    position: relative;
    .loginBg {
        width: 100%;
        height: 500rpx;
        image {
            width: 100%;
            height: 100%;
        }
    }
    .welcom {
        position: absolute;
        top: 78rpx;
        left: 80rpx;
        .hello {
            font-size: 56rpx;
            color: #FFFFFF;
            text-shadow: 0px 1px 2px 0px rgba(40, 64, 88, 0.3);
        }
        .wel {
            margin-top: 14rpx;
            font-size: 32rpx;
            color: rgba(255, 255, 255, 0.6);
            text-shadow: 0px 1px 2px 0px rgba(40, 64, 88, 0.3);
        }
    }
    .fingerprint {
        position: absolute;
        bottom: 40rpx;
        width: 100%;
        text-align: center;
        color: #526384;
        font-size: 28rpx;
		z-index: 9;
        image {
            width: 148rpx;
            height: 148rpx;
            margin-bottom: 30rpx;
        }
    }
}
.loginBox {
    position: absolute;
    top: 376rpx;
    left: 48rpx;
    width: 100%;
    z-index: 200;
    .autologin {
        padding-left: 48rpx;
        padding-top: 36rpx;
        
    }
}
::v-deep.u-theme-normal .u-checkbox__label {
    color: #909399!important;
    font-size: 14px!important;
}
.loginView {
    width: calc(100% - 96rpx);
    height: 552rpx;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 32rpx;
    border: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(20px);
    box-shadow: inset 0px -2px 8px 0px rgba(255, 255, 255, 0.5),inset 0px -8px 40px 0px rgba(255, 255, 255, 0.5);
    .countText {
        text-align: center;
        padding: 18px 0 8px 0;
        color: #fff;
        font-size: 32rpx;
    }
    input, .password {
        width: 85%;
        margin-left: 7.5%;
        height: 126rpx;
        font-size: 28rpx;
        border-bottom: 2rpx solid #DCDFE6;
    }
    .password {
        line-height: 126rpx;
        position: relative;
        .close {
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            right: 50rpx;
            top: 43rpx
        }
    }
    .loginBtn {
        width: 85%;
        height: 72rpx;
        margin-top: 64rpx;
        margin-left: 7.5%;
        border-radius: 18px;
        background: #409EFF;
        font-size: 28rpx;
        color: #fff;
        box-shadow: 0px 6px 12px 0px rgba(40, 64, 88, 0.2),inset 0px -2px 4px 0px rgba(255, 255, 255, 0.4),inset 0px -16px 16px 0px #0080FF,inset 0px 2px 16px 0px rgba(255, 255, 255, 0.5);
    }
}
.input:-internal-autofill-selected {
    background-color: #f3f8ff;
}
</style>
