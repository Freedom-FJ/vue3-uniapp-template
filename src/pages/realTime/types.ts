import { Ref } from 'vue'

/*
 * @Author: Tian
 * @Date: 2022-08-05 13:59:48
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-08 10:24:51
 * @Description:
 */
export interface RealTimeData {
    siteList: {
        icon: string
        status: string
        site: string | number
        runState: string
    }[]
    showSearchBox: boolean
    searchValue: string
    inputStyle: Record<string, string>
    isFocus: boolean
    curIndex: number | null
    activeIndex: number | null
    indexList: string[]
    configData: ConfigDataRes | null
    siteRealDataList: SiteDetail[]
    stateObj: Record<string, string>
    endTime: string
    runStateCodes: string
    searchList: SiteDetail[]
    searchText: string
    scrollHeight: number
}
export interface SiteDetailData {
    show: boolean
    theme: string
    mode: string
    selectedTime: string
    types: string[]
    type: string
    disabledDate: (arg0: Date) => boolean
    startTime: string | number
    endTime: string | number
    factorTime: string | number
    accessCode: string
    shouldUploadCount: number | string
    realUploadCount: number | string
    uploadRate: string | number
    siteName: string
    siteId: string
    tableList: FactorTrandData[] | null
    factorList: Record<string, any>[] | null
}
export interface FactorTrandData {
    code: string
    grade: null | string | number
    id: string | number
    name: string
    pollutantList: Record<string, any>[]
    timeList: Record<string, any>[]
    unit: string
    value: null | string | number
    chartData: {
        categories: (string | number)[]
        series: {
            name: string
            data: number[]
            connectNulls?: boolean
        }[]
    }
    opts: record
}
export interface SigleSite {
    accessCode: string
    realUploadCount: number
    realValidCount: number
    shouldUploadCount: number
    transportRate: number
    uploadRate: number
    validRate: number
}
export interface ConfigDataRes {
    city: string
    city_code: string
    enable_manual_audit: string
    flow_code: string
    one_six_eight_city: string
    region: string
    systemCode: string
    watershed: string
}
export interface SiteDetail {
    id: string | number
    accessCode: string
    name: string
    runState: string | number
    level: string | number
    time: string
    waterQuality: string
    stationCode: string | number
    factorDatas: []
    shouldUploadCount: number
    realUploadCount: number
    realValidCount: number
    uploadRate: number | null
    validRate: null | number
    transportRate: null | number
    chartData: record
    opts: record
}
export interface SiteDataRes {
    runStateCountMap: Record<string, string>
    siteRealDataList: SiteDetail[]
}

export interface FactorTrandDetail {
    tabList: Record<string, any>[]
    isShowFactorList: boolean
    activeIndex: number
    factorList: Record<string, string>[]
    curIndex: number
    currentFactorName: string
    currentSelectedFactor: Record<string, any>
    siteId: string
    queryTimeType: string
    dataTimeType: number
    currentTime: string | number
    chartData: record
    opts: record
    title: string
}
export interface ChartRes {
    dates: Record<string, any>[]
    times: string[]
}
