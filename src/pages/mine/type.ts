/*
 * @Author: Tian
 * @Date: 2022-08-03 17:36:27
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-11 18:42:20
 * @Description: 
 */
export interface UserInfo {
    userName: string
    orgName: string
    role: string
    telephone: string | undefined
    countName: string
    weekDone: number
    weekNeed: number
    troubleshootingDone: number
    troubleshootingNeed: number
}

export interface UserRoleRes {
    description: string
    roleCode: string
    roleId: string | number
    roleName: string
}
export interface WeeklyInspectionRes {
    assTask: null | string | number
    canDo: number
    insName: string
    isAlarmTime: string
    itemId: number
    lastLongMillTime: number
    lastTime: string
    opeAssiste: string
    opePerson: string
    opeState: number | string
    opeType: string
    siteAddress: string
    siteName: string
    opeAddress?: string
}
export interface ChangePassData {
    oldPassWord: string
    newPassWord: string
    confirmPassWord: string
    showPopup: boolean
    pasVaildText?: string
}
export interface ChangePasswordRes {
    success?: boolean
    status?: number
    message?: string
}