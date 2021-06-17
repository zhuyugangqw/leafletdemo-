// 风暴潮折线图位置监听参数
var stormPosition, stormPosition2, stormCartesian;
// 大屏风暴潮加载title
var waterTitle;
// 漫堤折线图位置监听参数
var EmbankmentPosition, EmbankmentPosition2, EmbankmentCartesian;
// 鼠标悬停时显示的lable
var labelEmbankmentLine = viewer.entities.add({
    label: {
        show: false,
        showBackground: true,
        font: '14px Microsoft YaHei',
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(15, 0),
        backgroundPadding: new Cesium.Cartesian2(14, 9),
        fillColor: Cesium.Color.fromCssColorString('#1DEBE4')
    }
});

/**
 * 加载河网面积图层
 */
function loadStormForecastGeojson() {
    var options = {
        clampToGround: true // 开启贴地
    };
    var polygonSF = Cesium.GeoJsonDataSource.load('./static/GeoJson/Guangzhouswj.json', options);
    polygonSF.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        var polygonEntities = dataSource.entities.values;
        for (var i = 0; i < polygonEntities.length; i++) {
            var polygonEntity = polygonEntities[i];
            polygonEntity.name = '河网面';
            polygonEntity.polygon.material = Cesium.Color.fromBytes(0, 0, 0, 0);
        }
    });
}
loadStormForecastGeojson();

/**
 * 创建风暴潮预报河网kmz数据
 * @param kmzViewer
 * @param data
 * @param isShow 是否显示第一张
 */
var loadStormForecastByKMZ = function (kmzViewer, data, isShow) {
    var stormForecastData = {};
    var list = data.kmz;
    var nowName;
    var nameArr = [];
    var optionsKMZ = {
        camera: kmzViewer.scene.camera,
        canvas: kmzViewer.scene.canvas
    };
    var kmzShowEnt;

    // 加载所有数据
    for (var time in list) {
        if (!list.hasOwnProperty(time)) {
            continue;
        }
        var url = list[time].path;
        if (url) {
            var namesUrl = url.split('/');
            nowName = namesUrl[namesUrl.length - 1];
            nameArr.push(nowName);
            var load = Cesium.KmlDataSource.load(url, optionsKMZ);
            if (!(isShow && nowName == '1.kmz')) {
                load.then(function (dataSource) {
                    dataSource.show = false;
                });
            }
            kmzViewer.dataSources.add(load);
        }
    }

    // 根据时间显示kmz
    stormForecastData.setKmzshowByTime = function (time) {
        if (kmzShowEnt) {
            kmzShowEnt.show = false;
            kmzShowEnt = null;
        }
        if (!list) {
            return;
        }
        if (!list[time.toString()]) {
            return;
        }
        var url = list[time.toString()].path;
        var names = url.split('/');
        nowName = names[names.length - 1];
        for (var i = 0; i < kmzViewer.dataSources.length; i++) {
            var dataGeoJson = kmzViewer.dataSources.get(i);
            if (dataGeoJson._name && dataGeoJson._name == nowName) {
                dataGeoJson.show = true;
                kmzShowEnt = dataGeoJson;
            }
        }
    };

    // 删除全部kmz
    stormForecastData.removeAll = function () {
        for (var i = 0; i < kmzViewer.dataSources.length; i++) {
            var dataGeoJson = kmzViewer.dataSources.get(i);
            for (var j in nameArr) {
                if (!nameArr.hasOwnProperty(j)) {
                    continue;
                }
                if (dataGeoJson._name && dataGeoJson._name === nameArr[j]) {
                    kmzViewer.dataSources.remove(dataGeoJson, true);
                    i--;
                }
            }
        }
        nameArr = null;
    };

    return stormForecastData;
}

/**
 * 加载风暴潮预报河网kmz数据
 * @param agency 预报类型请求参数
 * 常规预报：机构【1：央视（CCTV），2：美国（USA），3：台湾(Taiwan)，4：日本（Japan）】
 * 集合预报：预报类型【1：中国  2：偏左   3：偏右  4：偏快  5：偏慢】
 * @param type 预报类型【1：常规预报，2：集合预报】
 * @param typhoonNumber 台风编号【场景库参数，非必须】
 * @returns {*}
 */
function openTimeLine(times, typhoonNumber) {
    if(menuStatus == '风暴潮场景库') {
        // 场景库台风
        var listData = {
            "number": typhoonNumber
        }
        listData.interval = 1000
        // $ajax('/web/typhoon/path/history/tile', listData, function (res) {
        //     if (res.data) {
        //         for (var item in typhoonSelectObjectStormMin) {
		// 			typhoonSelectObjectStormMin[item].removeTyphoon();
		// 		}
        //         typhoonSelectObjectStormMin[typhoonNumber] = new typhoon(viewerTy, res.data.number, res.data, false);
        //         $(".stop").click();
        //         $('.typhoonContaner-effect').show();
        //         $('.typhoonContaner-name').show().html(res.data.number + '-' + res.data.name);
        //     } else {
        //         $('.typhoonContaner-effect').hide();
        //         $('.typhoonContaner-name').hide()
        //     }
        // })
    }else if(menuStatus == '水情专题大屏'){

    }else{
        // getTyphoonDataByMultiplier(2500, function (res) {
        //     if (res.data && res.data.length > 0) {
        //         new typhoon(viewerTy, res.number, res.data, true);
        //         $('.typhoonContaner-effect').show();
        //         $('.typhoonContaner-name').show().html(res.data[0].number + '-' + res.data[0].name);
        //     } else {
        //         $('.typhoonContaner-effect').hide();
        //         $('.typhoonContaner-name').hide()
        //     }
        // });
        getTyphoonDataByNumber(typhoonNumber, function (res) {
            if(res.data){
                (new typhoon(viewerTy, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewerTy"})).ByIntervalDrawTyphoon();
                $('.typhoonContaner-effect').show();
				$('.typhoonContaner-name').show().html(typhoonNumber + '-' + res.data.name);
            }else{
                $('.typhoonContaner-effect').hide();
				$('.typhoonContaner-name').hide().html("");
            }
        });
    }
    localStorage.setItem('startTime', times[0])
    changeTimeLineText(times[0], times[times.length - 1]);
    viewerTy.timeline.container.style.visibility = 'visible'
    viewerTy.timeline.container.style.display = 'block'
    $('#timelineBar').show();
    $('#typhoonContaner').show();
    viewerTy.clockViewModel.multiplier = 2500
    viewerTy.clockViewModel.shouldAnimate = false;
}
function loadStormForecast(agency, type, typhoonNumber) {
    waterTitle = '风暴潮预报';
    var times;
    var params;
    if(typhoonNumber) {
        params = {
            agency: agency,
            typhoonNumber: typhoonNumber
        }
    } else {
        params = {agency: agency}
    }
    switch (type) {
        case 1:
            // 常规预报
            $ajax('/web/opendap/kmz/storm/forecast/correct/normal/kmz', params, function (res) {
                // if(menuStatus == '风暴潮场景库') {
                //     updateStormForecastPNG(res.data);
                // } else {
                //     updateStormForecastKMZ(res.data);
                // }
                // updateStormForecastKMZ(res.data);
                updateStormForecastPNG(res.data)
                times = res.data.times;
                openTimeLine(times, typhoonNumber);
            });
            break;
        case 2:
            // 集合预报
            $ajax('/web/opendap/kmz/storm/forecast/correct/ensemble/kmz', { ensemble: agency }, function (res) {
                // updateStormForecastKMZ(res.data);
                updateStormForecastPNG(res.data)
                times = res.data.times;
                openTimeLine(times);
            });
            break;
    }
    return times;
}

/**
 * 加载最高水位kmz数据
 * @param params 请求参数
 * 常规预报：机构【1：央视（CCTV），2：美国（USA），3：台湾(Taiwan)，4：日本（Japan）】
 * 集合预报：预报类型【1：中国  2：偏左   3：偏右  4：偏快  5：偏慢】
 * @param type 预报类型【1：常规预报，2：集合预报】
 */
function loadHighestWaterLevel(params, type) {
    waterTitle = '最高水位';
    var dataWater = {};
    dataWater.kmz = {};
    switch (type) {
        case 1:
            // 常规预报
            $ajax('/web/opendap/kmz/storm/forecast/highest/level/correct/normal/kmz', { agency: params }, function (res) {
                dataWater.kmz[res.data.predictTargetTime.toString()] = {
                    "predictTargetTime": parseInt(res.data.predictTargetTime),
                    "path": res.data.path.toString()
                }
                // updateStormForecastKMZ(dataWater, null, true);
                updateStormForecastPNG(dataWater, null, true);
            });
            break;
        case 2:
            // 集合预报
            $ajax('/web/opendap/kmz/storm/forecast/highest/level/ensemble/normal/kmz', { ensemble: params }, function (res) {
                dataWater.kmz[res.data.predictTargetTime.toString()] = {
                    "predictTargetTime": parseInt(res.data.predictTargetTime),
                    "path": res.data.path.toString()
                };
                // updateStormForecastKMZ(dataWater, null, true);
                updateStormForecastPNG(dataWater, null, true);
            });
            break;
    }
}

/**
 * 创建风暴潮预报河网png数据
 * @param {*} pngViewer 
 * @param {*} data 
 * @param {*是否显示第一张} isShow 
 */
var loadStormForecastByPNG = function(pngViewer, data, isShow) {
    var stormForecastData = {};
    var list = data.kmz;
    var nowName;
    var imageryLayers = [];
    var imageryLayerShow; //正在显示的图层

    // 加载所有数据
    for(var time in list) {
        if (!list.hasOwnProperty(time)) {
            continue;
        }
        var url = list[time].path;
        if(url) {
            var namesUrl = url.split('/');
            nowName = namesUrl[namesUrl.length - 1];
            var temptureLayer = pngViewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
                url: url,
                rectangle: new Cesium.Rectangle.fromDegrees(105, 13, 128, 28)
            }));
            temptureLayer.alpha = 1;
            temptureLayer.name = nowName;
            // if (!(isShow && nowName == '0.png')) {
            //     temptureLayer.show = false;
            // }
            imageryLayers.push(temptureLayer);
        }
    }

    // 根据时间显示png
    stormForecastData.setPngShowByTime = function(time) {
        if(imageryLayerShow) {
            // imageryLayerShow.show = false;
            imageryLayerShow = null;
        }
        if(!list) {
            return
        }
        if (!list[time.toString()]) {
            return;
        }
        var url = list[time.toString()].path;
        var names = url.split('/');
        nowName = names[names.length - 1];
        for(var i = 0; i < imageryLayers.length; i++) {
            var layer = imageryLayers[i];
            if(layer.name == nowName) {
                // layer.show = true;
                pngViewer.imageryLayers.raiseToTop(layer)
                imageryLayerShow = layer;
            }
        }
    };

    // 删除全部png
    stormForecastData.removeAll = function() {
        for(var i = 0; i < imageryLayers.length; i++) {
            var layer = imageryLayers[i];
            pngViewer.imageryLayers.remove(layer);
        }
        imageryLayers = null;
    }

    return stormForecastData
}

var stormForecast;
/**
 * 
 * 修改风暴潮预报河网kmz数据
 * @param data
 * @param readTime 时间戳
 * @param isShow 是否显示第一张
 */
function updateStormForecastKMZ(data, readTime, isShow) {
    if (readTime) {
        if (stormForecast) {
            stormForecast.setKmzshowByTime(readTime);
        }
    } else {
        removeStormForecastKMZ();
        stormForecast = new loadStormForecastByKMZ(viewer, data, isShow);
    }
}

/**
 * 
 * 修改风暴潮预报河网png数据
 * @param data
 * @param readTime 时间戳
 * @param isShow 是否显示第一张
 */
function updateStormForecastPNG(data, readTime, isShow) {
    if (readTime) {
        if (stormForecast) {
            stormForecast.setPngShowByTime(readTime);
        }
    } else {
        removeStormForecastKMZ();
        stormForecast = new loadStormForecastByPNG(viewer, data, isShow);
    }
}

/**
 * 删除风暴潮预报河网kmz数据
 */
function removeStormForecastKMZ() {
    if (stormForecast) {
        stormForecast.removeAll();
        stormForecast = null;
        viewer.entities.removeById('imgEnd');
        // 水情专题大屏最高水位
        forecastPlayMaxWaterProduceHide();
        // 水情专题大屏风暴潮预报播放
        forecastPlayStormProduceHide();
        // 预报订正风暴潮
        hideArbitrarilyEchart();
        // 风暴潮场景库任意点折线图
        stormPlayStormProduceHide();
    }
}

/**
 * 大屏风暴潮预报数据加载
 */
function loadWaterStormForecast() {
    waterTitle = '风暴潮预报';
    viewer.camera.flyTo({
        duration: 1.0,
        destination: Cesium.Cartesian3.fromDegrees(113.517628, 23.353899, 1000000.0),
        complete: function () {
            $ajax('/web/opendap/kmz/storm/forecast/big/screen/kmz', {}, function (res) {
                // updateStormForecastKMZ(res.data);
                updateStormForecastPNG(res.data);
                times = res.data.times;
                openTimeLine(times);
            });
        }
    })
}

/**
 * 大屏最高水位数据加载
 */
function loadWaterHightestWaterLevel() {
    waterTitle = '最高水位';
    viewer.camera.flyTo({
        duration: 1.0,
        destination: Cesium.Cartesian3.fromDegrees(113.517628, 23.353899, 1000000.0),
        complete: function () {
            $ajax('/web/opendap/kmz/storm/forecast/highest/level/big/screen/kmz', {}, function (res) {
                var dataWater = {};
                dataWater.kmz = {};
                dataWater.kmz[res.data.predictTargetTime.toString()] = {
                    "predictTargetTime": parseInt(res.data.predictTargetTime),
                    "path": res.data.path.toString()
                };
                updateStormForecastKMZ(dataWater, null, true);
            });
        }
    })
}

/**
 * 风暴潮水面任意点点击折线图
 * @param drillPick
 * @param position
 */
function clickWatrStormAnyShowLine(drillPick, position) {
    var isJson = false;
    // var isKmz = false;
    var isShowEchar = true;
    for (var i in drillPick) {
        var pickEchar = drillPick[i]
        if (pickEchar && pickEchar.id && pickEchar.id.name && pickEchar.id.name === '河网面') {
            isJson = true;
        }
        // if (pickEchar && pickEchar.id && pickEchar.id.name && pickEchar.id.name === 'SMS - 111') {
        //     isKmz = true;
        // }
    }
    if (isJson) {
        var pickEnd = new Cesium.Cartesian2(position.x, position.y);
        var cartesianEnd = viewer.scene.globe.pick(viewer.camera.getPickRay(pickEnd), viewer.scene);
        if (cartesianEnd) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesianEnd);
            var longitude = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(5));
            var latitude = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(5));
            if (menuStatus == '水情专题大屏' && waterProjectMenuListStatus == '水位预报') {
                // if (waterTitle == '风暴潮预报') {
                //     forecastPlayStormProduceShow(0, 0, longitude, latitude);
                //     setkWatrStormAnyShow(position);
                // }
                if (waterTitle == '最高水位') {
                    forecastPlayMaxWaterProduceShow(0, 0, longitude, latitude);
                } else {
                    forecastPlayStormProduceShow(0, 0, longitude, latitude);
                }
                setkWatrStormAnyShow(position);
                isShowEchar = false;
            }
            if (menuStatus == '预报订正') {
                arbitrarilyAjax(longitude, latitude);
                setkWatrStormAnyShow(position);
                isShowEchar = false;
            }
            if (menuStatus == '风暴潮场景库') {
                stormPlayStormProduceShow(0, 0, longitude, latitude);
                setkWatrStormAnyShow(position);
                isShowEchar = false;
            }

            // pickEnd = new Cesium.Cartesian2(position.x + 10, position.y - 10);
            // cartesianEnd = viewer.scene.globe.pick(viewer.camera.getPickRay(pickEnd), viewer.scene);
            // cartographic = Cesium.Cartographic.fromCartesian(cartesianEnd);
            // longitude = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(5));
            // latitude = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(5));
            // stormCartesian = cartesianEnd;
            // stormPosition = { x: position.x, y: position.y };

            // var imgEnd = viewer.entities.getById('imgEnd');
            // if (imgEnd) {
            //     imgEnd.position = cartesianEnd;
            // } else {
            //     var imgSrc = './images/end.png';
            //     addBillboard('imgEnd', 'imgEnd', 'imgEnd', longitude, latitude, imgSrc, 1);
            // }

            // isShowEchar = false;
        }
    }
    if (isShowEchar) {
        viewer.entities.removeById('imgEnd');
        // 水情专题大屏风暴潮预报播放
        forecastPlayStormProduceHide();
        // 水情专题大屏最高水位
        forecastPlayMaxWaterProduceHide();
        // 预报订正风暴潮
        hideArbitrarilyEchart();
        // 风暴潮场景库任意点折线图
        stormPlayStormProduceHide();

        stormCartesian = undefined;
    }
}

function setkWatrStormAnyShow(position) {
    var pickEnd = new Cesium.Cartesian2(position.x + 10, position.y - 10);
    var cartesianEnd = viewer.scene.globe.pick(viewer.camera.getPickRay(pickEnd), viewer.scene);
    var cartographic = Cesium.Cartographic.fromCartesian(cartesianEnd);
    var longitude = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(5));
    var latitude = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(5));
    stormCartesian = cartesianEnd;
    // console.log(stormCartesian)
    stormPosition = { x: position.x, y: position.y };

    var imgEnd = viewer.entities.getById('imgEnd');
    if (imgEnd) {
        imgEnd.position = cartesianEnd;
    } else {
        var imgSrc = './images/end.png';
        addBillboard('imgEnd', 'imgEnd', 'imgEnd', longitude, latitude, imgSrc, 1);
    }
}

/**
 * 风暴潮折线图位置
 */
function stromLinePosition() {
    if (stormCartesian) {
        if (stormPosition !== stormPosition2) {
            stormPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, stormCartesian);
            if (menuStatus == '水情专题大屏' && waterProjectMenuListStatus == '水位预报') {
                var popw = 866;
                var poph = 454;
                var innerH = document.documentElement.clientHeight || document.body.clientHeight;
                var left = stormPosition2.x - (popw / 2) - 25;
                var top;
                if (stormPosition2.y + poph > innerH) {
                    top = stormPosition2.y - poph - 20;
                } else {
                    top = stormPosition2.y;
                }
                // if (waterTitle == '风暴潮预报') {
                //     forecastPlayStormProducePosition(left, top);
                // }
                if (waterTitle == '最高水位') {
                    forecastPlayMaxWateProducerPosition(left, top);
                } else {
                    forecastPlayStormProducePosition(left, top);
                }
            }
            if (menuStatus == '预报订正') {
                var popw = $('.arbitrarilyPoint').eq(0).width();
                var poph = $('.arbitrarilyPoint').eq(0).height();

                var left = stormPosition2.x - (popw / 2) - 15;
                var top;
                if (stormPosition2.y - poph > 0) {
                    top = stormPosition2.y - poph;
                } else {
                    top = stormPosition2.y + 70 + 20;
                }
                arbitrarilyEchartPosition(left, top);
            }
            if (menuStatus == '风暴潮场景库') {
                var popw = $('#stormProduceStormForecastHistory').eq(0).width();
                var poph = $('#stormProduceStormForecastHistory').eq(0).height();

                var left = stormPosition2.x - (popw / 2) - 26;
                var top = stormPosition2.y - poph + 70;
                stormPlayStormProducePosition(left, top);
            }
        }
    }
}

loadEmbankmentLine();
/**
 * 加载岸堤线数据
 */
// var dataSourceEmbankmentLine = {
//     1: new Cesium.DataSourceCollection(),
//     2: new Cesium.DataSourceCollection(),
//     3: new Cesium.DataSourceCollection(),
//     4: new Cesium.DataSourceCollection(),
//     5: new Cesium.DataSourceCollection(),
//     6: new Cesium.DataSourceCollection(),
//     7: new Cesium.DataSourceCollection(),
//     8: new Cesium.DataSourceCollection(),
//     9: new Cesium.DataSourceCollection(),
//     10: new Cesium.DataSourceCollection(),
//     11: new Cesium.DataSourceCollection(),
//     12: new Cesium.DataSourceCollection(),
//     13: new Cesium.DataSourceCollection(),
//     14: new Cesium.DataSourceCollection(),
// }
var dataSourceEmbankmentLine = new Cesium.DataSourceCollection();
var entityEmbankmentWarnLine = []; // 显示的漫堤数据集合
var embankmentWarnLine = {}; // 显示的漫堤数据id集合
function loadEmbankmentLine() {
    var options = {
        // clampToGround: true // 开启贴地
    };
    var loadThenZhanJiang = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/ZhanJiang.json', options)
    loadThenZhanJiang.then(function (dataSource) {
        dataSource.name = '1';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[1].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '1_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenMaoMing = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/MaoMing.json', options)
    loadThenMaoMing.then(function (dataSource) {
        dataSource.name = '2';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[2].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '2_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenYangJiang = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/YangJiang.json', options)
    loadThenYangJiang.then(function (dataSource) {
        dataSource.name = '3';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[3].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '3_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenJiangMen = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/JiangMen.json', options)
    loadThenJiangMen.then(function (dataSource) {
        dataSource.name = '4';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[4].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '4_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenZhuHai = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/ZhuHai.json', options)
    loadThenZhuHai.then(function (dataSource) {
        dataSource.name = '5';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[5].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '5_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenZhongShan = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/ZhongShan.json', options)
    loadThenZhongShan.then(function (dataSource) {
        dataSource.name = '6';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[6].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '6_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenGuangZhou = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/GuangZhou.json', options)
    loadThenGuangZhou.then(function (dataSource) {
        dataSource.name = '7';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[7].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '7_' + entity.properties.NO._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenDongGuan = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/DongGuan.json', options)
    loadThenDongGuan.then(function (dataSource) {
        dataSource.name = '8';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[8].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '8_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenShenZhen = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/ShenZhen.json', options)
    loadThenShenZhen.then(function (dataSource) {
        dataSource.name = '9';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[9].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '9_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenHuiZhou = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/HuiZhou.json', options)
    loadThenHuiZhou.then(function (dataSource) {
        dataSource.name = '10';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[10].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '10_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenShanWei = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/ShanWei.json', options)
    loadThenShanWei.then(function (dataSource) {
        dataSource.name = '11';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[11].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '11_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenJieYang = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/JieYang.json', options)
    loadThenJieYang.then(function (dataSource) {
        dataSource.name = '12';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[12].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '12_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenShanTou = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/ShanTou.json', options)
    loadThenShanTou.then(function (dataSource) {
        dataSource.name = '13';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[13].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '13_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
    var loadThenChaoZhou = new Cesium.GeoJsonDataSource.load('./static/GeoJson/embankmentLine/ChaoZhou.json', options)
    loadThenChaoZhou.then(function (dataSource) {
        dataSource.name = '14';
        viewer.dataSources.add(dataSource);
        // dataSourceEmbankmentLine[14].add(dataSource);
        dataSourceEmbankmentLine.add(dataSource);
        var polylineEntities = dataSource.entities.values;
        for (var i in polylineEntities) {
            var entity = polylineEntities[i];
            var enId = '14_' + entity.properties.ID._value.toString();
            entity.enId = enId;
            embankmentWarnLine[enId] = entity.id
            entity.name = 'EmbankmentLine';
            entity.polyline.width = 3;
            entity.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
            entity.show = false;
        }
    });
}

/**
 * 漫堤常规预报
 * @param agency 【1：央视（CCTV），2：美国（USA），3：台湾(Taiwan)，4：日本（Japan）】
 * @param time 秒级时间戳
 * @param cityId 城市ID
 * @param warnType 预警类型，1：漫堤预警，2：重现期预警
 * @param typhoonNumber 台风编号【风暴潮场景库使用，非必须】
 */
function setNormalEmbankmentLineByTime(agency, time, cityId, warnType, typhoonNumber) {
    var params;
    if (menuStatus == '风暴潮场景库') {
        params = {
            agency: agency,
            time: time,
            cityId: cityId,
            warnType: warnType,
            typhoonNumber: typhoonNumber
        };
        typhoonSelectObjectStorm[typhoonNumber].ByTimerShaftDrawTyphoon(time);//台风绘制根据时间戳
    } else if(menuStatus == '水情专题大屏'){
        params = {
            agency: agency,
            time: time,
            cityId: cityId,
            warnType: warnType
        };
        var typhoonCurrentNumber = $("#typhoonSelectWater").find("option:selected").val();
        waterProjectCurrentObject[typhoonCurrentNumber].ByTimerShaftDrawTyphoon(time);
    }else{
        params = {
            agency: agency,
            time: time,
            cityId: cityId,
            warnType: warnType
        };
    }
    $ajax('/web/opendap/netcdf/normal/dike/forecast', params, function (res) {
        // setTimeout(updateEmbankmentLineColor, 1000, res.data);
        setTimeout(function(){
            updateEmbankmentLineColor(res.data, params);
        },200);
    })
}
// setNormalEmbankmentLineByTime(1, 1600444800);

/**
 * 漫堤集合预报
 * @param ensemble 集合预报类型【1：中国  2：偏左   3：偏右  4：偏快  5：偏慢】
 * @param time 秒级时间戳
 * @param cityId 城市ID
 * @param warnType 预警类型，1：漫堤预警，2：重现期预警
 */
function setEnsembleEmbankmentLineByTime(ensemble, time, cityId, warnType) {
    var params = {
        ensemble: ensemble,
        time: time,
        cityId: cityId,
        warnType: warnType
    };
    $ajax('/web/opendap/netcdf/ensemble/dike/forecast', params, function (res) {
        // setTimeout(updateEmbankmentLineColor, 1000, res.data);
        setTimeout(function(){
            updateEmbankmentLineColor(res.data, params);
        },200);
    })
}

/**
 * 漫堤线显示设置
 * @param warnType 预警类型，1：漫堤预警，2：重现期预警
 */
function showEmbankmentLine(warnType) {
    switch(warnType) {
        case 1:
            if (menuStatus == '水情专题大屏') {
                waterTitle = '漫堤风险预警';
            } else {
                waterTitle = '漫堤预报';
            }
            break;
        case 2:
            waterTitle = '防洪水位预警';
            break;
        default:
            if (menuStatus == '水情专题大屏') {
                waterTitle = '漫堤风险预警';
            } else {
                waterTitle = '漫堤预报';
            }
            break;
    }
    // showRiver(false);
    $ajax('/web/opendap/netcdf/dike/all', { warnType: warnType }, function(res) {
        if(res.code == 200) {
            // console.log(res.data);
            // console.log(embankmentWarnLine);
            var lineData = res.data;
            for (var i = 0; i < lineData.length; i++) {
                var lineIdArr = lineData[i];
                var lineId = lineIdArr.cityId + '_' + lineIdArr.dikeId;
                var dataSource = dataSourceEmbankmentLine.getByName(lineIdArr.cityId.toString())[0];
                dataSource.show = true;
                var entityId = embankmentWarnLine[lineId];
                var entities = dataSource.entities.getById(entityId);
                if (entities) {
                    entities.show = true;
                    if(lineIdArr.dikeName) {
                        entities.dikeName = lineIdArr.dikeName;
                        // console.log(entities);
                    }
                    if(lineIdArr.defenseStandards) {
                        entities.defenseStandards = lineIdArr.defenseStandards;
                        // console.log(entities.defenseStandards);
                    }
                }
            }
        }
    })
}

/**
 * 设置堤岸线颜色
 * @param data
 * @param params 请求参数
 */
function updateEmbankmentLineColor(data, params) {
    // console.log(data);
    for(var j = 0; j < entityEmbankmentWarnLine.length; j++) {
        var entityDisplay = entityEmbankmentWarnLine[j];
        entityDisplay.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
    }
    entityEmbankmentWarnLine = [];
    for (var i in data) {
        var entityId = embankmentWarnLine[i];
        var cityId = i.split('_')[0];
        var dataSource = dataSourceEmbankmentLine.getByName(cityId.toString())[0];
        var entities = dataSource.entities.getById(entityId);
        var warnType = data[i].warnType;
        var material;
        switch (warnType) {
            // case 0:
            //     material = Cesium.Color.fromCssColorString('#60cd05');
            //     break;
            case 1:
                material = Cesium.Color.fromCssColorString('#FFF137');
                break;
            case 2:
                material = Cesium.Color.fromCssColorString('#EC4040');
                break;
            default:
                material = Cesium.Color.fromCssColorString('#60cd05');
                break;
        }
        entities.polyline.material = material;
        entityEmbankmentWarnLine.push(entities);
    }
    
    var lastTime = timeIntegerAlgorithm(viewerTy.clockViewModel.currentTime) * 1000
    var currentTime = lastTime + 3600 * 1000
    viewerTy.clockViewModel.currentTime = Cesium.JulianDate.fromDate(new Date(currentTime))
    if (currentTime > stopTime) {
        $(".stop").click();
    } else {
        if (!$(".stop").hasClass('play')) {
            if(params.agency) {
                if(params.typhoonNumber) {
                    setNormalEmbankmentLineByTime(params.agency, currentTime, params.cityId, params.warnType, params.typhoonNumber)
                } else {
                    setNormalEmbankmentLineByTime(params.agency, currentTime, params.cityId, params.warnType)
                }
            }
            if(params.ensemble) {
                setEnsembleEmbankmentLineByTime(params.ensemble, currentTime, params.cityId, params.warnType)
            }
            // setNormalEmbankmentLineByTime(1, currentTime);
        }
    }
}

function timeIntegerAlgorithm(currenttime) {
    var currentDate = Cesium.JulianDate.toDate(currenttime)
    var currentDate_Year = currentDate.getYear() + 1900
    var currentDate_Month = currentDate.getMonth() + 1
    var currentDate_Date = currentDate.getDate()
    var currentDate_Hours = currentDate.getHours()
    var currentDate_Minutes = currentDate.getMinutes()
    // var currentDate_Seconds = currentDate.getSeconds()
    if (currentDate_Minutes > 30) {
        currentDate_Hours++
    }
    var currentTimeGB = currentDate_Year + '/' + currentDate_Month + '/' + currentDate_Date + ' ' + currentDate_Hours + ':00:00'
    var currentTimetest_value = moment(new Date(currentTimeGB)).format('YYYY-MM-DD HH:mm')
    var currentTimetestMide = Date.parse(currentTimetest_value)
    var currentTimetest = currentTimetestMide
    return currentTimetest / 1000
}

/**
 * 删除堤岸线数据
 */
function deleteEmbankmentLine() {
    for (var i = 0; i < dataSourceEmbankmentLine.length; i++) {
        var dataSource = dataSourceEmbankmentLine.get(i);
        // viewer.dataSources.remove(dataSource, true);
        dataSource.show = false;
        var entities = dataSource.entities.values;
        for (var k = 0; k < entities.length; k++) {
            var lineEntity = entities[k];
            lineEntity.show = false;
        }
    }
    if(entityEmbankmentWarnLine) {
        for(var j = 0; j < entityEmbankmentWarnLine.length; j++) {
            var entityDisplay = entityEmbankmentWarnLine[j];
            entityDisplay.polyline.material = Cesium.Color.fromCssColorString('#60cd05');
        }
    }
    // dataSourceEmbankmentLine = dataSourceEmbankmentLine && dataSourceEmbankmentLine.destroy();
}

function loadTestKMZ() {
    var optionsKMZ = {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas
    };
    // var dataColle = new Cesium.DataSourceCollection('dataColle');
    var arrTest = [];
    for (var i = 0; i < 72; i++) {
        var url = './static/kmz/' + i.toString() + '.kmz';
        var load = Cesium.KmlDataSource.load(url, optionsKMZ);
        load.then(function (dataSource) {
            // dataSource.show = false;
            console.log(dataSource)
        });
        arrTest.push(load);
        // viewer.dataSources.add(load);
        // dataColle.add(load);
    }
    console.log(arrTest);
    // 设置viewer不停循环删除添加arrTest里面的data，试试这样能不能流畅
    // 再试试TaskProcessor => webworker
    var count = 0;
    var timer;
    (function set() {
        timer = setTimeout(function () {
            console.log(count);
            if (count == 72) {
                clearTimeout(timer);
                return;
            }
            var data = arrTest[count];
            viewer.dataSources.add(data);
            if ((count - 1) >= 0) {
                viewer.dataSources.remove(arrTest[count - 1], true);
            }
            count++;
            set();
        }, 200)
    })();
    // viewer.dataSources.add(dataColle);
    // var load = Cesium.KmlDataSource.load('./static/kmz/0.kmz', optionsKMZ);
    // viewer.dataSources.add(load);
}
// loadTestKMZ()

/**
 * 漫堤线段点击折线图
 * @param {*} pick 
 * @param {*} position 
 */
function clickEmbankmentLine(pick, position) {
    var inClick = false;
    forecastPlayDamProduceHide();
    produceDamForecastChartHide();
    stormPlayStormDamProduceHide();
    forecastPlayFloodProduceHide();
    produceFloodForecastChartHide();
    stormPlayStormFloodProduceHide();
    if(pick && pick.id && pick.id.name && pick.id.name === 'EmbankmentLine') {
        var lineId = pick.id.enId;
        var idArr = lineId.split('_');
        var cartesianEnd = viewer.scene.globe.pick(viewer.camera.getPickRay(position), viewer.scene);
        if(cartesianEnd) {
            EmbankmentCartesian = cartesianEnd;
            EmbankmentPosition = {x: position.x, y: position.y};
            var cartographic = Cesium.Cartographic.fromCartesian(cartesianEnd);
            longitude = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(5));
            latitude = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(5));
            
            if(menuStatus == '水情专题大屏' && waterProjectMenuListStatus == '水位预报') {
                if(waterTitle == '漫堤风险预警') {
                    forecastPlayDamProduceShow(idArr[0], idArr[1], position.x, position.y, longitude, latitude);
                }
                if(waterTitle == '防洪水位预警') {
                    forecastPlayFloodProduceShow(idArr[0], idArr[1], position.x, position.y, longitude, latitude);
                }
            }
            if(menuStatus == '预报订正') {
                if(waterTitle == '漫堤预报') {
                    produceDamForecastChartShow(idArr[0], idArr[1], position.x, position.y, longitude, latitude);
                }
                if(waterTitle == '防洪水位预警') {
                    produceFloodForecastChartShow(idArr[0], idArr[1], position.x, position.y, longitude, latitude);
                }
            }
            if(menuStatus == '风暴潮场景库') {
                if(waterTitle == '漫堤预报') {
                    stormPlayStormDamProduceShow(idArr[0], idArr[1], position.x, position.y, longitude, latitude);
                }
                if(waterTitle == '防洪水位预警') {
                    stormPlayStormFloodProduceShow(idArr[0], idArr[1], position.x, position.y, longitude, latitude);
                }
            }
        }
        inClick = true;
    }
    return inClick
}

/**
 * 漫堤线段折线图位置
 */
function embankmentLinePosition() {
    if(EmbankmentCartesian) {
        if(EmbankmentPosition != EmbankmentPosition2) {
            EmbankmentPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, EmbankmentCartesian);
            var poph = 454;
            var popw = 866;
            var left;
            var top;
            if(menuStatus == '水情专题大屏' && waterProjectMenuListStatus == '水位预报') {
                left = EmbankmentPosition2.x - (popw / 2) - 15;
                top = EmbankmentPosition2.y - 15;
                if(waterTitle == '漫堤风险预警') {
                    forecastPlayDamProducePosition(left, top);
                }
                if(waterTitle == '防洪水位预警') {
                    forecastPlayFloodProducePosition(left, top);
                }
            }
            if(menuStatus == '预报订正') {
                left = EmbankmentPosition2.x - (popw / 2) - 15;
                if(EmbankmentPosition2.y - poph > 0) {
                    top = EmbankmentPosition2.y - poph + 70;
                } else {
                    top = EmbankmentPosition2.y + 40;
                }
                if(waterTitle == '漫堤预报') {
                    produceDamForecastChartPosition(left, top);
                }
                if(waterTitle == '防洪水位预警') {
                    produceFloodForecastChartPosition(left, top);
                }
            }
            if(menuStatus == '风暴潮场景库') {
                left = EmbankmentPosition2.x - (popw / 2) - 15;
                top = EmbankmentPosition2.y + 65;
                if(waterTitle == '漫堤预报') {
                    stormPlayStormDamProducePosition(left, top);
                }
                if(waterTitle == '防洪水位预警') {
                    stormPlayStormFloodProducePosition(left, top);
                }
            }
        }
    }
}

/**
 * 漫堤悬停样式
 * @param {*} pick 
 * @param {*} endPosition 
 */
function mouseMoveEmbankmentLine(pick, endPosition) {
    if(pick && pick.id && pick.id.name && pick.id.name === 'EmbankmentLine') {
        document.getElementById("cesiumContainer").style.cursor = "url(resource/pic/icons/magnifier3.cur) 12 12,pointer";
        var showText = '';
        if(pick.id.dikeName) {
            showText = pick.id.dikeName;
        }
        if(pick.id.defenseStandards) {
            showText = showText + '（' +pick.id.defenseStandards + '）';
        }
        if(showText != '') {
            var position;
            var cartesianStation;
            var ray = viewer.scene.camera.getPickRay(endPosition);
            if (ray) {
                position = viewer.scene.globe.pick(ray, viewer.scene);
            }
            if (position) {
                cartesianStation = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            }
            if (cartesianStation) {
                var height = viewer.scene.globe.getHeight(cartesianStation) + 70;
                labelEmbankmentLine.position = Cesium.Cartesian3.fromDegrees(cartesianStation.longitude / Math.PI * 180, cartesianStation.latitude / Math.PI * 180, height);
                labelEmbankmentLine.label.show = true;
                labelEmbankmentLine.label.text = showText;
            }
            
        } else {
            labelEmbankmentLine.label.show = false;
        }
    } else {
        labelEmbankmentLine.label.show = false;
        document.getElementById("cesiumContainer").style.cursor = "url(resource/pic/icons/magnifier3.cur) 12 12,default";
    }
}

var tyLightPoint;
var nawTynuber;
/**
 * 鼠标点击时间轴，根据时间设置台风高亮点
 * @param {时间点} timeLineTime 
 */
function setTyphoonLightPointByTime(timeLineTime) {
    if (menuStatus == '风暴潮场景库' && timeLineTime) {
        // var params = {
        //     typhoonNumber: typhoonSelectIdStorm,
        //     time: timeLineTime
        // }
        // $ajax('/web/typhoon/point/lng/lat', params, function (res) {
        //     if(res.code == 200){
        //         var data = res.data;
        //         var lat = parseFloat(data.lat);
        //         var lng = parseFloat(data.lng);
        //         if(tyLightPoint) {
        //             tyLightPoint.position = Cesium.Cartesian3.fromDegrees(parseFloat(lng), parseFloat(lat));
        //         } else {
        //             tyLightPoint = viewer.entities.add({
        //                 id: 'tyLightPoint',
        //                 name: 'tyLightPoint',
        //                 position: Cesium.Cartesian3.fromDegrees(parseFloat(lng), parseFloat(lat)),
        //                 billboard: {
        //                     image: '../static/img/typhoonimage/Typhoon_Wind_Circle_Seven_image.png',
        //                     scale: 1
        //                 },
        //                 billboardName: 'tyLightPoint'
        //             })
        //         }
        //         nawTynuber = typhoonSelectIdStorm;
        //     }
        // })
        setTimeout(() => {
            typhoonSelectObjectStorm[typhoonSelectIdStorm].ByTimerShaftDrawTyphoon(timeLineTime);//根据时间轴调整台风
        }, 1000);
    }else if(menuStatus == '水情专题大屏' && timeLineTime){
        var typhoonCurrentNumber = $("#typhoonSelectWater").find("option:selected").val();
        setTimeout(() => {
            waterProjectCurrentObject[typhoonCurrentNumber].ByTimerShaftDrawTyphoon(timeLineTime);
        }, 1000);
    }
}

/**
 * 删除台风高亮点
 */
function removeTyphoonLightPoint() {
    if((menuStatus != '风暴潮场景库' || nawTynuber != typhoonSelectIdStorm) && tyLightPoint) {
        viewer.entities.remove(tyLightPoint);
        tyLightPoint = null;
    }
}

// var optionsTest = {
//     camera : viewer.scene.camera,
//     canvas : viewer.scene.canvas
//   }
//   var url01 = './static/0(3).kmz'
//   viewer.dataSources.add(Cesium.KmlDataSource.load(url01, optionsTest))

// var temptureLayer = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
//     url: './static/66.png',
//     // rectangle: new Cesium.Rectangle(
//     //     Cesium.Math.toRadians(parseFloat(105)),
//     //     Cesium.Math.toRadians(parseFloat(13)),
//     //     Cesium.Math.toRadians(parseFloat(128)),
//     //     Cesium.Math.toRadians(parseFloat(28))
//     //   )
//       rectangle: new Cesium.Rectangle.fromDegrees(105, 13, 128, 28)
// }));
// temptureLayer.alpha = 1;
// showRiver(false)