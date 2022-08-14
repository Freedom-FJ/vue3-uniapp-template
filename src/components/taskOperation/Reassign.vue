<template>
    <u-mask :show="modelValue">
        <view class="reassign-center">
            <view class="title">
                重分配
            </view>
            <u-form ref="uFormRef" :model="paramsData" :rules="rules" :error-type="['message']">
                <u-form-item label="负责人" :required="true" prop="resPersonName" label-width="120">
                    <u-input 
                        v-model="paramsData.operationManName" 
                        type="select" 
                        :select-open="isShowPrincipalList" 
                        placeholder="请选择负责人" 
                        @click="isShowPrincipalList = true" 
                    />
                </u-form-item>
                <u-form-item label="协办人" prop="assistManName" label-width="120">
                    <u-input 
                        v-model="paramsData.assistManName" 
                        type="select" 
                        :select-open="isShowAssitList" 
                        placeholder="选择协办人" 
                        @click="assToShowCheckList" 
                    />
                </u-form-item>
                <u-form-item
                    label="处理时限"
                    :required="true"
                    prop="handTimeLimit"
                    label-width="180"
                >
                    <u-input
                        v-model="paramsData.handTimeLimit"
                        type="select"
                        :select-open="isShowTimeLimitSelect"
                        placeholder="处理时限"
                        @click="isShowTimeLimitSelect = true"
                    />
                </u-form-item>
            </u-form>
            <view class="bottom-btn">
                <u-button shape="circle" size="medium" style="margin-right: 30rpx;" @click="$emit('update:modelValue', false)">
                    取消
                </u-button>
                <u-button shape="circle" size="medium" type="primary" @click="submit">
                    确定
                </u-button>
            </view>
            <!-- 负责人 -->
            <u-action-sheet v-model="isShowPrincipalList" v-model:active-index="principaIndex" :list="sitePrincipalNameList" @click="handlePrincipalList"></u-action-sheet>
            <!-- 协办人 -->
            <u-action-sheet v-model="isShowAssitList" v-model:active-index="assitIndex" :list="siteAssitNameList" @click="handleAssitList"></u-action-sheet>
            <!-- 截至时间 -->
            <u-picker
                v-model="isShowTimeLimitSelect"
                mode="time"
                :params="{ year: true, month: true, day: true, hour: true, minute: true, second: false
                }"
                @confirm="onPickerConfirmLimit"
            ></u-picker>
        </view>
    </u-mask>
</template>
<script lang="ts" setup>
import $service from '@/api/service'
import {
    getTheSitePrincipalName,
    getTheSiteAssitNameList,
    showToast
} from '@/utils/commonUtils'
import type { PropType } from 'vue'
const props = defineProps({
    /**
     * @desc 控制显示隐藏
     * @abstract 
     */
    modelValue: {
        type: Boolean,
        default: false
    },
    /**
     * @desc 显示数据
     * @abstract 
     */
    params: {
        type: Object as PropType<{
            workId: string,
            operationMan: string,
            assistMan: string,
            handTimeLimit: string
        }>,
        default: () => {
            return {
                workId: '',
                operationMan: '',
                assistMan: '',
                handTimeLimit: ''
            }
        }
    },
})
const data = reactive({
    titleText: '巡检维护记录表',
    isShowModal: false,
    isShowPrincipalList: false,
    isShowAssitList: false,
    isShowTimeLimitSelect: false,
    sitePrincipalNameList: [] as actionSheetTs[], // 负责人列表
    siteAssitNameList: [] as actionSheetTs[], // 协办人列表
    principaIndex: -1,
    assitIndex: -1,
    paramsData: {
        workId: '',
        operationMan: '', // 负责人
        assistMan: '', // 协办人
        handTimeLimit: '',
        assistManName: '',
        operationManName: ''
    },
    rules: {
        operationMan: [{ required: true, message: '请选择负责人', trigger: 'blur', }],
        assistMan: [{ required: true, message: '请选择协办人', trigger: 'blur', }],
        handTimeLimit: [{ required: true, message: '请选择截至时间', trigger: 'blur', }]
    }
})
const uFormRef = ref<any>() 

watch(
    () => props.modelValue,
    (val) => {
        if (!val) return
        data.paramsData = {
            // workId: props.params.workId,
            // operationMan: '',
            // assistMan: '',
            // handTimeLimit: props.params.handTimeLimit,
            // assistManName: props.params.assistMan,
            // operationManName: props.params.operationMan
            workId: props.params.workId,
            operationMan: '',
            assistMan: '',
            handTimeLimit: '',
            assistManName: '',
            operationManName: ''
        }
        getSelectData()
        nextTick(() => {
            uFormRef.value?.setRules(data.rules)
        })
    }
)
const $emit = defineEmits([
    'update:modelValue',
])

/**
 * @name 获取基础筛选数据
 */
const getSelectData = async () => {
    // 负责人数据
    !data.sitePrincipalNameList.length && getTheSitePrincipalName().then(res => { 
        const sitePrincipalNameList = res
        data.sitePrincipalNameList = sitePrincipalNameList.map(item => {
            return {
                text: item.opePerson,
                id: item.id
            }
        })
        // const currData = data.sitePrincipalNameList.filter(item => item.text === data.paramsData.operationManName)
        // if (currData.length) data.paramsData.operationMan = currData[0].id
        !data.siteAssitNameList.length && getSiteAssitList(data.paramsData.operationMan)
    })
    
}
const assToShowCheckList = () => {
    console.log(data.paramsData,'parms')
    if (!data.paramsData.operationMan) {
        showToast('请先选择负责人')
        return
    }
    data.isShowAssitList = true
}
/**
 * @name 负责人选择
 * @param index 选中的索引
 */
const handlePrincipalList = (index:number) => {
    const currCheck = data.sitePrincipalNameList[index]
    if (currCheck.id !== data.paramsData.operationMan) {
        data.paramsData.assistMan = ''
        data.paramsData.assistManName = ''
        data.assitIndex = -1
        console.log(currCheck.id,'currCheck.id')
        getSiteAssitList(currCheck.id)
    }
    data.paramsData.operationMan = currCheck.id
    data.paramsData.operationManName = currCheck.text
    
}
/**
 * @name 协办人选择
 * @param index 选中的索引
 */
const handleAssitList = (index:number) => {
    const currCheck = data.siteAssitNameList[index]
    data.paramsData.assistMan = currCheck.id
    data.paramsData.assistManName = currCheck.text
}
/**
 * @name 获取协办人
 * @param id 负责人id
 */
const getSiteAssitList = (id: string) => {
    console.log(id,'id')
    getTheSiteAssitNameList(id).then(res => { 
        const siteAssitNameList = res
        data.siteAssitNameList = siteAssitNameList.map(item => {
            return {
                text: item.opePerson,
                id: item.id
            }
        })
    })
    const currData = data.siteAssitNameList.filter(item => item.text === data.paramsData.operationManName)
    if(currData.length) data.paramsData.assistMan = currData[0].id
}
/**
 * @name 选择时间截至
 */
const onPickerConfirmLimit = (time: {
    year: string
    month: string
    day: string
    hour: string
    minute: string
}) => {
    data.paramsData.handTimeLimit = `${time.year}-${time.month}-${time.day} ${time.hour}:${time.minute}`
    data.isShowTimeLimitSelect = false
}
/**
 * @name 请求数据
 */
const submit = () => {
    uFormRef.value.validate((valid:boolean) => {
		if (valid) {
            $service('patrolInspectionTask/brokeOperationalReassign', data.paramsData).then(res => {
                showToast(res.message)
                if (res.code === 200) uni.navigateBack()
            })
		} else {
			console.log('验证失败')
		}
	})
    
}


const {
    rules,
    paramsData,
    isShowPrincipalList,
    isShowAssitList,
    isShowTimeLimitSelect,
    sitePrincipalNameList, // 负责人列表
    siteAssitNameList, // 协办人列表
    principaIndex,
    assitIndex,
} = toRefs(data)

</script>
<style lang="scss" scoped>
.reassign-center {
    width: 80%;
    padding: 20rpx 30rpx;
    margin: 50% auto 0;
    background-color: white;
    border-radius: 15rpx;
    .title {
        width: fit-content;
        font-size: 30rpx;
        font-weight: 500;
        margin: 0 auto 25rpx;
    }
    .bottom-btn {
        display: flex;
        justify-content: center;
        margin-top: 25rpx;
    }
}
</style>