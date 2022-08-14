/*
 * @Author: Tian
 * @Date: 2022-08-03 11:14:31
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-03 13:44:43
 * @Description: 生物认证
 */
//检查设备是否录入指纹
export const checkFingerPrint = () => {
    uni.checkIsSoterEnrolledInDevice({
		checkAuthMode: 'fingerPrint',
		success(res) {
			if (res.isEnrolled) {
				uni.showToast({
					icon: 'none',
					title: '已录入指纹'
				})
                //已录入指纹，开启认证
                authFingerPrint()
			} else {
				uni.showModal({
					content: '未录入指纹',
					showCancel: false
				})
			}
			console.log(res)
		},
		fail(err) {
			uni.showModal({
				content: '未录入指纹',
				showCancel: false
			})
			console.log(err)
		}
	})
}
const authFingerPrint = () => {
    uni.startSoterAuthentication({
		requestAuthModes: ['fingerPrint'],
		challenge: '123456', 
		authContent: '请用指纹解锁',
		success(res) {
			uni.showToast({
				icon: 'none',
				title: '指纹验证成功'
			})
			console.log(res)
		},
		fail(err) {
			uni.showModal({
				content: '指纹验证失败，errCode：' + err.errCode,
				showCancel: false
			})
			console.log(err)
		}
	})
}
