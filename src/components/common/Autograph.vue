<template>
    <u-mask :show="modelValue" @click="$emit('update:modelValue', false)">
        <view class="autograph" @tap.stop>
            <view class="autograph-text">
                <span class="autograph-label">书写签名：</span>
            </view>
            <view class="autograph-space">
                <canvas
                    ref="mycanvas"
                    canvas-id="mycanvas"
                    style="width:100%;height: 100%;"
                    @touchstart="touchstart"
                    @touchmove="touchmove"
                    @touchend="touchend"
                ></canvas>
            </view>
            <view class="autograph-btn">
                <u-button size="mini" style="margin-right: 30rpx;" @click="handleReset">
                    重画
                </u-button>
                <u-button size="mini" type="primary" @click="handleConfirm">
                    保存
                </u-button>
            </view>
        </view>
    </u-mask>
</template>
<script setup lang="ts">
import { dataURLtoBlob } from '@/utils/commonUtils'
import { onLoad } from "@dcloudio/uni-app"
import config from '@/api/config'

let tempPoint:any[] = [] //用来存放当前画纸上的轨迹点，用来判断当前是否签名了
defineProps({
    /**
     * @desc 控制显示隐藏
     * @abstract 
     */
    modelValue: {
        type: Boolean,
        default: false
    },
})
const data = reactive({
    ctx: '' as any,
    points: [] as {
        X: number;
        Y: number;
    }[],
    mycanvas: ref(),
    autographId: '', // 签名图片的id
})

onLoad(function () {
    data.ctx = uni.createCanvasContext("mycanvas") //创建绘图对象
    //设置画笔样式
    data.ctx.lineWidth = 4
    data.ctx.lineCap = "round"
    data.ctx.lineJoin = "round"

})
const $emit = defineEmits([
    'update:modelValue',
    'handleConfirm'
])

//触摸开始，获取到起点
const touchstart = function (e: any) {
    const startX = e.changedTouches[0].x
    const startY = e.changedTouches[0].y
    const startPoint = {
        X: startX,
        Y: startY
    }
    /* **************************************************
        #由于uni对canvas的实现有所不同，这里需要把起点存起来
     * **************************************************/
    data.points.push(startPoint)

    //每次触摸开始，开启新的路径
    data.ctx.beginPath()
}

//触摸移动，获取到路径点
const touchmove = function (e: any) {
    const moveX = e.changedTouches[0].x
    const moveY = e.changedTouches[0].y
    const movePoint = {
        X: moveX,
        Y: moveY
    }
    data.points.push(movePoint) //存点
    const len = data.points.length
    if (len >= 2) {
        draw() //绘制路径
    }
    tempPoint.push(movePoint)
}

// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
const touchend = function () {
    data.points = []

}

const draw = function () {
    const point1 = data.points[0]
    const point2 = data.points[1]
    data.points.shift()
    data.ctx.moveTo(point1.X, point1.Y)
    data.ctx.lineTo(point2.X, point2.Y)
    data.ctx.stroke()
    data.ctx.draw(true)

}
// 重置
const handleReset = function () {
    uni.getSystemInfo({
        success: function (res) {
            const canvasw = res.windowWidth
            const canvash = res.windowHeight
            data.ctx.clearRect(0, 0, canvasw, canvash)
            data.ctx.draw(true)
        },
    })
    tempPoint = []
}

//将签名笔迹存到本地
const handleConfirm = function () {
    console.log(tempPoint,'tempPoint')
    if (!tempPoint.length) {
        uni.showToast({
            title: '请先签名',
            icon: 'none',
            duration: 2000
        })
        return
    }
    uni.canvasToTempFilePath({
        canvasId: 'mycanvas',
        fileType: 'jpeg',
        success: function (res) {
            console.log('res::::',res)
            const tempPath = res.tempFilePath
            uploadImg(tempPath)
        }
    })
}

/**
 * @name 图片上传
 * @param tempPath 图片base64 string
 */
const uploadImg = (tempPath: string) => {
    // const blobImg = dataURLtoBlob(tempPath)
    // const formdata = new FormData()
    // // 将文件信息存入formdata，键名为file
    // // formdata会将文件信息序列化为ajax可识别的数据类型
    // formdata.append("file", blobImg)
    uni.uploadFile({
        url: config.domain + '/file-base-server/api/v1/sys/upload', //仅为示例，非真实的接口地址
        name: 'file',
        // formData: formdata,
        filePath: tempPath,
        success: (uploadFileRes) => {
            const resData = JSON.parse(uploadFileRes.data)
            data.autographId = resData[0].ID
            $emit('update:modelValue', false)
            $emit('handleConfirm', resData[0].ID)
        }
    })
}
</script>
<style lang="scss" scoped>
.autograph {
    height: 193px;
    padding: 24rpx 18rpx;
    background: #FFFFFF;
    margin-top: 60%;


    &-label {
        font-family: PingFangSC;
        font-size: 14px;
        line-height: 22px;
        color: #303133;
    }

    &-space {
        height: 75%;
        width: 100%;
        background: rgba(230, 230, 230, 0.8);
        border-radius: 2%;
    }

    &-btn {
        display: flex;
        justify-content: center;
        margin-top: 8rpx;
    }

    &-img {
        height: 75%;
        width: 100%;

        img {
            height: 100%;
            width: 100%;
        }
    }
}
</style>