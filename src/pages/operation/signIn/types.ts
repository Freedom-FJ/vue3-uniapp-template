export interface MapData {
    titleText: string
    searchValue: string
    inputStyle: Record<string, string>
    mapConfig: Record<string, any>
    siteInfoList: SiteInfo[]
    mapCenter: number[]
    rangeList: SiteInfo[]
    lngCenter: number[]
}
export interface SiteInfo {
    accessCode: string
    calculateFlag: number
    controlLevel: string
    id: string
    latitude: string
    longitude: string
    name: string
    regionId: string
    sectionIndex: number
    sectionType: string
    waterQuality: string
    watershedId: string
    isInRange: boolean
}