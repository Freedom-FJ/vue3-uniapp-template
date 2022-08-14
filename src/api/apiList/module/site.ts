import { typeObj } from '@/api/baseServe'
const { string, number, object, array, any, boolean } = typeObj
import { apiListTs } from '@/types/service'

const apiList: apiListTs = {
    // 配置文件
    configData: {
        path: '/config/server/basic-information-manager-server-app.json',
        server: 'wgmsConfigServer',
    },
    // 站点实况
    realData: {
        path: '/api/v3.0/transmission/realData',
        server: 'wgmsMonitorServer',
        params: {
            treeType: string,
            treeId: string,
            factorFlag: boolean,
            factor: string,
            stationCode: string,
            siteName: string,
            beginTime: number,
            endTime: number,
            runStateCodes: string
        }
    },
    // 单站点传输率
    siteTransportRate: {
        path: '/api/v3.0/transmission/singleSite',
        server: 'wgmsMonitorServer',
        params: {
            stationCode: string,
            accessCode: string,
            beginTime: number,
            endTime: number
        }
    },
    // 单站点因子趋势图
    factorTrand: {
        path: '/api/v3.0/transmission/siteData',
        server: 'wgmsMonitorServer',
        params: {
            stationCode: string,
            accessCode: string,
            time: number,
            queryTimeType: string
        }
    },
    // 24小时和7天趋势变化
    sigleSiteTrand: {
        path: '/api/v1.0/analyse/singleSiteQuality',
        server: 'wgmsMonitorServer',
        params: {
            factor: string,
            factorFlag: boolean,
            beginTime: number,
            endTime: number,
            dataTimeType: number,
            queryTimeType: string,
            siteId: string
        }
    },
    // 签到
    signIn: {
        path: '/h5/api/v1/signIn',
        server: 'wgmsQcOmServer',
        method: 'POST',
        params: {
            loginUserId: string,
            longitude: string,
            latitude: string,
            siteId: string,
            type: string
        }
    }
}
export default apiList