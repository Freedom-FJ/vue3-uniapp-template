<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="task-list">
            <view class="task-top">
                <view class="search-box">
                    <u-search
                        v-model="searchSite"
                        :height="56"
                        :show-action="false"
                        bg-color="#F2F6FC"
                        placeholder-color="#909399"
                        :clearable="true"
                        placeholder="请输入站点名称"
                        @change="changeSearch"
                        @blur="inputBlur"
                        @focus="isShowSearchBox = true"
                    />
                </view>
                <view class="status-select">
                    <span @click="showSataus = true"> {{ typeList[currSatausIndex].text }}</span>
                    <u-icon
                        :class="[showSataus ? 'up' : '', 'icon']"
                        name="arrow-down"
                        color="#000"
                        size="16"
                        @click="showSataus = true"
                    ></u-icon>
                </view>
            </view>
            <view class="list-box">
                <empty-common v-if="!list.length" text="暂无数据" style="padding-top: 24rpx"></empty-common>
                <view v-for="(item, index) in list" :key="index" class="list-item" @click="ToSiteNav(item)">
                    <view class="title-line">
                        <view class="title-tips">
                            {{ item.siteName }}
                        </view>
                        <view class="address-tips">
                            <image src="@/static/images/operation/icon-map-point.png" alt="" />
                            <span>{{ item.siteAddress || item.opeAddress || '--' }}</span>
                        </view>
                    </view>
                    <view class="status-line">
                        <view
                            class="status-tips"
                            :style="{ background: getTypeObj(item.opeState, item.isAlarmTime).tipsColor }"
                        >
                            {{ getTypeObj(item.opeState, item.isAlarmTime).text }}
                        </view>
                        <view class="overday-text">
                            {{ item.lastTime }}
                        </view>
                    </view>
                </view>
            </view>
            <view v-show="isShowSearchBox && currSearchList.length" class="search-box-abso">
                <view
                    v-for="(item, index) in currSearchList"
                    :key="index"
                    class="search-site-line"
                    @click="getCheckSit(item)"
                >
                    {{ item }}
                </view>
            </view>
        </view>
        <u-action-sheet
            v-model:active-index="currSatausIndex"
            v-model="showSataus"
            :list="typeList"
            :safe-area-inset-bottom="true"
            @click="checkStatus"
        ></u-action-sheet>
    </view>
</template>
<script lang="ts" setup>
import $service from '@/api/service'

import { debounce } from '@/utils/commonUtils'
import { onShow, onLoad } from "@dcloudio/uni-app"
import { faultStateList } from '@/utils/zm-constant'
import type { inspectionTasksTs } from './type'
// import moment from 'moment'

const data = reactive({
    titleText: '巡检列表',
    showSataus: false, // 状态弹框显示
    currSatausIndex: 0, // 当前选中状态索引
    props: {
        label: 'label', // 显示名称
        value: 'code', // 唯一标识
    },
    openType: '', // 当为fault时是故障列表
    searchSite: '', // 搜索变量
    isShowSearchBox: false, // 搜索面板
    allList: [] as inspectionTasksTs[], // 全部站点
    currStatusList: [] as inspectionTasksTs[], // 当前类型的站点
    currSearchList: [] as string[], // 当前搜索的站点列表
    list: [] as inspectionTasksTs[], // 当前显示的站点
    listParam: {
        opeType: 'WEEK',
        pageNum: 0,
        pageSize: 500
    },
    // 状态
    typeList: [
        {
            text: '全部状态',
            tipsColor: '',
            code: ''
        },
        {
            text: '未完成',
            tipsColor: '#F84439',
            code: '0'
        },
        {
            text: '已完成',
            tipsColor: '#2AC94F',
            code: '1'
        },
        {
            text: '超时完成',
            tipsColor: '#0084FF',
            code: '2'
        },
        {
            text: '超时',
            tipsColor: '#FF9902',
            code: '3'
        },
    ]
})
onLoad(function (option) {
    data.openType = option.openType || ''
    if (data.openType === 'fault') {
        data.titleText = '故障列表'
        data.typeList = [data.typeList[0], ...Object.keys(faultStateList).map((item) => faultStateList[item as keyof typeof faultStateList])]
    }
})
onShow(function () {
    getListData()
    data.searchSite = ''
    data.currSatausIndex = 0
})
/**
 * @name 站点点击切换
 * @param val 站点类型index
 */
const checkStatus = (val: number) => {
    data.searchSite = ''
    if (!val) data.currStatusList = data.allList // 全部 
    else if (data.openType === 'fault') {
        data.currStatusList = data.allList.filter(item => Number(item.opeState) === Number(data.typeList[val].code))
    } else {
        // 完成|超时完成
        if ([2, 3].includes(val)) data.currStatusList = data.allList.filter(item => Number(item.opeState) === Number(data.typeList[val].code))
        if (val === 1) data.currStatusList = data.allList.filter(item => !item.opeState && !Number(item.isAlarmTime))
        if (val === 4) data.currStatusList = data.allList.filter(item => !item.opeState && Number(item.isAlarmTime))
    }
    data.list = data.currStatusList
}
/**
 * @name 获取报警状态
 * @compute 
 * @param type 状态 0未完成|超时 1完成 2超时完成
 * @param isAlarmTime 报警类型 0不是  1是 报警时间
 */
const getTypeObj = computed(() => (type: number | string, isAlarmTime: string) => {
    const typeNum = parseInt(type + '')
    const useTypeList = data.typeList.slice(1)
    if (data.openType === 'fault') {
        if (typeNum < 0 || typeNum > 6 || (typeNum !== 0 && !typeNum)) return {
            text: '--',
            tipsColor: ''
        }
        return faultStateList[type as keyof typeof faultStateList]
    } else {
        if (typeNum < 0 || typeNum > 3 || (typeNum !== 0 && !typeNum)) return {
            text: '--',
            tipsColor: ''
        }
        //0不是  1是 报警时间
        if (type === 0) return parseInt(isAlarmTime) ? useTypeList[3] : useTypeList[type]
        return useTypeList[typeNum]
    }

})
/**
 * @name 输入框失去焦点
 */
const inputBlur = () => {
    setTimeout(function () {
        data.isShowSearchBox = false
    }, 300)
}
/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/**
 * @name 点击站点进入站点导航页
 * @param item 站点信息
 */
const ToSiteNav = (item: inspectionTasksTs) => {
    uni.navigateTo({ url: `/pages/operation/taskOperationList/ListDetail?id=${item.itemId}&state=${item.opeState}&openType=${data.openType}` })
}
/**
 * @name 搜索输入
 * @dec 防抖
 */
const changeSearch = debounce(() => {
    if (!data.searchSite) {
        data.currSearchList = []
        data.list = data.currStatusList
    } else {
        data.currSearchList = [... new Set(data.currStatusList.map(item => item.siteName).filter(siteName => siteName.indexOf(data.searchSite) !== -1))]
        data.list = data.currStatusList.filter(item => item.siteName.indexOf(data.searchSite) !== -1)
    }
}, false, 500)
/**
 * @name 搜索选中相应的站点
 * @param sitData 选中的站点
 */
const getCheckSit = (siteName: string) => {
    data.searchSite = siteName
}
/**
 * @name 获取列表数据
 */
const getListData = () => {
    const url = data.openType === 'fault' ? 'operation/getBrokeOperationalTasks' : 'operation/getInspectionTasks'
    $service<inspectionTasksTs[], true>(url, data.listParam).then(res => {
        const listData = res
        //针对超时完成状态 做一道筛选  后台的超时完成可能也是报警状态
        for (let i = 0; i < listData.length; i++) {
            const currListData = listData[i]
            if (currListData.isAlarmTime === '1') {
                currListData.lastTime = currListData.overTime || currListData.lastTime  
                // const lastLongMillTime = currListData.lastLongMillTime
                // const newValue = moment().valueOf()
                // const newMoment = moment()
                // const monMoment = moment(newValue + lastLongMillTime)
                // const MillDay = newMoment.diff(monMoment,'day')
                // if (currListData.lastTime === '已超时') currListData.lastTime = `已超时${MillDay}天`
                // else currListData.lastTime = `已超时完成`
            }
        }
        data.list = listData
        data.currStatusList = listData
        data.allList = listData
    })
}
const { titleText, list, currSatausIndex, showSataus, searchSite, isShowSearchBox, currSearchList, typeList } = toRefs(data)
</script>
<style lang="scss" scoped>
.task-list {
    position: relative;

    .task-top {
        display: flex;
        width: 100%;
        height: 40px;
        padding: 0 20px;
        justify-content: space-between;
        align-items: center;

        .search-box {
            flex: none;
            width: 75%;
        }

        .icon {
            transition: all 0.3s;
        }

        .up {
            transform: rotate(180deg);
        }
    }

    .list-box {
        width: 100%;
        height: calc(100% - 40px - 44px);
        overflow: auto;

        .list-item {
            position: relative;
            display: flex;
            padding: 20rpx 40rpx;
            justify-content: space-between;

            .title-line {
                max-width: 79%;
            }

            .title-tips {
                font-family: PingFangSC;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 40rpx;
                letter-spacing: 0px;
                color: #303133;
            }

            .address-tips {
                display: flex;
                align-items: center;
                margin-top: 16rpx;

                span {
                    font-family: PingFangSC;
                    font-size: 24rpx;
                    font-weight: normal;
                    letter-spacing: 0px;
                    color: #909399;
                }

                image {
                    width: 32rpx;
                    height: 32rpx;
                }
            }

            .status-line {
                .status-tips {
                    width: 112rpx;
                    height: 40rpx;
                    border-radius: 80rpx;
                    text-align: center;
                    line-height: 40rpx;
                    font-family: PingFangSC;
                    font-size: 24rpx;
                    font-weight: 500;
                    color: #FFFFFF;
                    margin: 0 0 15rpx auto;
                }

                .overday-text {
                    font-family: PingFangSC;
                    font-size: 24rpx;
                    line-height: 24rpx;
                    text-align: right;
                    color: #909399;
                }
            }
        }

        .list-item::before {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: calc(100% - 40rpx);
            height: 2rpx;
            background-color: #EBEEF5;
        }
    }

    .status-select {
        display: flex;
        align-items: center;

        span {
            margin-right: 5rpx;
        }
    }

    .search-box-abso {
        position: absolute;
        width: 100%;
        height: calc(100% - 40px);
        top: 40px;
        background-color: white;

        .search-site-line {
            height: 80rpx;
            line-height: 80rpx;
            font-family: PingFangSC;
            font-size: 28rpx;
            font-weight: 500;
            border-bottom: 1px solid #EBEEF5;
            margin-left: 40rpx;
            padding-left: 40rpx;
        }
    }
}
</style>
