<template>
    <u-navbar
        back-icon-name="nav-back"
        :is-back="true"
        title-width="500"
        title-color="#0a0f14"
        back-icon-color="#0a0f14"
        title-bold
        :title="titleText"
    >
        <template #right>
            <view v-show="isShowClose" class="navbar-right">
                <img
                    src="@/static/images/common/close.png"
                    alt=""
                    @click="$emit('close')"
                >
            </view>
        </template>
    </u-navbar>
</template>
<script lang="ts" setup>
defineProps({
    /**
     * @desc 表头
     */
    titleText: {
        type: String,
        default:''
    },
    isShowClose: {
        type: Boolean,
        default: true
    }
})
const $emit = defineEmits([
    'close'
])
</script>
<style scoped lang="scss">

.navbar-right {
    margin-right: 36rpx;
    width: 48rpx;
}
</style>