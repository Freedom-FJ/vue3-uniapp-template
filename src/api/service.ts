import base from './baseServe'
import { request } from './http'
import ApiConfig from './apiList'
import config from '@/api/config'
import { DataType, getContentValue, getUserData } from '@/utils/commonUtils'
import type {
    apiObjTs,
    apiParamPrototypeTs,
    ajaxDataTs,
    getApiTs
} from '@/types/service'
/**
 * @desc 请求函数
 * @param url 请求地址
 * @param params 请求参数
 * @param header 请求头
 * @param interceptorsRequestCallback
 * @type 类型参数 <T, X>  T: 类型返回值
 * X：ture 代表类型直接返回 不传则为false 代表类型返回通用格式
 *
 */
const getApi: getApiTs = async (
    url: string,
    params?: record,
    header?: record,
    interceptorsRequestCallback?: () => any
) => {
    const ajaxData: apiObjTs|undefined = getCurrApiData(url)
    if (!ajaxData) return Promise.reject(new Error('api对象地址错误')) // 判断是否为api对象地址错误
    const headers = ajaxData.headers || header || {} // 获取headers
    const data: any = getParams(ajaxData, params) // 获取请求参数
    // 添加userId
    if (ajaxData.isUserIdParams) {
        const userData = getUserData()
        if (userData) data[ ajaxData.isUserIdParams === true ? 'userId' : ajaxData.isUserIdParams ] = userData.userId ?? ''
    }
    const path = getPath(ajaxData, params) // 获取请求地址
    const option = {
        type: ajaxData.method || 'GET',
        url: path,
        data,
        header: headers
    }
    return request(option, interceptorsRequestCallback)
}
/**
 * @desc 获取请求api对象
 * @param url 请求封装api对象地址
 */
const getCurrApiData = (url:string) => {
    const start = url.lastIndexOf('/') + 1 // 获得最后一次出现‘/’的位置    home/page/getData
    const strName = url.slice(start) // 取得从该位置到结束的名字也就是方法name   => getData
    const filepath = url.slice(0, start - 1) // 取得路径名 => home/page
    const axiosData = ApiConfig[filepath] // api地址
    if (!axiosData) return
    const ajaxData: apiObjTs = axiosData.default[strName]
    return ajaxData
}
/**
 * @desc 获取请求地址
 * @param url 请求地址
 * @param ajaxData 请求api数据
 * @param data 实际参数
 */
const getPath = (ajaxData: record, data: record | undefined) => {
    let path = ''
    if ('pathExpr' in ajaxData) path = getContentValue(data, ajaxData.pathExpr)
    else path = ajaxData.path
    // 监测http开头的地址则直接请求无需拼接服务
    if (/^http/.test(path)) return path
    else
        return `/${
            (base as any)[ajaxData.server || config.defaultServer]
        }${path}`
}
/**
 * @desc 获取请求参数
 * @param url 请求地址
 * @param ajaxData 请求参数类型定义
 * @param data 实际参数
 */
const getParams = (
    ajaxData: apiObjTs, // api配置对象
    paramsData: record | undefined // 传参请求数据
) => {
    // if (DataType(paramsData) === 'formdata') return paramsData
    const { params, isArray, method } = ajaxData
    // 数组类型检测
    if(isArray) {
        method !== 'POST' && console.error('请求类型错误错误,为POST请求!')
        // 线上环境不检测类型
        if (config.innerNet) paramsCheckType(paramsData, 'array', '')
        return paramsData
    }
    if (!paramsData || !params) return {} // 如果数据为空则直接返回空传参
    const data: record = {}
    Object.keys(params).forEach((item: string) => {
        const currLimitType: ajaxDataTs = params[item] // 当前限制类型
        const currKeyParamsData = paramsData[item] // 当前数据
        // 线上环境不检测类型 
        if (config.innerNet) paramsCheckType(currKeyParamsData, currLimitType, item)
        data[item] = currKeyParamsData
    })
    return data
}
/**
 * @desc 类型检测方法
 * @param currKeyParamsData 当前被检测数据
 * @param currLimitType 当前检测类型限制
 * @param key 数据对应名称 用于输出错误信息
 */
const paramsCheckType = (currKeyParamsData:any, currLimitType:ajaxDataTs, key:string):void => {
    // any类型不检测
    if(currLimitType === 'any') return
    // 判断如果是数组类型定义
    if (DataType(currLimitType) === 'array') {
        const currType: string = DataType(currKeyParamsData)
        const stringTypeLimit = (
            currLimitType as apiParamPrototypeTs[]
        ).map((item: apiParamPrototypeTs) => item + '')
        !stringTypeLimit.includes(currType) &&
            console.error(
                `参数${key}类型错误,应该为${stringTypeLimit}`
            )
    } else {
        currLimitType = currLimitType + ''
        !DataType(currKeyParamsData, currLimitType) &&
            console.error(`参数${key}类型错误,应该为${currLimitType}`)
    }
}
export default getApi
