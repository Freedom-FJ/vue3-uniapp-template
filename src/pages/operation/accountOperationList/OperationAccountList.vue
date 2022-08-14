<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="task-list">
            <view class="task-top">
                <view class="search-box">
                    <u-search v-model="searchSite" :height="56" :show-action="false" bg-color="#F2F6FC" placeholder-color="#909399" :clearable="true" placeholder="请输入关键字" @change="changeSearch" @blur="inputBlur" @focus="isShowSearchBox = true" />
                </view>
            </view>
            <view class="list-box" :style="{'display': dataList.length ? 'flex':'block'}">
                <empty-common v-if="!dataList.length" text="暂无数据" style="padding-top: 24rpx;"></empty-common>
                <!-- 左边内容 -->
                <scroll-view class="scroller" :scroll-into-view="toView" scroll-y="true" scroll-with-animation="true">
                    <view v-for="(item,index) in dataList" :id="item.name" :key="index" class="left every-item">
                        <!-- 字母分类 -->
                        <view class="letter-content">
                            <span>{{ item.name.toUpperCase() }}</span>
                        </view>
                        <view v-for="(v, i) in item.value" :key="i" class="list-item" @click="ToSiteNav(v)">
                            <view class="title-line">
                                <view class="title-tips">
                                    {{ v.siteName }}
                                </view>
                                <view class="address-tips">
                                    <span>最近运维时间：{{ v.nearOpeTime }}</span>
                                </view>
                            </view>
                            <view class="status-line">
                                <view class="status-tips">
                                    {{ v.opePerson }}
                                </view>
                            </view>
                        </view> 
                    </view>
                </scroll-view>
                
                <!-- 右边索引 -->
                <view v-if="dataList.length" class="right-position">
                    <view v-for="(item,index) in AnchorPointList" :key="index" :data-id="item" @tap="bindToView"> 
                        {{ item==='#'?item : item.toUpperCase() }} 
                    </view>
                </view>
            </view>
            <view v-show="isShowSearchBox && currSearchList.length" class="search-box-abso">
                <view v-for="(item,index) in currSearchList" :key="index" class="search-site-line" @click="getCheckSit(item.siteName)">
                    {{ item.siteName }}
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import $service from '@/api/service'

import { debounce } from '@/utils/commonUtils'
import { onShow, onLoad } from "@dcloudio/uni-app"

interface inspectionTasksTs {
    itemId: number
    nearOpeTime: string
    opePerson: string
    spell: string
    siteName: string
}
interface leterItemTs {
    name: string,
    value: Array<inspectionTasksTs>,
}

interface listDataType {
    list: Array<leterItemTs>,
}
const data = reactive({
    titleText: '运维台账',
    searchSite: '', // 搜索变量
    isShowSearchBox: false, // 搜索面板
    allList: [] as leterItemTs[], // 全部数据
    currSearchList: [] as inspectionTasksTs[], // 当前搜索的站点列表
    AnchorPointList:['#','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
	toView:'a',
    dataList: [] as leterItemTs[]
})

onShow(function () {
    getListData()
    data.searchSite = ''
})
/**
 * @name 输入框失去焦点
 */
const inputBlur = () => {
    setTimeout(function() {
        data.isShowSearchBox = false
    }, 300)
}
/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/**
 * @name 点击站点进入站点导航页
 * @param item 站点信息
 */
const ToSiteNav = (item:inspectionTasksTs) => {
    uni.navigateTo({ url: `/pages/operation/accountOperationList/AccountListDetail?id=${item.itemId}&siteName=${item.siteName}` })
}
/**
 * @name 搜索输入
 * @dec 防抖
 */
const changeSearch = debounce(() => {
    data.currSearchList = []
    if(!data.searchSite) {
        data.currSearchList = []
        // 搜索数据
        data.dataList = data.allList
    } else {
        const filterData = data.allList.filter(item => {
            // 把搜索的内容过滤掉
            const values = item.value.filter(v => v.siteName.indexOf(data.searchSite) > -1) 
            // 搜索的tooltip   
            if(values.length > 0) {  
                data.currSearchList = data.currSearchList.concat(values)
            }
            return values.length > 0
        })
        data.dataList = filterData
    }
}, false, 500) 
/**
 * @name 搜索选中相应的站点
 * @param sitData 选中的站点
 */
const getCheckSit = (siteName: string) => {
    data.searchSite = siteName
}
/**
 * @name 获取列表数据
 */
const getListData = () => {
    const url = 'account/getSiteAccounts'
    $service(url).then((res:any) => {
        const listData = res.list
        data.dataList = listData || []
        data.allList = listData || []
    })
}

/**
 * @name: bindToView
 * @test: test font
 * @msg: 
 * @param {*} event
 * @return {*}
 */

const bindToView = (event:any) => {
    const id = event.currentTarget.dataset.id
    data.toView = (id === '#') ? 'a' : id
}

const { titleText, searchSite, isShowSearchBox, currSearchList, AnchorPointList, toView, dataList } = toRefs(data)
</script>
<style lang="scss" scoped>
.task-list {

    position: relative;
    height: calc(100% - 88rpx);
    .task-top {
        display: flex;
        width: 100%;
        height: 40px;
        padding: 0 20px;
        justify-content: space-between;
        align-items: center;
        .search-box {
            flex: none;
            width: 100%;
        }
        .icon {
            transition: all 0.3s;
        }
        .up {
            transform: rotate(180deg);
        }
    }
    .list-box {
        width: 100%;
        height: calc(100% - 40px - 88rpx);
        overflow: auto;
        display: flex;
        scroll-view{
			height: calc(100vh - 84px);
		}
        .letter-content {
            width: 100%;
            background: rgba(241, 244, 249, 1);
            height: 28px;
            line-height: 28px;
            padding-left: 20px;
            span {
                font-weight: 500;
                font-size: 32rpx;
                color: #000000;
            }
        }
        .right-position {
            position: fixed;
			right: 10rpx;
            font-weight: 500;
            line-height: 20px;
            font-size: 24rpx;
            color: #0084FF;
        }
        .list-item {
            position: relative;
            display: flex;
            margin: 0rpx 40rpx;
            padding: 20rpx 0rpx;
            border-bottom: 1px solid #EBEEF5;
            justify-content: space-between;
            .title-line {
                max-width: 79%;
            }   
            .title-tips {
                font-family: PingFangSC;
                font-size: 28rpx;
                font-weight: 500;
                line-height: 40rpx;
                letter-spacing: 0px;
                color: #303133;
            }
            .address-tips {
                display: flex;
                align-items: center;
                margin-top: 16rpx;
                span {
                    font-family: PingFangSC;
                    font-size: 24rpx;
                    font-weight: normal;
                    letter-spacing: 0px;
                    color: #909399;
                }
                image {
                    width: 32rpx;
                    height: 32rpx;
                }
            }
            .status-line {
                .status-tips {
                    width: 112rpx;
                    height: 40rpx;
                    border-radius: 80rpx;
                    text-align: center;
                    line-height: 40rpx;
                    font-family: PingFangSC;
                    font-size: 24rpx;
                    color: #303133;
                    margin: 0 0 15rpx auto;
                }
                .overday-text {
                    font-family: PingFangSC;
                    font-size: 24rpx;
                    line-height: 24rpx;
                    text-align: right;
                    color: #909399;
                }
            }
        }

        .list-item::before {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: calc(100% - 40rpx);
            height: 2rpx;
            background-color: #EBEEF5;
        }
    }
    .search-box-abso {
        position: absolute;
        width: 100%;
        height: calc(100% - 40px);
        top: 40px;
        background-color: white;
        .search-site-line {
            height: 80rpx;
            line-height: 80rpx;
            font-family: PingFangSC;
            font-size: 28rpx;
            font-weight: 500;
            border-bottom: 1px solid #EBEEF5;
            margin-left: 40rpx;
            padding-left: 40rpx;
        }
    }
}

</style>
