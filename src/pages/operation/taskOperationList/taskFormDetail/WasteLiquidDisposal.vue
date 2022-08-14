<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view
            class="container-body"
            :style="{ height: state === '0' ? 'calc(100% - 44px - 160rpx)' : 'calc(100% - 44px)' }"
        >
            <empty-common v-if="!wasteLiquidList.length" text="暂无数据" style="padding-top: 24rpx"></empty-common>
            <view v-for="(item, index) in wasteLiquidList" :key="index" class="instrument-item">
                <view class="top-name">
                    <span></span>
                    <image v-show="state === '0'" src="@/static/images/operation/delete.png" @click="deleteData(index)"></image>
                </view>
                <view class="form-body">
                    <u-form :ref="el => item.formRef = el" :model="item.data" :rules="rules" :error-type="['message']">
                        <u-form-item label="处理时间" :required="true" prop="disposalTime" label-width="150">
                            <div class="time-input" @click="state === '0' && (item.isShowDisposalTime = true)">
                                <image src="@/static/images/common/date.png" alt="" />
                                <span>
                                    {{ item.data.disposalTime }}
                                </span>
                            </div>
                        </u-form-item>
                        <u-form-item label="处理方式" :required="true" prop="disposalWay" label-width="150">
                            <div class="time-input">
                                <u-input v-model="item.data.disposalWay" placeholder="请输入" />
                            </div>
                        </u-form-item>
                        <u-form-item label="产生废液名称" :required="true" prop="liquidWasteParameter" label-width="200">
                            <div class="time-input">
                                <u-input v-model="item.data.liquidWasteParameter" placeholder="请输入" />
                            </div>
                        </u-form-item>
                        <u-form-item label="废液量(L)" prop="liquidWasteNum" :required="true" label-width="150">
                            <div class="time-input">
                                <u-input v-model="item.data.liquidWasteNum" type="number" placeholder="请输入" />
                            </div>
                        </u-form-item>
                        <u-form-item label="处置人" :required="true" prop="disposalManName" label-width="120">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.disposalManName"
                                    :select-open="item.isShowDisposalMan"
                                    placeholder="请输入"
                                    type="select"
                                    @click=" state === '0' && (item.isShowDisposalMan = true)"
                                />
                            </div>
                        </u-form-item>
                        <u-action-sheet
                            v-model="item.isShowDisposalMan"
                            v-model:active-index="item.disposalManIndex"
                            :list="disposalManList"
                            @click="(index: number) => handlePrincipalList(index, item)"
                        >
                        </u-action-sheet>
                    </u-form>
                </view>
                <u-picker
                    v-model="item.isShowDisposalTime"
                    mode="time"
                    :params="timePickerParam"
                    @confirm="(time: any) => item.data.disposalTime = `${time.year}-${time.month}-${time.day}`"
                >
                </u-picker>
            </view>
            <view v-if="wasteLiquidList.length" class="other-form">
                <u-form :model="paramsOther" :error-type="['message']">
                    <u-form-item label="现场照片" label-position="top" prop="picture" label-width="250">
                        <u-upload
                            v-if="state === '0'"
                            :ref="el => data.upLoadRef = el"
                            :file-list="paramsOther.imgList"
                            :action="config.fileHost + '/file-base-server/api/v1/sys/upload'"
                            :auto-upload="true"
                            index="name"
                        >
                        </u-upload>
                        <view v-else class="img-show">
                            <view v-for="(item, index) in paramsOther.imgList" :key="item.url">
                                <image :src="item.url" @click="showBigImg(index)"></image>
                            </view>
                        </view>
                    </u-form-item>
                    <u-form-item label="备注" label-position="top" prop="remark" label-width="250">
                        <div class="other-remark">
                            <u-input v-model="paramsOther.remark" type="textarea" input-align="left" placeholder="请输入" />
                        </div>
                    </u-form-item>
                </u-form>
            </view>
        </view>
        <view v-show="state === '0'" class="btn-box">
            <u-button shape="circle" type="success" @click="addItem()">
                新增
            </u-button>
            <u-button shape="circle" type="primary" @click="upData()">
                提交
            </u-button>
        </view>
    </view>
</template>
<script lang="ts" setup>

import { onLoad, onReady } from "@dcloudio/uni-app"
import $service from '@/api/service'
import { getTheSitePrincipalName, navigateBackSetTime } from '@/utils/commonUtils'
import { showToast } from '@/utils/commonUtils'
import moment from 'moment'
import config from '@/api/config'
import service from '@/api/service'
import type{ liquidWasteDisposalTs, picFileItemTs, WasteLiquidDisposalServiceTs } from './type'

const { domain } = config
const timePickerParam = { year: true, month: true, day: true, hour: false, minute: false, second: false }
const data = reactive({
    titleText: '废液处置记录表',
    state: '', //站点状态
    siteId: '', // 站点id
    id: '', // 任务/工单id
    formId: -1, // 表单id
    isFault: 0, //  打开类型 如果是1 就是故障类型
    wasteLiquidList: [] as liquidWasteDisposalTs[],
    disposalManList: [] as actionSheetTs[],
    upLoadRef: ref(),
    paramsOther: {
        picture: '',
        remark: '',
        imgList: [] as {
            url: string,
            error: boolean,
            progress: number
        }[]
    },
    rules: {
        disposalTime: [{ required: true, message: '请输入处理时间', trigger: 'blur', }],
        disposalWay: [{ required: true, message: '请输入处理方式', trigger: 'blur', }],
        liquidWasteParameter: [{ required: true, message: '请输入产生废液名称', trigger: 'blur', }],
        liquidWasteNum: [{ required: true, message: '请输入废液量', trigger: 'blur', }],
        disposalManName: [{ required: true, message: '请输入处置人', trigger: 'blur', }],
    },
})

onLoad(function (option) {
    data.siteId = option.siteId || ''
    data.id = option.id || ''
    data.state = option.state || '0'
    data.isFault = Number(option.isFault || '0')
    data.titleText = decodeURIComponent(option.formName || '')
    Promise.all([getTheSitePrincipalName(), getData()]).then(res => {
        const sitePrincipalNameList = res[0] || []
        data.disposalManList = sitePrincipalNameList.map(item => {
            return {
                text: item.opePerson,
                id: item.id
            }
        })
        data.wasteLiquidList.forEach((curr) => {
            const currMan = sitePrincipalNameList.filter((item) => item.id === curr.data.disposalMan)
            if (!currMan.length) return
            curr.data.disposalManName = currMan[0].opePerson
        })
    })

})
onReady(function () {
    allEquipmentSetRules()
})

/**
 * @name 获取设备选项
 */
const allEquipmentSetRules = async () => {
    data.wasteLiquidList.forEach(item => {
        item.formRef?.setRules(data.rules)
    })
}
/**
 * @name 获取数据
 */
const getData = async () => {
    const params = {
        workId: data.id,
        type: data.isFault ? 'BROKE' : 'WEEK'
    }
    const res = await $service<WasteLiquidDisposalServiceTs>('patrolInspectionTask/liquidWasteGet', params)
    if (!res.data) return
    data.formId = res.data?.id
    const pic = res.data.picture
    data.paramsOther.imgList = pic ? pic.split(',').map(item => {
        return {
            url: domain + '/file-base-server/api/v1/sys/download/' + item,
            error: false,
            progress: 100
        }
    }) : []
    const liquidWasteDisposalRecordList = res.data.liquidWasteDisposalRecordList || []
    data.paramsOther.remark = res.data.remark || ''
    data.wasteLiquidList = liquidWasteDisposalRecordList.map((item) => {
        return {
            formRef: ref(),
            isShowDisposalTime: false,
            isShowDisposalMan: false,
            disposalManIndex: -1,
            data: item
        }
    })
}
/**
 * @name 提交
 */
const upData = () => {
    const validList: boolean[] = []
    data.wasteLiquidList.forEach((item) => {
        item.formRef?.validate((valid: boolean) => {
            validList.push(valid)
        })
    })
    if (validList.some(item => !item)) {
        showToast('表单校验未通过!')
    } else {
        toSendData()
    }

}
/**
 * @name 处置人选择事件
 */
const handlePrincipalList = (index: number, item: liquidWasteDisposalTs) => {
    const currDisposalMan = data.disposalManList[index]
    item.data.disposalMan = currDisposalMan.id
    item.data.disposalManName = currDisposalMan.text
}
/**
 * @name 删除当前项目
 */
const deleteData = (index: number) => {
    data.wasteLiquidList.splice(index, 1)
}

const showBigImg = (index:number) => {
        uni.previewImage({
            current: index,
            urls: data.paramsOther.imgList.map(item => item.url) //必须是网址路径，否则加载不出来，如：http：或https：
    })
}
/**
 * @name 提交请求
 */
const toSendData = () => {
    const imgList = data.upLoadRef?.lists || []
    const imgIdList: string[] = []
    imgList.forEach((item: picFileItemTs) => {
        if (item.response) imgIdList.push(item.response[0].ID)
        else {
            const url = item.url
            const lastInd = url.lastIndexOf('/') + 1
            const picId = url.slice(lastInd)
            imgIdList.push(picId)
        }
    })
    const picture = imgIdList.join(',')
    const sendParam = {
        recordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        id: data.formId,
        type: data.isFault ? 'BROKE' : 'WEEK',
        workId: data.id,
        picture,
        remark: data.paramsOther.remark,
        liquidWasteDisposalRecordList: (data.wasteLiquidList || []).map(item => item.data)
    }

    service('patrolInspectionTask/liquidWasteSave', sendParam).then(res => {
        uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
        })
         if (res.code === 200) navigateBackSetTime()
    })
}


/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}

/**
 * @name 新增废液处置项
 */
const addItem = () => {
    const item = {
        formRef: ref(),
        isShowDisposalTime: false,
        isShowDisposalMan: false,
        disposalManIndex: -1,
        data: {
            disposalTime: '',
            disposalWay: '',
            liquidWasteParameter: '',
            liquidWasteNum: '',
            disposalMan: '',
            disposalManName: '',
        }
    }
    data.wasteLiquidList.push(item)
    nextTick(() => {
        allEquipmentSetRules()
    })
}

const {
    titleText,
    paramsOther,
    disposalManList,
    wasteLiquidList,
    rules,
    state
} = toRefs(data)

</script>
<style lang="scss" scoped>
@import "./common.scss";
.other-form {
    padding: 0 40rpx;
    background-color: white;
    width: 720rpx;
    margin: 0 auto;
}
.instrument-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.is-check-type {
    margin-bottom: 0 !important;
}
.instrument-type {
    margin-bottom: 0 !important;

}
.other-remark {
    width: 100%;
}
</style> 