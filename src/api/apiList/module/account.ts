import { typeObj } from '@/api/baseServe'
const { string, number, object, array, any, boolean } = typeObj
import { apiListTs } from '@/types/service'
const apiList: apiListTs = {
    // 运维站点台账列表
    getSiteAccounts: {
        path: '/h5/api/v1/account/getSiteAccounts',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true, // 请求参数中是否需要添加 userId
    },
    // 运维站点台账详情
    getSiteAccountDetails: {
        path: '/h5/api/v1/account/getSiteAccountDetails',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true, // 请求参数中是否需要添加 userId
        params: {
            nodeId: string,
            parDate: string,
        }
    },
    // 运维人员台账列表
    getPeopleAccounts: {
        path: '/h5/api/v1/account/getPeopleAccounts',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true, // 请求参数中是否需要添加 userId
    },
    // 运维人员台账详情
    getPeopleAccountDetails: {
        path: '/h5/api/v1/account/getPeopleAccountDetails',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: false, // 请求参数中是否需要添加 userId
        params: {
            userId: string,
            parDate: string,
        }
    },
    // 运维日历
    getOperationalCalendar: {
        path: '/h5/api/v1/account/getOperationalCalendar',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true, // 请求参数中是否需要添加 userId
        params: {
            beginDate: string,
            endDate: string,
        }
    }
}
export default apiList
