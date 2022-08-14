import config from '@/api/config'
/* eslint-disable */
const install = (app: any) => {
    console.log('config.domain', config.domain)
    app.config.globalProperties.$u.http.setConfig({
        baseUrl:
            process.env.NODE_ENV === 'development'
                ? config.domain
                : config.domain
    })
    app.config.globalProperties.$u.http.interceptor.request = (config: any) => {
        try {
            const token = getApp().globalData?.token ?? ''
            if (token) {
                config.header.token = token
            } else {
                return false
            }
        } catch (e) {
            console.error(e)
        }
        return config
    }
    // 响应拦截，判断状态码是否通过
    app.config.globalProperties.$u.http.interceptor.response = (res: any) => {
        return res
    }
}

export const request: (
    options: any,
    interceptorsRequestCallback?: any
) => Promise<any> = (options: any = {}, interceptorsRequestCallback?: any) => {
    const headerConfig: any = options.header || {}
    const header: any = {
        ...headerConfig,
        token: getApp().globalData?.token || uni.getStorageSync('token'),
        regionCode: uni.getStorageSync('currentRegion')
    }
    return new Promise((resolve, reject) => {
        const reqPromise = uni.request({
            url: config.domain + options.url || '',
            method: options.type || 'GET',
            data: options.data || {},
            header: header
        })
        if (typeof interceptorsRequestCallback === 'function') {
            interceptorsRequestCallback(reqPromise)
        }
        ;(reqPromise as any)
            .then((data: any) => {
                // let [err, res] = data;
                let res = data
                if (res.data.code && res.data.code === 400) {
                    uni.reLaunch({
                        url: '/pages/login/Login'
                    })
                }
                resolve(res.data)
            })
            .catch((error: any) => {
                console.error(error)
                reject(error)
            })
    })
}

export default { install }
/* eslint-disable */
