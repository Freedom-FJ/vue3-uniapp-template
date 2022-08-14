import $service from '@/api/service'
import type { systemMenuTs } from '@/types/system'
import { useSystemStore } from '@/store/system'
import { tabBarPathList } from '@/utils/zm-constant'
import type { systemKeyTs, tabarItemTs } from '@/types/system'

/**
 * 获取权限菜单
 */
export const systemMenuInit = async () => {
    const systemList = await $service<{
        entries: systemMenuTs[]
    }>('common/getSystemMenus', {
        systemCode: 'wgmsOperationMaintenanceApp'
    })
    const systemStore = useSystemStore()
    const resData = systemList.data?.entries || []
    const filterData = resData.filter(item => !item.hidden)
    if (!filterData.length) {
        uni.navigateTo({ url: '/pages/noMenu/index' })
    } else {
        const returnData: any = {}
        filterData.forEach(item => {
            returnData[item.key] = item
        })
        systemStore.setSystemData(returnData)
        const tabarList: tabarItemTs[] = []
        tabBarPathList.forEach(item => {
            const currSystem = returnData[item.key as systemKeyTs]
            if (currSystem && !currSystem.hidden) {
                tabarList.push({
                    key: currSystem.key, 
                    pagePath: item.pagePath, // 路由地址
                    iconPath: `/static/images/tabbar/${item.key}-select-no.png`,
                    selectedIconPath: `/static/images/tabbar/${item.key}-select.png`,
                    text: currSystem.label,
                    count: 0, // 红色角标显示的数字，如果需要移除角标，配置此参数为0即可
                    isDot: false // 如果配置此值为true，那么角标将会以红点的形式显示
                })
            }
        })
        systemStore.setTabarListData(tabarList)
        uni.switchTab({ url: tabarList[0].pagePath })
    }
}
/**
 * 获取地图配置
 */
export const getGlobalMapConfig = async () => {
    const { data } = await $service('common/getMapGlobal', {})
    const mapData = JSON.parse(data as any)
    const systemStore = useSystemStore()
    systemStore.setMapConfigData(mapData)
}
