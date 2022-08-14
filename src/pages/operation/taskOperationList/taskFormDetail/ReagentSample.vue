<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view
            class="container-body"
            :style="{ height: state === '0' ? 'calc(100% - 44px - 160rpx)' : 'calc(100% - 44px)' }"
        >
            <empty-common
                v-if="!(equipmentLists || []).filter(item => item.isCheck).length"
                text="暂无数据"
                style="padding-top: 24rpx"
            ></empty-common>
            <view v-for="(item, index) in equipmentLists" v-show="item.isCheck" :key="index" class="instrument-item">
                <view class="top-name">
                    <span>{{ item.name }}</span>
                    <image
                        v-show="state === '0'"
                        src="@/static/images/operation/delete.png"
                        @click="item.isCheck = false"
                    ></image>
                </view>
                <view v-show="state === '0'" class="reagent-btn-box">
                    <u-button
                        shape="circle"
                        :custom-style="{ background: 'rgba(42, 201, 79, 0.05)', border: '1px solid #2AC94F', color: 'rgba(42, 201, 79, 1)' }"
                        type="info"
                        @click="item.isShowReagentList = true, currShowReagentListIndex = index"
                    >
                        {{ `选择${typeStr}` }}
                    </u-button>
                </view>
                <view class="form-body">
                    <view
                        v-for="(reagentItem) in item.reagentList"
                        v-show="reagentItem.isReagentCheck"
                        :key="reagentItem.data.reagentName"
                        class="reagent-box"
                    >
                        <view class="indent-line"></view>
                        <u-form
                            :ref="el => reagentItem.formRef = el"
                            :model="reagentItem.data"
                            :rules="rules"
                            :error-type="['message']"
                        >
                            <u-form-item
                                v-for="(formItem) in formObj[openType]"
                                :key="formItem.key"
                                :required="formItem.required"
                                :prop="formItem.prop"
                                :label="formItem.label"
                                :label-width="formItem.labelWidth"
                            >
                                <div class="time-input">
                                    <view v-if="formItem.inputType === 'num-btn'" class="number-btn">
                                        <view
                                            :class="[reagentItem.data[formItem.key] === 0 ? 'btn-disabled' : '', 'btn-control']"
                                            @click="reagentItem.data[formItem.key] && reagentItem.data[formItem.key]--"
                                        >
                                            -
                                        </view>
                                        <view class="btn-text">
                                            {{ reagentItem.data[formItem.key] || 0 }}
                                        </view>
                                        <view
                                            class="btn-control"
                                            @click="reagentItem.data[formItem.key] !== undefined && reagentItem.data[formItem.key]++"
                                        >
                                            +
                                        </view>
                                    </view>
                                    <u-switch
                                        v-if="formItem.inputType === 'switch'"
                                        v-model="reagentItem.data[formItem.key]"
                                        active-value="1"
                                        inactive-value="0"
                                    />
                                    <div
                                        v-if="formItem.inputType === 'time'"
                                        class="time-input"
                                        @click="formItem.isShowKey && (reagentItem[formItem.isShowKey] = true)"
                                    >
                                        <image src="@/static/images/common/date.png" alt="" />
                                        <span>
                                            {{ reagentItem.data[formItem.key] }}
                                        </span>
                                    </div>
                                    <u-input
                                        v-if="!['switch', 'num-btn', 'time'].includes(formItem.inputType)"
                                        v-model="reagentItem.data[formItem.key]"
                                        :type="formItem.inputType"
                                        :disabled="formItem.disabled"
                                    />
                                </div>
                            </u-form-item>
                        </u-form>

                        <u-picker
                            v-model="reagentItem.isShowChangeTime"
                            mode="time"
                            :params="{ year: true, month: true, day: true, hour: true, minute: true, second: false }"
                            @confirm="(time: any) => reagentItem.data.changeTime = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`"
                        >
                        </u-picker>
                        <u-picker
                            v-if="openType === 'reagent'"
                            v-model="reagentItem.isShowConfigurationTime"
                            mode="time"
                            :params="timePickerParam"
                            @confirm="(time: any) => reagentItem.data.configurationTime = `${time.year}-${time.month}-${time.day}`"
                        >
                        </u-picker>
                        <u-picker
                            v-if="openType === 'reagent'"
                            v-model="reagentItem.isShowValidDate"
                            mode="time"
                            :params="timePickerParam"
                            @confirm="(time: any) => reagentItem.data.validDate = `${time.year}-${time.month}-${time.day}`"
                        >
                        </u-picker>
                    </view>
                    <view class="indent-line"></view>

                    <view class="upload-box">
                        <view class="top-text">
                            现场照片
                        </view>
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
                                <image :src="imgItem.url" @click="showBigImg(imgIndex, item.imgList)"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-show="state === '0'" class="btn-box">
            <u-button shape="circle" type="success" @click="isShowInstrumentPop = true">
                选择设备
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
                    <u-search
                        v-model="searchInstrument"
                        :height="56"
                        :show-action="false"
                        bg-color="#F2F6FC"
                        placeholder-color="#909399"
                        :clearable="true"
                        placeholder="请输入设备名称"
                    />
                </view>
                <view class="instrument-total">
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">{{ `设备总数：${equipmentLists.length}` }}</span>
                    </view>
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">选中设备数：</span>
                        <span class="instrument-total-value">{{ equipmentLists.filter(item => item.isCheck).length
                        }}</span>
                    </view>
                </view>
                <view class="instrument-box">
                    <view class="instrument-flex">
                        <view
                            v-for="(item, index) in searchEquipmentList"
                            :key="index"
                            :class="[item.isCheck ? 'is-check-type' : 'instrument-type']"
                            @click="item.isCheck = !item.isCheck"
                        >
                            <span>{{ item.name }}</span>
                        </view>
                    </view>
                </view>
                <view class="instrument-btn-box">
                    <u-button
                        shape="circle"
                        :custom-style="{ color: '#3296FA', background: '#F2F6FC' }"
                        type="info"
                        @click="resetSearch()"
                    >
                        重置
                    </u-button>
                    <u-button shape="circle" type="primary" @click="changeInstrumentSearch()">
                        查询
                    </u-button>
                </view>
            </view>
        </u-popup>

        <u-popup
            v-if="searchEquipmentList.length"
            v-model="searchEquipmentList[currShowReagentListIndex].isShowReagentList"
            border-radius="10"
            mode="bottom"
            length="70%"
            :mask="true"
            @close="closeReagent"
        >
            <view class="popup-container">
                <view class="popup-search">
                    <u-search
                        v-model="searchEquipmentList[currShowReagentListIndex].searchReagent"
                        :height="56"
                        :show-action="false"
                        bg-color="#F2F6FC"
                        placeholder-color="#909399"
                        :clearable="true"
                        :placeholder="`请输入${typeStr}名称`"
                    />
                </view>
                <view class="instrument-total">
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">{{ `${typeStr}总数：${searchEquipmentList[currShowReagentListIndex].reagentList.length}`
                            
                        }}</span>
                    </view>
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">{{ `选中${typeStr}数：` }}</span>
                        <span class="instrument-total-value">{{
                            searchEquipmentList[currShowReagentListIndex].reagentList.filter(item =>
                                item.isReagentCheck).length
                        }}</span>
                    </view>
                </view>
                <view class="instrument-box">
                    <view class="instrument-flex">
                        <view
                            v-for="(item, index) in searchEquipmentList[currShowReagentListIndex].reagentSearchList"
                            :key="index"
                            :class="[item.isReagentCheck ? 'is-check-type' : 'instrument-type']"
                            @click="item.isReagentCheck = !item.isReagentCheck"
                        >
                            <span>{{ item.data.name }}</span>
                        </view>
                    </view>
                </view>
                <view class="instrument-btn-box">
                    <u-button
                        shape="circle"
                        :custom-style="{ color: '#3296FA', background: '#F2F6FC' }"
                        type="info"
                        @click="resetReagentSearch()"
                    >
                        重置
                    </u-button>
                    <u-button shape="circle" type="primary" @click="changeInstrumentReagentSearch()">
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
import { equipmentList, getEquipmentType, showToast, showBigImg, navigateBackSetTime } from '@/utils/commonUtils'
import config from '@/api/config'
import moment from 'moment'
import service from '@/api/service'
import type {
    openTypeTs,
    equipmentTs,
    reagentListTs,
    ReagentSampleFormObj,
    ReagentSampleServiceTs,
    picFileItemTs,
    reagentSampleChangeRecordEquipmentListTs,
    equipmentKeyParameterChangeRecordEquipmentVoListTs,
    consumableKitChangeRecordEquipmentListTs
} from './type'
const { domain } = config

const timePickerParam = { year: true, month: true, day: true, hour: false, minute: false, second: false }

const urlObj = {
    get: {
        'reagent': 'patrolInspectionTask/reagentSampleGet',
        'accessories': 'patrolInspectionTask/consumableKitGet',
        'keyParameter': 'patrolInspectionTask/equipmentKeyParameterGet',
    },
    save: {
        'reagent': 'patrolInspectionTask/reagentSampleSave',
        'accessories': 'patrolInspectionTask/consumableKitSave',
        'keyParameter': 'patrolInspectionTask/equipmentKeyParameterSave',
    }
}
// 当前类型对应的显示文字 用于按钮显示使用
const labelObj = { 'reagent': { typeStr: '试剂' }, 'accessories': { typeStr: '配件' }, 'keyParameter': { typeStr: '参数' } }
const formObj = {
    'reagent': [
        { label: "试剂名称", labelWidth: "180", prop: "", required: false, key: 'reagentName', inputType: 'text', disabled: true },
        { label: "试剂体积", labelWidth: "180", prop: "reagentVolume", required: true, key: 'reagentVolume', inputType: 'number', disabled: false },
        { label: "配置日期", labelWidth: "180", prop: "configurationTime", required: true, key: 'configurationTime', inputType: 'time', isShowKey: 'isShowConfigurationTime' },
        { label: "有效日期", labelWidth: "180", prop: "validDate", required: true, key: 'validDate', inputType: 'time', isShowKey: 'isShowValidDate' },
        { label: "更换时间", labelWidth: "180", prop: "changeTime", required: true, key: 'changeTime', inputType: 'time', isShowKey: 'isShowChangeTime' },
    ],
    'accessories': [
        { label: "配件名称", labelWidth: "180", prop: "", required: false, key: 'kitName', inputType: 'text', disabled: true },
        { label: "更换数量", labelWidth: "180", prop: "changeNum", required: true, key: 'changeNum', inputType: 'num-btn', disabled: false },
        { label: "更换时间", labelWidth: "180", prop: "changeTime", required: true, key: 'changeTime', inputType: 'time', isShowKey: 'isShowChangeTime' },
        { label: "是否关键部件", labelWidth: "220", prop: "isKeyPart", required: true, key: 'isKeyPart', inputType: 'switch' },
        { label: "更换原因", labelWidth: "180", prop: "changeReason", required: true, key: 'changeReason', inputType: 'text', disabled: false },
    ],
    'keyParameter': [
        { label: "关键参数", labelWidth: "180", prop: "", required: false, key: 'keyParameter', inputType: 'text', disabled: true },
        { label: "变更前参数值", labelWidth: "220", prop: "beforeValue", required: true, key: 'beforeValue', inputType: 'number', disabled: false },
        { label: "参数值", labelWidth: "180", prop: "value", required: true, key: 'value', inputType: 'number', disabled: false },
        { label: "更换原因", labelWidth: "180", prop: "changeReason", required: true, key: 'changeReason', inputType: 'text', disabled: false },
    ]
} as Record<openTypeTs, ReagentSampleFormObj[]>

const data = reactive({
    titleText: '试剂及标准样品更换记录表',
    isShowInstrumentPop: false,
    state: '', //站点状态
    searchInstrument: '', // 仪器搜索
    siteId: '', // 站点id
    id: '', // 任务/工单id
    formId: -1, // 表单id
    typeStr: '', // 显示的类型对应的描述文字
    isFault: 0, //  打开类型 如果是1 就是故障类型
    openType: '' as openTypeTs,
    currShowReagentListIndex: 0, // 当前显示的 试剂选择弹框的对应的设备索引
    equipmentLists: [] as equipmentTs[],
    searchEquipmentList: [] as equipmentTs[],
    rules: {
        changeTime: [{ required: true, message: '请输入更换时间', trigger: 'blur', }],
        validDate: [{ required: true, message: '请输入有效日期', trigger: 'blur', }],
        configurationTime: [{ required: true, message: '请输入配置日期', trigger: 'blur', }],
        changeReason: [{ required: true, message: '请输入更换原因', trigger: 'blur', }],
        reagentVolume: [{ required: true, message: '请输入试剂体积', trigger: 'blur', }],
        value: [{ required: true, message: '请输入参数值', trigger: 'blur', }],
        beforeValue: [{ required: true, message: '请输入变更前参数', trigger: 'blur', }],
    },
})

onLoad(function (option) {
    data.siteId = option.siteId || ''
    data.id = option.id || ''
    data.state = option.state || '0'
    data.isFault = Number(option.isFault || '0')
    data.titleText = decodeURIComponent(decodeURIComponent(option.formName || ''))
    data.openType = (option.openType || 'reagent') as openTypeTs
    data.typeStr = labelObj[data.openType].typeStr
    getEquipment()
})
onReady(function () {
    allEquipmentSetRules()
})
/**
 * @name 获取设备选项
 */
const getEquipment = async () => {
    const equipmentLists = await equipmentList(data.siteId)
    const currAsync = (equipmentLists || []).map(async (item) => {
        const equipmentDetail = await getEquipmentType(item.id)
        const currReagent = equipmentDetail[data.openType]
        const curEquipment = {
            uploadRef: ref(),
            imgList: [],
            isCheck: false,
            name: item.name,
            equipmentId: item.id,
            isShowReagentList: false,
            searchReagent: '',
            reagentList: (currReagent || []).map(reagent => {
                return {
                    formRef: ref(),
                    isReagentCheck: false,
                    isShowConfigurationTime: false,
                    isShowChangeTime: false,
                    isShowValidDate: false,
                    data: data.openType === 'reagent' ? {
                        name: reagent.name,
                        reagentId: reagent.id,
                        reagentName: reagent.name,
                        reagentVolume: reagent.volume ? reagent.volume + '' : '0', // 传数字表单无法校验
                        configurationTime: '',
                        changeTime: '',
                        validDate: '',
                    } : data.openType === 'accessories' ? {
                        name: reagent.name,
                        kitId: reagent.id,
                        kitName: reagent.name,
                        changeTime: '',
                        changeReason: '',
                        isKeyPart: '0',
                        changeNum: reagent.volume || 0
                    } : {
                        name: reagent.name,
                        keyParameterId: reagent.id,
                        keyParameter: reagent.name,
                        value: '',
                        beforeValue: '',
                        changeReason: ''
                    }
                }
            }),
            reagentSearchList: [] as reagentListTs[]

        }
        curEquipment.reagentSearchList = curEquipment.reagentList as any
        return curEquipment
    })
    Promise.all(currAsync).then(res => {

        getData(res as any)
    })

}

/**
 * @name 获取设备选项
 */
const allEquipmentSetRules = async () => {
    data.equipmentLists.forEach(item => {
        item.isCheck && item.reagentList.forEach((reagent) => {
            reagent.isReagentCheck && reagent.formRef?.setRules(data.rules)
        })
    })
}
/**
 * @name 获取数据
 */
const getData = (allEquip: equipmentTs[]) => {

    const params = {
        workId: data.id,
        type: data.isFault ? 'BROKE' : 'WEEK'
    }
    const url = urlObj.get[data.openType]
    $service<ReagentSampleServiceTs>(url, params).then(res => {
        if (!res.data) return
        data.formId = res.data?.id
        let currEquipmentMaintenanceRecordList: equipmentTs[] = []
        if (data.openType === 'reagent') currEquipmentMaintenanceRecordList = res.data.reagentSampleChangeRecordEquipmentList || []
        else if (data.openType === 'accessories') currEquipmentMaintenanceRecordList = res.data.consumableKitChangeRecordEquipmentList || []
        else if (data.openType === 'keyParameter') currEquipmentMaintenanceRecordList = res.data.equipmentKeyParameterChangeRecordEquipmentVoList || []
        currEquipmentMaintenanceRecordList.forEach((item) => {
            const index = allEquip.findIndex(equipment => Number(equipment.equipmentId) === Number(item.equipmentId))
            if (index === -1) return
            const currEquipment = allEquip[index]
            const pic = item.picture || ''
            currEquipment.imgList = pic ? pic.split(',').map(picSrc => {
                return {
                    url: domain + '/file-base-server/api/v1/sys/download/' + picSrc,
                    error: false,
                    progress: 100
                }
            }) : []
            currEquipment.isCheck = true
            const currEquipmentReagentList = currEquipment.reagentList
            if (!currEquipmentReagentList.length) return
            // 试剂
            if (item.reagentSampleChangeRecordReagentList) {
                item.reagentSampleChangeRecordReagentList.forEach((reagentSample: any) => {
                    const indexReagent = currEquipmentReagentList.findIndex(equipment => Number(equipment.data.reagentId) === Number(reagentSample.reagentId))
                    if (indexReagent === -1) return
                    const currEquipmentReagent = currEquipmentReagentList[indexReagent]
                    const midReagent = reagentSample as reagentListTs['data']
                    currEquipmentReagent.data.changeTime = midReagent.changeTime
                    currEquipmentReagent.data.configurationTime = midReagent.configurationTime
                    currEquipmentReagent.data.validDate = midReagent.validDate
                    midReagent.reagentVolume && (currEquipmentReagent.data.reagentVolume = midReagent.reagentVolume + '')
                    currEquipmentReagent.isReagentCheck = true
                })
                 // 配件
            } else if (item.consumableKitChangeRecordKitList) {
                item.consumableKitChangeRecordKitList.forEach((reagentSample: any) => {
                    const indexReagent = currEquipmentReagentList.findIndex(equipment => Number(equipment.data.kitId) === Number(reagentSample.kitId))
                    if (indexReagent === -1) return
                    const currEquipmentReagent = currEquipmentReagentList[indexReagent]
                    const midReagent = reagentSample as reagentListTs['data']
                    currEquipmentReagent.data.changeTime = midReagent.changeTime
                    currEquipmentReagent.data.changeNum = midReagent.changeNum || 0
                    currEquipmentReagent.data.isKeyPart = midReagent.isKeyPart === 1 ? '1' : '0'
                    currEquipmentReagent.data.changeReason = midReagent.changeReason || ''
                    currEquipmentReagent.isReagentCheck = true
                })
                // 精确参数
            } else if (item.equipmentKeyParameterChangeRecordParameterList) {
                item.equipmentKeyParameterChangeRecordParameterList.forEach((reagentSample: any) => {
                    const indexReagent = currEquipmentReagentList.findIndex(equipment => Number(equipment.data.keyParameterId) === Number(reagentSample.keyParameterId))
                    if (indexReagent === -1) return
                    const currEquipmentReagent = currEquipmentReagentList[indexReagent]
                    const midReagent = reagentSample as reagentListTs['data']
                    currEquipmentReagent.data.value = midReagent.value
                    currEquipmentReagent.data.beforeValue = midReagent.beforeValue
                    currEquipmentReagent.data.changeReason = midReagent.changeReason
                    currEquipmentReagent.isReagentCheck = true
                })
            }
        })
        data.equipmentLists = allEquip
        data.searchEquipmentList = data.equipmentLists
    })
}
/**
 * @name 提交
 */
const upData = () => {
    const validList: boolean[] = []
    data.equipmentLists.forEach((item) => {
        item.isCheck && item.reagentList.forEach((reagent) => {
            reagent.isReagentCheck && reagent.formRef?.validate((valid: boolean) => {
                validList.push(valid)
            })
        })
    })
    if (validList.some(item => !item)) {
        showToast('表单校验未通过!')
    } else {
        toSendData()
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
        reagentSampleChangeRecordEquipmentList: [] as reagentSampleChangeRecordEquipmentListTs[],
        consumableKitChangeRecordEquipmentList: [] as consumableKitChangeRecordEquipmentListTs[],
        equipmentKeyParameterChangeRecordEquipmentVoList: [] as equipmentKeyParameterChangeRecordEquipmentVoListTs[],
    }
    data.equipmentLists.forEach(item => {
        if (item.isCheck) {
            const refList = item.uploadRef?.lists || []
            const imgList: string[] = []
            refList.forEach((refItem: picFileItemTs) => {
                if (refItem.response) imgList.push(refItem.response[0].ID)
                else {
                    const url = refItem.url
                    const lastInd = url.lastIndexOf('/') + 1
                    const picId = url.slice(lastInd)
                    imgList.push(picId)
                }
            })
            if (data.openType === 'reagent') { // 试剂
                const reagentSampleChangeRecordEquipmentItem = {
                    picture: imgList.join(','),
                    equipmentId: item.equipmentId,
                    reagentSampleChangeRecordReagentList: item.reagentList.filter(item => item.isReagentCheck).map(item => item.data)
                }
                params.reagentSampleChangeRecordEquipmentList.push(reagentSampleChangeRecordEquipmentItem)
            } else if (data.openType === 'accessories') { // 配件耗材参数回传
                const reagentSampleChangeRecordEquipmentItem = {
                    picture: imgList.join(','),
                    equipmentId: item.equipmentId,
                    consumableKitChangeRecordKitList: item.reagentList.filter(item => item.isReagentCheck).map(item => {
                        return {
                            kitId: item.data.kitId,
                            kitName: item.data.kitName,
                            changeNum: item.data.changeNum,
                            changeTime: item.data.changeTime,
                            changeReason: item.data.changeReason,
                            isKeyPart: item.data.isKeyPart ? '1' : '0',
                        }
                    })
                }
                params.consumableKitChangeRecordEquipmentList.push(reagentSampleChangeRecordEquipmentItem as any)
            } else if (data.openType === 'keyParameter') { // 关键参数
                const reagentSampleChangeRecordEquipmentItem = {
                    picture: imgList.join(','),
                    equipmentId: item.equipmentId,
                    equipmentKeyParameterChangeRecordParameterList: item.reagentList.filter(item => item.isReagentCheck).map(item => item.data)
                }
                params.equipmentKeyParameterChangeRecordEquipmentVoList.push(reagentSampleChangeRecordEquipmentItem as any)
            }

        }

    })
    const url = urlObj.save[data.openType]

    service(url, params).then(res => {
        uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
        })
        if (res.code === 200) navigateBackSetTime()
    })
}
/**
 * @name 搜索改变
 */
const changeInstrumentSearch = () => {
    if (!data.searchInstrument) {
        data.searchEquipmentList = data.equipmentLists
    } else {
        data.searchEquipmentList = data.equipmentLists.filter(item => item.name.indexOf(data.searchInstrument) !== -1)
    }
}
/**
 * @name 重置搜索
 */
const resetSearch = () => {
    data.searchInstrument = ''
    changeInstrumentSearch()
    data.equipmentLists.forEach(item => {
        item.isCheck = false
    })
}

/**
 * @name 搜索试剂改变
 */
const changeInstrumentReagentSearch = () => {
    const currEquipment = data.equipmentLists[data.currShowReagentListIndex]
    if (!currEquipment.searchReagent) {
        currEquipment.reagentSearchList = currEquipment.reagentList
    } else {
        currEquipment.reagentSearchList = currEquipment.reagentList.filter(item => item.data.name.indexOf(currEquipment.searchReagent) !== -1)
    }
}
/**
 * @name 重置试剂搜索
 */
const resetReagentSearch = () => {
    const currEquipment = data.equipmentLists[data.currShowReagentListIndex]
    currEquipment.searchReagent = ''
    currEquipment.reagentList.forEach(element => {
        element.isReagentCheck = false
    })
}
/**
 * @name 关闭仪器选择框
 */
const close = () => {
    allEquipmentSetRules()
}
/**
 * @name 关闭仪器试剂选择框
 */
const closeReagent = () => {
    allEquipmentSetRules()
}
/**
 * @name 打开仪器选择框
 */
const open = () => {
    // 
}
/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}


const {
    titleText,
    isShowInstrumentPop,
    searchInstrument,
    searchEquipmentList,
    equipmentLists,
    rules,
    state,
    currShowReagentListIndex,
    openType,
    typeStr
} = toRefs(data)

</script>
<style lang="scss" scoped>
@import "./common.scss";

.upload-box {
    padding: 0 25rpx;

    .top-text {
        padding: 10rpx 15rpx 0;
        font-family: PingFangSC;
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        color: #303133;
    }
}

.reagent-box {
    margin-bottom: 15rpx;
    padding: 0 40rpx;
    background-color: white;

}

.indent-line {
    width: 125%;
    height: 10rpx;
    margin-left: -45rpx;
    background-color: #F2F6FC;
}

.reagent-btn-box {
    display: flex;
    padding: 20rpx 0;
    justify-content: center;
}

.form-body {
    padding: 0 !important;
}

.number-btn {
    display: flex;
    align-items: center;

    .btn-control:first-child {
        border-radius: 10rpx 0 0 10rpx;
    }

    .btn-control:lase-child {
        border-radius: 0 10rpx 10rpx 0;
    }

    .btn-control {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50rpx;
        width: 50rpx;
        background-color: rgb(244, 237, 237);
    }

    .btn-text {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10rpx;
        height: 50rpx;
        width: 50rpx;
        background-color: rgb(244, 237, 237);
    }

    .btn-disabled {
        opacity: 0.5;
    }
}
</style>