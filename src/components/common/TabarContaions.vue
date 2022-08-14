<template>
    <view class="container">
        <u-tabbar :list="tabBar" :switch-mode="switchMode" :mid-button="false"></u-tabbar>
    </view>
</template>
<script lang="ts" setup>
import { useSystemStore } from '@/store/system' 
const systemStore = useSystemStore()
const tabBar = computed(() => {
    return systemStore.getTabBarListData
})
// 自定义传入点击tabbar的跳转方式,默认是uni.switchTab
const switchMode = (params:{ url: string }) => {
	uni.switchTab(params)
}

</script>
<style lang="scss" scoped>
.container {
    height: 100rpx;
}
</style>