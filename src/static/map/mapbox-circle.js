export default class Nearby {
    constructor(map, options) {
        this.map = map // 地图对象
        this.id = options.contaniereId // 控件的上级domId
        this.name = options.name || 'nearby-instance' // 实例的名称
        this.radius = options.radius || 5000 // 半径（单位：米）
        this.analyse = options.analyse // 重绘圆时的回调函数
        this.affirmClcik = options.affirmClcik // 点击确认
        this.onClose = options.onClose || null // 关闭时的回调函数
        this.confirmWhether = options.confirmWhether || false // 是否显示确认按钮
        this.radiusType = options.radiusType || 1
        this.type = options.type || 'nearby'
        this.circleColor = options.color || '#3296FA'
        this.allfillColor = options.fillColor || 'rgba(0, 188, 204, 0.2)'
        this.circleData = null // 圆的json数据
        this.init(options.lnglat)
    }

    //初始化
    /**
     *
     * @param {Array} lnglat 中心点经纬度
     * @param {Boolean} needScale 是否需要重新缩放
     */
    init(lnglat) {
        // 移除控制器（比较保险的方式移除）
        const doms = document.getElementsByClassName('nearby-search-control')
        Array.from(doms).forEach(domItem => domItem.remove())

        //同步中心点坐标
        this.lnglat = lnglat || this.lnglat || []
        //实例状态
        this.active = true
        this.destroyed = false

        //画中心marker
        this._addCenterMarker()

        // //画圆圈
        this._drawCircle()

        //构建圆圈的控制器
        // this._createControlDot()


        //初始化先分析一次
        this._analysis()
        this._upDataMapView()
    }

    _movestart() {
        if (!this.active) return false
        this.control.style.display = 'none'
    }

    _moveend() {
        if (!this.active) return false
        this.control.style.display = 'block'
    }

    _zoomstart() {
        if (!this.active) return false
        this.control.style.display = 'none'
    }

    _zoomend() {
        if (!this.control || !this.active) return false
        this.control.style.display = 'block'
    }
    // 跟新地图位置
    _upDataMapView () {
        const nowBbox = this.circleData.bbox
        const nowBounds = [
            [nowBbox[0], nowBbox[3]],
            [nowBbox[2], nowBbox[1]]
        ]
        window.glMap.fitBounds(nowBounds, {
            padding: { top: 20, bottom: 250, left: 15, right: 15 } // 根据页面头部菜单 底栏高度，调整合适的参数
        })
    }

    //生成距离米
    _createControlDot () {
        if (window.miterDom) window.miterDom.remove()
        const bounds = this.circleData.bbox
        const coordinates = [(bounds[2] + bounds[0]) / 2, bounds[1]]
        const el = document.createElement('div')
        el.innerHTML = `<div style="border-radius: 10px; background: #000000;color: #ffffff;text-align: center;
        height: 20px;z-index: 999;font-size: 12px;line-height: 22px;width: fit-content;padding: 0 5px">                         
                                    ${this.radius}米
                        </div>`
        window.miterDom = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(window.glMap)
    }
    
    // 中心处的marker
    _addCenterMarker () {
        if (window.centerMarker) window.centerMarker.remove()
        const coordinates = this.lnglat
        const el = document.createElement('div')
        el.className = 'location-marker'
        el.innerHTML = `<div class="location-marker-img" style="width: 14px; height: 14px;border: 2px solid #FFFFFF;background: #3296FA;border-radius: 50%;"></div>`
        window.centerMarker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(window.glMap)
    }

    //画圈
    _drawCircle() {
        // marker ?
        this.circleData = this.createCircle(this.lnglat, this.radius, 64)
        if (!window.glMap.getSource('nearby-circle')) {
            window.glMap.addSource('nearby-circle', { type: 'geojson', data: this.circleData })
            window.glMap.addLayer({
                id: 'tool-nearby-circle',
                type: 'fill',
                source: 'nearby-circle',
                paint: { 'fill-color': this.allfillColor, 'fill-outline-color': this.circleColor },
            })
        } else {
            window.glMap.getSource('nearby-circle').setData(this.circleData)
            if (window.glMap.getLayer('tool-nearby-circle')) {
                window.glMap.setLayoutProperty('tool-nearby-circle', 'visibility', 'visible')
            } else {
                window.glMap.addLayer({
                    id: 'tool-nearby-circle',
                    type: 'fill',
                    source: 'nearby-circle',
                    paint: { 'fill-color': this.allfillColor, 'fill-outline-color': this.circleColor },
                })
            }
        }
    }

    createCircle(center, radius, points) {
        if (!points) points = 64

        const coords = {
            longitude: center[0],
            latitude: center[1],
        }

        const km = radius / 1000.0

        const ret = []
        const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))
        const distanceY = km / 110.574

        let theta, x, y
        for (let i = 0; i < points; i++) {
            theta = (i / points) * (2 * Math.PI)
            x = distanceX * Math.cos(theta)
            y = distanceY * Math.sin(theta)

            ret.push([coords.longitude + x, coords.latitude + y])
        }
        ret.push(ret[0])

        return {
            type: 'FeatureCollection',
            bbox: [coords.longitude - distanceX, coords.latitude - distanceY, coords.longitude + distanceX, coords.latitude + distanceY],
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ret],
                    },
                },
            ],
        }
    }


    //触发分析的回调
    _analysis() {
        const bounds = this.circleData.bbox
        const extent = {
            xmax: bounds[2],
            xmin: bounds[0],
            ymax: bounds[3],
            ymin: bounds[1],
        }
        this.analyse(this, extent)
    }

    /**
     *
     * @param {Array} pos 点位的横纵坐标
     * @param {Function} cb 点在缓冲区域的回调
     */
    // 测量两地理坐标间距离
    checkPoint(pos, cb) {
        const pt = new mapboxgl.LngLat(pos[1], pos[0])
        const center = new mapboxgl.LngLat(this.lnglat[0], this.lnglat[1])
        const distance = center.distanceTo(pt).toFixed(0)
        const inCircle = Number(distance) <= Number(this.radius)
        cb && inCircle && cb()
        return inCircle
    }


    /**
     * 重新分析
     * @param {Array} lnglat 重置经纬度进行再次分析，可选参数
     */
    reset(lnglat) {
        this.hide()
        this.init(lnglat)
    }

    destroy() {
        if (this.destroyed) return false
        this.destroyed = true
        this.hide()
    }

    restore() {
        if (!this.destroyed) return false
        this.init()
    }

    //展示
    show() {
        if (this.destroyed) return false
        this.init(null, false)
    }

    //隐藏
    hide() {
        if (!this.active) return false
        this.active = false
        // 移除控制器（比较保险的方式移除）
        const doms = document.getElementsByClassName('nearby-search-control')
        Array.from(doms).forEach(domItem => domItem.remove())

        if (this.centerMarker) this.centerMarker.remove()

        // 关闭监听
        window.glMap._listeners.movestart.forEach(func => {
            if (func.name.indexOf('_movestart') !== -1) window.glMap.off('movestart',func)
        })
        window.glMap._listeners.moveend.forEach(func => {
            if (func.name.indexOf('_moveend') !== -1) window.glMap.off('moveend',func)
        })
        window.glMap._listeners.zoomstart.forEach(func => {
            if (func.name.indexOf('_zoomstart') !== -1) window.glMap.off('zoomstart',func)
        })
        window.glMap._listeners.zoomend.forEach(func => {
            if (func.name.indexOf('_zoomend') !== -1) window.glMap.off('zoomend',func)
        })

        // 隐藏圆
        if (window.glMap.getLayer('tool-nearby-circle')) {
            window.glMap.setLayoutProperty('tool-nearby-circle', 'visibility', 'none')
        }
    }

    //经纬度转网络墨卡托
    lnglat2WebMercator(lat, lng) {
        const earthRad = 6378137.0
        const x = ((lng * Math.PI) / 180) * earthRad
        const a = (lat * Math.PI) / 180
        const y = (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
        return [y, x]
    }

    //网络墨卡托转经纬度
    webMercator2LngLat(y, x) {
        const lng = (x / 20037508.34) * 180
        let lat = (y / 20037508.34) * 180
        lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2)
        return [lat, lng]
    }
}
