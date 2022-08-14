/*
 * @Author: Tian
 * @Date: 2022-08-03 17:36:27
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-04 15:11:36
 * @Description 周巡检和故障巡检接口联调
 */
import { typeObj } from '@/api/baseServe'
const { string, number, object, array, any, boolean } = typeObj
import { apiListTs } from '@/types/service'
const apiList: apiListTs = {
    // 登录接口
    loginIn: {
        path: '/userCenter/login',
        server: 'simpleUserCenterServer',
        method: 'POST',
        params: {
            passWord: string,
            userName: string
        }
    },
    // 获取用户信息
    getUserInfo: {
        path: '/api/v1.0/user/getUsersById',
        server: 'simpleUserCenterServer',
        isUserIdParams: true // 请求参数中是否需要添加 userId
    },
    // 获取用户角色
    getUserRole: {
        pathExpr: '/api/v1.0/userRoles/getUserRolesById/{{userId}}',
        server: 'bspServe'
    },
    // 获取周巡检列表
    getWeeklyInspection: {
        path: '/h5/api/v1/task/getInspectionTasks',
        server: 'wgmsQcOmServer',
        params: {
            userId: string,
            opeType: string,
            pageNum: number,
            pageSize: number
        }
    },
    // 获取故障巡检列表
    getTroubleshooting: {
        path: '/h5/api/v1/task/getBrokeOperationalTasks',
        server: 'wgmsQcOmServer',
        params: {
            userId: string
        }
    },
    // 修改密码
    changePassword: {
        path: '/api/v1.0/user/password',
        server: 'simpleUserCenterServer',
        method: 'POST',
        params: {
            originPassword: string,
            newPassword: string,
            repeatPassword: string
        }
    }
}
export default apiList
