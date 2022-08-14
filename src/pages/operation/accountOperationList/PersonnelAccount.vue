<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="comm-list">
            <view class="comm-top">
                <view class="search-box">
                    <u-search v-model="searchSite" :height="56" :show-action="false" bg-color="#F2F6FC" placeholder-color="#909399" :clearable="true" placeholder="请输入关键字" @change="changeSearch" @blur="inputBlur" @focus="isShowSearchBox = true" />
                </view>
            </view>
            <view class="comm-content" :style="{'display': personList.length ? 'flex':'block'}">
                <empty-common v-if="!personList.length" text="暂无数据" style="padding-top: 24rpx;"></empty-common>
                <!-- 左边内容 -->
                <scroll-view class="scroller" :scroll-into-view="toView" scroll-y="true" scroll-with-animation="true">
                    <view v-for="(item,index) in personList" :id="item.name" :key="index" class="left every-item">
                        <!-- 字母分类 -->
                        <view class="letter-content">
                            <span>{{ item.name }}</span>
                        </view>
                        <view v-for="(v, i) in item.value" :key="i" class="list-item" @click="ToSiteNav(v)">
                            <!-- <image src="@/static/images/mine/user.png" class="image"></image> -->
                            <image :src="`${imgUrl}${v.id}`" class="image"></image>
                            <view class="title-line">
                                <view class="title-tips">
                                    {{ v.opePerson }}
                                </view>
                                <view class="address-tips">
                                    <span>{{ v.organization }}</span>
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                
                <!-- 右边索引 -->
                <view class="right-position">
                    <view v-for="(item,index) in list" :key="index" :data-id="item" @tap="bindToView"> 
                        {{ item==='#'?item : item.toUpperCase() }}
                    </view>
                </view>
            </view>
            <view v-show="isShowSearchBox && currPersonList.length" class="search-box-abso">
                <view v-for="(item,index) in currPersonList" :key="index" class="search-site-line" @click="getCheckPerson(item.opePerson)">
                    {{ item.opePerson }}
                </view>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import $service from '@/api/service'

import { debounce } from '@/utils/commonUtils'
import { onShow, onLoad } from "@dcloudio/uni-app"
import config from '@/api/config'
const { domain } = config

interface inspectionTasksTs {
    id: string,
    opePerson: string,
    organization: string,
    roleType: string,
    spell: string,
}
interface leterItemTs {
    name: string,
    value: Array<inspectionTasksTs>,
}


const data = reactive({
    titleText: '人员台账',
    searchSite: '', // 搜索变量
    isShowSearchBox: false, // 搜索面板
    list:['#','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
	toView:'A',
    allPersonList: [] as leterItemTs[], // 所有的人员列表
    personList: [] as leterItemTs[],
    currPersonList: [] as inspectionTasksTs[], // 当前搜索的人员列表
    imgUrl: domain + '/file-base-server/api/v1/sys/download/'
})
onShow(function () {
    getListData()
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
 * @name: showBigImg
 * @test: test font
 * @msg: 查看大照片
 * @param {*} url
 * @return {*}
 */
const showBigImg = (url: string) => {
    if(!url) {
        return 
    }
    uni.previewImage({
        current: 0,
        urls: [url] //必须是网址路径，否则加载不出来，如：http：或https：
    })
}
/**
 * @name 点击站点进入站点导航页
 * @param item 站点信息
 */
const ToSiteNav = (item:inspectionTasksTs) => {
    uni.navigateTo({ url: `/pages/operation/accountOperationList/PersonnelAccountDetail?id=${item.id}&opePerson=${item.opePerson}` })
}
/**
 * @name 获取列表数据
 */
const getListData = () => {
    const url = 'account/getPeopleAccounts'
    $service<[], true>(url).then(res => {
        const listData = res
        data.personList = listData
        data.allPersonList = listData
    })
}
/**
 * @name 搜索输入
 * @dec 防抖
 */
const changeSearch = debounce(() => {
    data.currPersonList = []
    if(!data.searchSite) {
        data.personList = data.allPersonList
        data.currPersonList = []
    } else {
        const filterData = data.allPersonList.filter(item => {
            // 把搜索的内容过滤掉
            const values = item.value.filter(v => v.opePerson.indexOf(data.searchSite) > -1) 
            // 搜索的tooltip 
            if(values.length > 0) {  
                data.currPersonList = data.currPersonList.concat(values)
            }
            return values.length > 0
        })
        data.personList = filterData
    }
}, false, 500) 

/**
 * @name 搜索选中相应的人员
 * @param sitData 选中的人员
 */
const getCheckPerson = (opePerson: string) => {
    data.searchSite = opePerson
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
    data.toView = (id === '#') ? 'A' : id.toUpperCase()
}

const { titleText,toView,searchSite, list, personList, imgUrl, isShowSearchBox, currPersonList } = toRefs(data)
</script>
<style lang="scss" scoped>
.comm-list {
    position: relative;
    .comm-top {
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
    .comm-content {
        width: 100%;
        height: 100%;
		display: flex;
        scroll-view{
			height: calc(100vh - 84px);
		}
        .every-item {
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
            .list-item {
                position: relative;
                display: flex;
                align-items: center;
                margin: 0rpx 40rpx;
                padding: 20rpx 0rpx;
                border-bottom: 1px solid #EBEEF5;
                .title-tips {
                    font-family: PingFangSC;
                    font-size: 28rpx;
                    font-weight: 500;
                    line-height: 40rpx;
                    letter-spacing: 0px;
                    color: #303133;
                }
                .image {
                    width: 64rpx;
                    height: 64rpx;
                    margin-right: 16rpx;
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
                }
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
