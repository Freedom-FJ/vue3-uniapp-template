<template>
    <div class="visitor">
        <navbar :title="titleText" @close="closeNav" />
        <scroll-view scroll-y="true" class="scroll-Y" :style="{height: scrollHeight + 'rpx'}">
            <div class="visitorList">
                <div v-for="item, index in list" :key="index" class="one" @click="goPage(item)">
                    <div class="left">
                        <p class="company">
                            {{ item.company }}
                        </p>
                        <p class="site">
                            来访站点：{{ item.siteName }}
                        </p>
                        <p class="site">
                            来访原因：{{ item.reason }}
                        </p>
                        <p class="time">
                            {{ item.time }}
                        </p>
                    </div>
                    <div class="right">
                        <image v-if="item.picUrlList.length" mode="aspectFill" :src="item.picUrlList[0]"></image>
                    </div>
                </div>
                <empty-common v-if="!list.length" text="暂无数据" style="padding-top: 24rpx"></empty-common>
            </div>
        </scroll-view>
    </div>
    <div class="addBtn" @click="addNew">
        新增
    </div>
</template>
<script lang="ts" setup>

import service from '@/api/service'
import { VisitorData, VisitorListDataRes, VisitorListOne } from './types'
import { onShow } from "@dcloudio/uni-app"
import config from '@/api/config'
const data: VisitorData = reactive({
    titleText: '访客登记',
    list: [],
    picture: '',
    scrollHeight: 0
})
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
const goPage = (item: VisitorListOne) => {
    uni.navigateTo({
        url: `/pages/operation/visitor/VisitorDetails?id=${item.id}`
    })
}
const addNew = () => {
    uni.navigateTo({
        url: `/pages/operation/visitor/VisitorInput`
    })
}
onMounted(() => {
    getVisitorList()
    getScrollHeight()
})
onShow(() => {
    getVisitorList()
})
/**
 * 获取可滚动区域
 */
const getScrollHeight = () => {
    uni.getSystemInfo({
        success: function (res: Record<string, any>) {
            data.scrollHeight = (res.screenHeight - 50 - 80) * 2
        },
    })
}
/**
 * 获取访客列表
 */
const getVisitorList = async () => {
    const listRes = await service<VisitorListDataRes, false>('visitor/visitorList')
    data.list = listRes.data?.entries ? listRes.data.entries : []
    data.list.forEach(item => {
        const picList = item.picture ? item.picture.split(',').map((id: string) => {
            return config.domain + '/file-base-server/api/v1/sys/download/' + id
        }) : []
        item.picUrlList = picList
    })
}
const { titleText, list, scrollHeight } = toRefs(data)
</script>
<style lang="scss" scoped>
.visitorList {
    .one {
        display: flex;
        padding: 24rpx 24rpx 24rpx;
        border-bottom: 1px solid #EBEEF5;
        margin-left: 48rpx;
        .left {
            
            color: #303133;
            font-size: 24rpx;
            flex: 1;
            .company {
                font-size: 28rpx;
                font-weight: 500;
                margin-bottom: 8rpx;
            }
            .site {
                margin-bottom: 4rpx;
            }
            .time {
                color: #909399;
            }
        }
        .right {
            width: 240rpx;
            height: 176rpx;
            border-radius: 8rpx;
            flex-shrink: 0;
            image {
                width: 240rpx;
                height: 178rpx;
            }
        }
    }
} 
.addBtn {
    position: fixed;
    bottom: 40rpx;
    background: #2AC94F;
    box-shadow: 0px 4px 8px 0px rgba(42, 201, 79, 0.2);
    border-radius: 36rpx;
    width: 79%;
    margin-left: 10.5%;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    color: #fff;
    font-size: 28rpx;
    font-weight: 500;
}
</style>