/*
 * @Author: Tian
 * @Date: 2022-08-11 14:38:48
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-11 18:39:18
 * @Description: 
 */
let domain
let defaultHost
const treeId = 3301
const regionId = 330100000000
const key = 'test' // dev test
const token = '6622bd9b00c841388bc7db1cfa762203'
const defaultServer = 'simple-user-center-server' // 默认服务
let fileHost = '' // 文件服务代理地址 开发环境默认地址
export const innerNet = // true代表开发环境
    process.env.NODE_ENV === 'development'
        ? true
        : /^(192|0|127|172|localhost)/.test(location?.hostname ?? '')
try {
    if (location !== undefined) {
        const innerNet =
            process.env.NODE_ENV === 'development'
                ? true
                : /^(192|0|127|172|localhost|10)/.test(location.hostname)
        defaultHost = innerNet
            ? 'http://wgms.dev.fpi-inc.site'
            : location.origin
        if (innerNet && location.hostname === 'wgms.jilin.fpi-inc.site:9080/') {
            defaultHost = 'https://' + location.hostname
        }
        fileHost = defaultHost
        domain = defaultHost
        domain = innerNet ? '/api' : location.origin
    } else {
        switch (key as string) {
            case 'hangzhou':
                domain = 'https://wgms.jilin.fpi-inc.site:9080'
                defaultHost = 'https://wgms.jilin.fpi-inc.site:9080'
                fileHost = defaultHost
                break
            case 'test':
                domain = 'http://wgms-test.fpi-inc.site'
                defaultHost = 'http://wgms-test.fpi-inc.site'
                fileHost = defaultHost
                break
            case 'dev':
                domain = 'http://wgms.dev.fpi-inc.site'
                defaultHost = 'http://wgms.dev.fpi-inc.site'
                fileHost = defaultHost
                break
            default:
                break
        }
    }
} catch (e) {
    console.log('e', e)
}
const commonConfig = {
    defaultHost,
    domain: domain,
    treeId,
    regionId,
    token,
    key,
    innerNet,
    fileHost,
    defaultServer
}
export default {
    ...commonConfig
}
