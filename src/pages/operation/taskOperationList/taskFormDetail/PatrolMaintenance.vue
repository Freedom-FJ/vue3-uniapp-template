<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="top-select">
            <view class="current-type" @click="isShowSelect = true">
                <span>{{ selectList.length ? selectList[selectIndex].text : '--' }}</span>
                <u-icon
                    name="arrow-down"
                    :class="[isShowSelect ? 'is-show-select' : '', 'detail-arrow']"
                    color="#606266"
                    size="14"
                ></u-icon>
            </view>
        </view>
        <view v-if="selectListDetail.length" class="detail-box" :style="{ height: state === '0' ? 'calc(100% - 40px - 44px - 60px)' : 'calc(100% - 40px - 44px )'}">
            <view v-if="!selectIndex" class="type-box">
                <view
                    v-for="(item, index) in (selectListDetail[selectIndex].subprojects as siteDetailSubprojectsTs[])"
                    :key="index"
                    class="type-box-item"
                >
                    <view class="type-box-item-line line-center">
                        <view class="label-box">
                            <span class="is-must">*</span>
                            <span>巡检日期</span>
                        </view>
                        <view class="value-box">
                            <view class="input-box">
                                <u-input
                                    v-model="item.recordTime"
                                    input-align="right"
                                    :custom-style="{ color: '#909399' }"
                                    type="select"
                                    :select-open="isShowRecordTimeList"
                                    placeholder="选择巡检日期"
                                    @click="isShowRecordTimeList = true"
                                ></u-input>
                            </view>
                            <image src="@/static/images/common/date.png" alt="" />
                        </view>
                    </view>
                    <view class="type-box-item-line line-center">
                        <view class="label-box">
                            <span class="is-must">*</span>
                            <span>天气情况</span>
                        </view>
                        <view class="radio-box">
                            <u-radio-group v-model="item.weather" active-color="#0084FF">
                                <u-radio
                                    v-for="(itemWeather) in weatherList"
                                    :key="itemWeather.name"
                                    :name="itemWeather.name"
                                >
                                    {{ itemWeather.name }}
                                </u-radio>
                            </u-radio-group>
                        </view>
                    </view>
                    <view class="type-box-item-line line-center">
                        <view class="label-box">
                            <span class="is-must">*</span>
                            <span>站房温度</span>
                        </view>
                        <view class="input-box">
                            <u-input
                                v-model="item.temperature"
                                input-align="right"
                                :custom-style="{ color: '#909399' }"
                                type="number"
                                :clearable="true"
                                placeholder="请输入温度(℃)"
                            ></u-input>
                        </view>
                    </view>
                    <view class="type-box-item-line line-center">
                        <view class="label-box">
                            <span class="is-must">*</span>
                            <span>站房湿度</span>
                        </view>
                        <view class="radio-box">
                            <u-radio-group v-model="item.humidity" active-color="#0084FF">
                                <u-radio v-for="(itemHum) in humidityList" :key="itemHum.name" :name="itemHum.name">
                                    {{ itemHum.name }}
                                </u-radio>
                            </u-radio-group>
                        </view>
                    </view>
                    <view class="type-box-item-line">
                        <view class="label-top">
                            备注
                        </view>
                        <view class="input-box">
                            <u-input
                                v-model="item.remark"
                                type="textarea"
                                input-align="left"
                                :custom-style="{ color: '#909399' }"
                                :clearable="true"
                            ></u-input>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else class="type-box">
                <view
                    v-for="(item, index) in (selectListDetail[selectIndex].subprojects as typeDataSubprojectsTs[])"
                    :key="index"
                    class="type-box-item"
                >
                    <view class="top-title">
                        {{ item.modelName || '--' }}
                    </view>
                    <view class="type-box-item-line line-center">
                        <view class="label-box">
                            <span class="is-must">*</span>
                            <span>情况</span>
                        </view>
                        <view v-if="item.options" class="radio-box">
                            <u-radio-group v-model="item.situation" active-color="#0084FF">
                                <u-radio
                                    v-for="(itemSelect) in getSelectList(item.options)"
                                    :key="itemSelect.name"
                                    :name="itemSelect.name"
                                >
                                    {{ itemSelect.name }}
                                </u-radio>
                            </u-radio-group>
                        </view>
                        <view v-else class="situation-input">
                            <u-input
                                v-model="item.situation"
                                input-align="right"
                                :custom-style="{ color: '#909399' }"
                                placeholder="请输入"
                                :clearable="true"
                            ></u-input>
                        </view>
                    </view>
                    <view class="type-box-item-line">
                        <view class="label-top">
                            情况说明
                        </view>
                        <view class="input-box">
                            <u-input
                                v-model="item.instructions"
                                input-align="left"
                                type="textarea"
                                :custom-style="{ color: '#909399' }"
                                :clearable="true"
                            ></u-input>
                        </view>
                    </view>
                    <view class="type-box-item-line">
                        <view class="label-top">
                            备注
                        </view>
                        <view class="input-box">
                            <u-input
                                v-model="item.remark"
                                input-align="left"
                                type="textarea"
                                :custom-style="{ color: '#909399' }"
                                :clearable="true"
                            ></u-input>
                        </view>
                    </view>
                    <view class="type-box-item-line">
                        <view class="label-top">
                            现场照片
                        </view>
                        <view v-if="isShowUpload && state==='0'" class="input-box">
                            <u-upload
                                :ref="el => item.ref = el"
                                :file-list="item.imgList"
                                :action="config.fileHost + '/file-base-server/api/v1/sys/upload'"
                                :auto-upload="true"
                                :index="item.modelName"
                                @on-remove="changeUpLoad(item)"
                                @on-success="changeUpLoad(item)"
                            >
                            </u-upload>
                        </view>
                        <view v-else class="img-show">
                            <view v-for="(imgItem, imgIndex) in item.imgList" :key="imgItem.url">
                                <image style="height: 130rpx; width: 130rpx;" :src="imgItem.url" @click="item.imgList && showBigImg(imgIndex, item.imgList)"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-show="state==='0'" class="btn-box">
            <u-button shape="circle" type="primary" @click="upData()">
                提交
            </u-button>
        </view>
        <u-action-sheet
            v-model="isShowSelect"
            v-model:active-index="selectIndex"
            :list="selectList"
            @click="handleList"
        ></u-action-sheet>
        <u-picker
            v-model="isShowRecordTimeList"
            mode="time"
            :params="{
                year: true, month: true, day: true, hour: false, minute: false, second: false
            }"
            @confirm="onPickerConfirmTime"
        ></u-picker>
    </view>
</template>
<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app"
import $service from '@/api/service'
import { showToast, showBigImg, navigateBackSetTime } from '@/utils/commonUtils'
import config from '@/api/config'
import service from '@/api/service'
import type { selectListDetailTs, detailType } from './type'
interface siteDetailSubprojectsTs {
    recordTime: string
    weather: string
    temperature: string
    humidity: string
    remark: string
}
interface equipmentDataSubprojects {
    id: string
    instructions: string
    modelId: string
    modelName: string
    options: string
    picture: string
    recordId: string
    remark: string
    situation: stringn
    ref?: any
    imgList?: {
        response?: {
            ID: string
        }[]
        url: string,
        error: boolean,
        progress: number
    }[]
    sort: number
}
interface typeDataSubprojectsTs {
    createTime: string
    id: string
    instructions: null
    lastChangeTime: null
    modelId: string
    modelName: string
    modelType: 1
    options: string
    parentModelId: string
    picture: null
    recordId: string
    remark: null
    ref?: any
    imgList?: {
        url: string,
        error: boolean,
        progress: number
    }[]
    situation: null
    sort: number
}


const { domain } = config
const data = reactive({
    titleText: '巡检维护记录表',
    isShowSelect: false,
    state: '', //站点状态
    selectIndex: 0,
    selectList: [] as actionSheetTs[],
    selectListDetail: [] as selectListDetailTs,
    id: '',
    typeId: '',
    isShowUpload: true,
    isFault: 0, //  如果是1 就是故障 0 巡检
    isShowRecordTimeList: false, // 显示巡检日期
    weatherList: [
        { name: '晴天' },
        { name: '阴天' },
        { name: '小雨' },
        { name: '大雨' },
        { name: '暴雨' },
        { name: '雪' },
        { name: '台风' },
    ],
    humidityList: [
        { name: '<60%RH' },
        { name: '≥60%RH' },
    ],
})

onLoad(function (option) {
    data.id = option.id || ''
    data.state = option.state || '0'
    data.isFault = Number(option.isFault || '0')
    data.titleText = decodeURIComponent(option.formName || '')
    getData()
})
/**
 * @name 获取数据
 */
const getData = () => {
    const params = {
        workId: data.id,
        type: data.isFault ? 'BROKE' : 'WEEK',
        terminal: 'APP'
    }
    $service<{
        recordTime: stringn
        weather: stringn // 天气情况
        temperature: stringn // 站房温度
        humidity: stringn // 站房湿度
        remark: stringn
        id: string
        equipmentData: detailType<equipmentDataSubprojects>[] | null // 设备
        typeData: detailType<typeDataSubprojectsTs>[] | null
    }>('patrolInspectionTask/patrolMaintenanceGet', params).then(res => {
        const resData = res.data
        if (!resData) return
        data.typeId = resData.id
        const typeData = resData.typeData || []
        const equipmentData = resData.equipmentData
        let selectListDetail: selectListDetailTs = [...typeData]
        if (equipmentData) selectListDetail = selectListDetail.concat(equipmentData)
        selectListDetail.forEach((item) => {
            item.subprojects.forEach((item) => {
                const pic = (item as typeDataSubprojectsTs | equipmentDataSubprojects).picture || ''
                const picList = pic === '' ? [] : pic.split(',');
                (item as typeDataSubprojectsTs | equipmentDataSubprojects).imgList = picList.map(item => {
                    return {
                        url: domain + '/file-base-server/api/v1/sys/download/' + item,
                        error: false,
                        progress: 100
                    }
                })
            })
        })
        selectListDetail.unshift({
            subprojects: [{
                recordTime: resData.recordTime || '',
                weather: resData.weather || '',
                temperature: resData.temperature || '',
                humidity: resData.humidity || '',
                remark: resData.remark || '',
            }],
            typeId: '0',
            typeName: '站点详情'
        })
        const selectDataList = selectListDetail.map(item => {
            return {
                text: item.typeName,
                id: item.typeId
            }
        })
        data.selectList = selectDataList
        data.selectListDetail = selectListDetail
    })
}

/**
 * @name 点击类型
 */
const handleList = () => {
    data.isShowUpload = false
    setTimeout(() => {
        data.isShowUpload = true
    }, 300)
}
/**
 * @name 根据option 获取筛选list
 * @compute
 * @param options 筛选项逗号分割
 */
const getSelectList = computed(() => (options: string) => {
    if (!options) return []
    const optionList = options.split(',')
    return optionList.map(item => {
        return { name: item }
    })
})
/**
 * @name upload图片改变
 */
const changeUpLoad = (value: typeDataSubprojectsTs | equipmentDataSubprojects) => {
    const refList = value.ref?.lists || []
    value.ref?.clear()
    const imgList:any[] = []
    refList.forEach((item: {
        response?: {
            ID: string
        }[]
        url: string,
        error: boolean,
        progress: number
    }) => {
        if (item.response) {
            imgList.push({
                url: domain + '/file-base-server/api/v1/sys/download/' + item.response[0].ID,
                error: false,
                progress: 100
            })
        } else {
            imgList.push(item)
        }
    })
    value.imgList = imgList
}
/**
 * @name 选中时间
 */
const onPickerConfirmTime = (time: {
    year: string
    month: string
    day: string
}) => {
    (data.selectListDetail[0].subprojects[0] as siteDetailSubprojectsTs).recordTime = `${time.year}-${time.month}-${time.day}`
}
/**
 * @name 提交方法
 */
const upData = () => {
    const isCheckPass = checkData()
    if (!isCheckPass) {
        data.isShowUpload = false
        setTimeout(() => {
            data.isShowUpload = true
        }, 300)
        return
    }
    const params = toDealParams()
    service('patrolInspectionTask/patrolMaintenanceSave', params).then((res) => {
        uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
        })
        if (res.code === 200 && res.data === 1) navigateBackSetTime()
    })
}
/**
 * @name 校验方法
 * @returns boolean
 */
const checkData = (): boolean => {
    // 校验站点详情
    const currSiteDetail = data.selectListDetail[0].subprojects[0] as siteDetailSubprojectsTs
    if (!currSiteDetail.recordTime) {
        data.selectIndex = 0
        showToast('请输入巡检日期', 'error')
        return false
    }
    if (!currSiteDetail.weather) {
        data.selectIndex = 0
        showToast('请选择天气情况', 'error')
        return false
    }
    if (!currSiteDetail.temperature) {
        data.selectIndex = 0
        showToast('请输入站房温度', 'error')
        return false
    }
    if (!currSiteDetail.humidity) {
        data.selectIndex = 0
        showToast('请选择站房湿度', 'error')
        return false
    }
    const currSelectList = data.selectListDetail.slice(1)
    for (let i = 0; i < currSelectList.length; i++) {
        const currTypeData = currSelectList[i]
        for (let j = 0; j < currTypeData.subprojects.length; j++) {
            const currTypeItemData = currTypeData.subprojects[j] as typeDataSubprojectsTs | equipmentDataSubprojects
            if (!currTypeItemData.situation) {
                data.selectIndex = i + 1
                showToast(`请选择 ${currTypeItemData.modelName} 情况状态`, 'error')
                return false
            }
        }
    }
    return true
}
/**
 * @name 处理传参
 */
const toDealParams = () => {
    let params: record = {}
    const currSiteDetail = data.selectListDetail[0].subprojects[0] as siteDetailSubprojectsTs
    params = { ...currSiteDetail, id: Number(data.typeId), typeData: [], equipmentData: [] }
    const currSelectList = data.selectListDetail.slice(1)
    currSelectList.forEach(item => {
        const itemFather = {
            subprojects: [],
            typeId: item.typeId
        } as {
            subprojects: any[],
            typeId: string
        };
        (item.subprojects as (typeDataSubprojectsTs | equipmentDataSubprojects)[]).forEach(project => {
            const subprojectsPart = {
                situation: project.situation,
                remark: project.remark,
                instructions: project.instructions,
                picture: project.imgList?.map((item: {
                    error:boolean
                    progress: number
                    url: string
                }) => {
                    const url = item.url
                    const lastInd = url.lastIndexOf('/') + 1
                    const picId = url.slice(lastInd)
                    return picId
                }).join(','),
            } as record
            if (item.typeId === '1') { // 设备管理
                subprojectsPart.modelId = project.modelId
                subprojectsPart.modelName = project.modelName

                itemFather.subprojects.push(subprojectsPart)
            } else { // 明细项
                subprojectsPart.id = project.id
            }
            itemFather.subprojects.push(subprojectsPart)
        })
        if (item.typeId === '1') params.equipmentData.push(itemFather)
        else params.typeData.push(itemFather)
    })
    return params
}
/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}

const {
    isShowRecordTimeList,
    titleText,
    isShowSelect,
    selectIndex,
    selectList,
    selectListDetail,
    weatherList,
    humidityList,
    isShowUpload,
    state
} = toRefs(data)

</script>
<style lang="scss" scoped>
.container {
    height: 100vh;
    background-color: #eff2f8;

    .top-select {
        display: flex;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 24rpx;
        background: #F2F6FC;

        .current-type {
            display: flex;
            align-items: center;
            font-family: PingFangSC;
            font-size: 12px;
            font-weight: normal;
            line-height: 17px;
            color: #606266;
        }

        .detail-arrow {
            margin-left: 16rpx;
            transition: all 0.3s;
        }

        .is-show-select {
            transform: rotate(180deg);
        }
    }

    .btn-box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 120rpx;
        width: 100%;
        background-color: white;
    }

    .detail-box {
        height: calc(100% - 40px - 44px - 120rpx);
        width: 100%;
        overflow: auto;

        // background-color: red;
        .type-box {
            &-item {
                background-color: white;
                padding-bottom: 20rpx;

                .top-title {
                    width: 100%;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    padding: 0px 16px 0px 20px;
                    background: #0084FF;
                    font-family: PingFangSC;
                    font-size: 14px;
                    font-weight: 500;
                    color: #FFFFFF;
                }

                &-line:last-child {
                    border-bottom: 0px;
                }

                &-line {
                    min-height: 48px;
                    margin-left: 40rpx;
                    border-bottom: 1px solid #ebeef5;
                    padding-right: 30rpx;

                    image {
                        height: 32rpx;
                        width: 32rpx;
                        margin-left: 10rpx;
                    }

                    .value-box {
                        display: flex;
                        width: fit-content;
                        align-items: center;
                    }

                    .radio-box {
                        max-width: 460rpx;
                    }

                    .situation-input {
                        width: 80%;
                    }

                    .label-top {
                        margin: 15rpx 0 0 20rpx;
                    }
                }

                .line-center {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-family: PingFangSC;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 22px;
                    color: #303133;
                }
            }
        }

        .is-must {
            color: #F84439;
            margin-right: 10rpx;
        }
    }
}
.input-box {
    padding-left: 20rpx;
}
.img-show {
    display: flex;
    margin-top: 15rpx;
    min-height: 140rpx;
    img {
        margin-right: 10rpx;
        height: 130px;
        width: 130px;
    }
}
</style>