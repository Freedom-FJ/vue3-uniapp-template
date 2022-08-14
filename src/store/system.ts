import { defineStore } from 'pinia'
import type { systemListTs, tabarItemTs } from '@/types/system'

export const useSystemStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'system',
    state: () => ({
        systemList: {} as systemListTs, // 存储系统菜单
        tabarList: [] as tabarItemTs[], // tabar菜单列表
        mapConfigData: {}
    }),
    getters: {
        getSystemData: state => state.systemList,
        getTabBarListData: state => state.tabarList,
        getWorkbenchSubData: state => state.systemList.workbench?.subs ?? {},
        getMapConfigData: state => state.mapConfigData
    },
    actions: {
        // 存储菜单
        async setSystemData(data: systemListTs) {
            this.systemList = data
        },
        // 存储tabBar菜单
        async setTabarListData(data: tabarItemTs[]) {
            this.tabarList = data
        },
        // 清除菜单
        clearSystemData() {
            this.systemList = {} as systemListTs
            this.tabarList = []
        },
        // 存储地图配置数据
        setMapConfigData(data: Record<string, any>) {
            this.mapConfigData = data
        }
    }
})
