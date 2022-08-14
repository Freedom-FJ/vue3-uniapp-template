<!--
 * @Author: Tian
 * @Date: 2022-08-03 17:36:27
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-11 19:21:01
 * @Description: 
-->
<template>
    <div></div>
</template>
<script setup lang="ts">
// import { globalKey } from './types/symbols'
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import { systemMenuInit, getGlobalMapConfig } from '@/utils/systemInit'
import { nextTick } from 'vue'
// /**
//  * 全局注入echarts
//  */
// provide(globalKey, {
//     echarts
// })
onLaunch(function () {
    const value = uni.getStorageSync('loginDate')
    if (value && value.token) nextTick(() => {
        systemMenuInit()
        getGlobalMapConfig()
    })
})

onShow(function() {
    console.log("App Show")
    const value = uni.getStorageSync('loginDate')
  // 勾选自动登录
	// if(value && value.token && value.isAutoLogin) {
	// 	uni.reLaunch({
	// 		url:'/pages/realTime/RealTime',
	// 		success() {
	// 			plus.navigator.closeSplashscreen()
	// 		}
	// 	})
	// } else {
	// 	uni.reLaunch({
	// 		url:'/pages/login/Login',
	// 		success() {
	// 			plus.navigator.closeSplashscreen()
	// 		}
	// 	})
	// }
})
onHide(function() {
  console.log("App Hide")
})
</script>
<style lang="scss">
@import "@ued_fpi/uview-ui/index.scss";
//page页面元素要设置成100% ，一定要设置
page {
    height:100%;
}
* {
    padding: 0;
    margin: 0;
}
@font-face {
    font-family: "Bebas Neue";
    src: url('./static/font/BebasNeue-Regular.ttf');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: "PangMenZhengDao";
    src: url('./static/font/pangmen.ttf');
    font-weight: normal;
    font-style: normal;
}
</style>
