<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view ref="navCenter" class="nav-center">
            <view class="top-operation-control">
                <view :class="[lastId ? 'operation-click' : 'operation-unclick']" @click="getToThisId(lastId)">
                    上次运维
                </view>
                <view class="operation-list" @click="isShowTimeList = true">
                    <span class="operation-time">{{ time }}</span>
                </view>
                <view :class="[nextId ? 'operation-click' : 'operation-unclick']" @click="getToThisId(nextId)">
                    下次运维
                </view>
            </view>
            <view
                :class="[isShowSiteDetail ? 'isShowDetail' : '', 'sit-detail']"
                @click="isShowSiteDetail = !isShowSiteDetail"
            >
                <view class="bar-item">
                    <span>站点详情</span>
                    <u-icon name="arrow-right" class="detail-arrow" color="#DCDFE6" size="14"></u-icon>
                </view>
            </view>
            <view v-show="isShowSiteDetail" class="click-detal">
                <view v-for="item in siteInfoKeyList" :key="item.key" class="click-detal-option">
                    <span>{{ item.label }}</span> <span>{{ siteInfo[item.key] || '--' }}</span>
                </view>
            </view>
            <view
                :class="[isShowOperation ? 'isShowDetail' : '', 'sit-detail']"
                @click="isShowOperation = !isShowOperation"
            >
                <view class="bar-item">
                    <span>运维情况</span>
                    <u-icon name="arrow-right" class="detail-arrow" color="#DCDFE6" size="14"></u-icon>
                </view>
            </view>
            <view v-show="isShowOperation" class="click-detal">
                <view v-for="item in operationKeyList[openType || 'task']" :key="item.key" class="click-detal-option">
                    <span>{{ item.label }}</span> <span>{{ operationInfo[item.key] || '--' }}</span>
                </view>
            </view>
            <view
                v-if="openType === 'fault'"
                :class="[isShowFault ? 'isShowDetail' : '', 'sit-detail']"
                @click="isShowFault = !isShowFault"
            >
                <view class="bar-item">
                    <span>故障信息</span>
                    <u-icon name="arrow-right" class="detail-arrow" color="#DCDFE6" size="14"></u-icon>
                </view>
            </view>
            <view v-show="isShowFault" class="click-detal">
                <view v-for="item in faultInfoKeyList" :key="item.key" class="click-detal-option">
                    <span>{{ item.label }}</span> <span>{{ faultInfo[item.key] || '--' }}</span>
                </view>
            </view>
            <view class="sit-detail">
                <view
                    v-for="(item, index) in siteStatusList"
                    :key="index"
                    class="status-center"
                    @click="goToDetail(item)"
                >
                    <image v-if="item.isDone === '1'" src="@/static/images/common/select.png" alt="" />
                    <image v-else src="@/static/images/common/un-select.png" alt="" />
                    <view class="bar-item">
                        <view>
                            <span v-if="item.isMust == '1'" class="necessary-icon">*</span>
                            <span>{{ item.formName }}</span>
                        </view>
                        <u-icon name="arrow-right" class="detail-arrow" color="#DCDFE6" size="14"></u-icon>
                    </view>
                </view>
            </view>
            <view class="autograph">
                <view class="autograph-text">
                    <span class="necessary-icon">*</span>
                    <span class="autograph-label">签名</span>
                </view>
                <view class="autograph-img">
                    <image v-show="autographId" :src="getImgPath" alt="" />
                </view>
                <view v-show="!state" class="autograph-btn">
                    <u-button size="mini" style="margin-right: 30rpx;" @click="isShowAutograph = true">
                        书写
                    </u-button>
                </view>
            </view>
            <view v-if="openType === 'fault'" class="remarks">
                <view class="title-text">
                    <span class="necessary-icon">*</span>
                    故障描述
                </view>
                <u-input v-model="failureDescription" input-align="left" type="textarea" :disabled="state" placeholder="请输入" />
            </view>
            <view v-if="openType === 'fault'" class="remarks">
                <view class="title-text">
                    <span class="necessary-icon">*</span>
                    故障维修
                </view>
                <u-input v-model="breMaintenance" input-align="left" type="textarea" :disabled="state" placeholder="请输入" />
            </view>
            <view class="curr-img">
                <view class="title-text">
                    现场照片
                </view>
                <view v-if="!state">
                    <u-upload
                        ref="uUploadRef"
                        :file-list="sitePhotosList"
                        :action="config.fileHost + '/file-base-server/api/v1/sys/upload'"
                        :auto-upload="true"
                    >
                    </u-upload>
                </view>
                <view v-else class="img-show">
                    <view v-for="(item, index) in sitePhotosList" :key="item.url">
                        <image :src="item.url" @click="showBigImg(index)"></image>
                    </view>
                </view>
            </view>
            <view v-if="openType !== 'fault'" class="remarks">
                <view class="title-text">
                    备注
                </view>
                <u-input v-model="remarks" input-align="left" type="textarea" :disabled="state" placeholder="输入备注" />
            </view>
            <view v-else v-show="[3,4,5,6].includes(state as number)" class="back-reason">
                <view class="title-text">
                    {{ [5,6].includes(state as number) ? '打回原因:': '上报原因:' }}
                </view>
                <view class="title-value">
                    {{ backReaon }}
                </view>
            </view>
            <view v-if="openType === 'fault'" class="bottom-btn-fault">
                <!--组长运维按钮-->
                <div v-if="showState===0" class="sendBtn">
                    <div class="button" style="background: #0047CC; width: 20%; " @click="upData(1)">
                        提交
                    </div>
                    <div class="button" style="background: #E5EAF0;color: #042C5C; width: 20%; " @click="upData(0)">
                        暂存
                    </div>
                    <div class="button" style="background: #67C23A; width: 20%; " @click="reportOrRepulse(1)">
                        上报
                    </div>
                    <div class="button" style="background: #FFB74D; width: 20%; " @click="isShowReassign = true">
                        重分配
                    </div>
                </div>
                <!--经理运维人员-->
                <div v-if="showState===1" class="sendBtn">
                    <div class="button" style="background: #0047CC; width: 30%; " @click="upData(1)">
                        提交
                    </div>
                    <div class="button" style="background: #E5EAF0;color: #042C5C; width: 30%; " @click="upData(0)">
                        暂存
                    </div>
                    <div class="button" style="background: #FFB74D; width: 30%; " @click="isShowReassign = true">
                        重分配
                    </div>
                </div>
                <!--基层运维人员-->
                <div v-if="showState===2" class="sendBtn">
                    <div class="button" style="background: #0047CC; width: 30%; " @click="upData(1)">
                        提交
                    </div>
                    <div class="button" style="background: #E5EAF0;color: #042C5C; width: 30%; " @click="upData(0)">
                        暂存
                    </div>
                    <div class="button" style="background: #67C23A; width: 30%; " @click="reportOrRepulse(1)">
                        上报
                    </div>
                </div>
                <!--组长打回-->
                <div v-if="showState===3" class="sendBtn">
                    <div class="button" style="background: #FFB74D; width: 30%; " @click="isShowReassign = true">
                        重分配
                    </div>
                    <div class="button" style="background: #FF5D6E; width: 30%; " @click="reportOrRepulse(0)">
                        打回
                    </div>
                    <div class="button" style="background: #67C23A; width: 30%; " @click="reportOrRepulse(1)">
                        上报
                    </div>
                </div>
                <!--经理打回-->
                <div v-if="showState===4" class="sendBtn" style="padding:0 15%">
                    <div class="button" style="background: #FFB74D; width: 45%; " @click="isShowReassign = true">
                        重分配
                    </div>
                    <div class="button" style="background: #FF5D6E; width: 45%; " @click="reportOrRepulse(0)">
                        打回
                    </div>
                </div>
            </view>
            <view v-else v-show="!state" class="bottom-btn">
                <u-button shape="circle" style="margin-right: 30rpx;" @click="upData(0)">
                    暂存
                </u-button>
                <u-button shape="circle" type="primary" @click="upData(1)">
                    提交
                </u-button>
            </view>
        </view>
        <u-modal
            ref="uModal"
            v-model="isShowModal"
            theme="normal"
            :title="modalTitle"
            :show-cancel-button="true"
            :show-title="true" 
            @cancel="reason=''" 
            @confirm="confirmModal"
        >
            <view class="warp" style="margin: 30rpx;">
                <u-input v-model="reason" :border="true" placeholder="请输入" />
            </view>
        </u-modal>
        <Autograph v-model="isShowAutograph" @handle-confirm="handleConfirm"></Autograph>
        <Reassign v-model="isShowReassign" :params="paramsReassign"></reassign>
    </view>
</template>
<script lang="ts" setup>

import { onLoad, onShow } from "@dcloudio/uni-app"
import $service from '@/api/service'
import Autograph from '@/components/common/Autograph.vue'
import Reassign from '@/components/taskOperation/Reassign.vue'
import { showToast, togo, getUserData, getUserOperationRole, navigateBackSetTime } from '@/utils/commonUtils'
import { faultStateList } from '@/utils/zm-constant'
import config from '@/api/config'
import type { ListDetailServiceTs, goToDetailTs, picFileItemTs } from './type'
// 运维
const operationKeyList = {
    task: [
        { label: '运维状态', key: 'stateText' },
        { label: '运维时间', key: 'workTime' },
        { label: '运维类型', key: 'inspectionType' },
        { label: '运维人员', key: 'operationManName' },
    ],
    fault: [
        { label: '运维状态', key: 'opeState' },
        { label: '上报理由', key: 'upReason' },
        { label: '运维时间', key: 'opeTime' },
        { label: '运维类型', key: 'opeType' },
        { label: '运维人员', key: 'opePerson' },
        { label: '协办人员', key: 'opeAssiste' },
        { label: '备注', key: 'operationManName' },
    ]
}
// 站点
const siteInfoKeyList = [
    { label: '站点名称', key: 'name' },
    { label: '监管部门', key: 'controlLevel' },
    { label: '所属区域', key: 'area' },
    { label: '所属流域', key: 'river' },
    { label: '交界断面', key: 'isScan' },
    { label: '上游', key: 'upstream' },
]
// 故障
const faultInfoKeyList = [
    { label: '故障设备', key: 'faultEquipment' },
    { label: '故障内容', key: 'faultContent' },
    { label: '故障开始时间', key: 'startTime' },
    { label: '故障结束时间', key: 'endTime' },
    { label: '故障下发人', key: 'issPerson' },
    { label: '下发时间', key: 'issTime' },
    { label: '处理时限', key: 'timeLimit' },
]
const data = reactive({
    titleText: '',
    id: '',
    state: '' as number | string, // 站点状态
    isAccount: '',
    backReaon: '', // 打回原因
    isShowTimeList: false,
    openType: '' as 'task' | 'fault',
    siteStatusList: [
    ] as {
        isMust: '0' | '1'
        isDone: '0' | '1'
        pos: number
        formFlag: string
        formName: string
    }[],
    isShowSiteDetail: false, // 站点详情
    isShowOperation: false, // 运维详情
    isShowFault: false, // 故障
    sitePhotosList: [] as {
        url: string,
        error: boolean,
        progress: number
    }[], // 现场照片
    navCenter: ref(),
    autographId: '', // 签名图片的id
    isShowAutograph: false,
    remarks: '',
    uUploadRef: ref(), // 现场照片上传图片dom
    siteInfo: { // 站点详情
        area: "--",
        controlLevel: "--",
        id: "--",
        isScan: '--',
        name: "--",
        river: "--",
        transitionSection: "--",
        upstream: "--",
    } as record,
    operationInfo: { // 运维详情
        stateText: '--',
        workTime: '--',
        inspectionType: '--',
        operationManName: '--',
    } as record,
    isShowModal: false, // 显示上报或者驳回 输入框\
    relevanceTaskId: '', //  如果不为空，说明有关联的故障任务，如果为空，则没有关联
    reason: '', //上报原因 驳回原因
    modalTitle: '上报原因',
    faultInfo: {} as record,
    failureDescription:"", // 故障描述
    breMaintenance:"", // 故障维修
    showState: -1, // 运维按钮显示状态
    isShowReassign: false, // 是否显示重分配弹框
    paramsReassign: {
        workId: '',
        operationMan: '',
        assistMan: '',
        handTimeLimit: ''
    }, // 重分配弹框弹框数据
    time: '', // 运维完成或者创建时间
    nextId: '', // 下一次运维记录ID，如果为空，则没有
    lastId: '' // 上一次运维记录ID，如果为空，则没有

})

onLoad(function (option) {
    data.id = option.id || ''
    data.openType = (option.openType as 'task' | 'fault' | undefined) || 'task'
    data.isAccount = option.isAccount || ''
    getData()
})
onShow(function () {
    data.id && getData(true)
})
/**
 * @name 获取数据
 */
const getData = (isOnlyUpDataForm?:boolean) => {
    const url = data.openType !== 'fault' ? 'patrolInspectionTask/getForm' : 'patrolInspectionTask/brokeOperationalGetForm'
    const params = {
        workId: data.id,
        state: data.state,
        isAccount: data.isAccount ? parseInt(data.isAccount) : 0
    }
    $service<ListDetailServiceTs, true>(url, params).then(async (res) => {
        data.siteStatusList = res.forms || res.form || []
        if(isOnlyUpDataForm) return
        data.siteInfo = res.siteInfo
        data.siteInfo.isScan = res.siteInfo.isScan ? '是' : '否'
        const currOperationArr = operationKeyList[data.openType || 'task']
        currOperationArr.forEach(item => {
            data.operationInfo[item.key] = (res as record)[item.key]
        })
        if (data.openType === 'fault') {
            data.operationInfo.opeType = '周故障'
            data.backReaon = res.backReaon || res.upReason
            data.operationInfo.opeState = faultStateList[res.opeState].text
            faultInfoKeyList.forEach(item => {
                data.faultInfo[item.key] = (res as record)[item.key]
            })
            data.relevanceTaskId = res.relevanceTaskId || ''
            data.failureDescription = res.failureDescription || ''
            data.breMaintenance = res.breMaintenance || ''
            data.paramsReassign = {
                workId: res.itemId,
                operationMan: res.opePerson || '',
                assistMan: res.opeAssiste || '',
                handTimeLimit: res.timeLimit || ''
            }
        }
        data.autographId = res.signature
        data.sitePhotosList = res.imageIds ? res.imageIds.split(',').map((item: string) => {
            return {
                url: config.domain + '/file-base-server/api/v1/sys/download/' + item,
                error: false,
                progress: 100,
                response: [{
                    ID: item
                }]
            }
        }) : []
        data.state = res.opeState ? Number(res.opeState) : ['未完成'].includes(res.stateText) ? 0 : 1
        data.titleText = res.siteInfo.name || ''
        data.nextId = res.nextId
        data.lastId = res.lastId
        data.remarks = res.remark
        data.time = res.workTime || res.createTime || res.issTime || ''
        if (data.openType === 'fault') {
            const userData = getUserData() 
            if(!userData) return
            const namesa = userData.name
            if (res.opePerson === namesa) {
                    data.showState = await judgeState(data.state, 1)
            } else {
                    data.showState = await judgeState(data.state, 0)
            }
        }
        
    })
}
//	<!--//opeState 0未完成 1完成 2超时完成,3上报组长 4上报经理 5组长打回  6经理打回-->
//isBack 用户级别  0:运维领导  1:运维组长  2:运维人员
//divstate意义
//0 提交  暂存 上报 重分配
//1 提交  暂存   重分配
//2 提交  暂存 上报 
//3 打回 上报 重分配
//4 打回   重分配
//5  不会显示按钮 填报页不会展示
// 'ManagerRole',  运维经理
// 'operationsPersonnel',  分级-运维人员
// 'operationsPersonnelManO',  运维人员
// 'operationsPersonnelGroupO'  运维组长
const judgeState = async (opeState: number, isBack: number) => {
    const userRoleData = await getUserOperationRole()
    if(!userRoleData) return 0
    let divstate = -1
    const userLevel = userRoleData.roleCode || 'operationsPersonnelManO'
    if (opeState === 0) {
        if (userLevel === ('operationsPersonnelManO')) {
            divstate = 2
        } else if (userLevel === ('operationsPersonnelGroupO')) {
            divstate = 0
        } else if (userLevel === ('ManagerRole')) {
            divstate = 1
        }

    } else if (opeState === 1) {
        divstate = 5
    } else if (opeState === 2) {
        divstate = 5
    } else if (opeState === 3) {
        if (userLevel === ('operationsPersonnelGroupO')) {
            divstate = 3
        } else {
            divstate = 5
        }
    } else if (opeState === 4) {
        if (userLevel === ('ManagerRole')) {
            divstate = 4
        } else {
            divstate = 5
        }
    } else if (opeState === 5) {
        if (userLevel === ('operationsPersonnelManO')) {
            divstate = 2
        } else if (userLevel === ('operationsPersonnelGroupO')) {
            divstate = 3
        } else if (userLevel === ('ManagerRole')) {
            divstate = 5
        }
    } else if (opeState === 6) {
        if (userLevel === ('operationsPersonnelManO')) {
            divstate = 5
        } else if (userLevel === ('operationsPersonnelGroupO')) {
            if (isBack === 1) {
                divstate = 0
            } else {
                divstate = 3
            }
        } else if (userLevel === ('ManagerRole')) {
            divstate = 5
        }
    }
    return divstate
}
const showBigImg = (index: number) => {
    uni.previewImage({
        current: index,
        urls: data.sitePhotosList.map(item => item.url) //必须是网址路径，否则加载不出来，如：http：或https：
    })
}
/**
 * @name 打回提交最终请求 
 * @returns id逗号分割字符串
 */
const confirmModal = () => {
    if (!data.reason) {
        showToast('请先输入' + data.modalTitle + '!', 'error')
        return
    }
    let url = ''
    if (data.modalTitle === '上报原因') url = 'patrolInspectionTask/brokeOperationalReport'
    else url = 'patrolInspectionTask/brokeOperationalRepulse'
    $service(url, {
        workId: data.id,
        failureDescription: data.failureDescription,
        breMaintenance: data.breMaintenance,
        imageIds: getImgListId(),
        reason: data.reason
    }).then(res => {
        uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
        })
        if (res.code === 200 && res.data === 1) navigateBackSetTime()
    })
}
/**
 * @name 点击显示站点详情对应记录表
 */
const goToDetail = (item: goToDetailTs) => {
    console.log(item, 'item')
    const toGoData = {
        id: data.id,
        siteId: data.siteInfo.id,
        state: data.state,
        formName: (item.formName),
        openType: '',
        isFault: data.openType === 'fault' ? 1 : 0
    }
    switch (Number(item.formFlag)) {
        case 1: // 废液处置记录表
            togo('/pages/operation/taskOperationList/taskFormDetail/WasteLiquidDisposal', toGoData)
            break
        case 2: // 耗材及配件更换记录表
            toGoData.openType = 'accessories'
            togo('/pages/operation/taskOperationList/taskFormDetail/ReagentSample', toGoData)
            break
        case 3: // 试剂及标准样品更换记录表
            toGoData.openType = 'reagent'
            togo('/pages/operation/taskOperationList/taskFormDetail/ReagentSample', toGoData)
            break
        case 4: // 巡检维护记录表
            togo('/pages/operation/taskOperationList/taskFormDetail/PatrolMaintenance', toGoData)
            break
        case 5: // 仪器设备检修记录表
            togo('/pages/operation/taskOperationList/taskFormDetail/MaintenanceRecord', toGoData)
            break
        case 6: // 仪器校准记录表
            togo('/pages/operation/taskOperationList/taskFormDetail/InstrumentCalibration', toGoData)
            break
        case 7: // 关键参数变更
            toGoData.openType = 'keyParameter'
            togo('/pages/operation/taskOperationList/taskFormDetail/ReagentSample', toGoData)
            break
        default:
            break


    }
}
/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/**
 * @name 上一次和下一次切换
 */
const getToThisId = (id: string) => {
    if (!id) return
    data.id = id
    getData()
}
//将签名笔迹存到本地
const handleConfirm = function (id: string) {
    data.autographId = id
}

/**
 * @name 返回签名图片
 * @computed
 */
const getImgPath = computed<string>(() => {
    return config.domain + '/file-base-server/api/v1/sys/download/' + data.autographId
})


/**
 * @name 上报或者打回
 * @param type 0:打回 1:上报
 */
const reportOrRepulse = (type: 0 | 1) => {
    if (type) {
        data.modalTitle = '上报原因'
        if (!data.autographId) {
            showToast('请先签字！', 'error')
            return
        }
        if (!data.failureDescription) {
            showToast('请先填写故障描述！', 'error')
            return
        }
        if (!data.breMaintenance) {
            showToast('请先填写故障维修！', 'error')
            return
        }
        for (const i of data.siteStatusList) {
            if (i.isMust === '1' && i.isDone === '0') {
                showToast('请填写！' + i.formName, 'error')
                return
            }
        }
        data.isShowModal = true
    } else {
        data.isShowModal = true
        data.modalTitle = '打回原因'
    }
}

/**
 * @name 提交或者暂存
 * @param type 0:暂存 1:提交
 */
const upData = (type: 0 | 1) => {
    if (type) {
        if (!data.autographId) {
            showToast('请先签字！', 'error')
            return
        }
        for (const i of data.siteStatusList) {
            if (i.isMust === '1' && i.isDone === '0') {
                showToast('请填写！' + i.formName, 'error')
                return
            }
        }
        if (data.openType === 'fault' && !data.breMaintenance) {
            showToast('请先填写故障维修！', 'error')
            return
        }
        if (data.openType === 'fault' && !data.failureDescription) {
            showToast('请先填写故障描述！', 'error')
            return
        }
        
    }
    let params = {}
    let url = ''
    if (data.openType === 'fault') {
        params = {
            itemId: data.id,
            failureDescription: data.failureDescription,
            breMaintenance: data.breMaintenance,
            imageIds: getImgListId(),
            relevanceTaskId: data.relevanceTaskId, // 如果不为空，说明有关联的故障任务，如果为空，则没有关联
            isSubmit: type, // 提交或暂存 0:暂存 1:提交
            signature: data.autographId // 签名图片
        }
        url = 'patrolInspectionTask/brokeOperationalSaveForm'
    } else {
        params = {
            id: data.id,
            picture: getImgListId(),
            remark: data.remarks,
            isSubmit: type,
            signature: data.autographId
        }
        url = 'patrolInspectionTask/saveForm'
    }
    $service(url, params).then(res => {
        uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
        })
        if (res.code === 200) navigateBackSetTime()
    })
}
/**
 * @name 获取图片 
 * @returns id逗号分割字符串
 */
const getImgListId = () => {
    let files = []
    
    if(data.uUploadRef)
    // 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
    files = data.uUploadRef.lists.filter((val: {
        response: {
            ID: string
        }[]
        progress: number
    }) => {
        return val.progress === 100
    })
    else files = data.sitePhotosList
    const picIdList: string[] = files.map((item: picFileItemTs) => {
        if (item.response) return item.response[0].ID
        const url = item.url
        const lastInd = url.lastIndexOf('/') + 1
        const picId = url.slice(lastInd)
        return picId
    })
    return picIdList.join(',')
}
const {
    titleText,
    isShowTimeList,
    remarks,
    backReaon,
    siteStatusList,
    navCenter,
    isShowAutograph,
    autographId,
    sitePhotosList,
    uUploadRef,
    isShowSiteDetail,
    siteInfo,
    nextId,
    lastId,
    faultInfo,
    operationInfo,
    time,
    state,
    openType,
    isShowFault,
    showState,
    failureDescription, // 故障描述
    breMaintenance, // 故障维修
    isShowModal,
    reason,
    modalTitle,
    isShowReassign,
    paramsReassign,
    isShowOperation, } = toRefs(data)

</script>
<style lang="scss" scoped>
.container {
    height: 100%;
    background-color: #eff2f8;

    .necessary-icon {
        color: #F84439 !important;
        margin-right: 10rpx;
    }

    .nav-center {
        width: 100%;
        height: calc(100% - 44px);
        overflow: auto;
    }

    .top-operation-control {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FFFFFF;

        .operation-click {
            width: 144rpx;
            height: 64rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            box-sizing: border-box;
            border: 1px solid #0084FF;
            font-family: PingFangSC;
            font-size: 24rpx;
            font-weight: normal;
            line-height: 40rpx;
            color: #0084FF;
        }

        .operation-unclick {
            width: 144rpx;
            height: 64rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            background: #E4E7ED;
            box-sizing: border-box;
            border: 1px solid #DCDFE6;
            font-family: PingFangSC;
            font-size: 24rpx;
            line-height: 40rpx;
            color: #909399;
        }

        .operation-list {
            margin: 0 80rpx;
            font-family: PingFangSC;
            font-size: 24rpx;
            line-height: 34rpx;
            color: #606266;

            .operation-time {
                margin-right: 16rpx;
            }
        }

        .icon {
            transition: all 0.3s;
        }

        .up {
            transform: rotate(180deg);
        }
    }

    .sit-detail {
        width: 100%;
        margin-top: 16rpx;
        background: #FFFFFF;

        .bar-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 48px;
            padding: 0 32rpx 0 40rpx;
        }

        .status-center {
            display: flex;
            width: 100%;
            height: 48px;
            align-items: center;
            padding: 0 0 0 40rpx;

            image {
                height: 48rpx;
                width: 48rpx;
                flex-shrink: 0;
            }

            .bar-item {
                padding: 0 32rpx 0 0;
                margin-left: 28rpx;
                border-width: 0px 0px 1px 0px;
                border-style: solid;
                border-color: #EBEEF5;
            }
        }

        &>.status-center:last-child {
            .bar-item {
                border-width: 0 !important;
            }
        }
    }

    .click-detal {
        background-color: white;

        .click-detal-option:last-child {
            border-bottom: 0px;
        }

        .click-detal-option {
            display: flex;
            height: 70rpx;
            align-items: center;
            justify-content: space-between;
            padding: 0 32rpx 0 40rpx;
            border-bottom: 1px solid #eeee;
        }
    }

    .autograph {
        height: 193px;
        padding: 24rpx 18rpx;
        background: #FFFFFF;
        margin-top: 16rpx;

        &-label {
            font-family: PingFangSC;
            font-size: 14px;
            line-height: 22px;
            color: #303133;
        }

        &-space {
            height: 75%;
            width: 100%;
            background: rgba(230, 230, 230, 0.8);
            border-radius: 2%;
        }

        &-btn {
            display: flex;
            justify-content: center;
            margin-top: 8rpx;
        }

        &-img {
            height: 75%;
            width: 100%;

            image {
                height: 100%;
                width: 100%;
            }
        }
    }

    .curr-img {
        height: 272rpx;
        padding: 28rpx 40rpx;
        background: #FFFFFF;
        margin-top: 16rpx;

        .img-show {
            display: flex;
            margin-top: 15rpx;

            image {
                margin-right: 10rpx;
                height: 130rpx;
                width: 130rpx;
            }
        }
    }

    .remarks {
        min-height: 200rpx;
        padding: 28rpx 40rpx;
        background: #FFFFFF;
        margin-top: 16rpx;
    }
    .back-reason {
        display: flex;
        align-items: center;
        min-height: 100rpx;
        padding: 28rpx 40rpx;
        background: #FFFFFF;
        margin-top: 16rpx;
        .title-text {
            flex: 1;
        }
        .title-value {
            flex: 4;
            text-align: right;
        }
    }
    .bottom-btn {
        display: flex;
        justify-content: space-between;
        padding: 30rpx 80rpx;
        height: 196rpx;
        margin-top: 16rpx;
        background: #FFFFFF;
    }

    .title-text {
        font-family: PingFangSC;
        font-size: 28rpx;
        font-weight: normal;
        line-height: 44rpx;
        color: #303133;
    }

    .detail-arrow {
        transition: all 0.3s;
    }

    .isShowDetail {
        background-color: #0084FF !important;

        .detail-arrow {
            transform: rotate(90deg);
        }
    }
    .bottom-btn-fault {
        .sendBtn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: white;
            height: 100rpx;
            margin-top: 16rpx;
            padding: 10rpx 15rpx;
        }
        .button{
            height: 64rpx;
            line-height: 64rpx;
			text-align: center;
			border-radius: 4px;
			color: #fff;
        }
    }
    

}
</style>