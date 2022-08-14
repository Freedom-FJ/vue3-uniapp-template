<template>
    <div class="visitor">
        <navbar :title="titleText" @close="closeNav" />
        <div class="visitorList">
            <div v-for="item, index in list" :key="index" class="one">
                <div class="left">
                    <image v-if="item.require" src="@/static/images/common/require.svg"></image>
                    <p class="company">
                        {{ item.label }}
                    </p>
                </div>
                <div class="right">
                    {{ item.value }}
                </div>
            </div>
            <div class="remark">
                <div class="label">
                    备注
                </div>
                <div class="content" style="min-height: 40rpx;">
                    {{ remark }}
                </div>
            </div>
            <div class="remark">
                <div class="label">
                    现场照片
                </div>
                <div class="content">
                    <image v-for="url, index in picList" :key="index" mode="aspectFill" :src="url" @click="showBigImg(index)"></image>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import { onLoad } from "@dcloudio/uni-app"
import service from '@/api/service'
import { VisitorListOne } from './types'
import config from '@/api/config'
const data = reactive({
    titleText: '',
    list: [
        { label: '来访站点', key: 'siteName', value: '', require: true },
        { label: '来访单位', key: 'company', value: '', require: true },
        { label: '来访时间', key: 'time', value: '', require: true },
        { label: '来访原因', key: 'reason', value: '', require: true },
        { label: '来访人数', key: 'number', value: '', require: false },
        { label: '报备时间', key: 'reportTime', value: '', require: false },
    ],
    remark: '',
    picList: []
})
onLoad((option: Record<string, string | undefined>) => {
    const id = option.id || ''
    getVisitorDetail(id)
})
/**
 * 获取访客详情
 */
const getVisitorDetail = async (id: string) => {
    const listRes = await service<VisitorListOne, false>('visitor/visitorDetail', {
        id: id
    })
    const resData: any = listRes.data
    data.list.forEach((item) => {
        item.value = resData[item.key] || '--'
    })
    data.titleText = `${resData.company}访客详情`
    data.remark = resData.remark
    data.picList = resData.picture ? resData.picture.split(',').map((id: string) => {
        return config.domain + '/file-base-server/api/v1/sys/download/' + id
    }) : []
}
/**
 * 返回主界面
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/**
 * 显示大图
 * @param index 索引
 */
const showBigImg = (index: number) => {
    uni.previewImage({
        current: index,
        urls: data.picList//必须是网址路径，否则加载不出来，如：http：或https：
    })
}
const { list, remark, picList, titleText } = toRefs(data)

</script>
<style lang="scss" scoped>
.visitorList {
    .one {
        display: flex;
        border-bottom: 1px solid #EBEEF5;
        margin-left: 40rpx;
        height: 96rpx;
        align-items: center;
        justify-content: space-between;
        padding-right: 32rpx;
        box-sizing: border-box;
        position: relative;
        .left {
            color: #909399;
            font-size: 28rpx;
            display: flex;
            align-items: center;
            image {
                width: 16rpx;
                height: 16rpx;
                margin-right: 8rpx;
                position: absolute;
                left: -20rpx;
            }
        }
        .right {
            color: #303133;
        }
    }
    .remark {
        padding: 24rpx 40rpx 24rpx 0;
        font-size: 28rpx;
        margin-left: 40rpx;
        border-bottom: 1px solid #EBEEF5;
        .label {
            color: #909399;
            margin-bottom: 16rpx;
            
        }
        .content {
            color: #303133;
            display: flex;
            flex-wrap: wrap;
            image {
                width: 144rpx;
                height: 144rpx;
                border-radius: 16rpx;
                margin-right: 16rpx;
                margin-bottom: 10rpx;
            }
        }
    }
    .remark:last-child {
        border-bottom: none;
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