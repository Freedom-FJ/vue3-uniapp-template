<!--
 * @Author: Tian
 * @Date: 2022-08-05 16:39:51
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-12 10:40:08
 * @Description: 
-->
<template>
    <div class="siteDetail">
        <div class="top">
            <image class="back" src="@/static/images/site/back.png" @click="goBack"></image>
            <div class="text">
                {{ siteName }}
            </div>
            <image class="data" src="@/static/images/site/data.png"></image>
        </div>
        <div class="dateSelect">
            <div class="time" @click="showTimePicker">
                <span>{{ selectedTime }}</span>
                <image src="@/static/images/mine/drop.png"></image>
            </div>
            <u-date-time-group-picker
                v-model="selectedTime"
                :theme="theme"
                :disabled-date="disabledDate" 
                :show="show"
                :mode="mode"
                :types="types"
                :type="type"
                cancel-text="重置"
                @onPickerCancel="onPickerCancel"
                @onPickerConfirm="onPickerConfirm"
            />
        </div>
        <div class="dataDetail">
            <div class="one">
                数据条数：{{ realUploadCount }}
            </div>
            <div class="one">
                应上传：{{ shouldUploadCount }}
            </div>
            <div class="one">
                上传率：{{ uploadRate }}
            </div>
        </div>
        <div class="table">
            <div class="tableHeader">
                <div class="cell">
                    监测因子
                </div>
                <div class="cell">
                    日均值
                </div>
                <div class="cell">
                    近24小时趋势
                </div>
            </div>
            <div class="tableList">
                <div v-for="item, index in tableList" :key="index" class="one" @click="showDetail(item)">
                    <div class="cell">
                        <p>{{ item.name }}</p>
                        <p v-if="item.unit">
                            ({{ item.unit }})
                        </p>
                    </div>
                    <div class="cell">
                        {{ item.value == null ? '--' : item.value }}
                    </div>
                    <div :ref="setItemRef" class="chart">
                        <qiun-data-charts 
                            type="line"
                            :opts="item.opts"
                            :chart-data="item.chartData"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>  
<script lang="ts" setup>
import { SiteDetailData } from './types'
import moment from 'moment'
import service from '@/api/service'
import { onLoad } from '@dcloudio/uni-app'
import { FactorTrandData, SigleSite } from './types'
//data跳转到质控页面
const data: SiteDetailData = reactive({
    show: false,
    theme: 'normal',
    mode: "time",
    selectedTime: moment().format('YYYY.MM.DD'),
    types: ['day'],
    type: 'day',
    disabledDate: (date: Date) => {
        return date > new Date()
    },
    startTime: moment().startOf('day').valueOf(),
    endTime: moment().valueOf(),
    factorTime: moment().valueOf(),
    accessCode: '',
    shouldUploadCount: '',
    realUploadCount: '',
    uploadRate: '',
    siteName: '',
    siteId: '',
    tableList: [],
    factorList: []
})
const itemRefs = ref<Record<string, any>[]>([])
const setItemRef = (el: any) => {
    if (el) {
        itemRefs.value.push(el)
    }
}
onLoad((option: Record<string, any>) => {
    console.log(option)
    data.accessCode = option.accessCode
    data.siteName = option.siteName
    data.siteId = option.siteId
    getSiteDetail()
    getFacotrTrandData()
})
const showTimePicker = () => {
    data.show = true
}
const onPickerCancel = () => {
    data.show = false
}
const onPickerConfirm = (val: Date) => {
    //
    data.startTime = moment(val).valueOf()
    // 结束时间判断是否是当天，如果是，传当前时间
    data.endTime = 
        moment().format('YYYYMMDD') === moment(val).format('YYYYMMDD') 
        ? moment().valueOf() : 
        moment(val).add(1, 'days').startOf('day')
        .valueOf()
    data.factorTime = moment().format('YYYYMMDD') === moment(val).format('YYYYMMDD') 
        ? moment().valueOf() : moment(val).valueOf()
    data.selectedTime = moment(val).format('YYYY.MM.DD')
    data.show = false
    getSiteDetail()
    getFacotrTrandData()
}
onMounted(() => {
    //
    
})
/**
 * 获取单站点传输有效率
 */
const getSiteDetail = async () => {
    const siteDetail = await service<SigleSite, false>('site/siteTransportRate', {
        stationCode: '1',
        accessCode: data.accessCode,
        beginTime: data.startTime,
        endTime: data.endTime
    })
    const siteData = siteDetail.data
    data.shouldUploadCount = siteData?.shouldUploadCount ?? '--'
    data.realUploadCount = siteData?.realUploadCount ?? '--'
    data.uploadRate = siteData?.uploadRate ? siteData?.uploadRate + '%' : '--'
    // console.log(siteDetail)
}
/**
 * 获取因子趋势图
 */
const getFacotrTrandData = async () => {
    const trandData = await service<FactorTrandData[], false>('site/factorTrand', {
        stationCode: '1',
        accessCode: data.accessCode,
        time: data.factorTime,
        queryTimeType: 'day'
    })
    data.tableList = trandData.data
    data.factorList = trandData.data && trandData.data.length ? trandData.data.map((item) => {
        return {
            text: item.name,
            value: item.code,
            unit: item.unit,
            id: item.id
        }
    }) : []
    // 环形图绘制pollutantList
    await nextTick()
    data.tableList?.forEach((item) => {
        item.opts = {
            color: ["#3296FA"],
            padding: [5, 5, 5, 5],
            dataLabel: false,
            legend: {
                show: false
            },
            xAxis: {
                disabled: true,
                disableGrid: true,
                axisLine: false
            },
            yAxis: {
                disabled: true,
                disableGrid: true,

            },
            extra: {
            line: {
                type: "straight",
                width: 2
            }
            }
        }
        const xdata = item.pollutantList.map((one) => {
            return one.time
        })
        item.chartData = {
            categories: xdata,
            series: [{
                name: '',
                data: item.pollutantList.map((one) => {
                    return one.value
                }),
                connectNulls: true
            }]
        }
    })
}

/**
 * 跳转至详情
 */
const showDetail = (item: FactorTrandData) => {
    const factorList = JSON.stringify(data.factorList)
    uni.navigateTo({
        url: `/pages/realTime/FactorDetail?factorList=${factorList}&curFactorName=${item.name}&curFactor=${item.code}&time=${data.factorTime}&siteId=${data.siteId}`
    })
}
/**
 * 返回上一页
 */
const goBack = () => {
    uni.navigateBack({
        delta: 1
    })
}
const { show, theme, mode, selectedTime, types, type, disabledDate, shouldUploadCount, realUploadCount, uploadRate, siteName, tableList } = toRefs(data)
</script>
<style lang="scss" scoped>
.siteDetail {
    .top {
        display: flex;
        justify-content: space-between;
        height: 88rpx;
        align-items: center;
        padding: 0 32rpx 0 24rpx;
        .back {
            width: 40rpx;
            height: 40rpx;
        }
        .data {
            width: 48rpx;
            height: 48rpx;
        }
    }
    .dateSelect {
        height: 80rpx;
        background: #F2F6FC;
        display: flex;
        align-items: center;
        padding-left: 24rpx;
        .time {
            display: flex;
            align-items: center;
            span {
                color: #606266;
                font-size: 24rpx;
            }
            image {
                width: 32rpx;
                height: 32rpx;
                margin-left: 10rpx;
            }
        }
    }
    .dataDetail {
        display: flex;
        align-items: center;
        height: 80rpx;
        padding-left: 24rpx;
        color: #3296FA;
        font-size: 24rpx;
        .one {
            margin-right: 64rpx;
        }
    }
    .table {
        .tableHeader {
            display: flex;
            align-items: center;
            color: #606266;
            font-size: 24rpx;
            height: 84rpx;
            border-bottom: 1px solid #CFD8DC;
            padding-left: 24rpx;
            .cell:nth-child(1) {
                flex-shrink: 0;
                width: 20%;
            }
            .cell:nth-child(2) {
                flex-shrink: 0;
                width: 20%;
                text-align: center;
            }
            .cell:nth-child(3) {
                flex-shrink: 0;
                width: 60%;
            }
        }
        .tableList {
            .one {
                display: flex;
                align-items: center;
                height: 112rpx;
                padding-left: 24rpx;
                .cell:nth-child(1) {
                    flex-shrink: 0;
                    width: 20%;
                    color: #263238;
                    font-size: 24rpx;
                }
                .cell:nth-child(2) {
                    flex-shrink: 0;
                    width: 20%;
                    text-align: center;
                    color: #263238;
                    font-size: 28rpx;
                    font-family: Bebas Neue;
                }
                .chart {
                    flex-shrink: 0;
                    width: 60%;
                    height: 100%;
                }
            }
        }
    }
}
</style>