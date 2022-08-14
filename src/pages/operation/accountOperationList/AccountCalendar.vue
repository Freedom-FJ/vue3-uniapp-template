<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="comm-list">
            <view class="comm-top-time">
                <view class="time-text">
                    {{ curDay ? comTimeText(curDay) : moment().format('YYYY年MM月') }}
                </view>
            </view>
            <!-- <u-pollute-calendar :theme="'normal'" :current-node-options="currentNodeOptions" :range="timeRange" :p-data="pollutionData" :cindex="1" @calendar-click="calendarClick" /> -->
            <Calendar @change-day="changeDay"></Calendar>
            <!-- 列表数据 -->
            <view class="calendar-station">
                <u-empty v-if="!curDayData.length" text="暂无数据" style="padding-top: 24rpx;"></u-empty>
                <view v-for="(item,index) in curDayData" :key="index" class="station-item">
                    <view class="station-type" :style="{'background': item.inspectionType ==='BROKE' ?'#FF9902' :'#0084FF'}" @click="ToOtherNav(item)">
                        {{ matchTaskType(item.inspectionType) }}
                    </view>
                    <view class="station-name">
                        {{ item.portName }}
                    </view>
                    <view class="station-time">
                        {{ item.day }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import moment from 'moment'
import $service from '@/api/service'
import Navbar from '@/components/common/Navbar.vue'
import { debounce } from '@/utils/commonUtils'
import { onShow, onLoad } from "@dcloudio/uni-app"
import Calendar from '@/components/calendar/Calendar.vue'

interface dayDataTs {
    companyName: string
    portName: string
    inspectionType: string,
    day?: string
}

interface calendarDataTs {
    day: string
    calanderInspVoList: Array<dayDataTs>
}

// 节点的配置,level可以自定义配置字段名,color必填，目前只用到 level和color。
const currentNodeOptions = [
    {
        level: 1,
        color: "#03a9f3",
        // color: "#fff",
    },
    {
        level: 2,
        color: "#84c941",
    },
    {
        level: 3,
        color: "#E8DD3E",
    },
    {
        level: 4,
        color: "#d9cc4b",
    },
    {
        level: 5,
        color: "#e02134",
    }
]

const data = reactive({
    titleText: '运维日历',
    pollutionData: [] as any[],   
    currentNodeOptions: currentNodeOptions,
    timeRange: moment().format('YYYY-MM'),
    allData: [] as calendarDataTs[], // 所有数据
    curDayData: [] as dayDataTs[], // 当前月份数据
    curDay: ''
})

onShow(function () {
    getDataCalendar()
    getListData()
})

// 日历点击
const calendarClick = debounce((item:void) => {
    console.log('日历点击Item：', item)
}, true)

/**
 * @name: matchTaskType
 * @test: test font
 * @msg: 匹配巡检类型
 * @param {*} type
 * @return {*}
 */
const matchTaskType = (type:any) => {
    const mapData: any = {
        'WEEK': '周巡检',
        'MONTH': '月巡检',
        'SEASON': '季巡检',
        'BROKE': '故障巡检'
    }
    return mapData[type] || ''
}

/**
 * @name: comTimeText
 * @test: test font
 * @msg: 计算时间文字
 * @param {*} date
 * @return {*}
 */
const comTimeText = (date:any) => {
    if(!date) {
        return '--'
    }
    let txt = ''
    const week = moment(date).day()
    switch (week) {
        case 0:
            txt = "周日"
            break
        case 1:
            txt = "周一"
            break
        case 2:
            txt = "周二"
            break
        case 3:
            txt = "周三"
            break
        case 4:
            txt = "周四"
            break
        case 5:
            txt = "周五"
            break
        case 6:
            txt = "周六"
            break
        default:
            txt = ''
    }
    return `${moment(date).format('YYYY年MM月DD日')} ${txt}`
}
 /**
 * 获取日历数据
 */
const getDataCalendar = () => {
    const tempList = getMonthDate(data.timeRange)
    tempList.forEach((item:string,index:number) => {
        data.pollutionData.push([item, '', index / 5])
    })
}

/**
 * @name 获取列表数据
 */
const getListData = () => {
    const url = 'account/getOperationalCalendar'
    const params = {
        beginDate: moment(data.timeRange).startOf("month").format("YYYY-MM-DD 00:00:00"),
        endDate: moment(data.timeRange).add(1, 'M').startOf("month")
.format("YYYY-MM-DD 00:00:00"),
    }
    $service<[], true>(url,params).then(res => {
        data.allData = res
        // 处理一下数据
        data.allData = data.allData.map((item:calendarDataTs) => {
            const calanderInspVoList: dayDataTs[] = item.calanderInspVoList.map((v:dayDataTs) => {
                return {
                    ...v,
                    day: item.day
                }
            })
            return {
                ...item,
                day: item.day,
                calanderInspVoList
            }
        })
        if(!data.curDay) {
            data.allData.forEach((item:calendarDataTs) => {
                data.curDayData = [...data.curDayData].concat(item.calanderInspVoList || [])
            })
        }else {
            // 当前选中天份的数据
            const curDayData: any = data.allData.find((item:calendarDataTs) => item.day === moment(data.curDay).format('YYYY-MM-DD'))
            if(curDayData) {
                data.curDayData = curDayData.calanderInspVoList || []
            }else {
                data.curDayData = []
            }
        }
        
    })
}
/**
 * @name: getMonthDate
 * @test: test font
 * @msg: 获取当月数据
 * @param {*} date
 * @return {*}
 */
const getMonthDate = (date:any) => {
  const nowdays:any = date ? new Date(date) : new Date()
  const year:any = nowdays.getFullYear()
  let month:any = nowdays.getMonth() + 1
  if (month < 10) {
    month = "0" + month
  }
  const myDate = new Date(year, month, 0)
  const tempList = []
  for (let i = 1; i <= myDate.getDate(); i++) {
    if (i < 10) {
      tempList.push(year + "-" + month + "-" + "0" + i)
    } else {
      tempList.push(year + "-" + month + "-" + i)
    }
  }
  return tempList
}
// 选择日期
const changeDay = (time: string) => {
    data.curDay = time
    const curDayData:any = data.allData.find((item:any) => item.day === moment(time).format('YYYY-MM-DD'))
    if(curDayData) {
        data.curDayData = curDayData.calanderInspVoList || []
    }else {
        data.curDayData = []
    }
}
/**
 * @name 跳转其他页面
 * @param item 站点信息
 */
const ToOtherNav = (item: dayDataTs) => {
    // 先不跳转，暂时不确定跳到哪个页面
    return ''
    // uni.navigateTo({ url: `/pages/operation/taskOperationList/ListDetail?portName=${item.portName}&opeType=${item.inspectionType}` })
}
/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}

const { titleText, pollutionData,timeRange,curDay,curDayData } = toRefs(data)
</script>
<style lang="scss" scoped>
.comm-list {
    position: relative;
    .comm-top-time {
        width: 100%;
        background: #F2F6FC;
        height: 40px;
        line-height: 40px;
        color: #606266;
        display: flex;
        align-items: center;
        justify-content: center;
        .time-text {
            font-size: 28rpx;
            font-weight: 500;
            color: #909399;
        }
    }
    .calendar-station {
        box-sizing: border-box;
        margin: 0 20rpx;
        overflow-y: auto;
        .station-item {
            width: 100%;
            display: flex;
            padding: 0rpx 32rpx 0rpx 0rpx;
            height: 48px;
            box-sizing: border-box;
            align-items: center;
            border-bottom: 1px solid #EBEEF5;
            .station-type {
                width: 128rpx;
                height: 40rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 6rpx;
                color: #FFFFFF;
                background: #0084FF;
                font-size: 24rpx;
                margin-right: 4px;
                &.blue {
                    background: #0084FF;
                }
                &.orange {
                    background: #FF9902;
                }
            }
            .station-name {
                font-size: 28rpx;
                color: #303133;
            }
            .station-time {
                font-size: 24rpx;
                margin-left: auto;
                color: #909399;
            }
        }
    }
}

::v-deep .pCalendar .pCalendar-month {
    display: none;
}
::v-deep .pCalendar .pCalendar-chart {
    padding-top: 24rpx;
}
::v-deep .pCalendar {
    padding-bottom: 0px;
}
</style>
