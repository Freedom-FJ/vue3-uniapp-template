/**
 * 常量定义
 */

/**
 * 运维状态
 */
export const faultStateList = {
    '0': {
        text: '未处理',
        tipsColor: '#ff5d6e',
        code: '0'
    },
    '1': {
        text: '完成',
        tipsColor: '#2AC94F',
        code: '1'
    },
    '2': {
        text: '超时完成',
        tipsColor: '#0084FF',
        code: '2'
    },
    '3': {
        text: '上报组长',
        tipsColor: '#19c2d8',
        code: '3'
    },
    '4': {
        text: '上报经理',
        tipsColor: '#d17efc',
        code: '4'
    },
    '5': {
        text: '组长打回',
        tipsColor: '#F84439',
        code: '5'
    },
    '6': {
        text: '经理打回',
        tipsColor: '#F84439',
        code: '6'
    }
}
/**
 * tabBar 基础数据
 */
export const tabBarPathList = [
    {
        key: 'siteLive',
        pagePath: '/pages/realTime/RealTime',
        text: '站点实况'
    },
    {
        key: 'workbench',
        pagePath: '/pages/operation/Index',
        text: '工作台'
    },
    {
        key: 'mine',
        pagePath: '/pages/mine/Mine',
        text: '我的'
    }
]
export default {
    faultStateList,
    tabBarPathList
}
