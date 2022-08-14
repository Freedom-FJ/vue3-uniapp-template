<template>
    <div>
        <navbar :title="titleText" @close="closeNav" />
        <!-- <div class="searchBox">
            <image class="searchIcon" src="@/static/images/site/search.svg"></image>
            <u-input 
                v-model="searchValue"
                placeholder="请输入签到点名称" 
                clearable="true"
                type="text"
                :custom-style="inputStyle"
                height="56"
            />
        </div> -->
        <div id="fpiMapContainer">
        </div>
        <div class="operate">
            <div class="zoom">
                <div class="add" @click="zoom2Big">
                    <image src="@/static/images/map/add.png"></image>
                </div>
                <div class="add" @click="zoom2Small">
                    <image src="@/static/images/map/del.png"></image>
                </div>
            </div>
            <div class="reset" @click="mapReset">
                <image src="@/static/images/map/location.png"></image>
            </div>
        </div>
        <div class="signInBtn" :class="!mapData.rangeList.length ? 'disabled' : ''" @click="signIn">
            签到打卡
        </div>
    </div>
</template> 
<script lang="ts" setup>

import '@/static/map/mapbox-gl-v22'
import service from '@/api/service'
import styleJson from '@/static/map/style.json'
import { onShow } from '@dcloudio/uni-app'
import Nearby from '@/static/map/mapbox-circle'
import { getTheSiteNameList, getUserData } from '@/utils/commonUtils'
import { MapData, SiteInfo } from './types' 
import Icon from '@/static/images/map/icon.png'
import IconGray from '@/static/images/map/icon_gray.png'
import { useSystemStore } from '@/store/system' 
const systemStore = useSystemStore()
const mapGlobalData: Record<string, any> = computed(() => {
    return systemStore.getMapConfigData
})
const mapData: MapData = reactive({
    titleText: '',
    searchValue: '',
    inputStyle: {
        background: '#F2F6FC',
        borderRadius: '28rpx',
        paddingLeft: '64rpx'
    },
    mapConfig: {},
    siteInfoList: [],
    mapCenter: [],
    rangeList: [],
    lngCenter: []
})
const zoom2Small = () => {
    if (window.glMap.getZoom() > 7) window.glMap.zoomTo(window.glMap.getZoom() - 1)
}
const zoom2Big = () => {
    if (window.glMap.getZoom() < 18) window.glMap.zoomTo(window.glMap.getZoom() + 1)
}
const mapReset = () => {
    // window.glMap.flyTo({
    //     center: mapData.lngCenter,
    //     zoom: 15,
    //     bearing: 0,
    //     pitch: 0,
    // })
    // 重新获取定位
    getUniLocation()
}
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
onShow(() => {
    setTimeout(() => {
        initMap()
        getUniLocation()
    }, 100)
})

const initMap = () => {
    const lngcenter = mapGlobalData.value?.centerConfig?.center ?? [119.756470, 30.079901]
    console.log(mapGlobalData.value, 'dffffffffff', lngcenter)
    const mapCenter = [parseFloat(lngcenter[1]),parseFloat(lngcenter[0])]
    window.glMap = new mapboxgl.Map({
        container: 'fpiMapContainer',
        zoom: 10,
        minZoom: 4,
        maxZoom: 18,
        center: mapCenter,
        style: styleJson
    })
}
/**
 * 绘制圆圈
 * @param lnglat 经纬度
 * @param radius 半径 米
 */
const drawCircle = (lnglat: number[], radius: number) => {
    const pollutantNearby = new Nearby('', {
        name: 'pollutantNearby',
        contaniereId: 'app',
        lnglat: lnglat,
        analyse: (val: Record<string, any>) => {
            console.log(val, 'vvv')
        },
        radiusType: '0.5',
        color: '#2196F3',
        radius: radius
    })
    return pollutantNearby
}
/**
 * 获取当前经纬度
 */
const getUniLocation = () => {
    uni.getLocation({
        type: 'wgs84',
        success: async (res: Record<string, any>) => {
            const { longitude, latitude } = res
            const lnglat = [parseFloat(longitude), parseFloat(latitude)]
            mapData.lngCenter = lnglat
            console.log('定位:', longitude, latitude, lnglat)
            // 以当前位置为圆心绘制圆形区域
            setTimeout(() => {
                drawCircle(lnglat, 500)
                getSiteInfo()
            }, 100)
        },
        fail: () => {
            uni.showToast({
                title: '获取地址失败，将导致部分功能不可用',
                icon: 'none',
                duration: 1500,
            })
        },
    })
}
/**
 * 计算两经纬度点之间的距离(单位：米)
 * @param lng1 经度1
 * @param lat1 纬度1
 * @param lng2 经度2
 * @param lat2 纬度2
 * @return 距离（米）
 */
const caculateLL = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const radLat1 = lat1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137
    s = Math.round(s * 10000) / 10
    return s
}
/**
 * 获取运维人员下所有站点信息
 */
const getSiteInfo = () => {
    getTheSiteNameList().then(async res => {
        const idList = res.map(item => {
            return item.siteId
        })
        // 获取站点信息列表
        const siteList = await service<SiteInfo[], true>('common/getSiteDetailList', idList)
        // 判断当前站点是否在圆形区域内
        siteList.forEach((site: SiteInfo) => {
            const dis = caculateLL(mapData.mapCenter[1], mapData.mapCenter[0], parseFloat(site.latitude), parseFloat(site.longitude))
            if (dis <= 500) {
                site.isInRange = true
            } else {
                site.isInRange = false
            }
        })
        mapData.siteInfoList = siteList
        mapData.rangeList = siteList.filter((item) => {
            return item.isInRange
        })
        // 在地图上绘制站点点位
        drawSiteMarker(siteList)
    })
}
/**
 * 绘制站点图标
 * @param list 
 */
const drawSiteMarker = (list: SiteInfo[]) => {
    list.forEach((item: SiteInfo) => {
        const coordinates = [parseFloat(item.longitude), parseFloat(item.latitude)]
        const el = document.createElement('div')
        const icon = item.isInRange ? Icon : IconGray
        const bgColor = item.isInRange ? '#00BB8E' : 'rgba(0, 0, 0, 0.3)'
        el.className = 'site-marker'
        el.innerHTML = `<div style='display: flex;flex-direction: column;align-items: center;'>
            <div style='padding: 0 10px;box-shadow: 0px 1px 3px 0px rgba(40, 64, 88, 0.3);height: 24px;line-height: 24px;color: #fff;font-size: 12px;font-weight: 600;border-radius: 80px;background: ${bgColor}'>${item.name}</div>
            <img style='width: 20px;height: auto;' src=${icon} />
        </div>`
        if (!window.siteMarkers) window.siteMarkers = {}
        window.siteMarkers[item.id] = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(window.glMap)
    })
    window.glMap.triggerRepaint()
}
/**
 * 签到打卡
 */
const signIn = async () => {
    if (mapData.rangeList.length === 0) return
    const userData = getUserData() 
    if(!userData) return
    const res = await service('site/signIn', {
        loginUserId: userData.userId,
        longitude: mapData.rangeList[0].longitude,
        latitude: mapData.rangeList[0].latitude,
        siteId: mapData.rangeList[0].id,
        type: ''
    })
    if (res.code === 200) {
        uni.showToast({
            icon: 'success',
            title: '打卡成功',
            duration: 1000
        })
    } else if (res.code === 301) {
        uni.showToast({
            icon: 'none',
            title: res.message,
            duration: 1000
        })
    }
}
const { searchValue, inputStyle, titleText } = toRefs(mapData)
</script> 
<style lang="scss" scoped>
.operate {
    position: fixed;
    right: 32rpx;
    bottom: 150rpx;
    z-index: 99;
    .zoom {
        width: 64rpx;
        height: 128rpx;
        background: #fff;
        box-shadow: 0px 2px 4px 0px rgba(40, 64, 88, 0.5);
        border-radius: 16rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        .add {
            width: 100%;
            height: 64rpx;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        image {
            width: 40rpx;
            height: 40rpx;
        }
        
    }
    .reset {
        width: 64rpx;
        height: 64rpx;
        background: #fff;
        box-shadow: 0px 2px 4px 0px rgba(40, 64, 88, 0.5);
        border-radius: 16rpx;
        margin-top: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        image {
            width: 40rpx;
            height: 40rpx;
        }
    }
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;
    height: 88rpx;
    image {
        width: 40rpx;
        height: 40rpx;
    }
    .location {
        font-size: 32rpx;
        color: #303133;
    }
}
.searchBox {
    height: 88rpx;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    position: relative;
    .searchIcon {
        width: 32rpx;
        height: 32rpx;
        position: absolute;
        top: 26rpx;
        left: 50rpx;
        z-index: 2;
    }
}
#fpiMapContainer {
    width: 100%;
    height: 100vh;
    align-items: center;
} 
.signInBtn {
    width: 79%;
    position: fixed;
    left: 10.5%;
    bottom: 32rpx;
    height: 72rpx;
    background: #3296FA;
    border-radius: 36rpx;
    text-align: center;
    line-height: 72rpx;
    z-index: 99;
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
    box-shadow: 0px 4px 8px 0px rgba(50, 150, 250, 0.3);
} 
.disabled {
    background: #98CCFF;
} 
</style>