/**
 * 获取圆边的点集合
 * @param r 半径（米）
 * @param longitude 圆心经度
 * @param latitude 圆心纬度
 * @returns {Array}
 */
function drawCirclePolyline(r, longitude, latitude) {
    // 用polyline画圆
    var circleIn = new Cesium.CircleOutlineGeometry({
        center: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        radius: r,
        granularity: 0.001
    });
    var geometyIn = Cesium.CircleOutlineGeometry.createGeometry(circleIn);
    var float64ArrayPositionIn = geometyIn.attributes.position.values;
    var positionIn = [].slice.call(float64ArrayPositionIn);
    var oneArrL1 = positionIn.length;

    // 将一维数组转换成三维数组istrack
    var erArrL1 = positionIn.length/3;
    var er1 = new Array();
    for (var p = 0; p < erArrL1; p++) {
        er1[p] = new Array();
    }
    var k1 = 0;
    for (var o = 0; o < erArrL1; o++) {
        for (var u = 0; u < 3; u++) {
            er1[o][u] = positionIn[k1];
            k1++;
            if (k1 > oneArrL1 - 1) {
                break;
            }
        }
    }
    var posCir1 = [];
    for (var i = 0; i < er1.length; i++) {
        posCir1.push(new Cesium.Cartesian3(er1[i][0], er1[i][1], er1[i][2]));
    }
    posCir1.push(new Cesium.Cartesian3(er1[0][0], er1[0][1], er1[0][2]));
    return posCir1;
}

/**
 * 创建概率圆
 * @param options 概率圆点位置
 */
var probabilityCircle = function (options) {
    var circles = {};
    var point = options.point;
    var dot24 = options.dot24;
    var dot48 = options.dot48;
    var dot72 = options.dot72;
    var arrLine0 = [];
    arrLine0.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));
    var arrLine1 = [];
    arrLine1.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));
    var arrLineMin = [];
    arrLineMin.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));
    var arrLineMax = [];
    arrLineMax.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));

    var lines = [];
    initCircle();
    /**
     * 初始化概率圆
     */
    function initCircle() {
        if (dot24) {
            var positionCir24 = drawCirclePolyline(70000, dot24.lon, dot24.lat);
            var circleLine24 = drawLine('circleLine24','circleLine',positionCir24, 3, Cesium.Color.fromCssColorString('#E20303'));
            lines.push({
                name: 'circleLine24',
                dot: point,
                line: positionCir24
            });
        }

        if (dot48) {
            var positionCir48 = drawCirclePolyline(120000, dot48.lon, dot48.lat)
            var circleLine48 = drawLine('circleLine48','circleLine',positionCir48, 3, Cesium.Color.fromCssColorString('#DF01CD'));
            lines.push({
                name: 'circleLine48',
                dot: dot24,
                line: positionCir48
            });
        }

        if (dot72) {
            var positionCir72 = drawCirclePolyline(180000, dot72.lon, dot72.lat);
            var circleLine72 = drawLine('circleLine72','circleLine',positionCir72, 3, Cesium.Color.fromCssColorString('#0169DF'));
            lines.push({
                name: 'circleLine72',
                dot: dot48,
                line: positionCir72
            });
        }
        for (var i = 0; i < lines.length; i++) {
            var findPio = findPiont(lines[i].dot,lines[i].line);
            arrLine0.push(findPio.piont0);
            arrLine1.push(findPio.piont1);
            arrLineMin.push(findPio.minPiont);
            arrLineMax.push(findPio.maxPiont);
        }
    }
    var lineRight = drawLine('circleLine0','circleLine0',arrLine0, 3, Cesium.Color.fromCssColorString('#38FFE4'));
    var lineLeft = drawLine('circleLine1','circleLine1',arrLine1, 3, Cesium.Color.fromCssColorString('#00BBFF'));
    var lineMin = drawLine('circleLineMin','circleLineMin',arrLineMin, 3, Cesium.Color.fromCssColorString('#F88C01'));
    var lineMax = drawLine('circleLineMax','circleLineMax',arrLineMax, 3, Cesium.Color.fromCssColorString('#00E676'));

    /**
     * 鼠标拖拽动态改变概率圆数据
     */
    var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    var leftDownFlag = false;
    var pointDraged = null;
    updateCircle()
    function updateCircle() {
        // Select plane when mouse down
        handler3D.setInputAction(function (movement) {
            pointDraged = viewer.scene.pick(movement.position);// 选取当前的entity
            leftDownFlag = true;
            if (pointDraged && pointDraged.id && pointDraged.id.name == 'circleLine') {
                viewer.scene.screenSpaceCameraController.enableRotate = false;// 锁定相机
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        // Release plane on mouse up
        handler3D.setInputAction(function () {
            leftDownFlag = false;
            pointDraged = null;
            viewer.scene.screenSpaceCameraController.enableRotate = true;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        // Update plane on mouse move
        handler3D.setInputAction(function (movement) {
            if (leftDownFlag === true && pointDraged != null && pointDraged.id && pointDraged.id.name == 'circleLine') {
                let ray = viewer.camera.getPickRay(movement.endPosition);
                let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                var dot;
                if (pointDraged.id.id == 'circleLine24') {
                    dot = dot24;
                }
                if (pointDraged.id.id == 'circleLine48') {
                    dot = dot48;
                }
                if (pointDraged.id.id == 'circleLine72') {
                    dot = dot72;
                }
                // 重新计算圆边
                var geodesic = new Cesium.EllipsoidGeodesic();
                geodesic.setEndPoints(Cesium.Cartographic.fromCartesian(cartesian), Cesium.Cartographic.fromDegrees(dot.lon, dot.lat));
                var distance = geodesic.surfaceDistance;
                var posiNow = drawCirclePolyline(parseFloat(distance), dot.lon, dot.lat);
                pointDraged.id.polyline.positions = new Cesium.CallbackProperty(function () {
                    return posiNow;
                }, false);//防止闪烁，在移动的过程

                // 重新算垂点
                arrLine0 = [];
                arrLine0.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));
                arrLine1 = [];
                arrLine1.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));
                arrLineMin = [];
                arrLineMin.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));
                arrLineMax = [];
                arrLineMax.push(Cesium.Cartesian3.fromDegrees(point.lon,point.lat));
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].name == pointDraged.id.id) {
                        lines[i].line = posiNow;
                    }
                    var findPio = findPiont(lines[i].dot,lines[i].line);
                    arrLine0.push(findPio.piont0);
                    arrLine1.push(findPio.piont1);
                    arrLineMin.push(findPio.minPiont);
                    arrLineMax.push(findPio.maxPiont);
                }
                lineRight.polyline.positions = new Cesium.CallbackProperty(function () {
                    return arrLine0;
                }, false);
                lineLeft.polyline.positions = new Cesium.CallbackProperty(function () {
                    return arrLine1;
                }, false);
                lineMin.polyline.positions = new Cesium.CallbackProperty(function () {
                    return arrLineMin;
                }, false);
                lineMax.polyline.positions = new Cesium.CallbackProperty(function () {
                    return arrLineMax;
                }, false);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    /**
     * 清除概率圆
     */
    circles.deleteProbabilityCircle = function () {
        viewer.entities.remove(lineRight);
        viewer.entities.remove(lineLeft);
        viewer.entities.remove(lineMin);
        viewer.entities.remove(lineMax);
        lineRight = null;
        lineLeft = null;
        lineMin = null;
        lineMax = null;
        viewer.entities.removeById('circleLine24');
        viewer.entities.removeById('circleLine48');
        viewer.entities.removeById('circleLine72');
        point = null;
        dot24 = null;
        dot48 = null;
        dot72 = null;
        arrLine0 = null;
        arrLine1 = null;
        arrLineMin = null;
        arrLineMax = null;
        lines = null;
        handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        handler3D.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler3D = null;
        leftDownFlag = null;
        pointDraged = null;
    };

    /**
     * 获取概率圆路径数据
     */
    circles.getCalculate = function () {
        var data = {};
        data.baseList = [];
        if (dot24) {
            data.baseList.push({
                "power": dot24.power.toString(),
                "pressure": dot24.pressure.toString(),
                "speed": dot24.speed.toString(),
                "strong": dot24.strong.toString(),
                "time": dot24.time.toString()
            })
        }
        if (dot48) {
            data.baseList.push({
                "power": dot48.power.toString(),
                "pressure": dot48.pressure.toString(),
                "speed": dot48.speed.toString(),
                "strong": dot48.strong.toString(),
                "time": dot48.time.toString()
            })
        }
        if (dot72) {
            data.baseList.push({
                "power": dot72.power.toString(),
                "pressure": dot72.pressure.toString(),
                "speed": dot72.speed.toString(),
                "strong": dot72.strong.toString(),
                "time": dot72.time.toString()
            })
        }
        var ellipsoid = viewer.scene.globe.ellipsoid;
        data.rightForecast = [];
        for (var r = 1; r < arrLine0.length; r++) {
            var cartographicR = ellipsoid.cartesianToCartographic(arrLine0[r]);
            var latR = Cesium.Math.toDegrees(cartographicR.latitude);
            var lngR = Cesium.Math.toDegrees(cartographicR.longitude);
            data.rightForecast.push({
                "lat": latR,
                "lng": lngR
            })
        }
        data.leftForecast = [];
        for (var l = 1; l < arrLine1.length; l++) {
            var cartographicL = ellipsoid.cartesianToCartographic(arrLine1[l]);
            var latL = Cesium.Math.toDegrees(cartographicL.latitude);
            var lngL = Cesium.Math.toDegrees(cartographicL.longitude);
            data.leftForecast.push({
                "lat": latL,
                "lng": lngL
            })
        }
        data.fastForecast = [];
        for (var f = 1; f < arrLineMax.length; f++) {
            var cartographicF = ellipsoid.cartesianToCartographic(arrLineMax[f]);
            var latF = Cesium.Math.toDegrees(cartographicF.latitude);
            var lngF = Cesium.Math.toDegrees(cartographicF.longitude);
            data.fastForecast.push({
                "lat": latF,
                "lng": lngF
            })
        }
        data.slowForecast = [];
        for (var s = 1; s < arrLineMin.length; s++) {
            var cartographicS = ellipsoid.cartesianToCartographic(arrLineMin[s]);
            var latS = Cesium.Math.toDegrees(cartographicS.latitude);
            var lngS = Cesium.Math.toDegrees(cartographicS.longitude);
            data.slowForecast.push({
                "lat": latS,
                "lng": lngS
            })
        }
        return data
    };
    return circles
}

/**
 * 找圆边上的垂点和最远点、最近点
 * @param piont 圆外一点
 * @param circles 圆边的点集
 * @returns {{maxPiont: *, minPiont: *, piont0: *, piont1: *}}
 */
function findPiont(piont, circles) {
    // 遍历所有圆边点，找到距离最短那个
    var minI = 0;
    var maxI = 0;
    var minDistance;
    var maxDistance;
    var dot = Cesium.Cartographic.fromDegrees(piont.lon, piont.lat);
    var geodesic = new Cesium.EllipsoidGeodesic();
    for (var i = 0; i < circles.length - 1; i++) {
        var circle = Cesium.Cartographic.fromCartesian(circles[i]);
        geodesic.setEndPoints(circle, dot);
        var distance = geodesic.surfaceDistance;
        if (minDistance) {
            if (minDistance > distance) {
                minDistance = distance;
                minI = i;
            }
        } else {
            minDistance = distance;
        }
        if (maxDistance) {
            if (maxDistance < distance) {
                maxDistance = distance;
                maxI = i;
            }
        } else {
            maxDistance = distance;
        }
    }
    var minPiont = circles[minI];
    var maxPiont = circles[maxI];
    // 重新排序
    var arr1 = circles.slice(minI,-1);
    var arr2 = circles.slice(0,minI);
    arr1.push.apply(arr1,arr2);
    // 找垂直点
    var pointI0 = arr1.length / 4;
    var pointI1 = arr1.length / 4 * 3;
    return {
        piont0: arr1[pointI0],
        piont1: arr1[pointI1],
        minPiont: minPiont,
        maxPiont: maxPiont
    };
}