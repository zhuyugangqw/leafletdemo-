/**
 * 绘制线段
 */
var CreatePolyline = (function () {
    function _ (positons, cesium) {
        if (!Cesium.defined(positons)) {
            throw new Cesium.DeveloperError('positions is required!')
        }
        if (positons.length < 2) {
            throw new Cesium.DeveloperError('positions 的长度必须大于等于2')
        }
        var material = Cesium.Material.fromType(Cesium.Material.ColorType)
        material.uniforms.color = new Cesium.Color(1.0, 1.0, 0.0, 0.5)
        this.options = {
            polyline: {
                show: true,
                width: 2,
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.WHITE.withAlpha(0.5),
                    outlineWidth: 0,
                    outlineColor: Cesium.Color.WHITE
                }),
                depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.RED,
                    outlineWidth: 1,
                    outlineColor: Cesium.Color.RED
                }),
                followSurface: true
            }
        }
        this.path = positons

        this._init(cesium)
    }

    _.prototype._init = function (cesium) {
        var that = this
        var positionCBP = function () {
            return that.path
        }
        this.options.polyline.positions = new Cesium.CallbackProperty(positionCBP, false)
        this.lineEntity = cesium.entities.add(this.options)
    }
    return _
})()

/**
 * 测量距离
 */
var measureDistance = function (cesium) {
    var isDraw = false
    var polylinePath = []
    var polylineCartographic = []//弧度数组,地表插值用
    var polyline = undefined
    var scene = cesium.scene
    var ellipsoid = scene.globe.ellipsoid
    var billboards = new Cesium.BillboardCollection()
    scene.primitives.add(billboards)
    var WebMercatorProjection = new Cesium.WebMercatorProjection()
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    var tooltip = document.getElementById('toolTip')
    tooltip.innerHTML = '<span>单击开始,双击结束</span>'
    var entities = []
    var billboard = undefined
    //隐藏选中容器标识
    $('.cesium-selection-wrapper').hide()
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    isDraw = true
    handler.setInputAction(function (movement) {
        //新增部分
        var position1
        var cartographicLine
        var ray = cesium.scene.camera.getPickRay(movement.endPosition)
        if (ray) {
            position1 = cesium.scene.globe.pick(ray, cesium.scene)
        }
        if (position1) {
            cartographicLine = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1)
        }
        if (cartographicLine) {
            //海拔
            var height = cesium.scene.globe.getHeight(cartographicLine)
            //地理坐标（弧度）转经纬度坐标
            var point = Cesium.Cartesian3.fromDegrees(cartographicLine.longitude / Math.PI * 180, cartographicLine.latitude / Math.PI * 180, height)
            //var point = Cesium.Cartesian3.fromDegrees(currentLon, currentLat, height);
            if (isDraw) {
                tooltip.style.left = movement.endPosition.x + 10 + 'px'
                tooltip.style.top = movement.endPosition.y + 20 + 'px'
                tooltip.style.display = 'block'
                if (polylinePath.length < 1) {
                    return
                }
                if (!Cesium.defined(polyline)) {
                    polylinePath.push(point)
                    polyline = new CreatePolyline(polylinePath, cesium)
                } else {
                    polyline.path.pop()
                    polyline.path.push(point)
                }
                if (polylinePath.length >= 1) {
                    if (polyline && polyline.path) {
                        var distance = getDistance(polyline.path)
                        tooltip.innerHTML = '<p>长度：' + distance + '</p><p>双击确定终点</p>'
                    }
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    //线段之间地表插值
    var SurfaceLine = function (cartographicLine) {
        polylineCartographic.push(cartographicLine)
        var terrainSamplePositions = []
        if (polylineCartographic.length > 1) {
            var p1 = polylineCartographic[polylineCartographic.length - 2]
            var p2 = polylineCartographic[polylineCartographic.length - 1]
            var a = Math.abs(p1.longitude - p2.longitude) * 10000000
            var b = Math.abs(p1.latitude - p2.latitude) * 10000000
            if (a > b) b = a
            var length = parseInt(b / 10)
            if (length > 1000) length = 1000
            if (length < 2) length = 2
            for (var i = 0; i < length; ++i) {
                terrainSamplePositions.push(
                    new Cesium.Cartographic(
                        Cesium.Math.lerp(p1.longitude, p2.longitude, i / (length - 1)),
                        Cesium.Math.lerp(p1.latitude, p2.latitude, i / (length - 1))
                    )
                )
            }

        } else {
            terrainSamplePositions = polylineCartographic
        }
        if (terrainSamplePositions.length > 0) {
            for (var j = 0; j < terrainSamplePositions.length; j++) {
                //地理坐标（弧度）转经纬度坐标
                var cartographicLine = terrainSamplePositions[j]
                var height = cesium.scene.globe.getHeight(cartographicLine)
                var point = Cesium.Cartesian3.fromDegrees(cartographicLine.longitude / Math.PI * 180, cartographicLine.latitude / Math.PI * 180, height)
                polylinePath.push(point)
            }
        }
    }

    handler.setInputAction(function (movement) {
        var position1
        var cartographicLine
        var ray = cesium.scene.camera.getPickRay(movement.position)
        if (ray) {
            position1 = cesium.scene.globe.pick(ray, cesium.scene)
        }
        if (position1) {
            cartographicLine = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1)
        }
        if (cartographicLine) {
            //海拔
            var height = cesium.scene.globe.getHeight(cartographicLine)
            //地理坐标（弧度）转经纬度坐标
            var point = Cesium.Cartesian3.fromDegrees(cartographicLine.longitude / Math.PI * 180, cartographicLine.latitude / Math.PI * 180, height)
            if (isDraw) {
                if (polyline) {
                    polyline.path.pop()
                }
                SurfaceLine(cartographicLine)
                var text = '起点'
                if (polyline) {
                    text = getDistance(polyline.path)
                }

                if (text === '起点') {
                    entities.push(cesium.entities.add({
                        position: point,
                        label: {
                            text: text,
                            font: '14px sans-serif',
                            style: Cesium.LabelStyle.FILL,
                            outlineWidth: 1,
                            fillColor: Cesium.Color.BLACK.withAlpha(1),
                            showBackground: true,
                            backgroundColor: Cesium.Color.WHITE.withAlpha(1),
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                            pixelOffset: new Cesium.Cartesian2(5.0, -20.0),
                        }
                    }))
                    billboards.add({
                        show: true,
                        id: '起点',
                        position: point,
                        pixelOffset: new Cesium.Cartesian2(0.0, 0.0),
                        eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.CENTER,
                        scale: 1.0,
                        image: './images/distance_start.png',
                        color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                    })
                } else {
                    entities.push(cesium.entities.add({
                        position: point,
                        point: {
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            show: true,
                            color: Cesium.Color.WHITE,
                            pixelSize: 10,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1,
                            zIndex: 2
                        },
                        label: {
                            text: text,
                            font: '14px sans-serif',
                            style: Cesium.LabelStyle.FILL,
                            outlineWidth: 1,
                            fillColor: Cesium.Color.BLACK.withAlpha(1),
                            showBackground: true,
                            backgroundColor: Cesium.Color.WHITE.withAlpha(1),
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                            pixelOffset: new Cesium.Cartesian2(5.0, -20.0),
                        }
                    }))
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction(function () {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        cesium.trackedEntity = undefined
        isDraw = false
        clearMeasureDistanceBtn()
        billboard = billboards.add({
            show: true,
            id: 'measureTool',
            position: polylinePath[polylinePath.length - 1],
            pixelOffset: new Cesium.Cartesian2(0.0, 20),
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            scale: 1.0,
            image: './images/distance_close.png',
            color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
        })
        billboards.add({
            show: true,
            id: '终点',
            position: polylinePath[polylinePath.length - 1],
            pixelOffset: new Cesium.Cartesian2(0.0, 0.0),
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            scale: 1.0,
            image: './images/distance_end.png',
            color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
        })
        cesium.entities.remove(entities[entities.length - 1])
        cesium.entities.remove(entities[entities.length - 2])
        var entityText = entities[entities.length - 1].label.text._value.toString()
        entities.push(cesium.entities.add({
            position: polylinePath[polylinePath.length - 1],
            label: {
                text: entityText,
                font: '14px sans-serif',
                style: Cesium.LabelStyle.FILL,
                outlineWidth: 1,
                fillColor: Cesium.Color.BLACK.withAlpha(1),
                showBackground: true,
                backgroundColor: Cesium.Color.WHITE.withAlpha(1),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                pixelOffset: new Cesium.Cartesian2(5.0, -20.0),
            }
        }))

        tooltip.style.display = 'none'
        // 关闭按钮执行事件
        handler.setInputAction(function (movement) {
            var pickedObjects = {}
            pickedObjects = scene.drillPick(movement.position)
            if (Cesium.defined(pickedObjects)) {
                for (var i = 0; i < pickedObjects.length; i++) {
                    if (pickedObjects[i].primitive == billboard) {
                        if (polyline) {
                            cesium.entities.remove(polyline.lineEntity)
                        }
                        for (var j = 0; j < entities.length; j++) {
                            cesium.entities.remove(entities[j])
                        }
                        entities = []
                        billboards.removeAll()
                        polylinePath = []
                        polyline = undefined
                        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // 获取线段距离
    var getDistance = function (path) {
        var Len = 0
        var distance = 0 + '米'
        var cg, cs, x1, y1, x2, y2
        for (i = 0; i < path.length - 1; i += 1) {
            cg = ellipsoid.cartesianToCartographic(path[i])
            cs = WebMercatorProjection.project(cg)
            x1 = cs.x
            y1 = cs.y
            cg = ellipsoid.cartesianToCartographic(path[i + 1])
            cs = WebMercatorProjection.project(cg)
            x2 = cs.x
            y2 = cs.y
            Len = Len + Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
        }
        if (Len > 0) {
            distance = Len.toFixed(2) + '米'
        }
        if (Len / 1000 >= 1) {
            distance = (Len / 1000).toFixed(2) + '公里'
        }
        return distance
    }
}
