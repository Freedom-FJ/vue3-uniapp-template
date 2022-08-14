export interface systemMenuTs {
    label: string
    hidden: boolean
    parentId: string
    id: string
    key: string
    positionCode: string
    code: string
    typeName: string
    subs: systemMenuSubsTs[]
}
export interface systemMenuSubsTs {
    label: string
    hidden: false
    parentId: string
    id: string
    key: string
    positionCode: string
    code: string
    typeName: string
    url: string
    subs: systemMenuSubsTs[]
}
export type systemKeyTs = 'siteLive' | 'workbench' | 'mine'
export type systemListTs = Record<systemKeyTs, systemMenuTs>

export interface tabarItemTs {
    key: string
    pagePath: string
    iconPath: string
    selectedIconPath: string
    text: string
    count: number // 红色角标显示的数字，如果需要移除角标，配置此参数为0即可
    isDot: boolean // 如果配置此值为true，那么角标将会以红点的形式显示
}
