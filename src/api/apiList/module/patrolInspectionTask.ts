import { typeObj } from '@/api/baseServe'
const { string, number, object, array, any, boolean } = typeObj
import { apiListTs } from '@/types/service'
const apiList: apiListTs = {
    // 提交巡检任务表单
    saveForm: {
        path: '/h5/api/v1/task/inspection/saveForm',
        server: 'wgmsQcOmServer',
        method: 'POST',
        params: {
            id: string,
            picture: string,
            remark: [string, null],
            isSubmit: number,
            signature: [string, null]
        }
    },
    // 巡检任务表单详情
    getForm: {
        path: '/h5/api/v1/task/inspection/getForm',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: string,
            state: [string, number]
        }
    },
    // 故障运维任务表单详情
    brokeOperationalGetForm: {
        path: '/h5/api/v1/task/brokeOperational/getForm',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: string,
            isAccount: number // 从台账 1 不是0
        }
    },
    // 新增巡检任务
    addInspectionTask: {
        path: '/h5/api/v1/task/addInspectionTask',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: true,
        params: {
            siteId: string,
            resPersonId: string,
            issuedRemark: string,
            type: string // 巡检类型 周 WEEK(大写)
        }
    },
    // 新增故障运维任务
    addBrokeOperationalTask: {
        path: '/h5/api/v1/task/addBrokeOperationalTask',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: true, // 请求参数中是否需要添加 userId
        params: {
            siteId: string,
            resPersonId: string,
            assistMan: string,
            assistManName: string,
            equipmenId: string,
            equipmenName: string,
            startTime: string,
            endTime: string,
            handTimeLimit: string,
            remark: string,
            brokeInfo: string
        }
    },
    // 巡检维护表单-获取
    patrolMaintenanceGet: {
        path: '/h5/api/v1/form/patrolMaintenance/get',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: 'loginUserId', // 请求参数中是否需要添加 loginUserId 设置变量名称
        params: {
            workId: string, // 	任务/工单id
            type: string, // 任务/工单类型WEEK/MONTH/SEASON/BROKE
            terminal: string // APP
        }
    },
    // 巡检维护表单-保存
    patrolMaintenanceSave: {
        path: '/h5/api/v1/form/patrolMaintenance/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: 'loginUser',
        params: {
            recordTime: string,
            id: [string, number],
            weather: string,
            temperature: string,
            humidity: string,
            remark: [string, null],
            typeData: array, // 巡检明细数据
            equipmentData: array // 仪器设备
        }
    },
    // 仪器设备检修表单-获取
    equipmentMaintenanceGet: {
        path: '/h5/api/v1/form/equipmentMaintenance/get',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: string,
            type: string
        }
    },
    // 仪器设备检修表单-保存
    equipmentMaintenanceSave: {
        path: '/h5/api/v1/form/equipmentMaintenance/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: 'operationMan',
        params: {
            workId: string,
            type: string,
            recordTime: string,
            id: [string, number],
            equipmentMaintenanceRecordList: array
        }
    },
    // 废液处置表单-保存
    liquidWasteSave: {
        path: '/h5/api/v1/form/liquidWaste/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: 'operationMan',
        params: {
            recordTime: string,
            id: number,
            type: string,
            workId: string,
            picture: string,
            remark: string,
            liquidWasteDisposalRecordList: array
        }
    },
    // 废液处置表单-获取
    liquidWasteGet: {
        path: '/h5/api/v1/form/liquidWaste/get',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: [string, number],
            type: string
        }
    },
    // 试剂及标准样品更换表单-保存
    reagentSampleSave: {
        path: '/h5/api/v1/form/reagentSample/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: 'operationMan',
        params: {
            recordTime: string,
            id: number,
            type: string,
            workId: string,
            reagentSampleChangeRecordEquipmentList: array
        }
    },
    // 试剂及标准样品更换表单-获取
    reagentSampleGet: {
        path: '/h5/api/v1/form/reagentSample/get',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: [string, number],
            type: string
        }
    },
    // 耗材及配件更换表单-获取
    consumableKitGet: {
        path: '/h5/api/v1/form/consumableKit/get',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: [string, number],
            type: string
        }
    },
    // 试剂及标准样品更换表单-保存
    consumableKitSave: {
        path: '/h5/api/v1/form/consumableKit/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: 'operationMan',
        params: {
            recordTime: string,
            id: number,
            type: string,
            workId: string,
            consumableKitChangeRecordEquipmentList: array
        }
    },
    // 仪器关键参数变更表单-获取
    equipmentKeyParameterGet: {
        path: '/h5/api/v1/form/equipmentKeyParameter/get',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: [string, number],
            type: string
        }
    },
    // 仪器关键参数变更表单-保存
    equipmentKeyParameterSave: {
        path: '/h5/api/v1/form/equipmentKeyParameter/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: 'operationMan',
        params: {
            recordTime: string,
            id: number,
            type: string,
            workId: string,
            equipmentKeyParameterChangeRecordEquipmentVoList: array
        }
    },
    // 仪器校准表单-获取
    equipmentCalibrationGet: {
        path: '/h5/api/v1/form/equipmentCalibration/get',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            workId: [string, number],
            type: string
        }
    },
    // 仪器关键参数变更表单-保存
    equipmentCalibrationSave: {
        path: '/h5/api/v1/form/equipmentCalibration/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: 'operationMan',
        params: {
            recordTime: string,
            id: number,
            type: string,
            workId: string,
            remark: string,
            equipmentCalibrationRecordList: array
        }
    },
    // 故障运维任务-上报
    brokeOperationalReport: {
        path: '/h5/api/v1/task/brokeOperational/report',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: true,
        params: {
            workId: string,
            failureDescription: string,
            breMaintenance: string,
            imageIds: string,
            reason: string
        }
    },
    // 故障运维任务-打回
    brokeOperationalRepulse: {
        path: '/h5/api/v1/task/brokeOperational/repulse',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: true,
        params: {
            workId: string,
            failureDescription: string,
            breMaintenance: string,
            imageIds: string,
            reason: string
        }
    },
    // 提交故障运维任务表单
    brokeOperationalSaveForm: {
        path: '/h5/api/v1/task/brokeOperational/saveForm',
        server: 'wgmsQcOmServer',
        method: 'POST',
        params: {
            itemId: string,
            failureDescription: string,
            breMaintenance: string,
            imageIds: string,
            relevanceTaskId: [string, null], // 如果不为空，说明有关联的故障任务，如果为空，则没有关联
            isSubmit: number, // 提交或暂存 0:暂存 1:提交
            signature: string // 签名图片
        }
    },
    // 故障运维任务-重分配
    brokeOperationalReassign: {
        path: '/h5/api/v1/task/brokeOperational/reassign',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isUserIdParams: true,
        params: {
            workId: string,
            operationMan: string,
            assistMan: string,
            handTimeLimit: string
        }
    }
}
export default apiList
