export interface inspectionTasksTs {
    isAlarmTime: string
    itemId: number
    lastLongMillTime: number
    lastTime: string
    overTime:string
    opeAssiste: string
    opePerson: string
    opeState: '0' | '1' | '2' | '3' | '4' | '5'
    opeType: 'WEEK' | number
    siteAddress: string
    opeAddress:string
    siteName: string
}
export interface ListDetailServiceTs {
    forms?: any[]
    form?: any[]
    siteInfo: {
        area: string
        controlLevel: string
        id: string
        isScan: string
        name: string
        river: string
        transitionSection: string
        upstream: string
    }
    inspectionType: string
    stateText: string
    workTime: string
    issTime: string // 故障开始
    itemId: string // 运维工单id
    timeLimit: string // 处理时限
    opeAssiste: string // 运维协办人
    createTime: string
    operationManName: string
    signature: string // 签名
    imageIds: null | string
    nextId: string
    lastId: string
    remark: string
    backReaon: string // 打回原因
    upReason: string // 上报原因
    relevanceTaskId?: string
    failureDescription?: string
    breMaintenance?: string
    opePerson?: string
    opeState: '0' | '1' | '2' | '3' | '4' | '5'
}
export interface goToDetailTs {
    formFlag: string
    formName: string
    isDone: string
    isMust: string
    pos: number
}

export interface picFileItemTs {
    response?: {
        ID: string
    }[]
    progress: number
    url: string
}

export interface onPickerTimeStartTs {
    year: string
    month: string
    day: string
    hour: string
    minute: string
}
