<!--
 * @Author: Tian
 * @Date: 2022-08-04 10:30:22
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-04 12:12:57
 * @Description: about页面开发
-->
<template>
    <div class="container">
        <div class="box">
            <div class="bg"></div>
            <div class="close" @click="closePage"></div>
            <div class="title">
                <div class="name">
                    水站运维
                </div>
                <div class="version">
                    V2.0.0
                </div>
            </div>
            <image class="qrCode" src="../../static/images/mine/cord.png"></image>
            <div class="download">
                扫一扫，下载APP
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const closePage = () => {
    uni.navigateBack({
        delta: 1
    })
}
</script>
<style lang="scss" scoped>
.container {
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    .box {
        width: 76.8%;
        height: 752rpx;
        background: #fff;
        border-radius: 24rpx;
        position: relative;
        display: flex;
        justify-content: center;
        .bg {
            width: 100%;
            height: 316rpx;
            background: url(../../static/images/mine/aboutBg.png) no-repeat;
            background-size: 100% 100%;

        }
        .close {
            position: absolute;
            right: 24rpx;
            top: 24rpx;
            width: 40rpx;
            height: 40rpx;
            background: url(../../static/images/mine/close.png) no-repeat;
            background-size: 100% 100%;
        }
        .title { 
            position: absolute;
            top: 80rpx;
            width: 100%;
            text-align: center;
            color: #fff;
            .name {
                font-size: 48rpx;
                margin-bottom: 24rpx;
            }
            .version {
                font-size: 28rpx;
            }
        }
        .qrCode {
            width: 336rpx;
            height: 336rpx;
            position: absolute;
            bottom: 144rpx;
        }
        .download {
            font-size: 28rpx;
            color: #606266;
            position: absolute;
            bottom: 64rpx;
        }
    }
}
</style>