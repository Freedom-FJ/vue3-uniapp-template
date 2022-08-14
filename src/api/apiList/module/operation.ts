import { typeObj } from '@/api/baseServe'
const { string, number, object, array, any, boolean } = typeObj
import { apiListTs } from '@/types/service'
const apiList: apiListTs = {
    // 巡检任务列表
    getInspectionTasks: {
        path: '/h5/api/v1/task/getInspectionTasks',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true, // 请求参数中是否需要添加 userId
        params: {
            opeType: string,
            pageNum: number,
            pageSize: number
        }
    },
    // 故障运维任务列表
    getBrokeOperationalTasks: {
        path: '/h5/api/v1/task/getBrokeOperationalTasks',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true // 请求参数中是否需要添加 userId
    }
}
export default apiList
