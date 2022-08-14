import moment from 'moment'
import $service from '@/api/service'
import type { userDataTs, UserRoleRes } from '@/types/common'
import { UserInfoRes } from '@/types/common' 
import { apiLimitTs } from '@/types/service'

/**
 * @name 获取运维人员对应的站点列表
 */
const getTheSiteNameList = async () => {
    const returnNameList = await $service<
        {
            siteId: string
            siteName: string
        }[],
        true
    >('common/getTheSiteNameList', {
        type: 'control'
    })
    return returnNameList
}
/**
 * @name 根据站点获取相应的站点运维负责人
 * @param id 站点id
 * @param isReturnSimple  是否直接返回站点相关信息  true直接返回 false 返回运维人员信息
 */
const getStationPerson = async (id: string | number, isReturnSimple?:boolean) => {
    const returnNameList = await $service<
        {
            bean: {
                operationUser: string // 运维人员id
            }
        }
    >('common/getMissionDetail', [id])
    if (isReturnSimple) return returnNameList
    else {
        const data = await getUsersById(returnNameList.data?.bean.operationUser || '')
        return data
    }
 }
/**
 * @name 获取用户信息
 * @param 用户userId
 */
 const getUsersById = async (userId:string|number) => {
    const returnNameList = await $service<UserInfoRes, true>('login/getUserInfo', {
        userId
    })
    return returnNameList
}

/**
 * @name 获取站点负责人列表
 */
const getTheSitePrincipalName = async () => {
    const returnNameList = await $service<
        {
            id: string
            opePerson: string
        }[],
        true
    >('common/getTheSitePrincipalName')
    return returnNameList
}
/**
 * @name 获取站点协办人列表
 * @param id 负责人id
 */
const getTheSiteAssitNameList = async (id: string) => {
    const returnNameList = await $service<
        {
            id: string
            opePerson: string
        }[],
        true
    >('common/getTheSiteAssitNameList', { manId: id })
    return returnNameList
}

/**
 * @name 设备信息-试剂，关键参数等（水网格化基础信息获取）
 * @param id 站点id
 */
const getEquipmentType = async (id: string) => {
    const returnNameList = await $service<
        {
            reagent: {
                attachedType: string
                backupType: null
                createTime: number
                detail: '无'
                factorId: null
                highLimit: null
                id: string
                isDel: false
                itemKey: string
                lowLimit: null
                methodAndPrinciple: null
                models: null
                modifyTime: number
                name: string
                params: null
                type: string
                typeId: string
                unit: null
                volume: string
            }[]
            accessories: {
                attachedType: string
                backupType: '001'
                createTime: number
                detail: string
                factorId: null
                highLimit: null
                id: string
                isDel: false
                itemKey: string
                lowLimit: null
                methodAndPrinciple: null
                models: string
                modifyTime: number
                name: string
                params: null
                type: null
                typeId: string
                unit: null
                volume: null
            }[]
            keyParameter: {
                attachedType: string
                backupType: null
                createTime: number
                detail: string
                factorId: null
                highLimit: null
                id: string
                isDel: false
                itemKey: string
                lowLimit: null
                methodAndPrinciple: null
                models: null
                modifyTime: number
                name: string
                params: string
                type: null
                typeId: string
                unit: string
                volume: null
            }[]
            name: string
        },
        true
    >('common/equipmentType', { id: id })
    return returnNameList
}

/**
 * @name 设备列表（水网格化基础信息获取）
 * @param id 站点id
 */
const equipmentList = async (id: string) => {
    const returnNameList = await $service<
        {
            id: string
            name: string
        }[],
        true
    >('common/equipmentList', { siteCode: id, isUse: true })
    return returnNameList
}
/**
 * 参数序列化
 * @param data
 */
function param(data: any) {
    let url = ''
    for (const k in data) {
        const value = data[k] !== undefined ? data[k] : ''
        url += '&' + k + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : ''
}

/**
 * 路由跳转
 * @param url
 * @param data
 */
const togo = function (url: string, data: any) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
    uni.navigateTo({
        url
    })
}

/**
 * 获取 url 参数
 * @param name
 */
const getParameterByName = (name: string) => {
    /* eslint-disable */
    let url = location.search ? location.search : location.href
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(url)
    return results == null ? '' : decodeURIComponent(results[1])
    /* eslint-disable */
}
/**
 * 计算某一天是当年的第几个星期
 * @param day{时间戳、Date、或字符串如2021-01-01}
 * @return {number} 第几星期
 */
const calWeek = (day: number | Date | string) => {
    //week.dow：每周从星期几开始算周一到周日分别对应1，2，3，4，5，6，0
    //week.doy：doy 的计算方式为 7 + dow - janX，其中 janX 是一月的第一天（必须属于年份中的第一周）
    moment.updateLocale('en', {
        week: {
            dow: 1, //星期的第一天是星期一。
            doy: 7 //年份的第一周必须包含1月1日，也就是第一周从1月1日开始算(7+dow-1 = 7+1-1)，如果要从1月4号开始算第一周(也就是元旦3天算在上一年的周数)，就是7+1-4
        }
    })
    let week = moment(day).format('w') //周数
    let year = moment(day).year()
    const month = moment(day).month()
    if (week == '1' && month >= 11) {
        year = Number(year) + 1
    }
    return { year, week }
}

/**
 * 返回之前网站
 * @param time 等待时间
 */
const navigateBackSetTime = (time?: number) => {
    setTimeout(() => {
        uni.navigateBack()
    }, time || 1000)
}
/**
 * @name 提示框封装
 * @param message 提示文字
 * @param icon? 提示图标
 * @param duration? 持续时间
 */
const showToast = (
    message: string,
    icon: 'none' | 'success' | 'loading' | 'error' = 'none',
    duration: number = 2000
) => {
    uni.showToast({
        title: message,
        icon: icon,
        duration: duration
    })
}
/**
 * 数组排名
 * arr：待排序数组
 * key：检测每一项是否排名一样的key
 * return：添加排名rankNum的新数组
 */
const rankArr = (arr: Record<string, any>[], key: string) => {
    let result: any = []
    arr.forEach((item, index) => {
        let rankNum = 0
        if (index > 0) {
            if (!key) {
                key = 'value'
            }
            // 判断如果跟上一个值相同，则排名相同，否则+1
            if (item[key] == result[index - 1][key]) {
                rankNum = result[index - 1].rankNum
            } else {
                rankNum = result[index - 1].rankNum + 1
            }
        } else {
            rankNum = 1
        }
        result.push({ ...item, rankNum })
    })
    return result
}

/**
 * @dec 获取类型方法 返回 参数类型 或者 true/false
 * @param {*} tgt 需要判断类型的变量
 * @param {*} type? 可传可不传， 不传的话方法返回变量类型，传的话返回参数类型是否一致true/false
 * 可确定的类型：undefined、null、string、number、boolean、array、object、symbol、
 * date、regexp、function、asyncfunction、arguments、set、map、weakset、weakmap
 */
type typeReturn<T> = T extends string ? boolean : string
function DataType<T>(tgt: any, type?: T): typeReturn<T> {
    const dataType = Object.prototype.toString
        .call(tgt)
        .replace(/\[object (\w+)\]/, '$1')
        .toLowerCase()
    return (
        type ? dataType === (type as unknown as string) : dataType
    ) as typeReturn<T>
}

/**
 * @dec 替换{{}}变量
 * @param {*} vm 变量对象
 * @param {*} expr 变量在对象内的位置  如server.base
 */
const getVal = (vm: any, expr: string) => {
    if (!expr) return vm
    const value = expr.split('.').reduce((data: any, current: any) => {
        return data[current]
    }, vm)
    return value
}

/**
 * @name 模板解析
 * @dec 处理{{}}字符串，替换变量值
 * @param {*} vm 变量对象
 * @param {*} expr 字符串内部包含{{变量}}  如http://{{server.base}}/{{path}}
 */
const getContentValue = (vm: any, expr: string) => {
    //expr: 我是{{person.name}}
    // 遍历表达式将内容重新特换成一个完整的内容，返回回去
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        return getVal(vm, args[1])
    })
}

// vue全局挂载导出方法  使用 const { proxy } = useCurrentInstance()
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
function useCurrentInstance() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const proxy = appContext.config.globalProperties
    return {
        proxy
    }
}
/**
 * @name 获取用户登录信息
 * @return userData
 */
const getUserData: () => userDataTs | undefined = () => {
    const userDataStr: userDataTs | undefined = uni.getStorageSync('loginDate')
    return userDataStr
}
/**
 * @desc 函数 防抖 false/节流 true
 * @param fn 函数
 * @param immediate 是否立即执行 Boolean     true: 节流  false 防抖
 * @param wait 函数执行间隔时间毫秒数 默认1s Number
 */
function debounce(fn: () => void, immediate: boolean, wait = 1000) {
    let timer: null | NodeJS.Timeout
    return function () {
        if (timer && immediate) {
            return
        }
        if (timer && !immediate) {
            clearTimeout(timer)
        }
        if (immediate) {
            fn()
        }
        timer = setTimeout(() => {
            timer = null
            if (!immediate) {
                fn()
            }
        }, wait)
    }
}
/**
 * @name 获取角色信息
 */
const getUserRole = async () => {
    const userInfo = getUserData()
    const data = await $service<UserRoleRes[], true>(`login/getUserRole`, {
        userId: userInfo?.userId
    })
    return data
}

/**
 * @name 获取角色第一个运维信息信息
 */
const getUserOperationRole = async () => {
    const roleList = await getUserRole()
    let roleOperationList = []
    roleOperationList = roleList.filter(item => item.roleCode === 'ManagerRole') // 运维经理
    if (roleOperationList.length) return roleOperationList[0]
    roleOperationList = roleList.filter(item => item.roleCode === 'operationsPersonnelGroupO') // 运维组长
    if (roleOperationList.length) return roleOperationList[0]
    roleOperationList = roleList.filter(item => item.roleCode === 'operationsPersonnelManO') // 运维人员
    if(roleOperationList.length)return roleOperationList[0]
}
/**
 * @name base64转2进制方法
 * @param dataurl 图片base64 string
 * @returns 2进制数据
 */
const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',')
    const arrMat = arr[0].match(/:(.*?);/)
    const mime = arrMat && arrMat.length && arrMat[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
        type: mime || ''
    })
}

/**
 * @name 显示图片查看方法
 * @param index  当前显示图片
 * @param imgList 图片列表
 */
const showBigImg = (
    index: number,
    imgList: {
        response?: {
            ID: string
        }[]
        url: string
        error: boolean
        progress: number
    }[]
) => {
    uni.previewImage({
        current: index,
        urls: imgList.map(item => item.url) //必须是网址路径，否则加载不出来，如：http：或https：
    })
}
export {
    togo,
    getParameterByName,
    calWeek,
    rankArr,
    getContentValue,
    getVal,
    DataType,
    useCurrentInstance,
    getUserData,
    dataURLtoBlob,
    getTheSiteNameList,
    getTheSitePrincipalName,
    getTheSiteAssitNameList,
    equipmentList,
    getEquipmentType,
    showBigImg,
    getUserRole,
    debounce,
    getUserOperationRole,
    showToast,
    navigateBackSetTime,
    getStationPerson,
    getUsersById
}
