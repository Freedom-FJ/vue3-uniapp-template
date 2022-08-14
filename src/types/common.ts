export interface userDataTs {
    email: string
    idcardNo: string
    imei: string
    name: string
    phone: null | string
    telephone: string
    token: string
    userId: string
    userName: string
    userUuid: string
}
export interface UserRoleRes {
    description: string
    roleCode: string
    roleId: string | number
    roleName: string
}

export interface UserInfoRes {
    account: string
    address: string
    comment: string
    email: string
    idcardNo: string
    imei: string
    name: string
    orgId: string | number
    orgName: string
    picture: string
    position: string
    status: string
    telephone: string
    updatePasswordTime: string | number
    userId: string | number
    userIdStr: string
    userUuid: string
    mobilePhone?: string
}