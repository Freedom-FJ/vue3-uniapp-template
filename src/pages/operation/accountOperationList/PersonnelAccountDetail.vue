<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="task-list">
            <view class="task-top-time">
                <view class="status-select">
                    <span @click="showTime = true"> {{ timeList[currTimeIndex].text }}</span> 
                    <u-icon :class="[showTime ? 'up': '', 'icon']" name="arrow-down" color="#000" size="14" @click="showTime = true"></u-icon>
                </view>
            </view>
            <view class="list-box">
                <empty-common v-if="!list.length" text="暂无数据" style="padding-top: 24rpx"></empty-common>
                <view v-for="(item, index) in list" :key="index" class="list-item" @click="ToOtherNav(item)">
                    <view class="title-line">
                        <view class="title-tips">
                            {{ item.insTime }}
                        </view>
                        <view class="address-tips">
                            <span>{{ item.siteName }}</span>
                        </view>
                    </view>
                    <view class="status-line">
                        <view class="status-tips" :style="{'background': item.opeType ==='BROKE' ?'#FF9902' :'#0084FF'}">
                            {{ matchTaskType(item.opeType) }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <u-action-sheet v-model="showTime" :active-index="currTimeIndex" :list="timeList" :safe-area-inset-bottom="true" @click="checkTime"></u-action-sheet>
    </view>
</template>
<script lang="ts" setup>
import moment from 'moment'
import $service from '@/api/service'

import { debounce } from '@/utils/commonUtils'
import { onShow, onLoad } from "@dcloudio/uni-app"

interface inspectionTasksTs {
    assistMans: string,
    insTime: string,
    itemId: number,
    opePerson: string,
    opeType: string,
    siteName: string,
}
// 时间
interface timeListTypeTs {
    text: string,
    fullTime: string
}

const data = reactive({
    titleText: '人员台账详情',
    id: '',
    opePerson: '',
    list: [] as inspectionTasksTs[], // 当前显示的站点
    showTime: false, // 状态弹框显示
    currTimeIndex: 0, // 当前选中状态索引
    timeList: [] as timeListTypeTs[], // 时间列表
})
onLoad(function (option) {
    data.id = option.id || ''
    data.titleText = option.opePerson || ''
    data.currTimeIndex = 0
    data.timeList = getTimeList()
})
onShow(function () {
    data.id && getListData()
})

/**
 * @name 跳转其他页面
 * @param item 站点信息
 */
const ToOtherNav = (item:inspectionTasksTs) => {
    uni.navigateTo({ url: `/pages/operation/taskOperationList/ListDetail?id=${item.itemId}&opeType=${item.opeType}` })
}
/**
 * @name: getTimeList
 * @test: test font
 * @msg: 获取时间列表（近12个月）
 * @return {*}
 */
const getTimeList = (): any => {
    const dataArr = []
    const data = new Date()
    const year = data.getFullYear()
    data.setMonth(data.getMonth() + 1, 1)//获取到当前月份,设置月份
    for (let i = 0; i < 12; i++) {
        data.setMonth(data.getMonth() - 1)//每次循环一次 月份值减1
        let m:any = data.getMonth() + 1
        m = m < 10 ? '0' + m : m
        dataArr.push({
            text: m,
            fullTime: data.getFullYear() + '-' + (m)
        })
    }
    return dataArr
}

/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/**
 * @name: matchTaskType
 * @test: test font
 * @msg: 匹配巡检类型
 * @param {*} type
 * @return {*}
 */
const matchTaskType = (type: any) => {
    const mapData: any = {
        'WEEK': '周巡检',
        'MONTH': '月巡检',
        'SEASON': '季巡检',
        'BROKE': '故障巡检'
    }
    return mapData[type] || ''
}
/**
 * @name 切换时间
 * @param val index
 */
const checkTime = (val:number) => {
    data.currTimeIndex = val
    getListData()
}
/**
 * @name 获取列表数据
 */
const getListData = () => {
    const url = 'account/getPeopleAccountDetails'
    const params = {
        userId: data.id,
        parDate: data.timeList[data.currTimeIndex].fullTime,
    }
    $service<inspectionTasksTs[], true>(url, params).then(res => {
        const listData = res
        data.list = listData
        console.log(data.list)
    })
}
const { titleText, list, showTime, currTimeIndex,timeList } = toRefs(data)
</script>
<style lang="scss" scoped>
.task-list {
    position: relative;
    .task-top-time {
        width: 100%;
        background: #F2F6FC;
        height: 40px;
        line-height: 40px;
        color: #606266;
        .status-select {
            display: flex;
            align-items: center;
            padding-left: 12px;
            .u-icon {
                margin-left: 4px;
            }
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
                    width: 118rpx;
                    height: 40rpx;
                    border-radius: 8rpx;
                    text-align: center;
                    line-height: 40rpx;
                    font-family: PingFangSC;
                    font-size: 24rpx;
                    font-weight: 500;
                    color: #ffffff;
                    margin: 0 0 15rpx auto;
                    background: #0084FF;
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
}

</style>
