import { typeObj } from '@/api/baseServe'
const { string, number, object, array, any, boolean } = typeObj
import { apiListTs } from '@/types/service'
const apiList: apiListTs = {
    // 图片上传
    uploadImg: {
        path: '/api/v1/sys/upload',
        server: 'fileBaseServer',
        method: 'POST',
        params: {
            file: string
        }
        // headers: {
        //     'content-type': 'application/x-www-form-urlencoded'
        // }
    },
    // 获取运维人员对应的站点列表
    getTheSiteNameList: {
        path: '/h5/api/v1/common/getTheSiteNameList',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true, // 请求参数中是否需要添加 userId
        params: {
            type: string // 质控签到用：control
        }
    },
    // 站点负责人列表
    getTheSitePrincipalName: {
        path: '/h5/api/v1/common/getTheSitePrincipalName',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true
    },
    // 站点协办人列表
    getTheSiteAssitNameList: {
        path: '/h5/api/v1/common/getTheSiteAssitNameList',
        server: 'wgmsQcOmServer',
        method: 'GET',
        isUserIdParams: true,
        params: {
            manId: string
        }
    },
    // 设备列表（水网格化基础信息获取）
    equipmentList: {
        path: '/api/v1.0/equipment/type/list',
        server: 'wgmsBaseServer',
        method: 'GET',
        params: {
            siteCode: [string, number], // 站点id（马破巷）
            isUse: boolean // true 是否启用
        }
    },
    // 设备信息-试剂，关键参数等（水网格化基础信息获取）
    equipmentType: {
        pathExpr: '/api/v1.0/equipment/type/{{id}}',
        server: 'wgmsBaseServer',
        method: 'GET'
    },
    // 获取地图配置
    getMapGlobal: {
        path: '/api/v1.0/config/systemConfig/006',
        server: 'wgmsBaseServer'
    },
    // 获取运维角色权限菜单
    getRoleResources: {
        path: '/api/v1.0/role/resources/18',
        server: 'bspPermissionServer',
        method: 'GET',
        params: {
            systemCode: string, // 角色code wgmsOperationMaintenanceApp
            type: number // 2
        }
    },
    // 获取运维角色系统权限菜单
    getSystemMenus: {
        path: '/api/v1.0/permissions/systemMenus',
        server: 'bspPermissionServer',
        method: 'POST',
        params: {
            systemCode: string // 角色code wgmsOperationMaintenanceApp
        }
    },
    // 根据id集合查询站点信息
    getSiteDetailList: {
        path: '/api/v1.0/section/querySectionByIds',
        server: 'wgmsBaseServer',
        method: 'POST',
        isArray: true
    },
    // 根据id集合查询站点信息
    getMissionDetail: {
        path: '/om/api/v1/mission/detail',
        server: 'wgmsQcOmServer',
        method: 'POST',
        isArray: true
    }
}
export default apiList
