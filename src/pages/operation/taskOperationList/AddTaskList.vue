<template>
    <div class="container">
        <navbar :title="titleText" @close="closeNav" />
        <view class="flow-body">
            <view class="center-body">
                <u-form ref="uFormRef" :model="model" :rules="rules" :error-type="['message']">
                    <u-form-item label="站点" prop="siteName" label-width="120" :required="true" style="position: relative;">
                        <u-input 
                            v-model="model.siteName" 
                            type="select"
                            :select-open="isShowSiteList" 
                            placeholder="请选择站点" 
                            @click="isShowSiteList = true"
                        />
                    </u-form-item>
                    <u-form-item label="负责人" :required="true" prop="resPersonName" label-width="120">
                        <u-input 
                            v-model="model.resPersonName" 
                            :select-open="isShowPrincipalList" 
                            :disabled="true"
                            placeholder="请选择负责人" 
                            @click="showToast('请选择站点！')"
                        />
                        <!-- type="select"  -->
                        <!-- @click="isShowPrincipalList = true"  -->
                    </u-form-item>
                    <u-form-item v-if="!isTask" label="协办人" prop="assistManName" label-width="120">
                        <u-input 
                            v-model="model.assistManName" 
                            type="select" 
                            :select-open="isShowAssitList" 
                            placeholder="选择协办人" 
                            @click="assToShowCheckList" 
                        />
                    </u-form-item>
                    <u-form-item v-if="!isTask" label="故障设备" prop="equipmenName" label-width="130">
                        <u-input 
                            v-model="model.equipmenName" 
                            type="select" 
                            :select-open="isShowEquipmentList" 
                            placeholder="选择故障设备" 
                            @click="equipmenToShowCheckList" 
                        />
                    </u-form-item>
                    <u-form-item v-if="!isTask" label-position="top" label="故障内容" prop="brokeInfo">
                        <u-input
                            v-model="model.brokeInfo"
                            type="textarea"
                            input-align="left"
                            placeholder="输入故障内容"
                        />
                    </u-form-item>
                    <u-form-item v-if="!isTask" label="故障开始时间" prop="startTime" label-width="220">
                        <div class="time-input" @click="isShowTimeSelectStart = true">
                            <image src="@/static/images/common/date.png" alt="" />
                            <span>
                                {{ model.startTime }}
                            </span>
                        </div>
                    </u-form-item>
                    <u-form-item
                        v-if="!isTask"
                        label="故障结束时间"
                        prop="endTime"
                        label-width="220"
                    >
                        <div class="time-input" @click="showEndTimePanel">
                            <image src="@/static/images/common/date.png" alt="" />
                            <span>
                                {{ model.endTime }}
                            </span>
                        </div>
                    </u-form-item>
                    <u-form-item
                        v-if="!isTask"
                        label="处理时限"
                        :required="true"
                        prop="handTimeLimit"
                        label-width="130"
                    >
                        <u-input
                            v-model="model.handTimeLimit"
                            type="select"
                            :select-open="isShowTimeLimitSelect"
                            placeholder="处理时限"
                            @click="isShowTimeLimitSelect = true"
                        />
                    </u-form-item>
                    <u-form-item v-if="isTask" label-position="top" label="备注" prop="remark">
                        <u-input
                            v-model="model.issuedRemark"
                            input-align="left"
                            type="textarea"
                            placeholder="输入备注"
                        />
                    </u-form-item>
                    <u-form-item v-else label-position="top" label="备注" prop="remark">
                        <u-input
                            v-model="model.remark"
                            input-align="left"
                            type="textarea"
                            placeholder="输入备注"
                        />
                    </u-form-item>
                </u-form>
            </view>
        </view>
    
        <view class="bottom-btn">
            <u-button shape="circle" style="margin-right: 30rpx;" @click="cancel">
                取消
            </u-button>
            <u-button shape="circle" type="primary" @click="submit">
                确定
            </u-button>
        </view>
   
        <!-- 站点 -->
        <u-action-sheet v-model="isShowSiteList" v-model:active-index="siteIndex" :list="siteNameList" @click="handleSite"></u-action-sheet>
        <!-- 负责人 -->
        <u-action-sheet v-model="isShowPrincipalList" v-model:active-index="principaIndex" :list="sitePrincipalNameList" @click="handlePrincipalList"></u-action-sheet>
        <!-- 协办人 -->
        <u-action-sheet v-model="isShowAssitList" v-model:active-index="assitIndex" :list="siteAssitNameList" @click="handleAssitList"></u-action-sheet>
        <!-- 设备列表 -->
        <u-action-sheet v-model="isShowEquipmentList" v-model:active-index="equipmentIndex" :list="currEquipmentList" @click="handleEquipmentList"></u-action-sheet>
    
        <!-- 开始时间 -->
        <u-picker
            v-model="isShowTimeSelectStart"
            mode="time"
            :default-time="moment().format('YYYY-MM-DD HH:mm')"
            :params="{ year: true, month: true, day: true, hour: true, minute: true, second: false
            }"
            @confirm="onPickerConfirmStart"
        ></u-picker>
        <!-- 结束时间 -->
        <u-picker
            v-model="isShowTimeSelectEnd"
            :default-time="moment().format('YYYY-MM-DD HH:mm')"
            mode="time"
            :params="{ year: true, month: true, day: true, hour: true, minute: true, second: false
            }"
            @confirm="onPickerConfirmEnd"
        ></u-picker>
        <!-- 截至时间 -->
        <u-picker
            v-model="isShowTimeLimitSelect"
            :default-time="moment().format('YYYY-MM-DD HH:mm')"
            mode="time"
            :params="{ year: true, month: true, day: true, hour: true, minute: true, second: false
            }"
            @confirm="onPickerConfirmLimit"
        ></u-picker>
    </div>
</template>
<script lang="ts" setup>

import moment from 'moment'
import { onLoad, onReady } from "@dcloudio/uni-app"
import service from '@/api/service'
import {
    getTheSiteNameList,
    getTheSitePrincipalName,
    getTheSiteAssitNameList,
    equipmentList,
    showToast,
    getStationPerson
} from '@/utils/commonUtils'
import type { onPickerTimeStartTs } from './type'
import { UserInfoRes } from '@/types/common' 

const data = reactive({
    titleText: '新增巡检',
    isTask: true, // true 巡检 false 故障
    model: {
        siteId: '',
        siteName: '',
        resPersonId: '',
        resPersonName: '',
        issuedRemark: '', // 备注
        type: 'WEEK',
        assistMan: '',
        assistManName: '',
        equipmenId: '',
        equipmenName: '',
        startTime: '',
        endTime: '',
        handTimeLimit: '',
        remark:'',	
        brokeInfo:''	
    } as {
        siteId: string // 站点id 
        siteName: string // 站点名称
        resPersonId: string // 负责人id
        resPersonName: string
        issuedRemark: string // 备注
        type: 'WEEK',
        assistMan: string // 协助人员id
        assistManName: string
        equipmenId: string // 设备id
        equipmenName: string 
        startTime: string|Date
        endTime: string|Date
        handTimeLimit: string // 运维期限
        remark:string	
        brokeInfo:string // 故障内容
    },
    disabledDate: (date:Date) => {
        return date > new Date()
    },
    rules: {
        siteName: [{ required: true, message: '请选择站点', trigger: 'blur', }],
        resPersonName: [{ required: true, message: '请选择负责人', trigger: 'blur', }],
        handTimeLimit: [{ required: true, message: '请选择截至时间', trigger: 'blur', }]
    },
    siteNameList:[] as actionSheetTs[], // 站点列表
    sitePrincipalNameList: [] as actionSheetTs[], // 负责人列表
    siteAssitNameList: [] as actionSheetTs[], // 协办人列表
    currEquipmentList: [] as actionSheetTs[], // 设备列表
    isShowSiteList: false, // 站点显示
    isShowPrincipalList: false, // 负责人显示
    isShowAssitList: false, // 协办人显示
    isShowEquipmentList: false, // 设备列表显示
    isShowTimeLimitSelect: false, // 截至时间显示
    isShowTimeSelectStart: false, // 开始时间显示选择弹框
    isShowTimeSelectEnd: false, // 结束时间显示选择弹框
    siteIndex: -1,
    principaIndex: -1,
    assitIndex: -1,
    equipmentIndex: -1,
})
const uFormRef = ref<any>() 

onLoad(function (option) {
    data.isTask = option.isTask === 'true' 
    data.titleText = data.isTask ? '新增巡检' : '新增故障'
    getSelectData()
})
onReady(function() {
	uFormRef.value.setRules(data.rules)
}) 

/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/** 
 * @name 表单提交验证
 */
const submit = () => {
	uFormRef.value.validate((valid:boolean) => {
		if (valid) {
            console.log('验证通过')
            if(data.isTask) submitTask()
            else submitOperation()
		} else {
			console.log('验证失败')
		}
	})
}

/**
 * @name 巡检提交
 */
const submitTask = async () => {
    const params = {
        siteId: data.model.siteId,
        resPersonId: data.model.resPersonId,
        issuedRemark: data.model.issuedRemark,
        type: 'WEEK' // 巡检类型 周 WEEK(大写)
    }
    const res = await service('patrolInspectionTask/addInspectionTask', params)
    showToast(res.message)
    if(res.code === 200) closeNav()
}
/**
 * @name 故障提交
 */
const submitOperation = async () => {
    const params = data.model
    if(!params.startTime) params.startTime = moment().format('YYYY-MM-DD HH:mm')
    if(!params.endTime) params.endTime = moment().format('YYYY-MM-DD HH:mm')
    const res = await service('patrolInspectionTask/addBrokeOperationalTask', params)
    showToast(res.message)
    if(res.code === 200) closeNav()
}

const assToShowCheckList = () => {
    if (!data.model.resPersonId) {
        showToast('请先选择负责人')
        return
    }
    data.isShowAssitList = true
}
const equipmenToShowCheckList = () => {
    if (!data.model.siteId) {
        showToast('请先选择站点')
        return
    }
    data.isShowEquipmentList = true
}
/**
 * @name 获取基础筛选数据
 */
const getSelectData = async () => {
    getTheSiteNameList().then(res => {
        const siteNameList = res
        data.siteNameList = siteNameList.map(item => {
            return {
                text: item.siteName,
                id: item.siteId
            }
        })
    })
   
    getTheSitePrincipalName().then(res => { 
        const sitePrincipalNameList = res
        data.sitePrincipalNameList = sitePrincipalNameList.map(item => {
            return {
                text: item.opePerson,
                id: item.id
            }
        })
    })
    
}
/**
 * @name 获取协办人
 * @param id 负责人id
 */
const getSiteAssitList = (id:string) => {
    getTheSiteAssitNameList(id).then(res => { 
        const siteAssitNameList = res
        data.siteAssitNameList = siteAssitNameList.map(item => {
            return {
                text: item.opePerson,
                id: item.id
            }
        })
    })
}
/**
 * @name 获取设备列表
 * @param id 站点id
 */
const getEquipmentList = (id:string) => {
    equipmentList(id).then(res => { 
        const currEquipmentList = res
        data.currEquipmentList = currEquipmentList.map(item => {
            return {
                text: item.name,
                id: item.id
            }
        })
    })
}

/**
 * @name 点击取消
 */
const cancel = () => {
    closeNav()
}
/**
 * @name 显示结束时间选择列表
 */
const showEndTimePanel = () => {
    if (!data.model.startTime) {
        showToast('请先选择开始时间')
        return
    }
    data.isShowTimeSelectEnd = true
}
/**
 * @name 开始时间
 */
const onPickerConfirmStart = (time: onPickerTimeStartTs) => {
    const timeStr = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`
    if (moment(timeStr).valueOf() > moment().valueOf()) {
        showToast('结束时间不可以超过当前时间!')
        return 
    } else if(data.model.endTime && moment(timeStr).valueOf() > moment(data.model.endTime).valueOf()) {
        data.model.endTime = ''
    }
    data.model.startTime = timeStr
    data.isShowTimeSelectStart = false
}
/**
 * @name 结束时间
 */
const onPickerConfirmEnd = (time: onPickerTimeStartTs) => {
    const timeStr = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`
    if (moment(timeStr).valueOf() > moment().valueOf()) {
        showToast('结束时间不可以超过当前时间!')
        return 
    } else if(moment(timeStr).valueOf() < moment(data.model.startTime).valueOf()) {
        showToast('结束时间不可以早于开始时间!')
        return 
    }
    data.model.endTime = timeStr
    data.isShowTimeSelectEnd = false
}
/**
 * @name 选择时间截至
 */
const onPickerConfirmLimit = (time: onPickerTimeStartTs) => {
    data.model.handTimeLimit = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`
    data.isShowTimeLimitSelect = false
}

/**
 * @name 站点选择
 * @param index 选中的索引
 * @detail 会根据站点id 自动获取站点运维人员 并获取站点负责人协助人员列表
 */
const handleSite = async (index:number) => {
    const currCheck = data.siteNameList[index]
    if (!data.isTask && currCheck.id !== data.model.siteId) {
        data.model.siteId = ''
        data.model.siteName = ''
        data.equipmentIndex = -1
        getEquipmentList(currCheck.id)
    }
    data.model.siteId = currCheck.id
    data.model.siteName = currCheck.text
    // 自动获取该站点对应的站点负责人数据
    const stationPersonData = await getStationPerson(currCheck.id) as UserInfoRes
    data.model.resPersonName = stationPersonData.name
    data.model.resPersonId = stationPersonData.userIdStr
    // data.principaIndex = data.sitePrincipalNameList.findIndex(item => (item.id + '') === data.model.resPersonId)
    // 自动获取该站点对应的站点负责人对应的协办人
    !data.isTask && getSiteAssitList(stationPersonData.userIdStr)
    
}
/**
 * @name 负责人选择
 * @param index 选中的索引
 */
const handlePrincipalList = (index:number) => {
    const currCheck = data.sitePrincipalNameList[index]
    if (!data.isTask && currCheck.id !== data.model.resPersonId) {
        data.model.assistMan = ''
        data.model.assistManName = ''
        data.assitIndex = -1
        getSiteAssitList(currCheck.id)
    }
    data.model.resPersonId = currCheck.id
    data.model.resPersonName = currCheck.text
    
}
/**
 * @name 协办人选择
 * @param index 选中的索引
 */
const handleAssitList = (index:number) => {
    const currCheck = data.siteAssitNameList[index]
    data.model.assistMan = currCheck.id
    data.model.assistManName = currCheck.text
}
/**
 * @name 设备选中
 * @param index 选中的索引
 */
const handleEquipmentList = (index:number) => {
    const currCheck = data.currEquipmentList[index]
    data.model.equipmenId = currCheck.id
    data.model.equipmenName = currCheck.text
}

const {
    isTask,
    titleText,
    model,
    rules,
    isShowTimeLimitSelect,
    siteNameList,
    isShowSiteList,
    isShowPrincipalList,
    sitePrincipalNameList,
    siteAssitNameList,
    isShowAssitList,
    disabledDate,
    isShowTimeSelectStart,
    isShowTimeSelectEnd,
    siteIndex,
    principaIndex,
    assitIndex,
    currEquipmentList,
    equipmentIndex,
    isShowEquipmentList
} = toRefs(data)
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    background-color: #f1f4f9;
    .flow-body {
        height: calc(100% - 44px - 196rpx);
        overflow: auto;
        background-color: #f1f4f9;
    }
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
}
</style>