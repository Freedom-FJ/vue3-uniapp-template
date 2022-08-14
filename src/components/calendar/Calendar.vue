<template>
    <view class="calendar">
        <!-- <view class="calendar-switch">
            <view class="icon" @click="lowerClick()">
                &lt;
            </view>
            <view class="title">
                {{ year }}-{{ month > 9 ? month : "0" + month }}
            </view>
            <view class="icon" @click="upperCLick()">
                &gt;
            </view>
        </view> -->
        <view class="calendar-content">
            <view class="calendar-content-week">
                <view v-for="(item,index) in weekList" :key="index" class="calendar-content-week-item">
                    {{ item }}
                </view>
            </view>
            <view class="calendar-content-day">
                <view v-for="(item,index) in calendarList" :key="index" class="calendar-content-day-item" @click="changeDay(item)">
                    <view class="calendar-num" :class="{'today': isToday(item.fullTime),'selectedTime': isSelectedTime(item.fullTime),'disabled': !item.isCurMonth}">
                        {{ isToday(item.fullTime) ? '今' : item.num }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import moment from 'moment'
import { defineComponent, reactive, ref, onMounted, computed } from "vue"

// export default defineComponent({
//     name: "Calendar",
//     setup() {
        /* 定义内容 */
        const weekList = reactive<string[]>(["日", "一", "二", "三", "四", "五", "六"])
        const year = ref<number>(0)
        const month = ref<number>(0)
        const day = ref<number>(0)
        const selectedTime = ref<string>('')
        const $emit = defineEmits([
            'changeDay'
        ])

        /* 生命周期 */
        onMounted(() => {
            getInitDate()
        })
        /* 获取当前年月日 */
        const getInitDate = () => {
            const date = new Date()
            year.value = date.getFullYear()
            month.value = date.getUTCMonth() + 1
            day.value = date.getDate()
            // selectedTime.value = moment().format('YYYY-MM-DD')
        }
        // 补0
        const addZero = (data:string|number) => {
            if(data < 10) {
                return '0' + data
            }else {
                return data
            }
        }
        /* 获取天数 */
        const calendarList = computed(() => {
            const arr = []
            /* 获取当前月份多少天 */
            const nowDays = getDays(year.value, month.value)
            /* 获取上个月多少天 */
            const upperDays = getDays(year.value, month.value - 1)
            /* 获取当前月份多少天 */
            const nowWeek = getWeek(year.value, month.value)
            /* 将这个月多少天加入数组days */
            for (let i = 1; i <= nowDays; i++) {
                // arr.push(i)
                arr.push({
                    num: i,
                    isCurMonth: true, // 是否是当月
                    fullTime: `${year.value}-${addZero(month.value)}-${addZero(i)}`,
                })
            }
            /* 将下个月要显示的天数加入days */
            for (let i = 1; i <= 35 - nowDays - nowWeek; i++) {
                // arr.push(i)
                arr.push({
                    num: i,
                    isCurMonth: false, // 是否是当月
                    fullTime: `${year.value}-${addZero(month.value + 1)}-${addZero(i)}`,
                })
            }
            /* 将上个月要显示的天数加入days */
            for (let i = 0; i < nowWeek; i++) {
                // arr.unshift(upperDays - i)
                 arr.unshift({
                    num: upperDays - i,
                    isCurMonth: false, // 是否是当月
                    fullTime: `${year.value}-${addZero(month.value - 1)}-${addZero(upperDays - i)}`,
                })
            }
            return arr
        })
        // 是否是今天
        const isToday = computed(() => {
            return (time:string) => {
                const firstNum:string = time.split('-')[0] + ''
                if(firstNum === '0') {
                    return false
                }
                return moment().format('YYYY-MM-DD') === moment(time).format('YYYY-MM-DD')
            }
        })
        // 是否是当前选中时间
        const isSelectedTime = computed(() => {
            return (time:string) => {
                const firstNum:string = time.split('-')[0] + ''
                if(firstNum === '0') {
                    return false
                }
                return moment(selectedTime.value).format('YYYY-MM-DD') === moment(time).format('YYYY-MM-DD')
            }
        })
        /* 得到当前年这个月分有多少天 */
        const getDays = (Y: number, M: number): number => {
            return new Date(Y, M, 0).getDate()
        }
        /* 得到当前年，这个月的一号是周几 */
        const getWeek = (Y: number, M: number): number => {
            const now = new Date()
            now.setFullYear(Y)
            now.setMonth(M - 1)
            now.setDate(1)
            return now.getDay()
        }
        /* 月份切换增加 */
        const upperCLick = () => {
            if (month.value !== 12) {
                month.value = month.value + 1
            } else {
                year.value = year.value + 1
                month.value = 1
            }
        }
        /* 月份切换减少 */
        const lowerClick = () => {
            if (month.value !== 1) {
                month.value = month.value - 1
            } else {
                year.value = year.value - 1
                month.value = 12
            }
        }
        // 选择日期
        const changeDay = (item:any) => {
            if(!item.isCurMonth) {
                return
            }
            selectedTime.value = item.fullTime
            $emit('changeDay', selectedTime.value)
        }
        /* return出去才能使用 */
        // return {
        //     weekList,
        //     calendarList,
        //     year,
        //     month,
        //     day,
        //     selectedTime,
        //     isSelectedTime,
        //     isToday,
        //     getInitDate,
        //     upperCLick,
        //     lowerClick,
        //     changeDay
        // }
//     }
// })
</script>

<style lang="scss" scoped>

.calendar {
    width: 100%;
    height: 100%;

    .calendar-switch {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        line-height: 50px;

        .icon {
            cursor: pointer;
            font-size: 32rpx;
            color: #2c3e50;
            user-select: none;
        }

        .title {
            margin: 0 20px;
            font-size: 32rpx;
            font-weight: bold;
            color: #2c3e50;
        }
    }

    .calendar-content {
        .calendar-content-week {
            display: flex;

            .calendar-content-week-item {
                height: 72rpx;
                box-sizing: border-box;
                flex: 0 calc(100% / 7);
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: rgba(23, 26, 29, 0.6);
            }
        }

        .calendar-content-day {
            display: flex;
            flex-wrap: wrap;
            // justify-content: space-between;

            .calendar-content-day-item {
                height: 72rpx;
                transition: all 0.3s;
                box-sizing: border-box;
                flex: 0 calc(100% / 7);
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                .calendar-num {
                    width: 72rpx;
                    height: 72rpx;
                    color: #171A1D;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &.today {
                        background: #F2F2F6;
                        color: #0089FF;
                    }
                    &.selectedTime {
                        background: #0089FF;
                        color: #fff;
                    }
                    &.disabled {
                        color: rgba(23, 26, 29, 0.4);
                    }
                }
                // &:hover {
                //     background: #2c3e50;
                //     color: #fff;
                // }
            }
        }
    }
}
</style>