<template>
    <view class="container">
        <Navbar :title="titleText" @close="closeNav" />
        <view class="container-body" :style="{ height: state === '0' ? 'calc(100% - 44px - 160rpx)' : 'calc(100% - 44px)'}">
            <empty-common v-if="!(equipmentLists||[]).filter(item => item.isCheck).length" text="暂无数据" style="padding-top: 24rpx"></empty-common>
            <view v-for="(item, index) in equipmentLists" v-show="item.isCheck" :key="index" class="instrument-item">
                <view class="top-name">
                    <span>{{ item.name }}</span>
                    <image v-if="!item.isMust && state === '0'" src="@/static/images/operation/delete.png" @click="item.isCheck = false"></image>
                </view>
                <view class="form-body">
                    <u-form :ref="el => item.formRef = el" :model="item.data" :rules="rules" :error-type="['message']">
                        <u-form-item label="校准完成时间" :required="true" prop="calibrationTime" label-width="180">
                            <div class="time-input" @click="state==='0' && (item.isShowCalibrationTime = true)">
                                <image src="@/static/images/common/date.png" alt="" />
                                <span>
                                    {{ item.data.calibrationTime }}
                                </span>
                            </div>
                        </u-form-item>
                        <u-form-item label="校准原因" :required="true" prop="calibrationReason" label-width="180">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.calibrationReason"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="点位信息" label-position="top" :required="true" prop="isOkPointImfor" label-width="180">
                            <div class="point-table-box">
                                <u-table padding="0" :th-style="{ 'line-height': '60rpx'}" :td-style="{ 'line-height': '50rpx'}">
                                    <u-tr>
                                        <u-th>点位</u-th>
                                        <u-th>标液浓度</u-th>
                                        <u-th>型号值</u-th>
                                    </u-tr>
                                    <u-tr v-for="(formItem) in item.data.formList" :key="formItem.label" style="line-height: 60rpx">
                                        <u-td> {{ formItem.label }} </u-td>
                                        <u-td>
                                            <u-input
                                                v-model="formItem.concentration "
                                                input-align="center"
                                                type="number"
                                                placeholder="请输入"
                                            />
                                        </u-td>
                                        <u-td>
                                            <u-input
                                                v-model="formItem.value "
                                                input-align="center"
                                                type="number"
                                                placeholder="请输入"
                                            />
                                        </u-td>
                                    </u-tr>
                                </u-table>
                            </div>
                        </u-form-item>
                        <u-form-item label="倾斜相关系数" :required="true" prop="slope" label-width="180">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.slope"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="截距相关系数" prop="intercept" label-width="180">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.intercept"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="线性相关系数" prop="linearCorrelationCoefficient" label-width="180">
                            <div class="time-input">
                                <u-input
                                    v-model="item.data.linearCorrelationCoefficient"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                        <u-form-item label="现场照片" label-position="top" prop="picture" label-width="250">
                            <u-upload
                                v-if="state==='0'"
                                :ref="el => item.uploadRef = el"
                                :file-list="item.imgList"
                                :action="config.fileHost + '/file-base-server/api/v1/sys/upload'"
                                :auto-upload="true"
                                :index="item.name"
                            >
                            </u-upload>
                            <view v-else class="img-show">
                                <view v-for="(imgItem, imgIndex) in item.imgList" :key="imgItem.url">
                                    <image style="height: 130rpx; width: 130rpx;" :src="imgItem.url" @click="showBigImg(imgIndex, item.imgList)"></image>
                                </view>
                            </view>
                        </u-form-item>
                    </u-form>
                </view>
                <u-picker
                    v-model="item.isShowCalibrationTime"
                    mode="time"
                    :params="timePickerParam"
                    @confirm="(time:any) => item.data.calibrationTime = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}:${time.second}`"
                ></u-picker>
            </view>
            <view v-show="equipmentLists.filter(item =>item.isCheck).length" class="instrument-item">
                <view class="remark-box">
                    <u-form>
                        <u-form-item label="备注" label-position="top" label-width="250">
                            <div class="time-input">
                                <u-input
                                    v-model="remark"
                                    type="textarea"
                                    input-align="left"
                                    placeholder="请输入"
                                />
                            </div>
                        </u-form-item>
                    </u-form>
                </view>
            </view>
        </view>
        <view v-show="state==='0'" class="btn-box">
            <u-button shape="circle" type="success" @click="isShowInstrumentPop = true">
                选择仪器
            </u-button>
            <u-button shape="circle" type="primary" @click="upData()">
                提交
            </u-button>
        </view>
        <u-popup
            v-model="isShowInstrumentPop"
            border-radius="10" 
            mode="bottom"
            length="70%"
            :mask="true" 
            @close="close"
            @open="open"
        >
            <view class="popup-container">
                <view class="popup-search">
                    <u-search v-model="searchInstrument" :height="56" :show-action="false" bg-color="#F2F6FC" placeholder-color="#909399" :clearable="true" placeholder="请输入站点名称" />
                </view>
                <view class="instrument-total">
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">配件总数：{{ equipmentLists.length }}</span>
                    </view>
                    <view class="instrument-total-item">
                        <span class="instrument-total-text">选中配件数：</span>
                        <span class="instrument-total-value">{{ equipmentLists.filter(item => item.isCheck).length }}</span>
                    </view>
                </view>
                <view class="instrument-box">
                    <view class="instrument-flex">
                        <view v-for="(item, index) in searchEquipmentList" :key="index" :class="[item.isCheck ? 'is-check-type' : 'instrument-type']" @click="item.isCheck=!item.isCheck">
                            <span>{{ item.name }}</span>
                        </view>
                    </view>
                </view>
                <view class="instrument-btn-box">
                    <u-button shape="circle" :custom-style="{ color: '#3296FA',background: '#F2F6FC'}" type="info" @click="resetSearch()">
                        重置
                    </u-button>
                    <u-button shape="circle" type="primary" @click="changeInstrumentSearch()">
                        查询
                    </u-button>
                </view>
            </view>
        </u-popup>
    </view>
</template>
<script lang="ts" setup>

import { onLoad, onReady } from "@dcloudio/uni-app"
import $service from '@/api/service'
import { equipmentList, showBigImg, navigateBackSetTime } from '@/utils/commonUtils'
import { showToast } from '@/utils/commonUtils'
import moment from 'moment'
import config from '@/api/config'
import service from '@/api/service'

interface equipmentMaintenanceRecordListTs{
    id?:null|number
    picture: string
    calibrationReason: string // 校准原因
    calibrationTime: string // 校准完成时间
    slope: string|null // 斜率
    equipmentId: string // 设备id
    intercept: string // 截距 
    linearCorrelationCoefficient: string // 线性相关
    isOkPointImfor: string | null, // 判断点位信息是否输入
    formList: {
       value:string, // 信号值
       concentration:string, // 标液浓度
       label:string, // 文字
    }[]
}
interface equipmentTs {
    formRef: any
    uploadRef: any
    imgList: {
        url: string,
        error: boolean,
        progress: number
    }[]
    isShowCalibrationTime: boolean
    isCheck: boolean, // 是否已经选择
    isMust: boolean // 是否无法删除
    name: string,
    data: equipmentMaintenanceRecordListTs
}
// 提交请求变量参数
interface equipmentCalibrationRecordListTs {
    picture: string
    calibrationReason: string // 校准原因
    calibrationTime: string // 校准完成时间
    slope: string|null // 斜率
    equipmentId: string // 设备id
    intercept: string // 截距 
    linearCorrelationCoefficient: string // 线性相关
    valueOne: string|number
    concentrationOne: string|number
    valueTwo: string|number
    concentrationTwo: string|number
    valueThree: string|number
    concentrationThree: string|number
    valueFour: string|number
    concentrationFour: string|number
    valueFive: string|number
    concentrationFive: string | number
}
const { domain } = config
const timePickerParam = { year: true, month: true, day: true, hour: true, minute: true, second: true }
const nameDictionaries = [
    { cnText: '一', englishText: 'One'},
    { cnText: '二', englishText: 'Two'},
    { cnText: '三', englishText: 'Three'},
    { cnText: '四', englishText: 'Four'},
    { cnText: '五', englishText: 'Five'},
]
const data = reactive({
    titleText: '仪器设备检修记录表',
    isShowInstrumentPop: false,
    state: '', //站点状态
    searchInstrument: '', // 仪器搜索
    siteId: '', // 站点id
    id: '', // 任务/工单id
    formId: -1, // 表单id
    equipmentLists: [] as equipmentTs[],
    searchEquipmentList: [] as equipmentTs[],
    remark: '',
    isFault: 0, //  如果是1 就是故障 0 巡检
    rules: {
        calibrationTime: [{ required: true, message: '请输入校准完成时间', trigger: 'blur', }],
        calibrationReason: [{ required: true, message: '请输入校准原因', trigger: 'blur', }],
        slope: [{ required: true, message: '请输入正常投入使用时间', trigger: 'blur', }],
        isOkPointImfor: [{ required: true, message: '点位信息不能为空', trigger: 'blur', }],
    },
})

onLoad(function (option) {
    data.siteId = option.siteId || ''
    data.id = option.id || ''
    data.isFault = Number(option.isFault || '0')
    data.state = option.state || '0'
    data.titleText = decodeURIComponent(option.formName || '')

    getEquipment()
})
onReady(function () {
    allEquipmentSetRules()
}) 
/**
 * @name 获取设备选项
 */
const getEquipment = async() => {
    const equipmentLists = await equipmentList(data.siteId)
    data.equipmentLists = (equipmentLists || []).map(item => {
        return {
            formRef: ref(),
            uploadRef: ref(),
            imgList: [],
            isShowCalibrationTime: false,
            isCheck: false,
            isMust: false,
            name: item.name,
            data: {
                equipmentId: item.id,
                brokeTime: '',
                picture: '',
                calibrationReason: '', // 校准原因
                calibrationTime: '', // 校准完成时间
                slope: null, // 斜率
                intercept: '', // 截距 
                linearCorrelationCoefficient: '', // 截距 
                isOkPointImfor: 'ok', // 判断点位信息是否输入
                formList: [...new Array(5).keys()].map(item => {
                    return {
                        value:'', // 信号值
                        concentration:'', // 标液浓度
                        label:`第${nameDictionaries[item].cnText}点`, // 文字
                    }
                })
            }
            
        }
    })
    data.searchEquipmentList = data.equipmentLists
    getData()

}

/**
 * @name 获取设备选项rules
 */
const allEquipmentSetRules = async () => { 
    data.equipmentLists.forEach(item => {
        item.formRef?.setRules(data.rules)
    })
}
/**
 * @name 获取数据
 */
const getData = () => {
    const params = {
        workId: data.id,
        type:  data.isFault ? 'BROKE' : 'WEEK'
    }
    $service<{
        id: number
        remark: string|null
        equipmentCalibrationRecordList: equipmentMaintenanceRecordListTs[]
    }>('patrolInspectionTask/equipmentCalibrationGet', params).then(res => {
        if(!res.data) return
        data.formId = res.data?.id
        data.remark = res.data?.remark || ''
        const currEquipmentMaintenanceRecordList = res.data.equipmentCalibrationRecordList
        currEquipmentMaintenanceRecordList.forEach(item => {
            const currEquipment = data.equipmentLists.filter(equipment => Number(equipment.data.equipmentId) === Number(item.equipmentId))
            if (currEquipment.length) {
                const { isOkPointImfor, formList } = currEquipment[0].data
                currEquipment[0].data = item
                currEquipment[0].data.isOkPointImfor = isOkPointImfor
                // 将不规则变量名称处理成数组形式用于table表格显示
                nameDictionaries.forEach((dictionarie, index) => {
                    const valueKey = 'value' + dictionarie.englishText
                    const concentrationKey = 'concentration' + dictionarie.englishText
                    const value:string = (item as record)[valueKey] || ''
                    const concentration = (item as record)[concentrationKey]
                    formList[index].concentration = concentration
                    formList[index].value = value
                })
                currEquipment[0].data.formList = formList
                currEquipment[0].isCheck = true
                currEquipment[0].isMust = true
                const pic = item.picture
                currEquipment[0].imgList = pic ? pic.split(',').map(item => {
                    return {
                        url: domain + '/file-base-server/api/v1/sys/download/' + item,
                        error: false,
                        progress: 100
                    }
                }) : []
            }
        })
        allEquipmentSetRules()
    })
}
/**
 * @name 提交
 */
const upData = () => {
    // 处理 点位信息 表单校验是否通过
    data.equipmentLists.forEach((item) => {
        const currFormList = item.data.formList
        const every = currFormList.every(item => !item.value && !item.concentration)
        if (every) item.data.isOkPointImfor = null
        else item.data.isOkPointImfor = 'ok'
    })
    const validList: boolean[] = []
    data.equipmentLists.forEach((item) => {
        item.isCheck && item.formRef?.validate((valid:boolean) => {
            validList.push(valid)
        })
    })
    if (validList.some(item => !item)) {
        showToast('表单校验未通过!')
    } else {
        toSendData()
    }
   
}
/**
 * @name 搜索改变
 */
const changeInstrumentSearch = () => {
    if(!data.searchInstrument) {
        data.searchEquipmentList = data.equipmentLists
    } else {
        data.searchEquipmentList = data.equipmentLists.filter(item => item.name.indexOf(data.searchInstrument) !== -1)
    }
}
/**
 * @name 提交请求
 */
const toSendData = () => {
    const params = {
        recordTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        id: data.formId.toString(),
        type:  data.isFault ? 'BROKE' : 'WEEK',
        workId: data.id,
        remark: data.remark,
        equipmentCalibrationRecordList: [] as equipmentCalibrationRecordListTs[]
    }
    data.equipmentLists.forEach(item => {
        if (item.isCheck) {
            const refList = item.uploadRef?.lists || []
            const imgList:string[] = []
            refList.forEach((refItem: {
                response?: {
                    ID: string
                }[]
                url: string,
                error: boolean,
                progress: number
            }) => {
                if (refItem.response) imgList.push(refItem.response[0].ID)
                else {
                    const url = refItem.url
                    const lastInd = url.lastIndexOf('/') + 1
                    const picId = url.slice(lastInd)
                    imgList.push(picId)
                }
            })
            item.data.picture = imgList.join(',')

            const itemEquipment = {
                picture: item.data.picture,
                calibrationReason: item.data.calibrationReason,
                calibrationTime: item.data.calibrationTime,
                slope: item.data.slope,
                equipmentId: item.data.equipmentId,
                intercept: item.data.intercept,
                linearCorrelationCoefficient: item.data.linearCorrelationCoefficient,
                id: item.data.id,
                valueOne: '',
                concentrationOne: '',
                valueTwo: '',
                concentrationTwo: '',
                valueThree: '',
                concentrationThree: '',
                valueFour: '',
                concentrationFour: '',
                valueFive: '',
                concentrationFive: ''
            }
            const currFormList = item.data.formList
            nameDictionaries.forEach((dictionaries, index) => {
                    const valueKey = 'value' + dictionaries.englishText
                    const concentrationKey = 'concentration' + dictionaries.englishText;
                    (itemEquipment as record)[valueKey] = currFormList[index].value;
                    (itemEquipment as record)[concentrationKey] = currFormList[index].concentration
            })
            params.equipmentCalibrationRecordList.push(itemEquipment)
        }

    })
    service('patrolInspectionTask/equipmentCalibrationSave', params).then(res => {
        uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
        })
        if (res.code === 200) navigateBackSetTime()
    })
}
/**
 * @name 重置搜索
 */
const resetSearch = () => {
    data.searchInstrument = ''
    console.log('object')
    changeInstrumentSearch()
    data.equipmentLists.forEach(item => {
        item.isCheck = false
    })
}

/**
 * @name 点击叉叉按钮
 */
const closeNav = () => {
    uni.switchTab({ url: '/pages/operation/Index' })
}
/**
 * @name 打开仪器选择框
 */
const open = () => {
    // 
}

/**
 * @name 关闭仪器选择框
 */
const close = () => {
    console.log('close')
    allEquipmentSetRules()
}

const {
    titleText,
    isShowInstrumentPop,
    searchInstrument,
    searchEquipmentList,
    equipmentLists,
    rules,
    state,
    remark
} = toRefs(data)

</script>
<style lang="scss" scoped>
@import "./common.scss";
.remark-box {
    padding: 0 40rpx;
    .time-input {
        width: 100%;
    }
}
.point-table-box {
    width: 100%;
}

</style>