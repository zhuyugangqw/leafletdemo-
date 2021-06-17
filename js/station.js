// 站点显示数据集合
var stationObj = {};
// 鼠标点中的站点对象
var clickStation;
// 鼠标悬停时显示的lable
var labelStation = viewer.entities.add({
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
// 弹窗位置监听用到的参数
var staPosition, staPosition2, staCartesian;
// 小弹窗位置监听参数
var Worlds, Positions, Positions2;

/**
 * 加载台风历史增水地图站点
 * @param number 台风编号
 */
function loadStaionListHistory(number) {
    removeStationList();
    Worlds = [];
    Positions = [];
    Positions2 = [];
    $ajax('/web/station/map/list/history', {number: number.toString()}, function (res) {
        // console.log(res);
        viewer.camera.flyTo({
            duration: 1.0,
            destination: Cesium.Cartesian3.fromDegrees(113.713664, 22.670833, 200000.0),
            complete: function () {
                var stationListData = res.data;
                for(var i in stationListData) {
                    if(!stationListData.hasOwnProperty(i)) {
                        continue;
                    }
                    var stationLevel = stationListData[i].stationLevel;
                    var stationList = stationListData[i].stationList;
                    updateStation(stationList, stationLevel);
                }
                // updateStation(stationList);
            }
        })
    })

}

/**
 * 根据状态码返回获取站点图标
 * @param type 状态码
 * @param isWarn 是否超警
 * @returns {string}
 */
function getStationImgByType(type, isWarn) {
    var img = '';
    switch (type) {
        case 0:// 潮位站
            if (isWarn === true) {
                img = './images/tide_station_isWarn.png';
            } else {
                img = './images/tide_station.png';
            }
            break;
        case 1:// 水文站
            if (isWarn === true) {
                img = './images/hydrological_station_isWarn.png';
            } else {
                img = './images/hydrological_station.png';
            }
            break;
        case 2:// 水位站
            if (isWarn === true) {
                img = './images/water_level_station_isWarn.png';
            } else {
                img = './images/water_level_station.png';
            }
            break;
        case 3:// 水库
            if (isWarn === true) {
                img = './images/reservoir_isWarn.png';
            } else {
                img = './images/reservoir.png';
            }
            break;
    }
    return img
}

/**
 * 切换站点的选中图标
 * @param imgUrl
 * @returns {string}
 */
function stationSelectImg (imgUrl) {
    switch (imgUrl) {
        case './images/hydrological_station_isWarn.png':
            imgUrl = './images/hydrological_station_isWarn_selected.png';
            break;
        case './images/hydrological_station.png':
            imgUrl = './images/hydrological_station_selected.png';
            break;
        case './images/tide_station_isWarn.png':
            imgUrl = './images/tide_station_isWarn_selected.png';
            break;
        case './images/tide_station.png':
            imgUrl = './images/tide_station_selected.png';
            break;
        case './images/water_level_station.png':
            imgUrl = './images/water_level_station_selected.png';
            break;
        case './images/water_level_station_isWarn.png':
            imgUrl = './images/water_level_station_isWarn_selected.png';
            break;
        case './images/reservoir.png':
            imgUrl = './images/reservoir_selected.png';
            break;
        case './images/reservoir_isWarn.png':
            imgUrl = './images/reservoir_isWarn_selected.png';
            break;
    }
    return imgUrl
}

/**
 * 切换站点的未选中图标
 * @param imgUrl
 * @returns {string}
 */
function stationNormalImg (imgUrl) {
    switch (imgUrl) {
        case './images/hydrological_station_isWarn_selected.png':
            imgUrl = './images/hydrological_station_isWarn.png';
            break;
        case './images/hydrological_station_selected.png':
            imgUrl = './images/hydrological_station.png';
            break;
        case './images/tide_station_isWarn_selected.png':
            imgUrl = './images/tide_station_isWarn.png';
            break;
        case './images/tide_station_selected.png':
            imgUrl = './images/tide_station.png';
            break;
        case './images/water_level_station_selected.png':
            imgUrl = './images/water_level_station.png';
            break;
        case './images/water_level_station_isWarn_selected.png':
            imgUrl = './images/water_level_station_isWarn.png';
            break;
        case './images/reservoir_selected.png':
            imgUrl = './images/reservoir.png';
            break;
        case './images/reservoir_isWarn_selected.png':
            imgUrl = './images/reservoir_isWarn.png';
            break;
    }
    return imgUrl
}

/**
 * 监听高度显示站点
 */
function showStationByHight() {
    var height = viewer.camera.positionCartographic.height;
    var heightStation = 1000000;
    // 判断高度
    if (height < heightStation) {
        // 显示
        isShowStation(true, height);
        // 历史增水弹窗
        if (menuStatus == '台风路径' && typhoonPathMenu != '台风计算') {
            historyInfoShow(true, height);
            // 历史增水小弹窗位置监听
            historyInfoPosition()
        } else {
            historyInfoShow(false);
        }
        // 预报订正
        if (menuStatus != '预报订正') {
            hideMapEchart();
        }
        if (menuStatus != '风暴潮场景库') {
            stormStationHistoryHide();
        }
        // 水情专题潮位站弹窗
        if (menuStatus == '水情专题大屏' && waterProjectMenuStatus == '潮位') {
            tideStationInfoShow(true, height);
            // 小弹窗位置监听
            tideStationPosition()
        } else {
            tideStationInfoShow(false);
        }
        // 水情专题站点预测
        if (!(menuStatus == '水情专题大屏' && waterProjectMenuListStatus == '站点预测')) {
            waterStationProduceDataHide();
        }
    } else {
        // 不显示
        isShowStation(false, height);
        historyInfoShow(false);
        tideStationInfoShow(false);
        // 预报订正折线图
        hideMapEchart();
        // 站点预测折线图
        waterStationProduceDataHide();
        // 风暴潮场景库站点折线图
        stormStationHistoryHide();
    }
}

/**
 * 设置站点是否显示
 * @param isShow Boolean
 */
function isShowStation(isShow, height) {
    for (var id in stationObj) {
        var stationEntity = viewer.entities.getById(id);
        if (stationEntity) {
            if (stationObj[id].show) {
                switch(stationObj[id].stationLevel) {
                    case 1:
                        if(height >= 0) {
                            stationEntity.show = isShow;
                        } else {
                            stationEntity.show = false;
                        }
                        break;
                    case 2:
                        if(height <= 250000) {
                            stationEntity.show = isShow;
                        } else {
                            stationEntity.show = false;
                        }
                        break;
                    case 3:
                        if(height <= 130000) {
                            stationEntity.show = isShow;
                        } else {
                            stationEntity.show = false;
                        }
                        break;
                    case 4:
                        if(height <= 55000) {
                            stationEntity.show = isShow;
                        } else {
                            stationEntity.show = false;
                        }
                        break;
                    default:
                        stationEntity.show = isShow;
                        break;
                }
                // stationEntity.show = isShow;
            } else {
                stationEntity.show = false;
            }
        }
    }
}

/**
 * 更新站点信息
 * @param stationData
 * @param stationLevel
 */
function updateStation(stationData, stationLevel) {
    var newNumber = [];
    for(var key in stationData) {
        if (!stationData.hasOwnProperty(key)){
            continue;
        }
        newNumber.push(stationData[key].stationNumber);
        var imgSrc = getStationImgByType(stationData[key].stationType, stationData[key].overWarnFlag);
        var highestLevel = '--';
        if (stationData[key].highestLevel) {
            highestLevel = stationData[key].highestLevel;
        }
        if (stationData[key].level) {
            highestLevel = stationData[key].level;
        }
        var labelText = stationData[key].stationName + '  ' + highestLevel + '米';
        // 已经加载，则更新状态
        if (stationObj[stationData[key].stationNumber]) {
            var stationEntity = viewer.entities.getById(stationData[key].stationNumber);
            if (stationEntity) {
                stationObj[stationData[key].stationNumber].show = true;
                if (stationObj[stationData[key].stationNumber].selected) {
                    imgSrc = stationSelectImg(imgSrc)
                }
                stationEntity.billboard.image = imgSrc;
                stationEntity.billboardName = labelText;

                stationObj[stationData[key].stationNumber].stationLevel = stationLevel;
            }
            continue;
        }

        addBillboard(stationData[key].stationNumber, '站点', labelText, stationData[key].lng, stationData[key].lat, imgSrc, 1);

        stationObj[stationData[key].stationNumber] = {
            stationName: stationData[key].stationName,
            longitude: stationData[key].lng,
            latitude: stationData[key].lat,
            show: true,
            selected: false,
            stationLevel: stationLevel
        }
        // 小弹窗显示设置
        if ((menuStatus == '台风路径') || (menuStatus == '水情专题大屏' && waterProjectMenuStatus == '潮位')) {
            var world = Cesium.Cartesian3.fromDegrees(stationData[key].lng, stationData[key].lat);
            var screenLocation = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, world);
            var leftX = screenLocation.x;
            var topY = screenLocation.y;
            // 历史增水
            if (menuStatus == '台风路径') {
                switch(stationLevel) {
                    case 1:
                        historySurgePopInfoShowLevelOne(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        historySurgePopInfoHideLevelOne();
                        break;
                    case 2:
                        historySurgePopInfoShowLevelTwo(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        historySurgePopInfoHideLevelTwo();
                        break;
                    case 3:
                        historySurgePopInfoShowLevelThree(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        historySurgePopInfoHideLevelThree();
                        break;
                    case 4:
                        historySurgePopInfoShowLevelFour(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        historySurgePopInfoHideLevelFour();
                        break;
                    default:
                        
                        break;
                }
                // historySurgePopInfoShow(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                // historySurgePopInfoHide();
            }
            // 水情专题潮位站
            if (menuStatus == '水情专题大屏' && waterProjectMenuStatus == '潮位') {
                switch(stationLevel) {
                    case 1:
                        waterProjectTideInfoShowLevelOne(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        waterProjectTideInfoHideLevelOne();
                        break;
                    case 2:
                        waterProjectTideInfoShowLevelTwo(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        waterProjectTideInfoHideLevelTwo();
                        break;
                    case 3:
                        waterProjectTideInfoShowLevelThree(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        waterProjectTideInfoHideLevelThree();
                        break;
                    case 4:
                        waterProjectTideInfoShowLevelFour(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                        waterProjectTideInfoHideLevelFour();
                        break;
                    default:
                        
                        break;
                }
                // waterProjectTideInfoShow(leftX, topY, stationData[key].stationName, stationData[key].time, stationData[key].highestLevel);
                // waterProjectTideInfoHide();
            }
            Worlds.push(world);
            var Location = {x: screenLocation.x, y: screenLocation.y}
            Positions.push(Location);
        }
    }
    // 多余站点隐藏
    // for (var id in stationObj) {
    //     if (!stationObj.hasOwnProperty(id)){
    //         continue;
    //     }
    //     var index = newNumber.indexOf(parseInt(id));
    //     if (index < 0) {
    //         stationObj[id].show = false;
    //     }
    // }
    // console.log(stationObj);
}

/**
 * 清除所有站点
 */
function removeStationList() {
    for (var id in stationObj) {
        if (!stationObj.hasOwnProperty(id)){
            continue;
        }
        viewer.entities.removeById(id)
    }
    stationObj = {}
}

/**
 * 站点悬停信息栏
 * @param drillPick
 * @param endPosition
 */
function mouseMoveStation(drillPick, endPosition) {
    for(var i = 0; i < drillPick.length; i++){
        var pick = drillPick[i]
        if (pick && pick.id && pick.id.name && pick.id.name === '站点') {
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
                labelStation.position = Cesium.Cartesian3.fromDegrees(cartesianStation.longitude / Math.PI * 180, cartesianStation.latitude / Math.PI * 180, height);
                labelStation.label.show = true;
                labelStation.label.text = pick.id.billboardName;
            }
        }
    }
    if(drillPick.length == 0){
        labelStation.label.show = false;
    }
}

/**
 * 站点点击
 * @param pick
 */
function stationClick(pick) {
    var inClick = false;
    if(clickStation && clickStation !== null) {
        if (stationObj[clickStation.id]) {
            stationObj[clickStation.id].selected = false;
        }
        var img = stationNormalImg(clickStation.billboard.image._value);
        clickStation.billboard.image = img;
        clickStation = null;
        // 历史增水折线图
        stationProduceAndTableHide();
        // 预报订正折线图
        hideMapEchart();
        // 水情专题潮位站折线图
        waterProjectTideProduceHide();
        // 水情专题站点预测折线图
        waterStationProduceDataHide();
        // 风暴潮场景库站点折线图
        stormStationHistoryHide();
    }
    if (pick && pick.id && pick.id.name && pick.id.name === '站点') {
        // var station = stationObj[pick.id.id];
        stationObj[pick.id.id].selected = true;
        clickStation = pick.id;
        var img = stationSelectImg(clickStation.billboard.image._value);
        clickStation.billboard.image = img;

        // 大折线图弹窗
        staCartesian = clickStation.position._value;
        var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(staCartesian);
        var centerLon = cartographic.longitude * 180 / Math.PI;
        var centerLat = cartographic.latitude * 180 / Math.PI;
        var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, staCartesian);
        staPosition = {x: picks.x, y: picks.y};
        var height = viewer.camera.positionCartographic.height;
        // 计算偏差
        var extent = getCurrentExtent();
        var latDeviation = 0;
        if (extent.ymin !== undefined) {
            var latMax = (extent.ymax).toFixed(6);
            var latMin = (extent.ymin).toFixed(6);
            var viewHeight = $('#cesiumContainer').height();
            latDeviation = (latMax - latMin) * (180 / viewHeight);
        }
        // if (menuStatus == '水情专题大屏' && (waterProjectMenuStatus == '潮位' || waterProjectMenuListStatus == '站点预测数据')) {
        //     latDeviation = 0;
        // }
        if (menuStatus == '水情专题大屏' && (waterProjectMenuStatus == '潮位')) {
            latDeviation = 0;
        }
        if (menuStatus == '水情专题大屏' && waterProjectMenuListStatus == '站点预测') {
            viewer.camera.flyTo({
                duration: 1.0,
                destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat-latDeviation, height),
                complete: function () {
                    if (clickStation) {// 暴力点击判断过滤
                        // 水情专题站点预测
                        waterStationProduceDataShow(parseInt(clickStation.id), picks.x, picks.y);
                    }
                }
            })
        } else {
            // 视角移动
            if (menuStatus == '风暴潮场景库') {
                viewer.camera.flyTo({
                    duration: 1.0,
                    destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat-latDeviation, height),
                    complete: function () {
                        if (clickStation) {// 暴力点击判断过滤
                            stormStationHistoryShow(parseInt(clickStation.id), picks.x, picks.y, centerLon, centerLat);
                            stormStationPredictTextByStationNum(parseInt(clickStation.id));
                        }
                    }
                })
            } else {
                viewer.camera.flyTo({
                    duration: 1.0,
                    destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat+latDeviation, height),
                    complete: function () {
                        if (clickStation) {// 暴力点击判断过滤
                            // 历史增水弹窗
                            if (menuStatus == '台风路径') {
                                stationProduceAndTableShow([parseInt(clickStation.id)], picks.x, picks.y, centerLon, centerLat);
                            }
                            // 预报订正
                            if (menuStatus == '预报订正') {
                                getMapEchart(clickStation.id);
                            }
                            // 水情专题潮位站
                            if (menuStatus == '水情专题大屏' && waterProjectMenuStatus == '潮位') {
                                waterProjectTideProduceShow([parseInt(clickStation.id)], picks.x, picks.y, centerLon, centerLat);
                            }
                        }
                    }
                })
            }
        }
        inClick = true;
    }
    return inClick
}

/**
 * 设置历史增水站点折线图、弹窗显示
 * @param isShow
 */
function historyInfoShow(isShow, height) {
    if (isShow) {
        // $(".sea_info_dialog").show();
        $(".sea_info_dialogLevelOne").show();
        if(height <= 250000) {
            $(".sea_info_dialogLevelTwo").show();
        } else {
            historySurgePopInfoHideLevelTwo();
        }
        if(height <= 130000) {
            $(".sea_info_dialogLevelThree").show();
        } else {
            historySurgePopInfoHideLevelThree();
        }
        if(height <= 55000) {
            $(".sea_info_dialogLevelFour").show();
        } else {
            historySurgePopInfoHideLevelFour();
        }
    } else {
        // 小弹窗
        // historySurgePopInfoHide();
        historySurgePopInfoHideLevelOne();
        historySurgePopInfoHideLevelTwo();
        historySurgePopInfoHideLevelThree();
        historySurgePopInfoHideLevelFour();
        // 折线图
        stationProduceAndTableHide();
    }
}

/**
 * 设置水情专题潮位站折线图、弹窗显示
 * @param isShow
 */
function tideStationInfoShow(isShow, height) {
    if (isShow) {
        $(".waterProjectTidePopLevelOne").show();
        if(height <= 250000) {
            $(".waterProjectTidePopLevelTwo").show();
        } else {
            waterProjectTideInfoHideLevelTwo();
        }
        if(height <= 130000) {
            $(".waterProjectTidePopLevelThree").show();
        } else {
            waterProjectTideInfoHideLevelThree();
        }
        if(height <= 55000) {
            $(".waterProjectTidePopLevelFour").show();
        } else {
            waterProjectTideInfoHideLevelFour();
        }
    } else {
        // 小弹窗
        // waterProjectTideInfoHide();
        waterProjectTideInfoHideLevelOne();
        waterProjectTideInfoHideLevelTwo();
        waterProjectTideInfoHideLevelThree();
        waterProjectTideInfoHideLevelFour();
        // 折线图
        waterProjectTideProduceHide();
    }
}

/**
 * 历史增水小弹窗位置监听
 */
function historyInfoPosition() {
    if (Positions) {
        for (var j = 0; j < Positions.length; j++) {
            if (Positions[j] !== Positions2[j]) {
                if (Worlds[j] !== undefined) {
                    Positions2[j] = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, Worlds[j]);
                    var change_leftX = Positions2[j].x - 73;
                    var change_topY = Positions2[j].y + 90;
                    historySurgePopPostion(change_leftX, change_topY, j);
                }
            }
        }
    }
}

/**
 * 水情专题潮位站小弹窗
 */
function tideStationPosition() {
    if (Positions) {
        for (var j = 0; j < Positions.length; j++) {
            if (Positions[j] !== Positions2[j]) {
                if (Worlds[j] !== undefined) {
                    Positions2[j] = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, Worlds[j]);
                    var change_leftX = Positions2[j].x - 99;
                    var change_topY = Positions2[j].y + 15;
                    waterProjectTideInfoPosition(change_leftX, change_topY, j);
                }
            }
        }
    }
}

/**
 * 站点折线图位置监听
 */
function stationTablePosition() {
    if (staCartesian) {
        if (staPosition !== staPosition2) {
            staPosition2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, staCartesian);
            // 历史增水弹窗
            if (menuStatus == '台风路径') {
                var popw = $('.typhoon-case').eq(0).width();
                var poph = $('.typhoon-case').eq(0).height();

                var left = staPosition2.x - (popw / 2) - 15;
                var top;
                if (staPosition2.y + 70 - poph - 24 > 0) {
                    top = staPosition2.y + 70 - poph - 24;
                } else {
                    top = staPosition2.y + 70 + 15;
                }
                stationProduceAndTablePosition(left, top);
            }
            // 预报订正
            if (menuStatus == '预报订正') {
                var popw = $('.forecastCorrectionNormalEchart').eq(0).width();
                var poph = $('.forecastCorrectionNormalEchart').eq(0).height();

                var left = staPosition2.x - (popw / 2) - 15;
                var top;
                if (staPosition2.y + 70 - poph - 60 > 0) {
                    top = staPosition2.y + 70 - poph - 60;
                } else {
                    top = staPosition2.y + 70 + 15;
                }
                setEchartsPosition(left, top);
            }
            // 水情专题潮位站折线图
            if (menuStatus == '水情专题大屏' && waterProjectMenuStatus == '潮位') {
                var popw = 866;
                var poph = 454;
                var innerH = document.documentElement.clientHeight || document.body.clientHeight;
                var left = staPosition2.x - (popw / 2) - 15;
                var top;
                if (staPosition2.y + poph > innerH) {
                    top = staPosition2.y - poph - 15;
                } else {
                    top = staPosition2.y;
                }
                waterProjectTideProducePosition(left, top);
            }
            // 水情专题站点预测
            if (menuStatus == '水情专题大屏' && waterProjectMenuListStatus == '站点预测') {
                var popw = 866;
                var poph = 454;
                var innerH = document.documentElement.clientHeight || document.body.clientHeight;
                var left = staPosition2.x - (popw / 2) - 15;
                var top;
                if (staPosition2.y + poph > innerH) {
                    top = staPosition2.y - poph - 15;
                } else {
                    top = staPosition2.y;
                }
                waterStationProduceDataPosition(left, top);
            }
            // 风暴潮场景库
            if (menuStatus == '风暴潮场景库') {
                var popw = 866;
                var poph = 440;
                var left = staPosition2.x - (popw / 2) - 15;
                var top = staPosition2.y + 70;
                stormStationHistoryPosition(left, top);
            }
        }
    }
}

/**
 * 加载预报订正地图站点
 */
function loadStationList() {
    viewer.camera.flyTo({
        duration: 1.0,
        destination: Cesium.Cartesian3.fromDegrees(113.517628, 23.353899, 1000000.0),
        complete: function () {
            removeStationList();
            $ajax('/web/station/map/list', {}, function (res) {
                var stationList = res.data;
                updateStation(stationList);
            })
        }
    })
}

/**
 * 视角看向站点位置
 * @param stationNumber
 */
function flyToStationByNum(stationNumber) {
    var height = viewer.camera.positionCartographic.height;
    var heightStation = 1000000;
    if (height > heightStation) {
        height = heightStation;
        viewer.camera.flyTo({
            duration: 1.0,
            destination: Cesium.Cartesian3.fromRadians(viewer.camera.positionCartographic.longitude, viewer.camera.positionCartographic.latitude, height),
            complete: function () {
                // 计算偏差
                var extent = getCurrentExtent();
                var latDeviation = 0;
                if (extent.ymin !== undefined) {
                    var latMax = (extent.ymax).toFixed(6);
                    var latMin = (extent.ymin).toFixed(6);
                    var viewHeight = $('#cesiumContainer').height();
                    latDeviation = (latMax - latMin) * (180 / viewHeight);
                }
                viewer.camera.flyTo({
                    duration: 1.0,
                    destination: Cesium.Cartesian3.fromDegrees(stationObj[stationNumber].longitude, parseFloat(stationObj[stationNumber].latitude)+latDeviation, height),
                });
                // getMapEchart(stationNumber);
                $('.forecastCorrectionNormalEchart').show();
            }
        });
    } else {
        // 计算偏差
        var extent = getCurrentExtent();
        var latDeviation = 0;
        if (extent.ymin !== undefined) {
            var latMax = (extent.ymax).toFixed(6);
            var latMin = (extent.ymin).toFixed(6);
            var viewHeight = $('#cesiumContainer').height();
            latDeviation = (latMax - latMin) * (180 / viewHeight);
        }
        viewer.camera.flyTo({
            duration: 1.0,
            destination: Cesium.Cartesian3.fromDegrees(stationObj[stationNumber].longitude, parseFloat(stationObj[stationNumber].latitude)+latDeviation, height),
        });
    }

    // 初始化弹窗位置参数
    staCartesian = Cesium.Cartesian3.fromDegrees(stationObj[stationNumber].longitude, stationObj[stationNumber].latitude);
    var picks = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, staCartesian);
    staPosition = {x: picks.x, y: picks.y};

    // 站点选中状态
    if(clickStation && clickStation !== null) {
        stationObj[stationNumber].selected = false;
        var img = stationNormalImg(clickStation.billboard.image._value);
        clickStation.billboard.image = img;
        clickStation = null;
    }
    var stationEntity = viewer.entities.getById(stationNumber);
    if (stationEntity) {
        clickStation = stationEntity;
        var img = stationSelectImg(stationEntity.billboard.image._value);
        stationEntity.billboard.image = img;
    }
}

/**
 * 水情专题的潮位站加载
 * @param number 台风编号
 * @param areaId 用户的areaId
 */
function loadTideStation(number, areaId) {
    removeStationList();
    Worlds = [];
    Positions = [];
    Positions2 = [];
    var params = {
        number: number.toString(),
        areaId: parseInt(areaId),
        stationType: 0
    };
    $ajax('/web/station/map/list/history', params, function (res) {
        var stationListData = res.data;
        // console.log(stationListData);
        for(var i in stationListData) {
            if(!stationListData.hasOwnProperty(i)) {
                continue;
            }
            var stationLevel = stationListData[i].stationLevel;
            var stationList = stationListData[i].stationList;
            updateStation(stationList, stationLevel);
        }
    })
}

/**
 * 水情专题站点预测数据站点加载
 * @param areaId 用户的areaId
 */
function loadWaterStationProduceData(areaId) {
    removeStationList();
    Worlds = [];
    Positions = [];
    Positions2 = [];
    var params = {
        areaId: parseInt(areaId)
    };
    $ajax('/web/station/map/list', params, function (res) {
        var stationList = res.data;
        updateStation(stationList);
    })
}