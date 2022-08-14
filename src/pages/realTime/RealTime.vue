<!--
 * @Author: Tian
 * @Date: 2022-08-03 17:36:27
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-11 17:23:19
 * @Description: 站点
-->
<template>
    <div class="real">
        <div class="title">
            站点实况
        </div>
        <div class="searchBox">
            <image src="../../static/images/site/_search.svg"></image>
            <input
                v-model="searchText"
                disabled
                type="text"
                placeholder="请输入站点名称"
                placeholder-style="color: rgba(255, 255, 255, 0.6);fontSize: 28rpx;"
                @click="goPage"
            >
        </div>
        <div class="siteTab">
            <div v-for="item, index in siteList" :key="index" class="item" @click="filterSite(item.runState)">
                <image :src="item.icon" :class="data.indexList.includes(item.runState) ? 'active' : ''"></image>
                <div class="text">
                    {{ item.status }}站点：{{ item.site }}
                </div>
            </div>
        </div>
        <div class="dataCutOff">
            数据截止时间：{{ endTime || '--' }}
        </div>
        <scroll-view scroll-y="true" class="scroll-Y" :style="{ height: scrollHeight + 'rpx' }">
            <div class="dataList">
                <u-empty v-if="!siteRealDataList.length" text="暂无数据" style="padding-top: 24rpx"></u-empty>
                <div v-for="item, index in siteRealDataList" :key="item.id" class="dataOne" @click="showDetail(item)">
                    <div class="left">
                        <div class="titleTop">
                            <div class="text">
                                {{ item.name }}
                            </div>
                            <div class="status" :class="`status${item.runState}`">
                                {{ stateObj[item.runState] }}
                            </div>
                        </div>
                        <div class="value">
                            <span>应上传数据数：</span>
                            <span>{{ item.shouldUploadCount }}</span>
                        </div>
                        <div class="value">
                            <span>已上传数据数：</span>
                            <span>{{ item.realUploadCount }}</span>
                        </div>
                    </div>
                    <div :id="`pieRef${index}`" :ref="setItemRef" class="right">
                        <qiun-data-charts :tooltip-show="false" type="ring" :opts="item.opts || {}" :chart-data="item.chartData || {}" />
                    </div>
                </div>
            </div>
        </scroll-view>
        <!-- 搜索弹出框 -->
        <u-popup v-model="showSearchBox" mode="bottom" border-radius="14" length="100%" :mask="true">
            <div class="searchContent">
                <div class="input">
                    <image class="searchIcon" src="../../static/images/site/search.svg"></image>
                    <u-input
                        v-model="searchValue"
                        placeholder="请输入站点名称"
                        clearable="true"
                        type="text"
                        :custom-style="inputStyle"
                        :focus="isFocus"
                        height="64"
                    />
                    <image
                        v-if="searchValue"
                        class="closeIcon"
                        src="../../static/images/site/close.svg"
                        @click="clearText"
                    ></image>
                </div>
                <div class="cancle" @click="cancle">
                    取消
                </div>
            </div>
            <div class="listContent">
                <div v-for="item, index in searchList" :key="index" class="list" @click="chooseItem(item)">
                    {{ item.name }}
                </div>
                <p v-if="searchList.length" class="total">
                    共搜索到 {{ searchList.length }} 条结果
                </p>
            </div>
        </u-popup>
    </div>
    <tabar-contaions></tabar-contaions>
</template>
<script lang="ts" setup>
import moment from 'moment'
import { RealTimeData, ConfigDataRes, SiteDataRes, SiteDetail } from './types'
import { pull, maxBy } from 'lodash'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import service from '@/api/service'
const data: RealTimeData = reactive({
    siteList: [
        {
            icon: '../../static/images/site/normal.png',
            status: '正常',
            runState: '1',
            site: 0
        },
        {
            icon: '../../static/images/site/over.png',
            status: '超标',
            runState: '2',
            site: 0
        },
        {
            icon: '../../static/images/site/abnormal.png',
            status: '异常',
            runState: '3',
            site: 0
        },
        {
            icon: '../../static/images/site/disable.png',
            status: '停站',
            runState: '6',
            site: 0
        },
    ],
    stateObj: {
        1: '正常',
        2: '超标',
        3: '异常',
        6: '停站'
    },
    showSearchBox: false,
    searchValue: '',
    inputStyle: {
        background: '#EBEEF5',
        borderRadius: '36rpx',
        paddingLeft: '64rpx'
    },
    isFocus: false,
    curIndex: null,
    activeIndex: null,
    indexList: [],
    configData: null,
    siteRealDataList: [],
    endTime: '',
    runStateCodes: '',
    searchList: [],
    searchText: '',
    scrollHeight: 0
})
const itemRefs = ref<Record<string, any>[]>([])
const setItemRef = (el: any) => {
    if (el) {
        itemRefs.value.push(el)
    }
}

onShow(async () => {
    getSiteList()
    await nextTick()
    getScrollHeight()

})
onPullDownRefresh(() => {
    setTimeout(() => {
        getSiteList()
        getScrollHeight()		
        uni.stopPullDownRefresh() //关闭刷新状态
    },2000)
})

/**
 * 获取可滚动区域
 */
const getScrollHeight = () => {
    uni.getSystemInfo({
        success: function (res: Record<string, any>) {
            data.scrollHeight = res.windowHeight * 2 - 500 - 200
            // console.log(data.scrollHeight, res.windowHeight, res.screenHeight)
        },
    })
}
/**
 * 获取配置信息
 */
const getSiteList = async () => {
    const config = await service<ConfigDataRes, true>('site/configData', {})
    data.configData = config
    await getSiteData()
}
/**
 * 获取站点列表数据
 * @param flag 默认true，显示列表数据。 false时显示搜索列表数据
 */
const getSiteData = async (flag = true) => {
    const res = await service<SiteDataRes, false>('site/realData', {
        treeType: '1',
        treeId: data.configData?.city_code ?? '-1',
        factorFlag: true,
        factor: '',
        stationCode: '1',
        siteName: data.searchValue,
        beginTime: moment().startOf('day').valueOf(),
        endTime: moment().valueOf(),
        runStateCodes: data.runStateCodes
    })
    if (flag) {
        //0:断线 1:正常 2：超标 3:异常  5:未接入 6:停站
        const siteData = res.data
        data.siteList.forEach(item => {
            if (siteData?.runStateCountMap[item.runState]) {
                item.site = siteData.runStateCountMap[item.runState]
            }
        })
        data.siteRealDataList = siteData?.siteRealDataList ? siteData?.siteRealDataList : []
        const timeObj = maxBy(data.siteRealDataList, (o: SiteDetail) => {
            return o.time
        })
        data.endTime = timeObj?.time
        await nextTick()
        // 加载环形图
        data.siteRealDataList.forEach((item: SiteDetail, index: number) => {
            const seriesData = item.uploadRate ? [
                            { name: '无效上传', value: item.uploadRate ? 100 - item.uploadRate : 0 },
                            { name: '有效上传', value: item.uploadRate ? item.uploadRate : 0 }
                        ] : [
                            { value: 100, name: '无数据' }
                        ]
            item.chartData = {
                series: [
                    {
                        data: seriesData
                    }
                ]
            }

            item.opts = {
                color: item.uploadRate !== null ? ['#FA5151', '#07DD82'] : ["rgba(233, 237, 240, 1)","rgba(233, 237, 240, 1)"],
                dataLabel: false,
                legend: {
                    show: false,
                },
                title: {
                    name: "上传率",
                    fontSize: 12,
                    color: "#606266"
                },
                subtitle: {
                    name: item.uploadRate !== null ? seriesData[1].value + '%' : '--',
                    fontSize: 14,
                    color: "#303133",
                },
                extra: {
                    ring: {
                        activeRadius: 0, // 启用Tooltip点击时，突出部分的宽度（最大值不得超过labelWidth）
                        ringWidth: 10, // 圆环的宽度
                        offsetAngle: 0,
                        labelWidth: 15,
                        border: false,
                    }
                }
            }
            const flag = item.uploadRate ? true : false

        })
    } else {
        //展示搜索列表
        data.searchList = res.data?.siteRealDataList ? res.data?.siteRealDataList : []
    }
}
/**
 * 根据站点类型筛选
 */
const filterSite = (index: string) => {
    if (data.indexList.includes(index)) {
        pull(data.indexList, index)
    } else {
        data.indexList.push(index)
    }

    data.runStateCodes = data.indexList.join(',')
    getSiteData()
}
/**
 * 站点搜索
 */
watch(
    () => data.searchValue,
    (val) => {
        val && getSiteData(false)
    }
)
/**
 * 搜索出来的列表选择
 * @param item 
 */
const chooseItem = (item: SiteDetail) => {
    data.siteRealDataList = [item]
    data.endTime = item.time
    data.searchText = item.name
    data.searchValue = item.name
    data.showSearchBox = false
}
/**
 * 弹出搜索框
 */
const goPage = () => {
    data.showSearchBox = true
}
/**
 * 清除搜索框内容
 */
const clearText = () => {
    data.searchValue = ''
    data.searchText = ''
    data.isFocus = true
    data.searchList = []
}
/**
 * 取消搜索
 */
const cancle = () => {
    data.showSearchBox = false
    // 判断输入框是否有内容
    !data.searchValue && getSiteData()
}
/**
 * 跳转至站点详情页面
 */
const showDetail = (item: SiteDetail) => {
    uni.navigateTo({
        url: `/pages/realTime/SiteDetail?accessCode=${item.accessCode}&siteName=${item.name}&siteId=${item.id}`
    })
}
const { siteList, showSearchBox, searchValue, inputStyle, isFocus, siteRealDataList, stateObj, endTime, searchList, searchText, scrollHeight } = toRefs(data)
</script>

<style lang="scss" scoped>
.real {
    .title {
        height: 88rpx;
        line-height: 88rpx;
        padding-left: 32rpx;
        color: #fff;
        font-size: 32rpx;
        background: #0073f2;
    }

    .listContent {
        .list {
            margin-left: 40rpx;
            height: 96rpx;
            line-height: 96rpx;
            border-bottom: 1px solid #EBEEF5;
            color: #303133;
            font-size: 28rpx;
        }

        .noData {
            height: 120rpx;
            font-size: 28rpx;
            color: #303133;
            line-height: 120rpx;
            text-align: center;
        }

        .total {
            height: 88rpx;
            line-height: 88rpx;
            text-align: center;
            color: #909399;
            font-size: 24rpx;
        }
    }

    .searchBox {
        height: 96rpx;
        background: #0073f2;
        padding: 12rpx 32rpx 0 32rpx;
        box-sizing: border-box;
        position: relative;

        image {
            position: absolute;
            left: 50rpx;
            top: 24rpx;
            width: 32rpx;
            height: 32rpx;
            z-index: 2;
        }

        input {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 28rpx;
            height: 56rpx;
            padding-left: 64rpx;
            // color: rgba(255, 255, 255, 0.6);
        }
    }

    .siteTab {
        display: flex;
        padding: 24rpx 26rpx;
        justify-content: space-between;

        .item {
            width: 25%;
            text-align: center;

            image {
                width: 144rpx;
                height: 144rpx;
            }

            .text {
                color: #303133;
                font-size: 24rpx;
                margin-top: 8px;
                font-weight: 500;
            }
        }

        .active {
            background: #E6F7FF;
            border-radius: 24rpx;
        }
    }

    .dataCutOff {
        background: #F2F6FC;
        height: 80rpx;
        line-height: 80rpx;
        padding-left: 40rpx;
        color: #606266;
        font-size: 24rpx;
    }

    .dataList {
        .dataOne {
            display: flex;
            justify-content: space-between;
            padding: 24rpx 32rpx 24rpx 0rpx;
            margin-left: 40rpx;
            border-bottom: 1px solid #EBEEF5;

            .left {
                .titleTop {
                    display: flex;
                    margin-bottom: 10rpx;
                    align-items: center;

                    .text {
                        font-size: 28rpx;
                        color: #303133;
                        font-weight: 500;
                        margin-right: 16rpx;
                    }

                    .status {
                        font-weight: 500;
                        font-size: 24rpx;
                        color: #fff;
                        width: 96rpx;
                        height: 40rpx;
                        text-align: center;
                        line-height: 40rpx;
                        border-radius: 20rpx;

                    }

                    .status1 {
                        background: #29CC7E;
                        box-shadow: inset 0px -1px 2px 0px rgba(255, 255, 255, 0.5), inset 0px -10px 10px 0px #00B46F, inset 0px 2px 10px 0px rgba(255, 255, 255, 0.5);
                    }

                    .status2 {
                        background: #F56C6C;
                        box-shadow: inset 0px -1px 2px 0px rgba(255, 255, 255, 0.5), inset 0px -10px 10px 0px #ED2E2E, inset 0px 2px 10px 0px rgba(255, 255, 255, 0.5);
                    }

                    .status3 {
                        background: #B464F8;
                        box-shadow: inset 0px -1px 2px 0px rgba(255, 255, 255, 0.5), inset 0px -10px 10px 0px #9629F5, inset 0px 2px 10px 0px rgba(255, 255, 255, 0.5);
                    }

                    .status6 {
                        background: #F4BE2F;
                        box-shadow: inset 0px -1px 2px 0px rgba(255, 255, 255, 0.5), inset 0px -10px 10px 0px #E39500, inset 0px 2px 10px 0px rgba(255, 255, 255, 0.5);
                    }
                }

                .value {
                    margin-bottom: 4rpx;

                    span:nth-child(1) {
                        color: #909399;
                    }

                    span:nth-child(2) {
                        color: #303133;
                    }
                }
            }

            .right {
                width: 160rpx;
                height: 160rpx;
                //  width: 350rpx;
                // height: 350rpx;
            }
        }
    }
}

.searchContent {
    width: 100%;
    padding: 48rpx 32rpx 24rpx 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .input {
        width: 85%;
        height: 64rpx;
        position: relative;

        .searchIcon {
            width: 32rpx;
            height: 32rpx;
            position: absolute;
            top: 16rpx;
            left: 18rpx;
            z-index: 2;
        }

        .closeIcon {
            width: 32rpx;
            height: 32rpx;
            position: absolute;
            top: 16rpx;
            right: 18rpx;
            z-index: 2;
        }
    }

    .cancle {
        color: #0084FF;
        font-size: 28rpx;
        font-weight: 500;
    }

}
</style>
