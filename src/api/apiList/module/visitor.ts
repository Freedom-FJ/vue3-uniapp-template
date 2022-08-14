import { typeObj } from '@/api/baseServe'
const { string, number, object, array, any, boolean } = typeObj
import { apiListTs } from '@/types/service'

const apiList: apiListTs = {
    visitorList: {
        path: '/h5/api/v1/visitorsLog/list',
        server: 'wgmsQcOmServer',
        isUserIdParams: true, 
    },
    visitorDetail: {
        pathExpr: '/h5/api/v1/visitorsLog/info/{{id}}',
        server: 'wgmsQcOmServer',
    },
    addVisitor: {
        path: '/h5/api/v1/visitorsLog/save',
        server: 'wgmsQcOmServer',
        method: 'POST',
        params: {
            siteName: string,
            company: string,
            reportTime: [string, number],
            reason: string,
            picture: string,
            time: [string, number],
            userId: string,
            userName: string,
            siteId: string,
            number: number
        }
    }
}
export default apiList