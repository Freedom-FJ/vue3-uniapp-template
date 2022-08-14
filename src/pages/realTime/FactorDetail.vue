<template>
    <div class="factorDetail">
        <div class="selector">
            <div class="left">
                <div
                    v-for="item, index in tabList"
                    :key="item.label"
                    class="button"
                    :class="curIndex === index ? 'active' : ''"
                    @click="changeType(index)"
                >
                    {{ item.label }}
                </div>
            </div>
            <div class="right" @click="showSheet">
                <span>{{ currentFactorName }}</span>
                <image src="@/static/images/mine/drop.png"></image>
            </div>
        </div>
        <u-action-sheet
            v-model="isShowFactorList"
            v-model:active-index="activeIndex"
            :list="factorList"
            @click="handleSelect"
        >
        </u-action-sheet>
        <view class="title-box">
            {{ title }}
        </view>
        <div class="lineChart">
            <qiun-data-charts type="line" :opts="opts" :chart-data="chartData" :onzoom="true" :ontouch="true" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { findIndex, maxBy, minBy } from 'lodash'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { FactorTrandDetail, ChartRes } from './types'
import service from '@/api/service'
import moment from 'moment'
const data: FactorTrandDetail = reactive({
    tabList: [
        { label: '24小时', type: 'hour', startTime: '', endTime: '' },
        { label: '7日', type: 'day', startTime: '', endTime: '' }
    ],
    isShowFactorList: false,
    activeIndex: 0,
    factorList: [],
    curIndex: 0,
    currentFactorName: '',
    currentSelectedFactor: {},
    siteId: '',
    queryTimeType: 'hour',
    dataTimeType: 60,
    currentTime: '',
    chartData: {},
    title: '',
    opts: {
        enableScroll: true,
        color: ["#3296FA"],
        padding: [40, 10, 0, 15],
        legend: {
            show: false
        },
        xAxis: {
            axisLine: false,
            disableGrid: true,
            itemCount: 5
        },
        yAxis: {
            gridType: "dash",
            dashLength: 2,
            disableGrid: true,
            data: [
                {
                    axisLine: false
                }
            ]
        },
        extra: {
          line: {
            type: "curve",
            width: 2
          }
        }
      }
})
const changeType = (index: number) => {
    data.curIndex = index
    getTrandLineData()
}
const showSheet = () => {
    data.isShowFactorList = true
}
const handleSelect = (index: number) => {
    data.isShowFactorList = false
    data.currentFactorName = data.factorList[index].text
    data.currentSelectedFactor = data.factorList[index]
    getTrandLineData()
}
onLoad((option: Record<string, any>) => {
    data.factorList = JSON.parse(option.factorList)
    data.activeIndex = findIndex(data.factorList, function (i: Record<string, any>) {
        return i.value === option.curFactor
    })
    data.currentFactorName = option.curFactorName
    data.currentSelectedFactor = data.factorList[data.activeIndex]
    data.siteId = option.siteId
    data.currentTime = option.time
    //初始化时间
    //判断时间是否是今天
    const flag = moment().format('YYYYMMDD') === moment(Number(option.time)).format('YYYYMMDD')

    data.tabList[0].startTime = flag ? moment(Number(option.time)).add(-24, 'hours').valueOf() : Number(option.time)
    data.tabList[0].endTime = flag ? Number(option.time) : moment(Number(option.time)).add(24, 'hours').valueOf()
    data.tabList[1].startTime = moment(Number(option.time)).subtract(6, 'days')
.startOf('day')
.valueOf()
    data.tabList[1].endTime = moment(Number(option.time)).add(1, 'days').startOf('day')
        .valueOf()
    
})
onReady(function () {
    getTrandLineData()
})
/**
 * 获取折线图数据
 */
const getTrandLineData = async () => {
    const res = await service<ChartRes, true>('site/sigleSiteTrand', {
        factor: data.currentSelectedFactor.id,
        factorFlag: false,
        beginTime: data.tabList[data.curIndex].startTime,
        endTime: data.tabList[data.curIndex].endTime,
        dataTimeType: data.curIndex === 0 ? 60 : 1440,
        queryTimeType: data.tabList[data.curIndex].type,
        siteId: data.siteId
    })
    await nextTick()
    const text = `${data.currentFactorName}${data.currentSelectedFactor.unit ? '(' + data.currentSelectedFactor.unit + ' )' : ''}`
    data.title = text
    //获取最大值和最小值
    const seriesData = res.dates.map((item) => {
        return item.value
    })
    const min = minBy(seriesData, (o: number) => {
        return o
    })
    const max = maxBy(seriesData, (o: number) => {
        return o
    })
    // 处理Y轴显示bug
    if(max % 5 === 0) {
        data.opts.yAxis.data[0].max = max
    }else{
        data.opts.yAxis.data[0].max = max + (5 - max % 5)
    }
    if(min === 0) {
        data.opts.yAxis.data[0].min = min
    }else if(min % 5 === 0) {
        data.opts.yAxis.data[0].min = min
    }else{
        data.opts.yAxis.data[0].min = min - min % 5
    }
    // 根据日和小时，判断X轴显示个数
    if (data.curIndex === 0) {
        data.opts.xAxis.itemCount = 5
    } else {
        data.opts.xAxis.itemCount = 7
    }
    data.chartData = {
        categories: res.times.map(item => {
            if (!data.curIndex) {
                return moment(item).format('MM.DD HH')
            }else return moment(item).format('MM.DD')
        }),
        series: [
            {
                name: "监测值",
                data:  seriesData,
                textColor: '#3296FA',
                textSize: 12,
                connectNulls: true
            }
        ]
    }
}
const { title, chartData, opts, tabList, isShowFactorList, activeIndex, factorList, curIndex, currentFactorName } = toRefs(data)
</script> 
<style lang="scss" scoped>
.factorDetail {
    .selector {
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #F2F6FC;
        padding: 0 24rpx;

        .left {
            display: flex;
            align-items: center;
            height: 100%;

            .button {
                border: 1px solid #0084FF;
                width: 112rpx;
                height: 64rpx;
                border-radius: 6rpx;
                margin-right: 8rpx;
                text-align: center;
                line-height: 64rpx;
                color: #0084FF;
            }

            .active {
                background: #3296FA;
                color: #fff;
            }
        }

        .right {
            color: #606266;
            font-size: 24rpx;
            display: flex;
            align-items: center;

            image {
                width: 32rpx;
                height: 32rpx;
                margin-left: 8rpx;
            }

        }
    }
    .title-box {
        color: #909399;
        font-size: 12px;
        font-family: PingFangSC;
        z-index: 99;
        padding: 30rpx 0 0 28rpx;
        
    }
    .lineChart {
        padding-top: 20rpx;
        width: 100%;
        height: 400rpx;
        background: url(../../static/images/common/chart-bg.png) no-repeat;
        background-size: 86% 78%;
        background-position: 90% 61%;
    }
}
</style>