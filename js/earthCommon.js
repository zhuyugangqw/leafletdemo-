/**
 * 根据layer删除图层
 * @param layer
 */
function removeImageryProviderByLayer(layer) {
    for (var j = 0; j < viewer.scene.imageryLayers.length; j++) {
        var shadedImagery = viewer.scene.imageryLayers.get(j);
        if (shadedImagery.imageryProvider && shadedImagery.imageryProvider._layer && shadedImagery.imageryProvider._layer === layer) {
            viewer.scene.imageryLayers.remove(shadedImagery);
            j--;
        }
    }
}

/**
 * 添加实体图标
 * @param id
 * @param name
 * @param billboardName
 * @param lon
 * @param lat
 * @param imgSrc
 * @param scale
 */
function addBillboard (id, name, billboardName, lon, lat, imgSrc, scale) {
    if (id && name && billboardName && lon && lat && imgSrc && scale) {
        viewer.entities.add({
            id: id,
            name: name,
            position: Cesium.Cartesian3.fromDegrees(parseFloat(lon), parseFloat(lat)),
            billboard: {
                image: imgSrc,
                scale: scale
            },
            billboardName: billboardName
        })
    }
}

/**
 * 绘制线段
 * @param id
 * @param name
 * @param positions
 * @param width
 * @param material
 * @returns {*}
 */
function drawLine(id, name, positions, width, material) {
    if (!(id && name && positions && width && material)) {
        return undefined;
    }
    var entity = viewer.entities.add({
        id: id,
        name: name,
        polyline: {
            positions: positions,
            width: width,
            material: material
        }
    });
    return entity
}

/**
 * 绘制点
 * @param id
 * @param name
 * @param position
 * @param color
 * @param outlineColor
 * @param outlineWidth
 * @param pixelSize
 * @returns {*}
 */
function drawPoints(id, name, position, color, outlineColor, outlineWidth, pixelSize) {
    if (!(id && name && position && color && outlineColor && outlineWidth && pixelSize)) {
        return undefined;
    }
    var entity = viewer.entities.add({
        id: id,
        name: name,
        position: position,
        point: {
            color: color,
            outlineColor: outlineColor,
            outlineWidth: outlineWidth,
            pixelSize: pixelSize
        }
    });
    return entity
}

/**
 * 获取当前视图的三维范围
 * @returns {{}}
 */
function getCurrentExtent() {
    // 范围对象
    var extent = {};

    // 得到当前三维场景
    var scene = viewer.scene;

    // 得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var canvas = scene.canvas;

    // canvas左上角
    var car3Lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);

    // canvas右下角
    var car3Rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid);

    // 当canvas左上角和右下角全部在椭球体上
    if (car3Lt && car3Rb) {
        var cartoLt = ellipsoid.cartesianToCartographic(car3Lt);
        var cartoRb = ellipsoid.cartesianToCartographic(car3Rb);
        extent.xmin = Cesium.Math.toDegrees(cartoLt.longitude);
        extent.ymax = Cesium.Math.toDegrees(cartoLt.latitude);
        extent.xmax = Cesium.Math.toDegrees(cartoRb.longitude);
        extent.ymin = Cesium.Math.toDegrees(cartoRb.latitude);
    } else if (!car3Lt && car3Rb) {
        // 当canvas左上角不在但右下角在椭球体上
        var car3Lt2 = null;
        var yIndex = 0;
        do {
            // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
            yIndex <= canvas.height ? yIndex += 10 : canvas.height;
            car3Lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, yIndex), ellipsoid);
        } while (!car3Lt2)
        var cartoLt2 = ellipsoid.cartesianToCartographic(car3Lt2);
        var cartoRb2 = ellipsoid.cartesianToCartographic(car3Rb);
        extent.xmin = Cesium.Math.toDegrees(cartoLt2.longitude);
        extent.ymax = Cesium.Math.toDegrees(cartoLt2.latitude);
        extent.xmax = Cesium.Math.toDegrees(cartoRb2.longitude);
        extent.ymin = Cesium.Math.toDegrees(cartoRb2.latitude);
    }

    // 获取高度
    extent.height = Math.ceil(viewer.camera.positionCartographic.height);
    return extent
}

/**
 * 地图放大
 */
function zoomIn() {
    viewer.camera.zoomIn(viewer.camera.positionCartographic.height / Math.abs(Math.sin(viewer.camera.pitch)) * 0.2);
}

/**
 * 地图缩小
 */
function zoomOut() {
    viewer.camera.zoomOut(viewer.camera.positionCartographic.height / Math.abs(Math.sin(viewer.camera.pitch)) * 0.2);
}

/**
 * 小地球地图放大
 */
function zoomInTy() {
    viewerTy.camera.zoomIn(viewerTy.camera.positionCartographic.height / Math.abs(Math.sin(viewerTy.camera.pitch)) * 0.2);
}

/**
 * 小地球地图缩小
 */
function zoomOutTy() {
    viewerTy.camera.zoomOut(viewerTy.camera.positionCartographic.height / Math.abs(Math.sin(viewerTy.camera.pitch)) * 0.2);
}

/**
 * 根据区域切换视角
 * @param area
 */
function setCameraByArea(area) {
    switch (area) {
        case '广州市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(113.400730555556, 23.0526111111111, 200000.0)
            });
            break;
        case '深圳市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(114.027572222222, 22.7063888888889, 200000.0)
            });
            break;
        case '惠州市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(114.646655555556, 22.8669444444444, 200000.0)
            });
            break;
        case '佛山市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(113.170822222222, 22.4680555555556, 200000.0)
            });
            break;
        case '汕头市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(116.445105555556, 23.4469444444444, 200000.0)
            });
            break;
        case '江门市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(112.460408, 22.048041666, 200000.0)
            });
            break;
        case '茂名市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(111.104813888889, 21.5341666666667, 200000.0)
            });
            break;
        case '湛江市':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(110.203616666667, 20.9302777777778, 200000.0)
            });
            break;
        case '广东省':
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(113.505872222222, 22.2211111111111, 200000.0)
            });
            break;
    }
}

var RiverDisPlay = true
/**
 * 是否显示动态水纹
 * @param isShow bool
 */
function showRiver(isShow) {
    var primitives = viewer.scene.primitives
    for (var i = 0; i < primitives.length; i++) {
      var primitive = viewer.scene.primitives.get(i)
      if (primitive.name && primitive.name.toString() === 'River') {
        primitive.show = isShow
      }
    }
    RiverDisPlay = isShow
}

/**
 * 根据高度判断动态水显示
 */
function showRiverByHeight() {
    var height = viewer.camera.positionCartographic.height;
    if(RiverDisPlay) {
        var primitives = viewer.scene.primitives
        for (var i = 0; i < primitives.length; i++) {
            var primitive = viewer.scene.primitives.get(i)
            if (primitive.name && primitive.name.toString() === 'River') {
                if(height > 2757861) {
                    primitive.show = false;
                } else {
                    primitive.show = true;
                }
            }
        }
        
    }
}