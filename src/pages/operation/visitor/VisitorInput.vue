<template>
    <div class="container">
        <navbar :title="titleText" @close="closeNav" />
        <scroll-view scroll-y="true" class="scroll-Y" :style="{height: scrollHeight + 'rpx'}">
            <view class="center-body">
                <u-form ref="uFormRef" :model="model" :rules="rules" :error-type="['message']">
                    <u-form-item label="来访站点" prop="siteName" label-width="150" :required="true" style="position: relative;">
                        <u-input 
                            v-model="model.siteName" 
                            type="select"
                            :select-open="isShowSiteList" 
                            placeholder="请选择站点" 
                            @click="isShowSiteList = true"
                        />
                    </u-form-item>
                    <u-form-item label="来访单位" prop="company" label-width="150" :required="true" style="position: relative;">
                        <u-input 
                            v-model="model.company" 
                            type="text"
                            placeholder="请输入来访单位"
                        />
                    </u-form-item>
                    <u-form-item label="来访时间" prop="reportTimeStr" :required="true" label-width="150">
                        <div class="time-input" @click="isShowTimeSelectStart = true">
                            <image src="@/static/images/common/date.png" alt="" />
                            <span>
                                {{ model.reportTimeStr }}
                            </span>
                        </div>
                    </u-form-item>
                    <u-form-item label="来访原因" prop="reason" label-width="150" :required="true" style="position: relative;">
                        <u-input 
                            v-model="model.reason" 
                            type="text"
                            placeholder="请输入来访原因"
                        />
                    </u-form-item>
                    <u-form-item label="来访人数" prop="number" label-width="150" style="position: relative;">
                        <u-input 
                            v-model="model.number" 
                            type="text"
                            placeholder="请输入来访人数"
                        />
                    </u-form-item>
                    <u-form-item label="报备时间" prop="timeStr" label-width="220">
                        <div class="time-input" @click="isShowTimeSelectEnd = true">
                            <image src="@/static/images/common/date.png" alt="" />
                            <span>
                                {{ model.timeStr }}
                            </span>
                        </div>
                    </u-form-item>
                    <u-form-item label-position="top" label="备注" prop="remark" label-width="150">
                        <u-input
                            v-model="model.remark" 
                            type="textarea"
                            input-align="left"
                            placeholder="请添加备注"
                        />
                    </u-form-item>
                    <u-form-item label-position="top" label="现场照片" prop="picture" label-width="150">
                        <u-upload
                            ref="uUploadRef"
                            :file-list="fileList"
                            :action="config.fileHost + '/file-base-server/api/v1/sys/upload'"
                            :auto-upload="true"
                            :show-progress="true"
                            width="160"
                            height="160"
                            @onUploaded="finishUpload"
                        ></u-upload>
                    </u-form-item>
                </u-form>
            </view>
        </scroll-view>
        <div class="submit" @click="submitForm">
            提交
        </div>
        <!-- 来访站点 -->
        <u-action-sheet v-model="isShowSiteList" v-model:active-index="siteIndex" :list="siteNameList" @click="handleSite"></u-action-sheet>
        <!-- 来访时间 -->
        <u-date-time-group-picker
            :disabled-date="disabledDate" 
            :show="isShowTimeSelectStart"
            mode="time"
            :types="dateTypes"
            :type="dateType"
            cancel-text="取消"
            @onPickerCancel="isShowTimeSelectStart = false"
            @onPickerConfirm="onPickerConfirmStart"
        />
        <!-- 报备时间 -->
        <u-date-time-group-picker
            :disabled-date="disabledDate"
            :show="isShowTimeSelectEnd"
            mode="time"
            :types="dateTypes"
            :type="dateType"
            cancel-text="取消"
            @onPickerCancel="isShowTimeSelectEnd = false"
            @onPickerConfirm="onPickerConfirmEnd"
        />
    </div>
</template>
<script lang="ts" setup>
import config from '@/api/config'
import { VisitorInputData } from './types'
import moment from 'moment'
import service from '@/api/service'
import { onReady } from "@dcloudio/uni-app"
import { getTheSiteNameList, getUserData, showToast } from '@/utils/commonUtils'
const data: VisitorInputData = reactive({
    titleText: '访客登记',
    scrollHeight: 0,
    model: {
        siteName: '',
        company: '',
        reportTime: '',
        reportTimeStr: '',
        reason: '',
        number: '',
        time: '',
        timeStr: '',
        remark: '',
        picture: '',
        siteId: '',
        userId: '',
        userName: ''
    },
    siteIndex: null,
    siteNameList: [],
    isShowSiteList: false,
    isShowTimeSelectStart: false,
    isShowTimeSelectEnd: false,
    rules: {
        siteName: [{ required: true, message: '请选择站点', trigger: 'blur', }],
        company: [{ required: true, message: '请输入来访单位', trigger: 'blur', }],
        reportTime: [{ required: true, message: '请选择来访时间', trigger: 'blur', }],
        reason: [{ required: true, message: '请输入来访原因', trigger: 'blur', }]
    },
    curReportTime: '',
    dateTypes: ['hour'],
    dateType: 'hour',
    disabledDate: (date: Date) => {
        return date > new Date()
    },
    fileList: []
})
const uFormRef = ref<any>() 
const uUploadRef = ref('')
/**
 * 返回主界面
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
//来访时间
const onPickerConfirmStart = (val: Date) => {
    data.model.reportTimeStr = moment(val).format('YYYY.MM.DD HH:00')
    data.model.reportTime = moment(val).valueOf()
    data.isShowTimeSelectStart = false
}
// 报备时间
const onPickerConfirmEnd = (val: Date) => {
    data.model.timeStr = moment(val).format('YYYY.MM.DD HH:00')
    data.model.time = moment(val).valueOf()
    data.isShowTimeSelectEnd = false
}
/**
 * 站点选择
 * @param index 索引
 */
const handleSite = (index: number) => {
    const currCheck = data.siteNameList[index]
    data.model.siteId = currCheck.id
    data.model.siteName = currCheck.text
}

onMounted(() => {
    getScrollHeight()
    getSiteList()
})
onReady(function() {
	uFormRef.value.setRules(data.rules)
}) 
/**
 * 获取可滚动区域
 */
const getScrollHeight = () => {
    uni.getSystemInfo({
        success: function (res: Record<string, any>) {
            data.scrollHeight = (res.screenHeight - 50 - 80) * 2
        },
    })
}
/**
 * 获取站点列表
 */
const getSiteList = async () => {
    getTheSiteNameList().then(res => {
        const siteNameList = res
        data.siteNameList = siteNameList.map(item => {
            return {
                text: item.siteName,
                id: item.siteId
            }
        })
    })
}
/**
 * 图片上传成功
 * @param lists 
 */
const finishUpload = (lists: Record<string, any>[]) => {
    const imgList: string[] = []
    lists.forEach((file: Record<string, any>) => {
        if (file.response && file.response.length) {
            imgList.push(file.response[0].ID)
        }
    })
    data.model.picture = imgList.join(',')
}
/**
 * 表单提交验证
 */
const submitForm = () => {
    uFormRef.value.validate(async (valid: boolean) => {
		if (valid) {
            // 日期处理、图片ID处理
            const userData = getUserData() 
            if(!userData) return
            data.model.userId = userData.userId
            data.model.userName = userData.name
            console.log('验证通过')
            await formDataCommit()
		} else {
			console.log('验证失败')
		}
	})
}
/**
 * 表单提交
 */
const formDataCommit = async () => {
    const listRes = await service('visitor/addVisitor', data.model)
    if (listRes.data === 1) {
        showToast('提交成功', 'success', 1000)
        setTimeout(() => {
            goBack()
        }, 1000)

    } else {
        showToast('提交失败', 'error', 1000)
    }
}
/**
 * 返回上个界面
 */
const goBack = () => {
    uni.navigateBack()
}
const { 
    titleText, 
    model, 
    rules, 
    siteIndex, 
    siteNameList, 
    isShowSiteList, 
    isShowTimeSelectStart, 
    isShowTimeSelectEnd, 
    dateTypes, 
    dateType, 
    disabledDate, 
    fileList,
    scrollHeight
} = toRefs(data)
</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    .center-body {
        padding: 0 32rpx 0 32rpx;
        background-color: white;
    }
    .time-input{
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        image {
            width: 17.1px;
            height: 19px;
            margin-left: 10rpx;
        }
    }
    .bottom-btn {
        display: flex;
        position: fixed;
        justify-content: space-between;
        bottom: 0;
        width: 100%;
        height: 196rpx;
        padding: 28rpx 80rpx;
        background-color: white;
    }
    .must-icon {
        position: absolute;
        left: -15rpx;
        
    }
    .submit {
        position: fixed;
        bottom: 32rpx;
        width: 79%;
        height: 72rpx;
        margin-left: 10.5%;
        border-radius: 36rpx;
        background: #3296FA;
        box-shadow: 0px 4px 8px 0px rgba(50, 150, 250, 0.3);
        color: #fff;
        font-size: 28rpx;
        font-weight: 500;
        text-align: center;
        line-height: 72rpx;

    }
}  
</style>