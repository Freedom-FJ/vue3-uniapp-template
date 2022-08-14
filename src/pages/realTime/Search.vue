<!--
 * @Author: Tian
 * @Date: 2022-08-05 10:11:37
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-05 10:52:15
 * @Description: 
-->
<template>
    <div class="searchBox">
        <div class="mask"></div>
        <div class="content"></div>
    </div>
</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.searchBox { 
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    .mask {
        height: 80rpx;
    }
    .content {
        height: calc(100% - 80rpx);
        background: #fff;
        border-radius: 24rpx 24rpx 0 0;
    }
}
</style>