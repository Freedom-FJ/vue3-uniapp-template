<template>
    <view class="contains">
        <view class="center-body">
            <view v-for="(item, index) in dataList" v-show="!item.hidden" :key="index">
                <view class="top-title">
                    {{ item.label }}
                </view>
                <view style="display: flex; width: 196rpx;">
                    <view
                        v-for="(iItem) in item.subs || []"
                        v-show="!iItem.hidden"
                        :key="iItem.key"
                        style="height: 196rpx;width: 196rpx;"
                        @click="goto(iItem.url)"
                    >
                        <image :src="`../../static/images/work/${iItem.key}.png`" style="height: 64rpx;width: 64rpx;margin: 30rpx 56rpx;" mode="" />
                        <view style="text-align: center;">
                            {{ iItem.label }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <tabar-contaions></tabar-contaions>
    </view>
</template>

<script lang="ts" setup>
import { useSystemStore } from '@/store/system'
import type { systemMenuSubsTs } from '@/types/system'
const data = reactive({
    dataList: [] as systemMenuSubsTs[]
})

/**
 * @name 获取工作台权限菜单
 */
const getOperationMenu = () => {
    const systemStore = useSystemStore()
    const currDetailMenu = systemStore.getWorkbenchSubData
    data.dataList = currDetailMenu
}
getOperationMenu()
/**
 * @name 跳转页面
 * @param url 路由地址
 */
const goto = (url: string) => {
    uni.navigateTo({ url })
}

const { dataList } = toRefs(data)
</script>

<style scoped lang="scss">
.contains {
    height: 100%;
    width: 100%;

    .center-body {
        height: calc(100% - 100rpx);
        overflow: auto;
    }
}

.top-title {
    height: 64rpx;
    width: 100%;
    background: #F2F6FC;
    font-size: 12px;
    padding: 20rpx;
}
</style>
