/**
 * 创建台风
 * @param typhoonViewer 台风加载的地球
 * @param typhoonNum 台风编号
 * @param resData 台风数据
 * @param isUpdateForecast 是否修改预测点数据
 * @returns {{}}
 */
var typhoon = function (typhoonViewer, typhoonNum, resData, isUpdateForecast) {
    var typhoon = {}
    // 已经加载的台风路径数组
    var typhoonList = []
    // 已加载的台风风圈数据
    var pointsWindData = {}
    // 全部扇形对象
    var primitives = {}
    // 台风时间数组
    var times = {}
    var kTyphoons = {}
    var ellipsoid = Cesium.Ellipsoid.WGS84
    var scene = typhoonViewer.scene
    var clockViewModel = typhoonViewer.clockViewModel

    // if (clockViewModel.canAnimate) {
    //     clockViewModel.shouldAnimate = true
    // }
    if (isUpdateForecast) {
        setTyphoonImageScale(resData)
        resData = resData[0]
    } else {
        if (clockViewModel.canAnimate) {
            clockViewModel.shouldAnimate = true
        }
    }
    /**
     * 风圈覆盖，更换图片
     * resData台风数据
     */
    // console.log(resData)
    var typhoonPoint = resData.pointList
    var typhoonObjectPoint0 = typhoonPoint[typhoonPoint.length - 1]
    typhoonObjectPoint0.billboard.scale = 1
    var typhoonName = resData.name
    if (resData.modelList) {
        var typhoonMode = resData.modelList
        if(typhoonMode.length >= typhoonPoint.length - 1) {
            var typhoonModeScale = typhoonMode[typhoonPoint.length - 1]
            typhoonModeScale.billboard.scale = 1
            typhoonModeScale.position.cartographicDegrees[2] = 400
            for (var i = 1; i < typhoonPoint.length; i++) {
                typhoonMode[i].id = typhoonName + (i - 1)
            }
        }
    }
    /**
     * 给第一个点设置台风标签
     */
    var longitude01 = typhoonPoint[1].position.cartographicDegrees[0]
    var latitude01 = typhoonPoint[1].position.cartographicDegrees[1]
    var world01 = Cesium.Cartesian3.fromDegrees(longitude01, latitude01)
    var screenLocation = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, world01)
    var simTyLocation = { x: screenLocation.x, y: screenLocation.y }
    var leftXMarker = screenLocation.x
    var topYMarker = screenLocation.y
    if (typhoonViewer == viewer) {
        addTyphoonMarker(leftXMarker, topYMarker + 70, typhoonName, typhoonNum)
    }
    if (typhoonViewer == viewerTy) {
        addTyphoonMarker(leftXMarker, topYMarker + 70, typhoonName, typhoonNum, 'viewerTy')
    }


    /**
     * 渲染台风
     */
    // 创建点、线、模型、预测点容器对象
    var dataSource_point = new Cesium.CzmlDataSource()
    var dataSource_line = new Cesium.CzmlDataSource()
    var dataSource_modepoint = new Cesium.CzmlDataSource()
    var dataSource_chinaforcepoint = new Cesium.CzmlDataSource()
    var dataSource_chinaforceline = new Cesium.CzmlDataSource()
    var dataSource_japanforcepoint = new Cesium.CzmlDataSource()
    var dataSource_japanforceline = new Cesium.CzmlDataSource()
    var dataSource_taiwanforcepoint = new Cesium.CzmlDataSource()
    var dataSource_taiwanforceline = new Cesium.CzmlDataSource()
    var dataSource_Americanforcepoint = new Cesium.CzmlDataSource()
    var dataSource_Americanforceline = new Cesium.CzmlDataSource()
    var dataSource_hkforcepoint = new Cesium.CzmlDataSource()
    var dataSource_hkforceline = new Cesium.CzmlDataSource()

    typhoonList = {
        typhoon_number: typhoonNum,
        dataSource_point: dataSource_point,
        dataSource_line: dataSource_line,
        dataSource_modepoint: dataSource_modepoint,
        dataSource_chinaforcepoint: dataSource_chinaforcepoint,
        dataSource_chinaforceline: dataSource_chinaforceline,
        dataSource_japanforcepoint: dataSource_japanforcepoint,
        dataSource_japanforceline: dataSource_japanforceline,
        dataSource_taiwanforcepoint: dataSource_taiwanforcepoint,
        dataSource_taiwanforceline: dataSource_taiwanforceline,
        dataSource_Americanforcepoint: dataSource_Americanforcepoint,
        dataSource_Americanforceline: dataSource_Americanforceline,
        dataSource_hkforcepoint: dataSource_hkforcepoint,
        dataSource_hkforceline: dataSource_hkforceline
    }

    //拿到台风数据点数据
    var pointList = resData.pointList
    var lineList = resData.lineList
    var modelList = resData.modelList
    if (!resData.mainlandForecastPointList) {
        //2008年以前数据没有预测数据
        typhoonViewer.dataSources.add(dataSource_point.load(pointList))
        typhoonViewer.dataSources.add(dataSource_line.load(lineList))
        if (modelList) {
            typhoonViewer.dataSources.add(dataSource_modepoint.load(modelList))
        }
    } else {
        // 中国预测数据
        var mainlandForecastPointList = resData.mainlandForecastPointList
        var mainlandForecastLintList = resData.mainlandForecastLintList
        // 加载点、线、模型、各个国家预测数据
        typhoonViewer.dataSources.add(dataSource_point.load(pointList))
        typhoonViewer.dataSources.add(dataSource_line.load(lineList))
        if (modelList) {
            typhoonViewer.dataSources.add(dataSource_modepoint.load(modelList))
        }
        typhoonViewer.dataSources.add(dataSource_chinaforcepoint.load(mainlandForecastPointList))
        typhoonViewer.dataSources.add(dataSource_chinaforceline.load(mainlandForecastLintList))

        // 其他地区预测数据
        if (resData.taiwanForecastPointList) {
            var taiwanForecastPointList = resData.taiwanForecastPointList
            var taiwanForecastLintList = resData.taiwanForecastLintList
            typhoonViewer.dataSources.add(dataSource_taiwanforcepoint.load(taiwanForecastPointList))
            typhoonViewer.dataSources.add(dataSource_taiwanforceline.load(taiwanForecastLintList))
        }
        if (resData.japanForecastPointList) {
            var japanForecastPointList = resData.japanForecastPointList
            var japanForecastLintList = resData.japanForecastLintList
            typhoonViewer.dataSources.add(dataSource_japanforcepoint.load(japanForecastPointList))
            typhoonViewer.dataSources.add(dataSource_japanforceline.load(japanForecastLintList))
        }
        if (resData.usaForecastPointList) {
            var usaForecastPointList = resData.usaForecastPointList
            var usaForecastLintList = resData.usaForecastLintList
            typhoonViewer.dataSources.add(dataSource_Americanforcepoint.load(usaForecastPointList))
            typhoonViewer.dataSources.add(dataSource_Americanforceline.load(usaForecastLintList))
        }
        if (resData.hkForecastPointList) {
            var hkForecastPointList = resData.hkForecastPointList
            var hkForecastLintList = resData.hkForecastLintList
            typhoonViewer.dataSources.add(dataSource_hkforcepoint.load(hkForecastPointList))
            typhoonViewer.dataSources.add(dataSource_hkforceline.load(hkForecastLintList))
        }
        pointsWindData[typhoonNum] = {
            viewer: typhoonViewer,
            resData: resData.windCircleList
        }

        addTime(typhoonNum, resData.windCircleList)
    }

    function addTime(typhoonNumber, resData) {
        var typhoonTime = []
        if (resData) {
            for (var i = 0; i < resData.length; i++) {
                typhoonTime.push(resData[i].time)
            }
            times[typhoonNumber] = {
                typhoonTime: typhoonTime
            }
            kTyphoons[typhoonNumber] = -1
        }
    }

    // 台风名称标签监听
    var tyNameListener = scene.postRender.addEventListener(function () {
        var simTyLocation02 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, world01)
        if (simTyLocation02 && simTyLocation !== simTyLocation02) {
            var changeLeftX = simTyLocation02.x + 19
            var changeTopY = simTyLocation02.y - 13
            if (pointsWindData[typhoonNum] && pointsWindData[typhoonNum].viewer == viewerTy) {
                changeMarkerPosition(changeLeftX, changeTopY, typhoonNum, 'viewerTy')
            } else {
                if (menuStatus == '水情专题大屏') {
                    changeMarkerPosition(changeLeftX, changeTopY, typhoonNum)
                } else {
                    changeMarkerPosition(changeLeftX, changeTopY + 70, typhoonNum)
                }
            }
        }
    })

    // 风圈监听
    var typhoonClockListener = typhoonViewer.clock.onTick.addEventListener(function (clock) {
        if (typhoonViewer == viewer) {
            clock.multiplier = 10
        }
        if (pointsWindData !== undefined && pointsWindData !== '') {
            drawWind(clock._currentTime)
        }
    })

    // 绘制风圈方法
    function drawWind(currentTytime) {
        var directionNorthEast = 2.5, directionSouthEast = 2.0, directionNorthWast = 1.0, directionSouthWest = 1.5//扇形方向东北2.5、东南2、西北1、西南1.5
        var anglex = 5.869565217396//扇形角度
        var R7 = 37 / 255.0, G7 = 191 / 255.0, B7 = 42 / 255.0, A7 = 0.3//7级风圈颜色
        var R10 = 240 / 255.0, G10 = 138 / 255.0, B10 = 45 / 255.0, A10 = 0.5//10级风圈颜色
        var R12 = 254 / 255.0, G12 = 58 / 255.0, B12 = 163 / 255.0, A12 = 0.6//12级风圈颜色
        //控制风圈绘画次数
        var typhoonNumbers = Object.keys(times).sort()
        if (pointsWindData[typhoonNumbers] && pointsWindData[typhoonNumbers].viewer !== typhoonViewer) {
            return
        }
        for (var i = 0; i < typhoonNumbers.length; i++) {
            var typhoonNumber = typhoonNumbers[i]
            var pointsWind = pointsWindData[typhoonNumber].resData
            var kTyphoon = kTyphoons[typhoonNumber]
            var tyTime = times[typhoonNumber].typhoonTime
            for (var jTyphoon = 0, iTyphoon = 0; jTyphoon < pointsWind.length; jTyphoon++, iTyphoon++) {
                var lat = parseFloat(pointsWind[jTyphoon].lat)
                var lon = parseFloat(pointsWind[jTyphoon].lng)
                var radius7 = pointsWind[jTyphoon].radius7
                var radius10 = pointsWind[jTyphoon].radius10
                var radius12 = pointsWind[jTyphoon].radius12
                radius7 = radius7.split('|')
                radius10 = radius10.split('|')
                radius12 = radius12.split('|')
                var radiusNorthEast7 = radius7[0] * 1000
                var radiusSouthEast7 = radius7[1] * 1000
                var radiusNorthWast7 = radius7[2] * 1000
                var radiusSouthWest7 = radius7[3] * 1000
                var radiusNorthEast10 = radius10[0] * 1000
                var radiusSouthEast10 = radius10[1] * 1000
                var radiusNorthWast10 = radius10[2] * 1000
                var radiusSouthWest10 = radius10[3] * 1000
                var radiusNorthEast12 = radius12[0] * 1000
                var radiusSouthEast12 = radius12[1] * 1000
                var radiusNorthWast12 = radius12[2] * 1000
                var radiusSouthWest12 = radius12[3] * 1000
                var pointTimeEnd = tyTime[iTyphoon + 1]
                var pointTimecurrent = tyTime[iTyphoon]
                pointTimeEnd = Date.parse(pointTimeEnd)
                pointTimecurrent = Date.parse(pointTimecurrent)
                //拿到当前时间点并将当前时间转为国标时间点进行格式转化
                var currentTimetest = UtcTimeGBTime(currentTytime)
                var tyPrimitives = primitives[typhoonNumber]
                //判断当前时间，对当前点进行画扇形
                if ((jTyphoon === pointsWind.length - 1 && currentTimetest > pointTimecurrent) || (currentTimetest >= pointTimecurrent && currentTimetest < pointTimeEnd)) {
                    if (iTyphoon !== kTyphoon) {
                        if (iTyphoon + 1 === typhoonPoint.length - 1) {
                            // console.log('typhoonPoint is End')
                            // 达到终止时间后停止
                            clockViewModel.clockRange = Cesium.ClockRange.CLAMPED;
                        }
                        if (tyPrimitives && tyPrimitives.length !== 0) {
                            removeSector(typhoonNumber)
                        }
                        tyPrimitives = []
                        //七级风圈
                        var primitiveFill = new setvisible(lat, lon, radiusNorthEast7, directionNorthEast, anglex, R7, G7, B7, A7)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusNorthWast7, directionNorthWast, anglex, R7, G7, B7, A7)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusSouthEast7, directionSouthEast, anglex, R7, G7, B7, A7)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusSouthWest7, directionSouthWest, anglex, R7, G7, B7, A7)
                        tyPrimitives.push(primitiveFill)
                        //十级风圈
                        primitiveFill = new setvisible(lat, lon, radiusNorthEast10, directionNorthEast, anglex, R10, G10, B10, A10)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusNorthWast10, directionNorthWast, anglex, R10, G10, B10, A10)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusSouthEast10, directionSouthEast, anglex, R10, G10, B10, A10)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusSouthWest10, directionSouthWest, anglex, R10, G10, B10, A10)
                        tyPrimitives.push(primitiveFill)
                        //十二级风圈
                        primitiveFill = new setvisible(lat, lon, radiusNorthEast12, directionNorthEast, anglex, R12, G12, B12, A12)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusNorthWast12, directionNorthWast, anglex, R12, G12, B12, A12)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusSouthEast12, directionSouthEast, anglex, R12, G12, B12, A12)
                        tyPrimitives.push(primitiveFill)
                        primitiveFill = new setvisible(lat, lon, radiusSouthWest12, directionSouthWest, anglex, R12, G12, B12, A12)
                        tyPrimitives.push(primitiveFill)
                        primitives[typhoonNumber] = tyPrimitives
                        kTyphoon = iTyphoon
                        kTyphoons[typhoonNumber] = kTyphoon
                    }
                }
            }
        }
    }

    /*
      风圈扇形调用方法
      lat:风圈经度
      lon:风圈纬度
      semiMinorAxis：风圈半径
      direction四个扇形的不同方位东北2.5，东南2，西北1，西南1.5
    */
    var setvisible = function (lat, lon, semiMinorAxis, direction, anglex, R, G, B, A) {
        var center = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0)
        var eopt = {}
        eopt.semiMinorAxis = semiMinorAxis
        eopt.semiMajorAxis = semiMinorAxis
        eopt.rotation = Math.PI * direction//Math.PI;//逆时针转
        eopt.center = Cesium.Cartesian3.fromRadians(center.longitude, center.latitude, center.height)
        eopt.granularity = Math.PI * 2.0 / parseFloat(180)
        //正南为0度
        eopt.angle = Math.PI * 3.0 / anglex
        var ellipse = EllipseGeometryLibraryEx.computeSectorEdgePositions(eopt)
        var raiseopt = {}
        raiseopt.ellipsoid = ellipsoid
        raiseopt.height = center.height
        raiseopt.extrudedHeight = 0
        ellipse.outerPositions = EllipseGeometryLibraryEx.raisePositionsToHeight(ellipse.outerPositions, raiseopt, false)
        //转换
        var cartesians = []
        if (!ellipse.outerPositions) {
            return
        }
        for (var i = 0; i < ellipse.outerPositions.length; i += 3) {
            var cartesianTemp = new Cesium.Cartesian3(ellipse.outerPositions[i], ellipse.outerPositions[i + 1], ellipse.outerPositions[i + 2])
            cartesians.push(cartesianTemp)
        }
        //填充
        var cartesiansPointsFill = []
        var colorsFill = []
        for (var i = 1; i < cartesians.length; i++) {
            cartesiansPointsFill.push(cartesians[i - 1])
            cartesiansPointsFill.push(cartesians[i])
            cartesiansPointsFill.push(eopt.center)
            colorsFill.push(R)
            colorsFill.push(G)
            colorsFill.push(B)
            colorsFill.push(A)
            colorsFill.push(R)
            colorsFill.push(G)
            colorsFill.push(B)
            colorsFill.push(A)
            colorsFill.push(R)
            colorsFill.push(G)
            colorsFill.push(B)
            colorsFill.push(A)
        }
        var primitiveFill = new PrimitiveTriangles({
            'viewer': typhoonViewer,
            'Cartesians': cartesiansPointsFill,
            'Colors': colorsFill
        })
        return primitiveFill
    }

    /**
     * 删除风圈
     * @param typhoonNumber 台风编号
     */
    function removeSector(typhoonNumber) {
        if(primitives[typhoonNumber]) {
            var primitive = primitives[typhoonNumber]
            if (primitive) {
                for (var j = 0; j < primitive.length; j++) {
                    if (primitive[j].colorArr) {
                        primitive[j].remove();
                    }
                }
            }
            delete primitives[typhoonNumber]
        }
    }

    /**
     * 鼠标单击事件
     */
    var handler3D = new Cesium.ScreenSpaceEventHandler(typhoonViewer.scene.canvas)
    handler3D.setInputAction(function (movement) {
        var drillPick = scene.drillPick(movement.position)
        // typhoonClockListener()
        // piontClick(drillPick)
        showForecastByPiont(drillPick)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    /**
     * 点击绘制预测路线
     * @param drillPick
     */
    function showForecastByPiont(drillPick) {
        if (typhoonPathMenu && typhoonPathMenu != '台风计算') {
            return;
        }
        for (var i = 0; i < drillPick.length; i++) {
            var pick = drillPick[i];
            if (pick.id && pick.id.id && (pick.id.name === '热带风暴' || pick.id.name === '热带低压' || pick.id.name === '强热带风暴' || pick.id.name === '台风' || pick.id.name === '强台风' || pick.id.name === '超强台风') && pick.id.properties && pick.id.properties.number) {
                typhoon.forecastingAgencyIsShow('中国', false)
                typhoon.forecastingAgencyIsShow('日本', false)
                typhoon.forecastingAgencyIsShow('美国', false)
                typhoon.forecastingAgencyIsShow('中国台湾', false)
                typhoon.forecastingAgencyIsShow('中国香港', false)

                // console.log(pick.id)
                // var idNumber = pick.id.id
                // idNumber = idNumber.replace(/[^0-9]/ig, ""); // 提取数字
                // console.log(123)
                // console.log(idNumber)
                var typhoonNumber = pick.id.properties.number._value;
                if (pointsWindData[typhoonNumber] && pointsWindData[typhoonNumber].viewer == typhoonViewer) {
                    var forecastData = gettyTestData()
                    // console.log(forecastData)
                    var forecastCustomized = new customizedCircuit(forecastData.data);
                }
            }
        }
    }

    /**
     * 点击绘制风圈
     * @param drillPick
     */
    function piontClick(drillPick) {
        for (var i = 0; i < drillPick.length; i++) {
            var pick = drillPick[i]
            if (pick.id && pick.id.id && (pick.id.name === '热带风暴' || pick.id.name === '热带低压' || pick.id.name === '强热带风暴' || pick.id.name === '台风' || pick.id.name === '强台风' || pick.id.name === '超强台风') && pick.id.properties && pick.id.properties.number) {
                var idNumber = pick.id.id
                idNumber = idNumber.replace(/[^0-9]/ig, "")

                var typhoonNumber = pick.id.properties.number._value
                if (pointsWindData[typhoonNumber] && pointsWindData[typhoonNumber].viewer == typhoonViewer) {
                    var directionNorthEast = 2.5, directionSouthEast = 2.0, directionNorthWast = 1.0, directionSouthWest = 1.5//扇形方向东北2.5、东南2、西北1、西南1.5
                    var anglex = 5.869565217396//扇形角度
                    var R7 = 37 / 255.0, G7 = 191 / 255.0, B7 = 42 / 255.0, A7 = 0.3//7级风圈颜色
                    var R10 = 240 / 255.0, G10 = 138 / 255.0, B10 = 45 / 255.0, A10 = 0.5//10级风圈颜色
                    var R12 = 254 / 255.0, G12 = 58 / 255.0, B12 = 163 / 255.0, A12 = 0.6//12级风圈颜色
                    var pointsWind = pointsWindData[typhoonNumber].resData
                    var lat = parseFloat(pointsWind[idNumber].lat)
                    var lon = parseFloat(pointsWind[idNumber].lng)
                    var radius7 = pointsWind[idNumber].radius7
                    var radius10 = pointsWind[idNumber].radius10
                    var radius12 = pointsWind[idNumber].radius12
                    radius7 = radius7.split('|')
                    radius10 = radius10.split('|')
                    radius12 = radius12.split('|')
                    var radiusNorthEast7 = radius7[0] * 1000
                    var radiusSouthEast7 = radius7[1] * 1000
                    var radiusNorthWast7 = radius7[2] * 1000
                    var radiusSouthWest7 = radius7[3] * 1000
                    var radiusNorthEast10 = radius10[0] * 1000
                    var radiusSouthEast10 = radius10[1] * 1000
                    var radiusNorthWast10 = radius10[2] * 1000
                    var radiusSouthWest10 = radius10[3] * 1000
                    var radiusNorthEast12 = radius12[0] * 1000
                    var radiusSouthEast12 = radius12[1] * 1000
                    var radiusNorthWast12 = radius12[2] * 1000
                    var radiusSouthWest12 = radius12[3] * 1000
                    var tyPrimitives = primitives[typhoonNumber]
                    if (tyPrimitives && tyPrimitives.length !== 0) {
                        removeSector(typhoonNum)
                    }
                    tyPrimitives = []
                    //七级风圈
                    var primitiveFill = new setvisible(lat, lon, radiusNorthEast7, directionNorthEast, anglex, R7, G7, B7, A7)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusNorthWast7, directionNorthWast, anglex, R7, G7, B7, A7)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusSouthEast7, directionSouthEast, anglex, R7, G7, B7, A7)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusSouthWest7, directionSouthWest, anglex, R7, G7, B7, A7)
                    tyPrimitives.push(primitiveFill)
                    //十级风圈
                    primitiveFill = new setvisible(lat, lon, radiusNorthEast10, directionNorthEast, anglex, R10, G10, B10, A10)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusNorthWast10, directionNorthWast, anglex, R10, G10, B10, A10)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusSouthEast10, directionSouthEast, anglex, R10, G10, B10, A10)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusSouthWest10, directionSouthWest, anglex, R10, G10, B10, A10)
                    tyPrimitives.push(primitiveFill)
                    //十二级风圈
                    primitiveFill = new setvisible(lat, lon, radiusNorthEast12, directionNorthEast, anglex, R12, G12, B12, A12)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusNorthWast12, directionNorthWast, anglex, R12, G12, B12, A12)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusSouthEast12, directionSouthEast, anglex, R12, G12, B12, A12)
                    tyPrimitives.push(primitiveFill)
                    primitiveFill = new setvisible(lat, lon, radiusSouthWest12, directionSouthWest, anglex, R12, G12, B12, A12)
                    tyPrimitives.push(primitiveFill)
                    primitives[typhoonNumber] = tyPrimitives
                    var kTyphoon = kTyphoons[typhoonNumber]
                    kTyphoon = idNumber
                    kTyphoons[typhoonNumber] = kTyphoon
                    // console.log(idNumber)
                    return
                }
            }
        }
    }

    /**
     * 清除台风一个台风数据
     */
    typhoon.deleteTyphoon = function () {
        removeSector(typhoonNum)
        delete times[typhoonNum]
        delete kTyphoons[typhoonNum]
        typhoonList.dataSource_point.entities.removeAll()
        typhoonList.dataSource_line.entities.removeAll()
        typhoonList.dataSource_modepoint.entities.removeAll()
        typhoonList.dataSource_chinaforcepoint.entities.removeAll()
        typhoonList.dataSource_chinaforceline.entities.removeAll()
        typhoonList.dataSource_japanforcepoint.entities.removeAll()
        typhoonList.dataSource_japanforceline.entities.removeAll()
        typhoonList.dataSource_taiwanforcepoint.entities.removeAll()
        typhoonList.dataSource_taiwanforceline.entities.removeAll()
        typhoonList.dataSource_Americanforcepoint.entities.removeAll()
        typhoonList.dataSource_Americanforceline.entities.removeAll()
        typhoonList.dataSource_hkforcepoint.entities.removeAll()
        typhoonList.dataSource_hkforceline.entities.removeAll()
        typhoonList = null;
        pointsWindData = null;
        primitives = null;
        times = null;
        kTyphoons = null;
        ellipsoid = null;
        scene = null;
        clockViewModel = null;
        dataSource_point = null;
        dataSource_line = null;
        dataSource_modepoint = null;
        dataSource_chinaforcepoint = null;
        dataSource_chinaforceline = null;
        dataSource_japanforcepoint = null;
        dataSource_japanforceline = null;
        dataSource_taiwanforcepoint = null;
        dataSource_taiwanforceline = null;
        dataSource_Americanforcepoint = null;
        dataSource_Americanforceline = null;
        dataSource_hkforcepoint = null;
        dataSource_hkforceline = null;
        typhoonPoint = null;
        typhoonObjectPoint0 = null;
        typhoonName = null;
        typhoonMode = null;
        typhoonModeScale = null;
        longitude01 = null;
        latitude01 = null;
        world01 = null;
        screenLocation = null;
        simTyLocation = null;
        leftXMarker = null;
        topYMarker = null;
        pointList = null;
        lineList = null;
        modelList = null;
        // 清除风圈侦听
        typhoonClockListener()
        // 清除台风标签监听
        tyNameListener()
        if (typhoonViewer == viewerTy) {
            deleteMarkerItem(typhoonNum, 'viewerTy');
        } else {
            deleteMarkerItem(typhoonNum);
        }

        handler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    /**
     * 预测路线是否显示
     */
    typhoon.forecastingAgencyIsShow = function (agency, isShow) {
        switch (agency) {
            case '中国':
                if (isShow === true) {
                    typhoonList.dataSource_chinaforcepoint.show = true
                    typhoonList.dataSource_chinaforceline.show = true
                } else {
                    typhoonList.dataSource_chinaforcepoint.show = false
                    typhoonList.dataSource_chinaforceline.show = false
                }
                break
            case '日本':
                if (isShow === true) {
                    typhoonList.dataSource_japanforcepoint.show = true
                    typhoonList.dataSource_japanforceline.show = true
                } else {
                    typhoonList.dataSource_japanforcepoint.show = false
                    typhoonList.dataSource_japanforceline.show = false
                }
                break
            case '美国':
                if (isShow === true) {
                    typhoonList.dataSource_Americanforcepoint.show = true
                    typhoonList.dataSource_Americanforceline.show = true
                } else {
                    typhoonList.dataSource_Americanforcepoint.show = false
                    typhoonList.dataSource_Americanforceline.show = false
                }
                break
            case '中国台湾':
                if (isShow === true) {
                    typhoonList.dataSource_taiwanforcepoint.show = true
                    typhoonList.dataSource_taiwanforceline.show = true
                } else {
                    typhoonList.dataSource_taiwanforcepoint.show = false
                    typhoonList.dataSource_taiwanforceline.show = false
                }
                break
            case '中国香港':
                if (isShow === true) {
                    typhoonList.dataSource_hkforcepoint.show = true
                    typhoonList.dataSource_hkforceline.show = true
                } else {
                    typhoonList.dataSource_hkforcepoint.show = false
                    typhoonList.dataSource_hkforceline.show = false
                }
                break
        }
    }

    /**
     * 获取台风概率圆点位置
     * @param agency 预测机构
     */
    typhoon.circlesPrediction = function (agency) {
        var dots = {};
        dots.point = {
            lon: typhoonObjectPoint0.position.cartographicDegrees[0],
            lat: typhoonObjectPoint0.position.cartographicDegrees[1]
        };
        // var lastTime = typhoonObjectPoint0.properties.time;
        // lastTime = new Date(lastTime);
        // lastTime = lastTime.getTime();
        var forecastPoint;
        switch (agency) {
            case '中国':
                forecastPoint = resData.mainlandForecastPointList;
                break
            case '日本':
                forecastPoint = resData.japanForecastPointList;
                break
            case '美国':
                forecastPoint = resData.usaForecastPointList;
                break
            case '中国台湾':
                forecastPoint = resData.taiwanForecastPointList;
                break
            case '中国香港':
                forecastPoint = resData.hkForecastPointList;
                break
        }
        for (var k = 0; k < forecastPoint.length; k++) {
            if (forecastPoint[k].properties) {
                var lastTime = forecastPoint[1].properties.time;
                lastTime = new Date(lastTime);
                lastTime = lastTime.getTime();

                var forecastTime = forecastPoint[k].properties.time;
                forecastTime = new Date(forecastTime);
                forecastTime = forecastTime.getTime();

                var dateDiff = forecastTime - lastTime;
                dateDiff = dateDiff / (3600 * 1000);
                if (dateDiff == 24) {
                    dots.dot24 = {
                        lon: parseFloat(forecastPoint[k].properties.lng),
                        lat: parseFloat(forecastPoint[k].properties.lat),
                        power: forecastPoint[k].properties.power,
                        pressure: forecastPoint[k].properties.pressure,
                        speed: forecastPoint[k].properties.speed,
                        strong: forecastPoint[k].properties.strong,
                        time: forecastPoint[k].properties.time
                    }
                }
                if (dateDiff == 48) {
                    dots.dot48 = {
                        lon: parseFloat(forecastPoint[k].properties.lng),
                        lat: parseFloat(forecastPoint[k].properties.lat),
                        power: forecastPoint[k].properties.power,
                        pressure: forecastPoint[k].properties.pressure,
                        speed: forecastPoint[k].properties.speed,
                        strong: forecastPoint[k].properties.strong,
                        time: forecastPoint[k].properties.time
                    }
                }
                if (dateDiff == 72) {
                    dots.dot72 = {
                        lon: parseFloat(forecastPoint[k].properties.lng),
                        lat: parseFloat(forecastPoint[k].properties.lat),
                        power: forecastPoint[k].properties.power,
                        pressure: forecastPoint[k].properties.pressure,
                        speed: forecastPoint[k].properties.speed,
                        strong: forecastPoint[k].properties.strong,
                        time: forecastPoint[k].properties.time
                    }
                }
            }
        }
        return dots
    }
    return typhoon
};

/*
 时间转换
 时间时间转换国标时间
 currentTytime当前时间
 currentTimetest国标时间时间戳
 */
function UtcTimeGBTime(currentTytime) {
    var currentDate = Cesium.JulianDate.toDate(currentTytime)
    var currentDate_Year = currentDate.getYear() + 1900
    var currentDate_Month = currentDate.getMonth() + 1
    var currentDate_Date = currentDate.getDate()
    var currentDate_Hours = currentDate.getHours()
    var currentDate_Minutes = currentDate.getMinutes()
    var currentDate_Seconds = currentDate.getSeconds()
    var currentDate_Milliseconds = currentDate.getMilliseconds()
    var currentTimeGB = currentDate_Year + '/' + currentDate_Month + '/' + currentDate_Date + ' ' + currentDate_Hours + ':' + currentDate_Minutes + ':' + currentDate_Seconds + ':' + currentDate_Milliseconds
    var currentTimetest_value = moment(new Date(currentTimeGB)).format('YYYY/MM/DD HH:mm:ss.S')
    var currentTimetestMide = Date.parse(currentTimetest_value)
    return currentTimetestMide
}

/**
 * 监测气泡位置
 */
// 弹窗位置监听用到的参数
var tyPosition, tyPosition2, tyCartesian
scene.postRender.addEventListener(tyCartesianListener)
function tyCartesianListener() {
    if (tyPosition !== tyPosition2) {
        if (tyCartesian !== undefined) {
            tyPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, tyCartesian)
            if (tyPosition2) {
                var changeLeftX = tyPosition2.x
                var changeTopY = tyPosition2.y + 70
                typhoonInfoPosition(changeLeftX, changeTopY)
            }
        }
    }
}

/**
 * 台风消息弹出框
 * @param drillPick
 * @param movement
 * @constructor Zmumu
 * pick 台风点击位置
 * typhoonDistance 台风点距离广州的距离
 * typhoonId 台风点的id
 * typhoonNumber 台风编号
 * typhoonName 台风名称
 * leftX 消息框屏幕X坐标
 * topY 消息框屏幕Y坐标
 * isCurrent 是否为当前台风
 */
function typhoonPopup(drillPick, movement) {
    var inClick = false;
    typhoonInfoDelete();
    for (var i = 0; i < drillPick.length; i++) {
        var pick = drillPick[i]
        if (pick && pick.id && pick.id.id && (pick.id.name === '热带风暴' || pick.id.name === '热带低压' || pick.id.name === '强热带风暴' || pick.id.name === '台风' || pick.id.name === '强台风' || pick.id.name === '超强台风' || pick.id.name === '预测点') && pick.id._properties && pick.id._properties._number) {
            var clickEntity = pick.id
            var movement_pick = movement.position
            // tyCartesian = clickEntity.position._value
            tyPosition = { x: movement_pick.x, y: movement_pick.y }
            var typhoonId = pick.id.id
            var typhoonNumber = clickEntity._properties._number._value
            var typhoonName = pick.id._properties._typhoonName._value
            var leftX = movement_pick.x
            var topY = movement_pick.y + 70
            var pickTy = new Cesium.Cartesian2(movement_pick.x, movement_pick.y)
            tyCartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pickTy), viewer.scene)
            tyPosition = { x: movement_pick.x, y: movement_pick.y }
            var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(tyCartesian)
            var centerLon = cartographic.longitude * 180 / Math.PI
            var centerLat = cartographic.latitude * 180 / Math.PI
            var typhoonDistance = TyphoonGZDistance(centerLon, centerLat)
            var isCurrent = clickEntity._properties._isCurrent._value
            var typhoonFlag = 0
            if (pick.id._properties._typhoonFlag) {
                typhoonFlag = pick.id._properties._typhoonFlag._value
            }
            if (pick.id.name === '预测点') {
                var organ = clickEntity._properties._organ._value
                var lng = clickEntity._properties._lng._value
                var lat = clickEntity._properties._lat._value
                var power = clickEntity._properties._power._value
                var pressure = clickEntity._properties._pressure._value
                var speed = clickEntity._properties._speed._value
                var strong = clickEntity._properties._strong._value
                var time = clickEntity._properties._time._value
                var info = {
                    lat: lat,
                    lng: lng,
                    power: power,
                    pressure: pressure,
                    speed: speed,
                    strong: strong,
                    time: time
                }
                typhoneForecastInfoShow(leftX, topY, typhoonNumber, typhoonName, typhoonDistance, isCurrent, organ, info, false)
                tyCartesian = Cesium.Cartesian3.fromDegrees(lng, lat)
            } else {
                typhoneInfoShow(leftX, topY, typhoonNumber, typhoonName, typhoonId, typhoonDistance, isCurrent, false, typhoonFlag)
            }
            inClick = true;
            return inClick
        }
    }
    return inClick
}

/**
 * 添加台风标签
 * @param leftX
 * @param topY
 * @param name
 * @param number
 * @param flag
 */
function addTyphoonMarker(leftX, topY, name, number, flag) {
    var markerHtml = ''
    if (flag === 'viewerTy') {
        markerHtml = '<div class="typhoon_marker_small typhoon_marker_small_' + number + '">' +
            '<span></span>' +
            '<p>' + number + '-' + name + '</p>' +
            '</div>'
        $('.typhoonContaner').append(markerHtml)
    } else {
        markerHtml = '<div class="typhoon_marker typhoon_marker_' + number + '">' +
            '<span></span>' +
            '<p>' + number + '-' + name + '</p>' +
            '</div>'
        $('body').append(markerHtml)
    }
    changeMarkerPosition(leftX, topY, number)
}

/**
 * 改变台风标签位置
 * @param leftX
 * @param topY
 * @param number
 * @param flag
 */
function changeMarkerPosition(leftX, topY, number, flag) {
    if (flag === 'viewerTy') {
        $('.typhoon_marker_small_' + number).css({
            left: leftX,
            top: topY
        })
    } else {
        $('.typhoon_marker_' + number).css({
            left: leftX,
            top: topY
        })
    }
}

/**
 * 删除单个台风标签
 * @param number
 */
function deleteMarkerItem(number, flag) {
    if (flag === 'viewerTy') {
        $('.typhoon_marker_small_' + number).remove()
    } else {
        $('.typhoon_marker_' + number).remove()
    }

}

/**
 * 删除所有台风标签
 */
function deleteMarkerAll() {
    $('.typhoon_marker').remove()
    $('.typhoon_marker_small').remove()
}

/**
 * 台风信息弹窗
 * @param left
 * @param top
 * @param number
 * @param name
 * @param pointId
 * @param distance
 * @param isCurrent 是否是正在刮的台风
 * @param isReport 是否是预报模块
 * @param typhoonFlag 1: 历史台风 2: 相似台风
 */
function typhoneInfoShow(left, top, number, name, pointId, distance, isCurrent, isReport, typhoonFlag) {
    getTyphoonPointData(number, pointId, function (res) {
        if (res.code === 200 && res.data) {
            var resData = res.data
            $('.typhone_info').show()
            $('.info_list .info_forecast').show()
            $('.info_list .info_organ').hide()
            $('.typhoon_circle').show()
            $('.typhone_info').css({
                left: left + 'px',
                top: top + 'px'
            })
            var typhoonCircle = [{
                class: 7,
                direction: resData.radius7.split('|')
            }, {
                class: 10,
                direction: resData.radius10.split('|')
            }, {
                class: 12,
                direction: resData.radius12.split('|')
            }]
            var circleHtml = ''
            typhoonCircle.forEach(function (item, index) {
                circleHtml += '<li class="circle_item">' +
                    '<div class="circle_flag"><span>' + item.class + '</span>级风圈 (km)</div>' +
                    '<ol class="circle_detail flex">' +
                    '<li><span>' + (item.direction[0] ? item.direction[0] : '--') + '</span><p>东北</p></li>' +
                    '<li><span>' + (item.direction[1] ? item.direction[1] : '--') + '</span><p>东南</p></li>' +
                    '<li><span>' + (item.direction[2] ? item.direction[2] : '--') + '</span><p>西北</p></li>' +
                    '<li><span>' + (item.direction[3] ? item.direction[3] : '--') + '</span><p>西南</p></li>' +
                    '</ol>' +
                    '</li>'
            })
            $('.typhoon_circle').html(circleHtml)
            $('.info_title').attr('data-poinid', pointId)
            $('.info_title').find('h3').text(number + '-' + name)
            $('.info_title').find('.distance span').text(distance)
            $('.info_list li').eq(1).find('p').text(moment(resData.time).format('MM月DD日HH时'))
            $('.info_list li').eq(1).find('p').attr('data-time', resData.time)
            $('.info_list li').eq(1).find('span').text('过去时间')
            $('.info_list li').eq(2).find('p').text(resData.lat + '°E，' + resData.lng + '°N')
            $('.info_list li').eq(3).find('p').text(resData.strong + '级')
            $('.info_list li').eq(4).find('p').text(resData.speed + '米/秒')
            $('.info_list li').eq(5).find('p').text(resData.pressure + '百帕')
            $('.info_list li').eq(6).find('p').text(resData.movespeed + '公里/小时')
            $('.info_list li').eq(7).find('p').text(resData.movedirection)
            $('.typhone_btn').hide()
            // if (!isReport) {
            //     if (!isCurrent) {
            //         $('.history_water_btn').hide()
            //         $('.history_water_btn button').eq(0).attr('data-flag', typhoonFlag)
            //         // 是否有历史预报
            //         if (resData.hasHistoryForecast) {
            //             $('.history_water_btn button').eq(1).hide()
            //         } else {
            //             $('.history_water_btn button').eq(1).hide()
            //         }
            //     } else {
            //         $('.current_water_btn').hide()
            //     }
            // } else {
            //     if (!isCurrent) {
            //         $('.typhoon_start_btn').hide()
            //     }
            // }
            if (!isCurrent) {
                $('.history_water_btn').show();
            }
        }
    })
}

/**
 * 预测点信息弹窗
 * @param left
 * @param top
 * @param number
 * @param name
 * @param distance
 * @param isCurrent
 * @param organ
 * @param info
 * @param isReport
 * @param typhoonFlag
 */
function typhoneForecastInfoShow(left, top, number, name, distance, isCurrent, organ, info, isReport, typhoonFlag) {
    $('.typhone_info').show()
    $('.info_list .info_forecast').hide()
    $('.info_list .info_organ').show()
    $('.typhoon_circle').hide()
    $('.typhone_info').css({
        left: left + 'px',
        top: top + 'px'
    });
    $('.info_title').find('h3').text(number + '-' + name)
    $('.info_title').find('.distance span').text(distance)
    $('.info_list li').eq(0).find('p').text(organ)
    $('.info_list li').eq(1).find('p').text(moment(info.time).format('MM月DD日HH时'))
    $('.info_list li').eq(1).find('span').text('预计时间')
    $('.info_list li').eq(2).find('p').text(info.lat + '°E，' + info.lng + '°N')
    $('.info_list li').eq(3).find('p').text(info.strong + '级')
    $('.info_list li').eq(4).find('p').text(info.speed + '米/秒')
    var pressure = info.pressure ? info.pressure : 0
    $('.info_list li').eq(5).find('p').text(pressure + '百帕')
    $('.typhone_btn').hide()
    // if (!isReport) {
    //     if (!isCurrent) {
    //         $('.history_water_btn').show()
    //         $('.history_water_btn button').eq(0).attr('data-flag', typhoonFlag)
    //     } else {
    //         $('.current_water_btn').show()
    //     }
    // } else {
    //     if (!isCurrent) {
    //         $('.typhoon_organ_btn').show()
    //     }
    // }
    console.log(isCurrent)
    if (!isCurrent && organ === '中国' && localStorage.getItem('roleId') != 2 && menuStatus != "水情专题大屏") {
        $('.compound_water_btn').show();
    }
}
/**
 台风点信息窗口位置变更
 left: 屏幕左坐标
 top: 屏幕上坐标
 */
function typhoonInfoPosition(left, top) {
    $('.typhone_info').css({
        left: left + 'px',
        top: top + 'px'
    })
}

/**
 * 台风点信息弹窗删除
 */
function typhoonInfoDelete() {
    $('.typhone_info').hide()
}

/**
 * 计算台风距离广州直线距离
 * @param typhoonPoint_lon 台风点经度
 * @param typhoonPoint_lat 台风点纬度
 * @returns {string}
 * @constructor
 */
function TyphoonGZDistance(typhoonPoint_lon, typhoonPoint_lat) {
    var GZLon = 113.56442;
    var GZLat = 23.74414;
    var typhoonCartographic = Cesium.Cartographic.fromDegrees(typhoonPoint_lon, typhoonPoint_lat);
    var GZCartographic = Cesium.Cartographic.fromDegrees(GZLon, GZLat);
    // 计算两点之间距离
    var geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(typhoonCartographic, GZCartographic);
    var distance = geodesic.surfaceDistance / 1000;
    return distance.toFixed(0);
}

/**
 * 创建自定义路径
 * @param options
 */
var customizedCircuit = function (options) {
    var circuitMainland = [];
    var circuitJapan = [];
    var circuitUS = [];
    var circuitTaiwan = [];
    var lineMainland = [];
    var lineJapan = [];
    var lineUS = [];
    var lineTaiwan = [];
    var piontsMainland = [];
    var piontsJapan = [];
    var piontsUS = [];
    var piontsTaiwan = [];

    initLine();

    /**
     * 初始化路径
     */
    function initLine() {
        for (var i in options) {
            if (!options.hasOwnProperty(i)) {
                continue;
            }
            var points = options[i].forecastpoints;
            for (var k in points) {
                if (!points.hasOwnProperty(k)) {
                    continue;
                }
                var id = options[i].tm.toString() + k.toString();
                var color = Cesium.Color.fromBytes(255, 225, 121, 255);
                var positions = [];
                if (k > 0) {
                    positions.push(Cesium.Cartesian3.fromDegrees(points[k - 1].lng, points[k - 1].lat));
                    positions.push(Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat));
                }
                var material;
                var newLine;
                switch (options[i].tm.toString()) {
                    case '中国':
                        color = Cesium.Color.fromBytes(255, 225, 121, 255);
                        circuitMainland.push(Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat));
                        if (k > 0) {
                            material = new Cesium.PolylineDashMaterialProperty({
                                color: Cesium.Color.fromBytes(255, 225, 121, 255),
                                dashLength: 15.0
                            });
                            newLine = drawLine('customizedLineMainland' + k.toString(), 'customizedLine', positions, 1, material);
                            lineMainland.push(newLine);
                        }
                        var position = Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat);
                        var pointEnt = drawPoints(id, 'customizedPoint', position, color, color, 2.6, 2.6);
                        piontsMainland.push(pointEnt);
                        break;
                    case '日本':
                        color = Cesium.Color.fromBytes(23, 239, 23, 255);
                        circuitJapan.push(Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat));
                        if (k > 0) {
                            material = new Cesium.PolylineDashMaterialProperty({
                                color: Cesium.Color.fromBytes(23, 239, 23, 255),
                                dashLength: 15.0
                            });
                            newLine = drawLine('customizedLineJapan' + k.toString(), 'customizedLine', positions, 1, material);
                            lineJapan.push(newLine);
                        }
                        var position = Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat);
                        var pointEnt = drawPoints(id, 'customizedPoint', position, color, color, 2.6, 2.6);
                        piontsJapan.push(pointEnt);
                        break;
                    case '美国':
                        color = Cesium.Color.fromBytes(254, 58, 163, 255);
                        circuitUS.push(Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat));
                        if (k > 0) {
                            material = new Cesium.PolylineDashMaterialProperty({
                                color: Cesium.Color.fromBytes(254, 58, 163, 255),
                                dashLength: 15.0
                            });
                            newLine = drawLine('customizedLineUS' + k.toString(), 'customizedLine', positions, 1, material);
                            lineUS.push(newLine);
                        }
                        var position = Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat);
                        var pointEnt = drawPoints(id, 'customizedPoint', position, color, color, 2.6, 2.6);
                        piontsUS.push(pointEnt);
                        break;
                    case '中国台湾':
                        color = Cesium.Color.fromBytes(240, 138, 45, 255);
                        circuitTaiwan.push(Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat));
                        if (k > 0) {
                            material = new Cesium.PolylineDashMaterialProperty({
                                color: Cesium.Color.fromBytes(240, 138, 45, 255),
                                dashLength: 15.0
                            });
                            newLine = drawLine('customizedLineTaiwan' + k.toString(), 'customizedLine', positions, 1, material);
                            lineTaiwan.push(newLine);
                        }
                        var position = Cesium.Cartesian3.fromDegrees(points[k].lng, points[k].lat);
                        var pointEnt = drawPoints(id, 'customizedPoint', position, color, color, 2.6, 2.6);
                        piontsTaiwan.push(pointEnt);
                        break;
                }
            }
        }
    }

    /**
     * 鼠标操作
     */
    var handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    var leftDownFlag = false;
    var pointDraged = null;
    customized();

    function customized() {
        // Select plane when mouse down
        handler3D.setInputAction(function (movement) {
            pointDraged = viewer.scene.pick(movement.position);// 选取当前的entity
            leftDownFlag = true;
            // 移动
            if (pointDraged && pointDraged.id && pointDraged.id.name == 'customizedPoint' && typhoonPointStatus == 2) {
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
            // 移动
            if (leftDownFlag === true && pointDraged != null && pointDraged.id && pointDraged.id.name == 'customizedPoint' && typhoonPointStatus == 2) {
                let ray = viewer.camera.getPickRay(movement.endPosition);
                let cartesian = viewer.scene.globe.pick(ray, viewer.scene);

                // 移动预测点
                pointDraged.id.position = new Cesium.CallbackProperty(function () {
                    return cartesian;
                }, false);//防止闪烁，在移动的过程

                // 重新计算预测线
                var lineClass = pointDraged.id.id;
                var pointNumber = lineClass.replace(/[^0-9]/ig, ""); // 提取数字
                lineClass = lineClass.replace(/[0-9]/ig, ""); // 去除数字
                switch (lineClass) {
                    case '中国':
                        var newMainland = [];
                        for (var j in circuitMainland) {
                            if (j == pointNumber) {
                                newMainland.push(cartesian);
                                if ((parseInt(j) + 1) < circuitMainland.length) {
                                    var linePos0 = [];
                                    linePos0.push(cartesian);
                                    linePos0.push(circuitMainland[(parseInt(j) + 1)]);
                                    lineMainland[j].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos0;
                                    }, false);
                                }
                                if (parseInt(j) > 0) {
                                    var linePos1 = [];
                                    linePos1.push(circuitMainland[(parseInt(j) - 1)]);
                                    linePos1.push(cartesian);
                                    lineMainland[(parseInt(j) - 1)].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos1;
                                    }, false);
                                }
                            } else {
                                newMainland.push(circuitMainland[j]);
                            }
                        }
                        circuitMainland = newMainland;
                        break;
                    case '日本':
                        var newJapan = [];
                        for (var j in circuitJapan) {
                            if (!circuitJapan.hasOwnProperty(j)) {
                                continue;
                            }
                            if (j == pointNumber) {
                                newJapan.push(cartesian);
                                if ((parseInt(j) + 1) < circuitJapan.length) {
                                    var linePos0 = [];
                                    linePos0.push(cartesian);
                                    linePos0.push(circuitJapan[(parseInt(j) + 1)]);
                                    lineJapan[j].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos0;
                                    }, false);
                                }
                                if (parseInt(j) > 0) {
                                    var linePos1 = [];
                                    linePos1.push(circuitJapan[(parseInt(j) - 1)]);
                                    linePos1.push(cartesian);
                                    lineJapan[(parseInt(j) - 1)].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos1;
                                    }, false);
                                }
                            } else {
                                newJapan.push(circuitJapan[j]);
                            }
                        }
                        circuitJapan = newJapan;
                        break;
                    case '美国':
                        var newUS = [];
                        for (var j in circuitUS) {
                            if (!circuitUS.hasOwnProperty(j)) {
                                continue;
                            }
                            if (j == pointNumber) {
                                newUS.push(cartesian);
                                if ((parseInt(j) + 1) < circuitUS.length) {
                                    var linePos0 = [];
                                    linePos0.push(cartesian);
                                    linePos0.push(circuitUS[(parseInt(j) + 1)]);
                                    lineUS[j].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos0;
                                    }, false);
                                }
                                if (parseInt(j) > 0) {
                                    var linePos1 = [];
                                    linePos1.push(circuitUS[(parseInt(j) - 1)]);
                                    linePos1.push(cartesian);
                                    lineUS[(parseInt(j) - 1)].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos1;
                                    }, false);
                                }
                            } else {
                                newUS.push(circuitUS[j]);
                            }
                        }
                        circuitUS = newUS;
                        break;
                    case '中国台湾':
                        var newTaiwan = [];
                        for (var j in circuitTaiwan) {
                            if (!circuitTaiwan.hasOwnProperty(j)) {
                                continue;
                            }
                            if (j == pointNumber) {
                                newTaiwan.push(cartesian);
                                if ((parseInt(j) + 1) < circuitTaiwan.length) {
                                    var linePos0 = [];
                                    linePos0.push(cartesian);
                                    linePos0.push(circuitTaiwan[(parseInt(j) + 1)]);
                                    lineTaiwan[j].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos0;
                                    }, false);
                                }
                                if (parseInt(j) > 0) {
                                    var linePos1 = [];
                                    linePos1.push(circuitTaiwan[(parseInt(j) - 1)]);
                                    linePos1.push(cartesian);
                                    lineTaiwan[(parseInt(j) - 1)].polyline.positions = new Cesium.CallbackProperty(function () {
                                        return linePos1;
                                    }, false);
                                }
                            } else {
                                newTaiwan.push(circuitTaiwan[j]);
                            }
                        }
                        circuitTaiwan = newTaiwan;
                        break;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // Add or Delete piont when mouse left click
        handler3D.setInputAction(function (movement) {
            var pick = scene.pick(movement.position);
            // 增加点
            if (pick && pick.id && pick.id.name && pick.id.name === 'customizedLine' && typhoonPointStatus == 0) {
                var lineId = pick.id.id;
                var lineAgency = lineId.replace(/[0-9]/ig, ""); // 去除数字
                var lineNumber = lineId.replace(/[^0-9]/ig, ""); // 提取数字
                // 根据序号重新排序自定义点
                var color;
                var insertPiont = viewer.scene.globe.pick(viewer.camera.getPickRay(movement.position), viewer.scene);
                switch (lineAgency) {
                    case 'customizedLineMainland':
                        color = Cesium.Color.fromBytes(255, 225, 121, 255);
                        // 根据新增序号重新排序自定义点位置集
                        circuitMainland.splice(parseInt(lineNumber), 0, insertPiont);
                        // 根据序号重新画点，修改点
                        piontsMainland = repaintInsertPiont(lineNumber, insertPiont, piontsMainland, color);
                        // 重画线段
                        var material = new Cesium.PolylineDashMaterialProperty({
                            color: Cesium.Color.fromBytes(255, 225, 121, 255),
                            dashLength: 15.0
                        });
                        lineMainland = repaintInsertLine(circuitMainland, material, lineMainland, lineNumber, lineAgency);
                        break;
                    case 'customizedLineJapan':
                        color = Cesium.Color.fromBytes(23, 239, 23, 255);
                        // 根据新增序号重新排序自定义点位置集
                        circuitJapan.splice(parseInt(lineNumber), 0, insertPiont);
                        // 根据序号重新画点，修改点
                        piontsJapan = repaintInsertPiont(lineNumber, insertPiont, piontsJapan, color);
                        // 重画线段
                        var material = new Cesium.PolylineDashMaterialProperty({
                            color: Cesium.Color.fromBytes(23, 239, 23, 255),
                            dashLength: 15.0
                        });
                        lineJapan = repaintInsertLine(circuitJapan, material, lineJapan, lineNumber, lineAgency);
                        break;
                    case 'customizedLineUS':
                        color = Cesium.Color.fromBytes(254, 58, 163, 255);
                        // 根据新增序号重新排序自定义点位置集
                        circuitUS.splice(parseInt(lineNumber), 0, insertPiont);
                        // 根据序号重新画点，修改点
                        piontsUS = repaintInsertPiont(lineNumber, insertPiont, piontsUS, color);
                        // 重画线段
                        var material = new Cesium.PolylineDashMaterialProperty({
                            color: Cesium.Color.fromBytes(254, 58, 163, 255),
                            dashLength: 15.0
                        });
                        lineUS = repaintInsertLine(circuitUS, material, lineUS, lineNumber, lineAgency);
                        break;
                    case 'customizedLineTaiwan':
                        color = Cesium.Color.fromBytes(240, 138, 45, 255);
                        // 根据新增序号重新排序自定义点位置集
                        circuitTaiwan.splice(parseInt(lineNumber), 0, insertPiont);
                        // 根据序号重新画点，修改点
                        piontsTaiwan = repaintInsertPiont(lineNumber, insertPiont, piontsTaiwan, color);
                        // 重画线段
                        var material = new Cesium.PolylineDashMaterialProperty({
                            color: Cesium.Color.fromBytes(240, 138, 45, 255),
                            dashLength: 15.0
                        });
                        lineTaiwan = repaintInsertLine(circuitTaiwan, material, lineTaiwan, lineNumber, lineAgency);
                        break;
                }
            }

            // 删除点
            if (pick && pick.id && pick.id.name && pick.id.name === 'customizedPoint' && typhoonPointStatus == 1) {
                var piontId = pick.id.id;
                var pointNumber = piontId.replace(/[^0-9]/ig, ""); // 提取数字
                piontId = piontId.replace(/[0-9]/ig, ""); // 去除数字
                switch (piontId) {
                    case '中国':
                        circuitMainland.splice(parseInt(pointNumber), 1);
                        // 根据序号修改点信息
                        piontsMainland = repaintDeletePiont(pointNumber, piontsMainland);
                        // 根据序号修改线段
                        lineMainland = repaintDeleteLine(circuitMainland, lineMainland, pointNumber);
                        break;
                    case '日本':
                        circuitJapan.splice(parseInt(pointNumber), 1);
                        // 根据序号修改点信息
                        piontsJapan = repaintDeletePiont(pointNumber, piontsJapan);
                        // 根据序号修改线段
                        lineJapan = repaintDeleteLine(circuitJapan, lineJapan, pointNumber);
                        break;
                    case '美国':
                        circuitUS.splice(parseInt(pointNumber), 1);
                        // 根据序号修改点信息
                        piontsUS = repaintDeletePiont(pointNumber, piontsUS);
                        // 根据序号修改线段
                        lineUS = repaintDeleteLine(circuitUS, lineUS, pointNumber);
                        break;
                    case '中国台湾':
                        circuitTaiwan.splice(parseInt(pointNumber), 1);
                        // 根据序号修改点信息
                        piontsTaiwan = repaintDeletePiont(pointNumber, piontsTaiwan);
                        // 根据序号修改线段
                        lineTaiwan = repaintDeleteLine(circuitTaiwan, lineTaiwan, pointNumber);
                        break;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
};

/**
 * 根据新增序号重新画点，修改点
 * @param insertNum
 * @param insertPoint
 * @param pointsEntArr
 * @param color
 * @returns {[]}
 */
function repaintInsertPiont(insertNum, insertPoint, pointsEntArr, color) {
    var piontsArr = [];
    for (var i = 0; i < pointsEntArr.length; i++) {
        var piontEnt = pointsEntArr[i];
        var piontAgency = piontEnt.id.replace(/[0-9]/ig, ""); // 去除数字
        var position;
        if (i == insertNum) {
            position = piontEnt.position;
            piontEnt.position = insertPoint;
        }
        if (i > parseInt(insertNum)) {
            var newPosi = piontEnt.position;
            piontEnt.position = position;
            position = newPosi;
        }
        piontsArr.push(piontEnt);
        if (i == (pointsEntArr.length - 1)) {
            var id = piontAgency.toString() + pointsEntArr.length.toString();
            var pointEnt = drawPoints(id, 'customizedPoint', position, color, color, 2.6, 2.6);
            piontsArr.push(pointEnt);
        }
    }
    return piontsArr;
}

/**
 * 根据删除序号重排点,删点
 * @param deleteNum
 * @param pointsEntArr
 * @returns {[]}
 */
function repaintDeletePiont(deleteNum, pointsEntArr) {
    var piontsArr = [];
    for (var i = 0; i < pointsEntArr.length - 1; i++) {
        var piontEnt = pointsEntArr[i];
        if (i >= parseInt(deleteNum)) {
            piontEnt.position = pointsEntArr[i + 1].position
        }
        piontsArr.push(piontEnt)
    }
    viewer.entities.remove(pointsEntArr[parseInt(pointsEntArr.length) - 1]);
    return piontsArr;
}

/**
 * 根据新增序号重绘线段
 * @param positions
 * @param material
 * @param lines
 * @param insertNum
 * @param id
 * @returns {*}
 */
function repaintInsertLine(positions, material, lines, insertNum, id) {
    for (var i = insertNum; i < positions.length; i++) {
        var linePosition = [positions[i - 1], positions[i]];
        if (i < positions.length - 1) {
            var line = lines[i - 1];
            line.polyline.positions = linePosition;
            lines[i - 1] = line;
        } else {
            var k = parseInt(i) + 1;
            var newLine = drawLine(id.toString() + k.toString(), 'customizedLine', linePosition, 1, material);
            lines.push(newLine);
        }
    }
    return lines;
}

/**
 * 根据删除序号重绘线段
 * @param positions
 * @param lines
 * @param deleteNum
 * @returns {*}
 */
function repaintDeleteLine(positions, lines, deleteNum) {
    for (var i = deleteNum; i < positions.length; i++) {
        var linePosition = [positions[i - 1], positions[i]];
        var line = lines[i - 1];
        if (i < positions.length - 1) {
            line.polyline.positions = linePosition;
            lines[i - 1] = line;
        } else {
            viewer.entities.remove(line);
            lines.length = parseInt(positions.length) - 1;
        }
    }
    return lines;
}

/**
 * 更改水清专题中正在生效的台风，预测路径台风图片根据风速大小修改
 *
 超强台风：底层中心附近最大平均风速大于51.0米/秒，也即16级或以上。
 强台风：底层中心附近最大平均风速41.5-50.9米/秒，也即14-15级。
 台风：底层中心附近最大平均风速32.7-41.4米/秒，也即12-13级。
 强热带风暴：底层中心附近最大平均风速24.5-32.6米/秒，也即风力10-11级。
 热带风暴：底层中心附近最大平均风速17.2-24.4米/秒，也即风力8-9级。
 热带低压：底层中心附近最大平均风速10.8-17.1米/秒，也即风力为6-7级。
 * @param resData
 */
function setTyphoonImageScale(resData){
    var TyphoonData=resData;
    for(var i=0;i<TyphoonData.length;i++){
        //更改中国点大小和颜色
        if(TyphoonData[i].mainlandModelList){
            var mainlandModelList=TyphoonData[i].mainlandModelList
            for(var j=1;j<mainlandModelList.length;j++){
                var speed=mainlandModelList[j].speed;
                mainlandModelList[j].billboard.scale=0.4
                if(speed>=10.8&&speed<=17.1)
                    mainlandModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
                if(speed>=17.2&&speed<=24.4)
                    mainlandModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Storm_Point_image.png"
                if(speed>=24.5&&speed<=32.6)
                    mainlandModelList[j].billboard.image="../static/img/typhoonimage/Server_Tropical_Storm_Point_image.png"
                if(speed>=32.7&&speed<=41.4)
                    mainlandModelList[j].billboard.image="../static/img/typhoonimage/Typhoon_Point_image.png"
                if(speed>=41.5&&speed<=50.9)
                    mainlandModelList[j].billboard.image="../static/img/typhoonimage/Violent_Typhoon_Point_image.png"
                if(speed>=51)
                    mainlandModelList[j].billboard.image="../static/img/typhoonimage/Super_Typhoon_Point_image.png"
                else
                    mainlandModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
            }
        }
        //更改 美国模型点
        if(TyphoonData[i].usaModelList){
            var usaModelList=TyphoonData[i].usaModelList
            for(var j=1;j<usaModelList.length;j++){
                var speed=usaModelList[j].speed;
                usaModelList[j].billboard.scale=0.4
                if(speed>=10.8&&speed<=17.1)
                    usaModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
                if(speed>=17.2&&speed<=24.4)
                    usaModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Storm_Point_image.png"
                if(speed>=24.5&&speed<=32.6)
                    usaModelList[j].billboard.image="../static/img/typhoonimage/Server_Tropical_Storm_Point_image.png"
                if(speed>=32.7&&speed<=41.4)
                    usaModelList[j].billboard.image="../static/img/typhoonimage/Typhoon_Point_image.png"
                if(speed>=41.5&&speed<=50.9)
                    usaModelList[j].billboard.image="../static/img/typhoonimage/Violent_Typhoon_Point_image.png"
                if(speed>=51)
                    usaModelList[j].billboard.image="../static/img/typhoonimage/Super_Typhoon_Point_image.png"
                else
                    usaModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
            }
        }
        //更改 日本模型点
        if(TyphoonData[i].japanModelList){
            var japanModelList=TyphoonData[i].japanModelList
            for(var j=1;j<japanModelList.length;j++){
                var speed=japanModelList[j].speed;
                japanModelList[j].billboard.scale=0.4
                if(speed>=10.8&&speed<=17.1)
                    japanModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
                if(speed>=17.2&&speed<=24.4)
                    japanModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Storm_Point_image.png"
                if(speed>=24.5&&speed<=32.6)
                    japanModelList[j].billboard.image="../static/img/typhoonimage/Server_Tropical_Storm_Point_image.png"
                if(speed>=32.7&&speed<=41.4)
                    japanModelList[j].billboard.image="../static/img/typhoonimage/Typhoon_Point_image.png"
                if(speed>=41.5&&speed<=50.9)
                    japanModelList[j].billboard.image="../static/img/typhoonimage/Violent_Typhoon_Point_image.png"
                if(speed>=51)
                    japanModelList[j].billboard.image="../static/img/typhoonimage/Super_Typhoon_Point_image.png"
                else
                    japanModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
            }
        }
        //更改台湾模型点
        if(TyphoonData[i].taiwanModelList){
            var taiwanModelList=TyphoonData[i].taiwanModelList
            for(var j=1;j<taiwanModelList.length;j++){
                var speed=taiwanModelList[j].speed;
                taiwanModelList[j].billboard.scale=0.4
                if(speed>=10.8&&speed<=17.1)
                    taiwanModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
                if(speed>=17.2&&speed<=24.4)
                    taiwanModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Storm_Point_image.png"
                if(speed>=24.5&&speed<=32.6)
                    taiwanModelList[j].billboard.image="../static/img/typhoonimage/Server_Tropical_Storm_Point_image.png"
                if(speed>=32.7&&speed<=41.4)
                    taiwanModelList[j].billboard.image="../static/img/typhoonimage/Typhoon_Point_image.png"
                if(speed>=41.5&&speed<=50.9)
                    taiwanModelList[j].billboard.image="../static/img/typhoonimage/Violent_Typhoon_Point_image.png"
                if(speed>=51)
                    taiwanModelList[j].billboard.image="../static/img/typhoonimage/Super_Typhoon_Point_image.png"
                else
                    taiwanModelList[j].billboard.image="../static/img/typhoonimage/Tropical_Depression_Point_image.png"
            }
        }
    }
}