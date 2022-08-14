<!--
 * @Author: Tian
 * @Date: 2022-08-03 09:01:51
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-11 18:42:05
 * @Description: 我的页面开发
-->
<template>
    <view class="contains">
        <div class="mineContent">
            <div class="mineDetail">
                <div class="introMain">
                    <div class="introduce">
                        <image src="@/static/images/mine/user.png" />
                        <div class="person">
                            <div class="name">
                                {{ userName || '--' }}
                            </div>
                            <div class="company">
                                {{ orgName || '--' }}
                            </div>
                        </div>
                    </div>
                    <div class="role">
                        {{ role || '--' }}
                    </div>
                </div>
                <div class="inspection">
                    <div class="item">
                        <div class="text">
                            周巡检
                        </div>
                        <div class="value">
                            {{ weekDone }}/{{ weekNeed }}
                        </div>
                    </div>
                    <div class="item">
                        <div class="text">
                            故障巡检
                        </div>
                        <div class="value">
                            {{ troubleshootingDone }}/{{ troubleshootingNeed }}
                        </div>
                    </div>
                </div>  
            </div>
            <ul class="countDetail">
                <li>
                    <div class="left">
                        账户名称
                    </div>
                    <div class="right">
                        {{ countName || '--' }}
                    </div>
                </li>
                <li>
                    <div class="left">
                        手机号码
                    </div>
                    <div class="right">
                        {{ telephone || '--' }}
                    </div>
                </li>
                <li>
                    <div class="left">
                        修改密码
                    </div>
                    <div class="right" @click="goPage('ChangePassword')">
                        <span>已设定</span> 
                        <image src="@/static/images/mine/arrow.png" style="width: 15rpx;height:24rpx" alt="" />
                    </div>
                </li>
                <li>
                    <div class="left">
                        关于
                    </div>
                    <div class="right" @click="goPage('About')">
                        <span>版本2.0.0</span>    
                        <image src="@/static/images/mine/arrow.png" style="width: 15rpx;height:24rpx" alt="" />
                    </div>
                </li>
            </ul>
            <div class="loginOut" @click="loginOut">
                退出登录
            </div>
        </div>
        <tabar-contaions></tabar-contaions>
    </view>
</template>

<script lang="ts" setup>
import { UserInfo, WeeklyInspectionRes } from './type'
import { UserInfoRes } from '@/types/common' 
import { useSystemStore } from '@/store/system'
import { getUserRole } from '@/utils/commonUtils'
import { onShow } from '@dcloudio/uni-app'
import service from '@/api/service'
const mineData: UserInfo = reactive({
    userName: '',
    orgName: '',
    countName: '',
    role: '',
    telephone: '',
    weekDone: 0,
    weekNeed: 0,
    troubleshootingDone: 0,
    troubleshootingNeed: 0
})
onShow(() => {
   uni.getStorage({
        key: 'loginDate',
        success: function (res: Record<string, any>) {
            getUserInfo(res.data.userId)
            getUserRoleData()
            getWeeklyInspection(res.data.userId)
            getTroubleshooting(res.data.userId)
        }
    }) 
})
//获取用户信息
const getUserInfo = async (userId: string) => {
    const data = await service<UserInfoRes, true>('login/getUserInfo', {
        userId: userId
    })
    mineData.userName = data?.name
    mineData.orgName = data?.orgName
    mineData.telephone = data?.mobilePhone
    mineData.countName = data?.account
}
// 获取角色信息
const getUserRoleData = async () => {
    const data = await getUserRole()
    mineData.role = data[0]?.roleName
}
// 获取周巡检
const getWeeklyInspection = async (userId: string) => {
    const data = await service<WeeklyInspectionRes[], true>(`login/getWeeklyInspection`, {
        userId: userId,
        opeType: 'WEEK',
        pageNum: 1,
        pageSize: 500
    })
    const doneList = data.filter((item) => {
        // opeState 运维状态 1完成 0未完成
        return item.opeState
    })
    mineData.weekDone = doneList?.length ?? 0
    mineData.weekNeed = data?.length ?? 0
}
// 获取故障巡检
const getTroubleshooting = async (userId: string) => {
    const data = await service<WeeklyInspectionRes[], true>(`login/getTroubleshooting`, {
        userId: userId
    })
    const doneList = data.filter((item) => {
        // opeState 运维状态 0未完成 1完成 2超时完成,3上报组长 4上报经理 5打回
        return item.opeState === '1' || item.opeState === '2'
    })
    mineData.troubleshootingDone = doneList?.length ?? 0
    mineData.troubleshootingNeed = data?.length ?? 0
}
// 退出登录
const loginOut = () => {
    // 清除缓存，跳转至登录页
    uni.removeStorage({
        key: 'loginDate',
        success: function (res: Record<string, string>) {
            const systemStore = useSystemStore()
            systemStore.clearSystemData()
            uni.reLaunch({
                url: '/pages/login/Login'
            })
        }
    })
}
// 跳转至修改密码和关于页面
const goPage = (url: string) => {
    uni.navigateTo({
        url: `/pages/mine/${url}`
    })
}
const { userName, orgName, role, telephone, countName, weekDone, weekNeed, troubleshootingDone, troubleshootingNeed } = toRefs(mineData)
</script>

<style lang="scss" scoped>
.contains {
    height: 100%
}
.mineContent {
    height: calc(100vh - 100rpx);
    background: rgba(236, 240, 247, 1);
    overflow: hidden;
    .mineDetail {
        height: 448rpx;
        background: linear-gradient(132deg, #0B78F8 47%, #0B78F8 47%, #3296FA 100%, #3296FA 100%);
        padding-top: 156rpx;
        box-sizing: border-box;
        .introMain {
            display: flex;
            justify-content: space-between;
        }
        .introduce {
            display: flex;
            padding-left: 40rpx;
            image {
                width: 112rpx;
                height: auto;
                margin-right: 28rpx;
				flex-shrink: 0;
            }
            .person {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 108rpx;
                .name {
                    font-size: 36rpx;
                    color: #fff;
                }
                .company { 
                    font-size: 28rpx;
                    color: rgba(255, 255, 255, 0.6)
                }
            }
        }
        .role {
            font-size: 28rpx;
            height: 58rpx;
            line-height: 58rpx;
            text-align: center;
            min-width: 170rpx;
            color: #fff;
            font-family: PangMenZhengDao;
            background: url(../../static/images/mine/bg.png) no-repeat;
            background-size: 100% 100%;
            margin-right: -5px;
            margin-top: 8rpx;
        }
    }
    .inspection {
        display: flex;
        justify-content: space-between;
        padding: 60rpx 48rpx 0  48rpx;
        .item {
            width: 306rpx;
            height: 96rpx;
            line-height: 96rpx;
            padding-left: 40rpx;
            box-sizing: border-box;
            color: #fff;
            display: flex;
            border-radius: 32rpx;
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(20px);
            box-shadow: inset 0px -2px 8px 0px rgba(255, 255, 255, 0.2),inset 0px -8px 40px 0px rgba(255, 255, 255, 0.2);
            .text {
                font-size: 24rpx;
                margin-right: 40rpx;
            }
            .value {
                font-family: Bebas Neue;
                font-size: 48rpx;
            }
        }
    }
    .countDetail {
        padding-left: 0;
        background: #fff;
        li {
            margin-left: 40rpx;
            padding-right: 48rpx;
            display: flex;
            justify-content: space-between;
            list-style: none;
            box-sizing: border-box;
            height: 96rpx;
            line-height: 96rpx;
            border-bottom: 1px solid #EBEEF5;
            font-size: 28rpx;
            .left {
                color: #303133;
            }
            .right {
                color: #909399;
                image {
                    width: 15rpx;
                    height: 24rpx;
                    margin-left: 24rpx;
                }
            }
        }
        li:last-child {
            border-bottom: none;
        }
    }
    .loginOut {
        margin-top: 16rpx;
        height: 96rpx;
        line-height: 96rpx;
        text-align: center;
        font-size: 28rpx;
        color: #FF1744;
        background: #fff;
    }
}
</style>