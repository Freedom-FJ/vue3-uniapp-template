export interface VisitorData {
    titleText: string
    list: VisitorListOne[]
    picture: string
    scrollHeight: number
}
export interface VisitorListDataRes {
    entries: VisitorListOne[]
}
export interface VisitorListOne {
    company: string
    createTime: string
    id: string
    lastChangeTime: null | string
    number: string
    operationCompanyId: string
    operationCompanyName: string
    picture: string
    reason: string
    remark: null | string
    reportTime: string
    siteId: string
    siteName: string
    time: string
    userId: string
    userName: string
    picUrlList: string[]
}
export interface VisitorInputData {
    titleText: string
    scrollHeight: number
    model: FormModel
    siteIndex: null | number
    siteNameList: Record<string, string>[]
    isShowSiteList: boolean
    isShowTimeSelectStart: boolean
    isShowTimeSelectEnd: boolean
    rules: Record<string, any>
    curReportTime: string
    dateTypes: string[]
    dateType: string
    disabledDate: (arg0: Date) => boolean,
    fileList: Record<string, string>[]
}
export interface FormModel {
    siteName: string
    company: string
    reportTime: number | string
    reportTimeStr: string
    reason: string
    number: string | number
    time: number | string
    timeStr: string
    remark: string
    picture: string,
    siteId: string
    userId: string
    userName: string
}