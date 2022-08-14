/// <reference types="vite/client" />

declare module '*.vue' {
    import { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare module 'lodash'
declare module 'js-md5'
declare module '@ued_fpi/uview-ui'
declare module '@/static/map/mapbox-circle'
declare module '@qiun/ucharts'

type record = Record<string, any>
type recordt<T> = Record<string, T>
type stringn = string | null
type numbern = number | null

interface actionSheetTs {
    id: string
    text: string
}
declare const mapboxgl: any
declare interface Window {
    glMap: any
    glPopup: any
    glTooltip: any
    siteMarkers: any
    wx: any
}
