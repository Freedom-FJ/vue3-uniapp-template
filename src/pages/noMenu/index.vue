<template>
    <view class="container">
        <empty-common text="暂无菜单权限" style="padding-top: 24rpx"></empty-common>
    </view>
</template>
<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app'
import { showToast } from '@/utils/commonUtils'
import { useSystemStore } from '@/store/system'
onReady(function () {
    showToast('即将跳转登录页...')
    const systemStore = useSystemStore()
    setTimeout(() => {
        // 清除缓存，跳转至登录页
        uni.removeStorage({
            key: 'loginDate',
            success: function () {
                systemStore.clearSystemData()
                uni.reLaunch({
                    url: '/pages/login/Login'
                })
            }
        })
    },3000)
})

</script>
<style lang="scss" scoped>
.container {
    height: 100vh;
    background-color: #eff2f8;
}
</style>