<template>
    <view class="container">
        <image src="@/static/images/common/empty.png"></image>
        <span>{{ text }}</span>
    </view>
</template>
<script lang="ts" setup>
defineProps({
    text: {
        type: String,
        default: '暂无数据'
    }
})
</script>
<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    image {
        width: 	560rpx;
        height: 330rpx;
        margin-bottom: 10rpx;
    }
    span {
        color: #909399;
        font-size: 32rpx;
    }
}
</style>