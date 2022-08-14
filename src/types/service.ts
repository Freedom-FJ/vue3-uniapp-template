import BaseList from '@/api/baseServe'
export interface apiObjTs {
    path?: string // 请求地址
    pathExpr?: string // 解析变量版本请求地址  用{{}}包裹变量
    server?: keyof typeof BaseList // 请求服务
    method?: 'POST' | 'GET' // 请求类型
    params?: recordt<ajaxDataTs> // 请求参数
    headers?: record // 请求头
    isUserIdParams?: boolean | string, // 是否传参有userId  传true类型为默认为userId变量名称，传字符串为对应key值
    isArray?: boolean, //判断post请求是否传数组,[1, 2, 3]
}
export type apiListTs = recordt<apiObjTs>
export type apiParamPrototypeTs = string | undefined | null
export type ajaxDataTs = apiParamPrototypeTs | apiParamPrototypeTs[]

export type getApiTs = <T, X = false>(
    url: string,
    params?: record,
    header?: record,
    interceptorsRequestCallback?: () => any
) => apiReturnTs<T, X>

export type apiReturnTs<T, X> = X extends true
    ? Promise<T>
    : Promise<{
          code: number
          data: null | T
          message: string
      }>
export type apiLimitTs<T> = {
    code: number
    data: null | T
    message: string
}