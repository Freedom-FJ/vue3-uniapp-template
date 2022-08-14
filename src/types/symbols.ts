/*
 * @Author: Tian
 * @Date: 2022-08-04 17:28:32
 * @LastEditors: Tian
 * @LastEditTime: 2022-08-05 09:03:16
 * @Description: 
 */
import { InjectionKey } from 'vue'


export interface globalTs {
    echarts: any
}

export const globalKey: InjectionKey<globalTs> = Symbol()