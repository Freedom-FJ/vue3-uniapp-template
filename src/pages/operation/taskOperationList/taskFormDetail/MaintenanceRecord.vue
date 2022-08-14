<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="container-body" :style="{ height: state === '0' ? 'calc(100% - 44px - 160rpx)' : 'calc(100% - 44px)'}">
            <empty-common v-if="!(equipmentLists||[]).filter(item => item.isCheck).length" text="暂无数据" style="padding-top: 24rpx"></empty-common>
            <view v-for="(item, index) in equipmentLists" v-show="item.isCheck" :key="index" class="instrument-item">
                <view class="top-name">
                    <span>{{ item.name }}</span>
                    <image v-if="state==='0'" src="@/static/images/operation/delete.png" @click="item.isCheck = false"></image>
                </view>
                <view class="form-body">
                    <u-form :ref="el => item.formRef = el" :model="item.data" :rules="rules" :error-type="['message']">
                        <u-form-item label="故障开始时间" :required="true" prop="brokeTime" label-width="220">
                            <div class="time-input" @click="state==='0' && (item.isShowBrokeTime = true)">
                                <image src="@/static/images/common/date.png" alt="" />
                                <span>
                                    {{ item.data.brokeTime }}
                                </span>
                            </div>
                        </u-form-item>
                        <u-form-item label="维修开始时间" :required="true" prop="operationBeginTime" label-width="220">
                            <div class="time-input" @click="state==='0' && (item.isShowOperationBeginTime = true)">
                                <image src="@/static/images/common/date.png" alt="" />
                                <span>
                                    {{ item.data.operationBeginTime }}
                                </span>
                            </div>
                        </u-form-item>
                        <u-form-item label="正常投入使用时间" :required="true" prop="useTime" label-width="300">
                            <div class="time-input" @click="state==='0' && (item.isShowUseTime = true)">
                                <image src="@/static/images/common/date.png" alt="" />
                                <span>
                                    {{ item.data.useTime }}
                                </span>
                            </div>
                        </u-form-item>
                        <u-form-item label="是否更换关键部件" prop="isKeyPart" label-width="300">
                            <div class="time-input">
                                <u-switch
                                    v-model="item.data.isKeyPart"
                                    active-value="1"
                                    inactive-value="0"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="故障现象描述" label-position="top" :required="true" prop="brokeDescription" label-width="250">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.brokeDescription"
                                    type="textarea"
                                    input-align="left"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="故障原因" label-position="top" :required="true" prop="brokeReason" label-width="250">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.brokeReason"
                                    type="textarea"
                                    input-align="left"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="处理过程及结果" label-position="top" :required="true" prop="processResults" label-width="250">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.processResults"
                                    type="textarea"
                                    input-align="left"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="校准情况说明" label-position="top" :required="true" prop="calibrationRemark" label-width="250">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.calibrationRemark"
                                    type="textarea"
                                    input-align="left"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="备注" label-position="top" prop="multipointVerificationRemark" label-width="250">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.multipointVerificationRemark"
                                    type="textarea"
                                    input-align="left"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="现场照片" label-position="top" prop="picture" label-width="250">
                            <u-upload
                                v-if="state==='0'"
                                :ref="el => item.uploadRef = el"
                                :file-list="item.imgList"
                                :action="config.fileHost + '/file-base-server/api/v1/sys/upload'"
                                :auto-upload="true"
                                :index="item.name"
                            >
                            </u-upload>
                            <view v-else class="img-show">
                                <view v-for="(imgItem, imgIndex) in item.imgList" :key="imgItem.url">
                                    <image style="height: 130rpx; width: 130rpx;" :src="imgItem.url" @click="showBigImg(imgIndex, item.imgList)"></image>
                                </view>
                            </view>
                        </u-form-item>
                    </u-form>
                </view>
                <u-picker
                    v-model="item.isShowBrokeTime"
                    mode="time"
                    :params="timePickerParam"
                    @confirm="(time:any) => item.data.brokeTime = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`"
                ></u-picker>
                <u-picker
                    v-model="item.isShowOperationBeginTime"
                    mode="time"
                    :params="timePickerParam"
                    @confirm="(time:any) => item.data.operationBeginTime = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`"
                ></u-picker>
                <u-picker
                    v-model="item.isShowUseTime"
                    mode="time"
                    :params="timePickerParam"
                    @confirm="(time:any) => item.data.useTime = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`"
                ></u-picker>
            </view>
        </view>
        <view v-show="state==='0'" class="btn-box">
            <u-button shape="circle" type="success" @click="isShowInstrumentPop = true">
                选择仪器
            </u-button>
            <u-button shape="circle" type="primary" @click="upData()">
                提交
            </u-button>
        </view>
        <u-popup
            v-model="isShowInstrumentPop"
            border-radius="10" 
            mode="bottom"
            length="70%"
            :mask="true" 
            @close="close"
            @open="open"
        >
            <view class="popup-container">
                <view class="popup-search">
                    <u-search v-model="searchInstrument" :height="56" :show-action="false" bg-color="#F2F6FC" placeholder-color="#909399" :clearable="true" placeholder="请输入站点名称" />
                </view>
                <view class="instrument-total">
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">配件总数：{{ equipmentLists.length }}</span>
                    </view>
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">选中配件数：</span>
                        <span class="instrument-total-value">{{ equipmentLists.filter(item => item.isCheck).length }}</span>
                    </view>
                </view>
                <view class="instrument-box">
                    <view class="instrument-flex">
                        <view v-for="(item, index) in searchEquipmentList" :key="index" :class="[item.isCheck ? 'is-check-type' : 'instrument-type']" @click="item.isCheck=!item.isCheck">
                            <span>{{ item.name }}</span>
                        </view>
                    </view>
                </view>
                <view class="instrument-btn-box">
                    <u-button shape="circle" :custom-style="{ color: '#3296FA',background: '#F2F6FC'}" type="info" @click="resetSearch()">
                        重置
                    </u-button>
                    <u-button shape="circle" type="primary" @click="changeInstrumentSearch()">
                        查询
                    </u-button>
                </view>
            </view>
        </u-popup>
    </view>
</template>
<script lang="ts" setup>
import { onLoad, onReady } from "@dcloudio/uni-app"
import $service from '@/api/service'
import { equipmentList, showBigImg, navigateBackSetTime, showToast } from '@/utils/commonUtils'
import moment from 'moment'
import config from '@/api/config'
import service from '@/api/service'

interface equipmentMaintenanceRecordListTs{
    brokeTime: string
    picture: string
    equipmentId: string
    operationBeginTime: string
    useTime: string
    isKeyPart: '0'|'1'
    brokeDescription: string
    brokeReason: string
    processResults: string
    calibrationRemark: string
    multipointVerificationRemark: string
}
interface equipmentTs {
    formRef: any
    uploadRef: any
    imgList: {
        url: string,
        error: boolean,
        progress: number
    }[]
    isShowBrokeTime: boolean
    isShowOperationBeginTime: boolean
    isShowUseTime: boolean
    isCheck: boolean,
    name: string,
    data: equipmentMaintenanceRecordListTs
}
const { domain } = config
const timePickerParam = { year: true, month: true, day: true, hour: true, minute: true, second: false }
const data = reactive({
    titleText: '仪器设备检修记录表',
    isShowInstrumentPop: false,
    state: '', //站点状态
    searchInstrument: '', // 仪器搜索
    siteId: '', // 站点id
    id: '', // 任务/工单id
    formId: -1, // 表单id
    isFault: 0, //  如果是1 就是故障 0 巡检
    equipmentLists: [] as equipmentTs[],
    searchEquipmentList: [] as equipmentTs[],
    rules: {
        brokeTime: [{ required: true, message: '请输入故障开始时间', trigger: 'blur', }],
        operationBeginTime: [{ required: true, message: '请输入维修开始时间', trigger: 'blur', }],
        useTime: [{ required: true, message: '请输入正常投入使用时间', trigger: 'blur', }],
        brokeDescription: [{ required: true, message: '请输入故障现象描述', trigger: 'blur', }],
        brokeReason: [{ required: true, message: '请输入故障原因', trigger: 'blur', }],
        processResults: [{ required: true, message: '请输入处理过程及结果', trigger: 'blur', }],
        calibrationRemark: [{ required: true, message: '请输入校准情况说明', trigger: 'blur', }],
    },
})

onLoad(function (option) {
    data.siteId = option.siteId || ''
    data.id = option.id || ''
    data.isFault = Number(option.isFault || '0')
    data.state = option.state || '0'
    data.titleText = decodeURIComponent(decodeURIComponent(option.formName || '')
)
    getEquipment()
})
onReady(function () {
    allEquipmentSetRules()
}) 
/**
 * @name 获取设备选项
 */
const getEquipment = async() => {
    const equipmentLists = await equipmentList(data.siteId)
    data.equipmentLists = (equipmentLists || []).map(item => {
        return {
            formRef: ref(),
            uploadRef: ref(),
            imgList: [],
            isShowBrokeTime: false,
            isShowOperationBeginTime: false,
            isShowUseTime: false,
            isCheck: false,
            name: item.name,
            data: {
                equipmentId: item.id,
                brokeTime: '',
                picture: '',
                operationBeginTime: '',
                useTime: '',
                isKeyPart: '0',
                brokeDescription: '',
                brokeReason: '',
                processResults: '',
                calibrationRemark: '',
                multipointVerificationRemark: '',
            }
            
        }
    })
    data.searchEquipmentList = data.equipmentLists
    getData()

}

/**
 * @name 获取设备选项
 */
const allEquipmentSetRules = async () => { 
    data.equipmentLists.forEach(item => {
        item.formRef?.setRules(data.rules)
    })
}
/**
 * @name 获取数据
 */
const getData = () => {
    
    const params = {
        workId: data.id,
        type: data.isFault ? 'BROKE' : 'WEEK'
    }
    $service<{
        id: number
        equipmentMaintenanceRecordList: equipmentMaintenanceRecordListTs[]
    }>('patrolInspectionTask/equipmentMaintenanceGet', params).then(res => {
        if(!res.data) return
        data.formId = res.data?.id
        const currEquipmentMaintenanceRecordList = res.data.equipmentMaintenanceRecordList
        currEquipmentMaintenanceRecordList.forEach(item => {
            const currEquipment = data.equipmentLists.filter(equipment => Number(equipment.data.equipmentId) === Number(item.equipmentId))
            console.log(currEquipment,'currEquipment')
            if (currEquipment.length) {
                currEquipment[0].data = item
                currEquipment[0].isCheck = true
                const pic = item.picture
                currEquipment[0].imgList = pic ? pic.split(',').map(item => {
                    return {
                        url: domain + '/file-base-server/api/v1/sys/download/' + item,
                        error: false,
                        progress: 100
                    }
                }) : []
            }
        })
    })
}
/**
 * @name 提交
 */
const upData = () => {
    const validList: boolean[] = []
    data.equipmentLists.forEach((item) => {
        item.isCheck && item.formRef?.validate((valid:boolean) => {
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
 * @name 搜索改变
 */
const changeInstrumentSearch = () => {
    if(!data.searchInstrument) {
        data.searchEquipmentList = data.equipmentLists
    } else {
        data.searchEquipmentList = data.equipmentLists.filter(item => item.name.indexOf(data.searchInstrument) !== -1)
    }
}
/**
 * @name 提交请求
 */
const toSendData = () => {
    const params = {
        recordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        id: data.formId,
        type: data.isFault ? 'BROKE' : 'WEEK',
        workId: data.id,
        equipmentMaintenanceRecordList: [] as equipmentMaintenanceRecordListTs[]
    }
    data.equipmentLists.forEach(item => {
        if (item.isCheck) {
            const refList = item.uploadRef?.lists || []
            const imgList:string[] = []
            refList.forEach((refItem: {
                response?: {
                    ID: string
                }[]
                url: string,
                error: boolean,
                progress: number
            }) => {
                if (refItem.response) imgList.push(refItem.response[0].ID)
                else {
                    const url = refItem.url
                    const lastInd = url.lastIndexOf('/') + 1
                    const picId = url.slice(lastInd)
                    imgList.push(picId)
                }
            })
            item.data.picture = imgList.join(',')
            item.data.isKeyPart = item.data.isKeyPart ? '1' : '0'
            params.equipmentMaintenanceRecordList.push(item.data)
        }

    })
    service('patrolInspectionTask/equipmentMaintenanceSave', params).then(res => {
        uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
        })
        if (res.code === 200) navigateBackSetTime()
    })
}
/**
 * @name 重置搜索
 */
const resetSearch = () => {
    data.searchInstrument = ''
    console.log('object')
    changeInstrumentSearch()
    data.equipmentLists.forEach(item => {
        item.isCheck = false
    })
}

/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/**
 * @name 打开仪器选择框
 */
const open = () => {
    // 
}

/**
 * @name 关闭仪器选择框
 */
const close = () => {
    console.log('close')
    allEquipmentSetRules()
}

const {
    titleText,
    isShowInstrumentPop,
    searchInstrument,
    searchEquipmentList,
    equipmentLists,
    rules,
    state
} = toRefs(data)

</script>
<style lang="scss" scoped>
@import "./common.scss";
</style>