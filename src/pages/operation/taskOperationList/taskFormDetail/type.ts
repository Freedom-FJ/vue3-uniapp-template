/* eslint-disable no-redeclare */
export interface liquidWasteDisposalRecordListTs {
    disposalTime: string
    disposalWay: string
    liquidWasteParameter: string
    liquidWasteNum: string
    disposalMan: string
    disposalManName: string
}
export interface liquidWasteDisposalTs {
    formRef: any
    isShowDisposalTime: boolean
    isShowDisposalMan: boolean
    disposalManIndex: number
    data: liquidWasteDisposalRecordListTs
}
export interface picFileItemTs {
    response?: {
        ID: string
    }[]
    progress: number
    url: string
}

export interface WasteLiquidDisposalServiceTs {
    id: number
    picture: null | string
    remark: string | null
    liquidWasteDisposalRecordList: liquidWasteDisposalRecordListTs[] | null
}

export interface reagentDataTs {
    [key: string]: any
    name: string
    reagentId?: string | number
    reagentName?: string
    reagentVolume?: number|string
    configurationTime?: string
    changeTime: string
    validDate?: string
}
// 耗材
export interface reagentDataTs {
    name: string
    kitId?: string | number
    kitName?: string
    changeNum?: number
    changeTime: string
    changeReason?: string
    isKeyPart?: '0' | '1' | number | null
}

export type openTypeTs = 'reagent' | 'accessories' | 'keyParameter'

// 精确参数修改
export interface reagentDataTs {
    name: string
    keyParameterId?: string | number
    keyParameter?: string
    value?: string
    beforeValue: string
    changeReason?: string
}
export interface reagentListTs {
    [key: string]: any
    formRef: any
    isShowConfigurationTime: boolean
    isShowChangeTime: boolean
    isShowValidDate: boolean
    isReagentCheck: boolean
    reagentId?: number | string // 请求内部才有的参数
    kitId?: number | string // 请求内部才有的参数
    data: reagentDataTs
}
export interface equipmentTs {
    uploadRef: any
    imgList: {
        url: string
        error: boolean
        progress: number
    }[]
    isCheck: boolean
    name: string
    equipmentId: string | number
    isShowReagentList: boolean
    picture?: string
    searchReagent: string
    reagentList: reagentListTs[]
    reagentSearchList: reagentListTs[]
    reagentSampleChangeRecordReagentList?: reagentListTs[] // 试剂请求回传参数
    consumableKitChangeRecordKitList?: reagentListTs[] // 配件请求回传参数
    equipmentKeyParameterChangeRecordParameterList?: reagentListTs[] // 关键参数回传参数
}

export interface ReagentSampleFormObj {
    label: string
    labelWidth: string
    prop: string
    required: boolean
    key: string
    inputType: 'time' | 'number' | 'num-btn' | 'text' | 'switch'
    isShowKey?: string
    disabled?: boolean
}
// 试剂 设备 关键参数 获取数据请求回传参数
export interface ReagentSampleServiceTs {
    id: number
    reagentSampleChangeRecordEquipmentList?: equipmentTs[] // 试剂回传
    consumableKitChangeRecordEquipmentList?: equipmentTs[] // 配件耗材参数回传
    equipmentKeyParameterChangeRecordEquipmentVoList?: equipmentTs[] // 关键参数回传
}

// 试剂提交请求数据
export interface reagentSampleChangeRecordEquipmentListTs {
    picture: string | null
    equipmentId: string | number
    reagentSampleChangeRecordReagentList: reagentListTs['data'][]
}
// 配件提交请求数据
export interface consumableKitChangeRecordEquipmentListTs {
    picture: string | null
    equipmentId: string | number
    reagentSampleChangeRecordReagentList: reagentListTs['data'][]
}
// 关键参数提交请求数据
export interface equipmentKeyParameterChangeRecordEquipmentVoListTs {
    picture: string | null
    equipmentId: string | number
    reagentSampleChangeRecordReagentList: reagentListTs['data'][]
}

export interface siteDetailSubprojectsTs {
    recordTime: string
    weather: string
    temperature: string
    humidity: string
    remark: string
}
export interface equipmentDataSubprojectsTs {
    id: string
    instructions: string
    modelId: string
    modelName: string
    options: string
    picture: string
    recordId: string
    remark: string
    situation: stringn
    ref?: any
    imgList?: {
        url: string
        error: boolean
        progress: number
    }[]
    sort: number
}
export interface typeDataSubprojectsTs {
    createTime: string
    id: string
    instructions: null
    lastChangeTime: null
    modelId: string
    modelName: string
    modelType: 1
    options: string
    parentModelId: string
    picture: null
    recordId: string
    remark: null
    ref?: any
    imgList?: {
        url: string
        error: boolean
        progress: number
    }[]
    situation: null
    sort: number
}
export type selectListDetailTs = (
    | detailType<typeDataSubprojectsTs>
    | detailType<equipmentDataSubprojectsTs>
    | detailType<siteDetailSubprojectsTs>
)[]
export interface detailType<T> {
    subprojects: T[]
    typeId: string
    typeName: string
}
