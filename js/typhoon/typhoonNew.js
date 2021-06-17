/*
 * @Author: your name
 * @Date: 2021-03-01 14:11:18
 * @LastEditTime: 2021-04-02 11:34:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cesium方法功能集合\Build\js\typhoon.js
 */

/**
 *
 *台风对象初始化
 * @param {*} viewer 地球类型状态
 * @param {*} Cesium cesium全局对象包
 * @param {*} typhoonData 台风数据  typhoonData=res
 * @param {*} ForecastPathStatus 预测路线状态ForecastPathStatus = { maindland: true, usa: true,japan: true, taiwan: true }
 * @param {*} typhoonStatusinfo 储存台风状态所有信息typhoonStatusinfo={isCurrent:true/false,typhoonViewer:"viewer"/"viewerTy"}是否是当前台风传入值true/false
 */
var typhoon = function (viewer, Cesium, typhoonData, ForecastPathStatus, typhoonStatusinfo) {
    this.viewer = viewer;
    this.Cesium = Cesium;
    this.setIntervalTime = null;//定时器
    this.typhoonSpeed = 200;
    this.typhoonData = typhoonData;//台风数据
    this.pointlayerImage = null;//图片对象组
    this.pointInfo = null;//主点信息组
    this.typhoonNumber = null;//台风编号
    this.typhoonName = null;//台风名称
    this.mainlandForecastinfo = null;//中国大陆预测点得信息
    this.japanForecastinfo = null;//日本预测点信息组
    this.taiwanForecastinfo = null;//台湾预测点信息组
    this.usaForecastinfo = null;//美国预测点的信息组
    this.hkForecastinfo = null;//中国香港预测点信息组
    this.count = 0;//采用定时器绘制半路预测计数器
    this.pointlength = null;//采用定时器方法绘制半路预测点数长度
    this.typhoonPointTime = null;//台风主点绘制的所以时间戳

    this.polylineColor = Cesium.Color.BLUE;//台风线得颜色
    this.clampToGround = false;//台风线段是否贴地
    this.typhoonPointscale = 0.7;//台风点像素大小
    this.ForecastPointScale = 0.5;//中国预测点像素大小
    this.polylineWith = 2;//台风线得宽度
    this.chinaForecastLineWith = 1.5;//中国预测线宽度
    this.japanForecastLineWith = 1.5;//日本预测线宽度
    this.taiwanForecastLineWith = 1.5;//中国台湾预测线宽度
    this.usaForecastLineWith = 1.5;//美国预测线宽度
    this.hkForecastLineWith = 1.5;//中国香港预测线宽度
    this.chinaForecastLineColor = Cesium.Color.PINK;//中国预测线颜色
    this.japanForecastLineColor = Cesium.Color.WHITE;//日本预测线颜色
    this.taiwanForecastLineColor = Cesium.Color.RED;//中国台湾预测线颜色
    this.usaForecastLineColor = Cesium.Color.GREEN;//美国预测线颜色
    this.hkForecastLineColor = Cesium.Color.YELLOW;//美国预测线颜色

    this.chinaForecastPointLineIsshow = ForecastPathStatus.maindland;//中国预测点线是否显示
    this.jpanForecastPointLineIsshow = ForecastPathStatus.japan;//日本预测点线是否显示
    this.taiwanForecastPointLineIsshow = ForecastPathStatus.taiwan;//台湾预测点线是否显示
    this.usaForecastPointLineIsshow = ForecastPathStatus.usa;//美国预测点线是否显示
    this.hkForecastPointLineIsshow = ForecastPathStatus.hk;//香港预测点线是否显示
    this.mainlandForecastMaxCount = null;
    this.japanForecastMaxCount = null;
    this.taiwanForecastMaxCount = null;
    this.usaForecastMaxCount = null;
    this.hkForecastMaxCount = null;
    this.TyphoonPointEntities = [];//台风主点中所有点的集合得entity信息
    this.TyphoonLineEntities = [];//台风主点中所有线的集合得entity信息
    this.mainlandForecastPointEntities = null;//中国预测点实体集合
    this.mainlandForecastLineEntities = null;//中国预测线实体集合
    this.japanForecastPointEntities = null;//日本预测点实体集合
    this.japanForecastLineEntities = null;//日本预测点实体集合
    this.usaForecastPointEntities = null;//美国预测点实体集合
    this.usaForecastLineEntities = null;//美国预测点实体集合
    this.taiwanForecastPointEntities = null;//中国台湾预测点实体集合
    this.taiwanForecastLineEntities = null;//中国台湾预测点实体集合
    this.hkForecastPointEntities = null;//中国台湾预测点实体集合
    this.hkForecastLineEntities = null;//中国台湾预测点实体集合
    this.TyphoonModelEntities = null;//台风模型实体点
    this.firstPointlat = null;//第一个点的纬度信息
    this.firstPointlon = null;//第一个点的经度信息
    this.rotationSpeed = 40;//风圈旋转速率
    this.typhoonMarkerWorld = null;//台风标签全局World坐标
    //台风扇形属性定义
    this.directionNorthEast = 2.5;//扇形方向东北2.5
    this.directionSouthEast = 2.0;//扇形方向东南2
    this.directionNorthWast = 1.0;//扇形西北方向1
    this.directionSouthWest = 1.5//扇形方向西南1.5
    this.anglex = 5.869565217396//扇形角度,现在为90度
    this.TyphoonCircleColor7 = {
        R7: 37 / 255.0,
        G7: 191 / 255.0,
        B7: 42 / 255.0,
        A7: 0.3
    };//台风七级风圈色值rgba定义
    this.TyphoonCircleColor10 = {
        R10: 240 / 255.0,
        G10: 138 / 255.0,
        B10: 45 / 255.0,
        A10: 0.5
    };//台风十级风圈色值rgba定义
    this.TyphoonCircleColor12 = {
        R12: 254 / 255.0,
        G12: 58 / 255.0,
        B12: 163 / 255.0,
        A12: 0.6
    };//台风十二级风圈色值rgba定义
    this.tyPrimitives = [];//台风风圈数组
    this.ellipsoid = Cesium.Ellipsoid.WGS84//台风采用的坐标系
    this.tyNameListener = null;//台风标签监听器
    this.isCurrent = typhoonStatusinfo.isCurrent;//是否为当前钛粉 
    this.typhoonViewer = typhoonStatusinfo.typhoonViewer//地球类型
    this.isCreateTyphoonPointLine = true;//台风实测点只创建一次全局状态
    this.init();
}
//台风初始化
typhoon.prototype.init = function () {
    var that = this;
    var TyphoonAllInfo = dataHandler(that.typhoonData)
    that.pointlayerImage = TyphoonAllInfo.pointlayerImage;
    that.pointInfo = TyphoonAllInfo.pointInfo;
    that.typhoonNumber = TyphoonAllInfo.typhoonNumber;
    that.typhoonName = TyphoonAllInfo.typhoonName;
    that.mainlandForecastinfo = TyphoonAllInfo.mainlandForecastinfo;
    that.japanForecastinfo = TyphoonAllInfo.japanForecastinfo;
    that.taiwanForecastinfo = TyphoonAllInfo.taiwanForecastinfo;
    that.usaForecastinfo = TyphoonAllInfo.usaForecastinfo;
    that.hkForecastinfo = TyphoonAllInfo.hkForecastinfo;
    that.typhoonPointTime = TyphoonAllInfo.typhoonPointTime;
    that.pointlength = TyphoonAllInfo.pointlength;
    that.mainlandForecastMaxCount = TyphoonAllInfo.mainlandForecastMaxCount;
    that.japanForecastMaxCount = TyphoonAllInfo.japanForecastMaxCount;
    that.taiwanForecastMaxCount = TyphoonAllInfo.taiwanForecastMaxCount;
    that.usaForecastMaxCount = TyphoonAllInfo.usaForecastMaxCount;
    that.hkForecastMaxCount = TyphoonAllInfo.hkForecastMaxCount;
    that.firstPointlat = TyphoonAllInfo.firstPointlat;
    that.firstPointlon = TyphoonAllInfo.firstPointlon;
}



/*
平铺台风路径
 */
typhoon.prototype.DrawTyphoonTilePath = function () {
    var that = this;
    //中国测点线实体创建
    let createmainlandForecastPointLineEntity = that.createmainlandForecastPointLineEntity()
    that.mainlandForecastPointEntities = createmainlandForecastPointLineEntity.entitiesPoint;
    that.mainlandForecastLineEntities = createmainlandForecastPointLineEntity.entitiesLine;
    //日本测点线实体创建
    let createJapanForecastPointLineEntity = that.createJapanForecastPointLineEntity()
    that.japanForecastPointEntities = createJapanForecastPointLineEntity.entitiesPoint;
    that.japanForecastLineEntities = createJapanForecastPointLineEntity.entitiesLine;
    //美国预测点线实体创建
    let creatUSAForecastPointLineEntity = that.creatUSAForecastPointLineEntity()
    that.usaForecastPointEntities = creatUSAForecastPointLineEntity.entitiesPoint;
    that.usaForecastLineEntities = creatUSAForecastPointLineEntity.entitiesLine;
    //中国台湾预测点线实体创建
    let creatTaiWanForecastPointLineEntity = that.creatTaiWanForecastPointLineEntity()
    that.taiwanForecastPointEntities = creatTaiWanForecastPointLineEntity.entitiesPoint;
    that.taiwanForecastLineEntities = creatTaiWanForecastPointLineEntity.entitiesLine;
    //中国香港预测点线实体创建
    let creatHKForecastPointLineEntity = that.creatHKForecastPointLineEntity()
    that.hkForecastPointEntities = creatHKForecastPointLineEntity.entitiesPoint;
    that.hkForecastLineEntities = creatHKForecastPointLineEntity.entitiesLine;
    //添加台风html中标签
    that.addTyphoonHtmlChangePosition();
    for (let index = 0; index < that.pointlength; index++) {
        let drawinfo = that.pointInfo[index];
        let imgSrc = that.pointlayerImage[index];
        //台风点传入的信息
        var infopoint = {
            id: that.typhoonName + index,
            name: drawinfo.strong,
            lon: drawinfo.lng,
            lat: drawinfo.lat,
            imgSrc: imgSrc,
            properties: {
                number: that.typhoonNumber,
                typhoonName: that.typhoonName,
                isCurrent: that.isCurrent
            },
            billboardName: "主点",
            scale: that.typhoonPointscale
        };
        //台风风圈传入的信息
        var typhoonCircleInfo = {
            lon: drawinfo.lng,
            lat: drawinfo.lat,
            radius7: drawinfo.radius7,
            radius10: drawinfo.radius10,
            radius12: drawinfo.radius12,
        };
        if (index === that.pointlength - 1) {
            //台风线传入的数据
            var infoline = {
                name: "台风线",
                lonStart: that.pointInfo[index - 1].lng,
                latStart: that.pointInfo[index - 1].lat,
                lonEnd: that.pointInfo[index].lng,
                latEnd: that.pointInfo[index].lat,
                width: that.polylineWith,
                color: that.polylineColor,
                clampToGround: that.clampToGround
            };
            let lineEntity = that.addPolyline(infoline)
            that.TyphoonLineEntities.push(lineEntity)
            let pointentity = that.addBillboard(infopoint)
            that.TyphoonPointEntities.push(pointentity)
            //绘制最后一个中点中国预测点线并保存全局对象globelForecastPointLineEntities中
            that.changemainlandForecastPointLinePropertiesInfo(that.mainlandForecastinfo[index - 1])
            //绘制日本预测电线
            that.changeJapanForecastPointLinePropertiesInfo(that.japanForecastinfo[index - 1]);
            //绘制美国预测点线
            that.changeUSAForecastPointLinePropertiesInfo(that.usaForecastinfo[index - 1]);
            //绘制中国台湾预测点线
            that.changeTaiwanForecastPointLinePropertiesInfo(that.taiwanForecastinfo[index - 1]);
            //绘制中国香港预测点线
            that.changeHKForecastPointLinePropertiesInfo(that.hkForecastinfo[index - 1]);
            //绘制台风风圈效果
            that.removeTyPrimitives(that.tyPrimitives);
            that.tyPrimitives = that.SingleprimitiveFillEntities(typhoonCircleInfo)
            //台风模型
            that.TyphoonModelEntities = that.addBillboardRotation({ lon: drawinfo.lng, lat: drawinfo.lat });
        } else {
            if (index < that.pointlength - 1) {
                var infoline = {
                    name: "台风线",
                    lonStart: that.pointInfo[index].lng,
                    latStart: that.pointInfo[index].lat,
                    lonEnd: that.pointInfo[index + 1].lng,
                    latEnd: that.pointInfo[index + 1].lat,
                    width: that.polylineWith,
                    color: that.polylineColor,
                    clampToGround: that.clampToGround
                };
                let lineEntity = that.addPolyline(infoline)
                that.TyphoonLineEntities.push(lineEntity)
            }
            let pointentity = that.addBillboard(infopoint)
            that.TyphoonPointEntities.push(pointentity)
        }

    }
}

/*
根据时间戳绘制动态加预测点的台风
 */
typhoon.prototype.ByIntervalDrawTyphoon = function () {
    var that = this
    //中国测点线实体创建
    let createmainlandForecastPointLineEntity = that.createmainlandForecastPointLineEntity()
    that.mainlandForecastPointEntities = createmainlandForecastPointLineEntity.entitiesPoint;
    that.mainlandForecastLineEntities = createmainlandForecastPointLineEntity.entitiesLine;
    //日本测点线实体创建
    let createJapanForecastPointLineEntity = that.createJapanForecastPointLineEntity()
    that.japanForecastPointEntities = createJapanForecastPointLineEntity.entitiesPoint;
    that.japanForecastLineEntities = createJapanForecastPointLineEntity.entitiesLine;
    //美国预测点线实体创建
    let creatUSAForecastPointLineEntity = that.creatUSAForecastPointLineEntity()
    that.usaForecastPointEntities = creatUSAForecastPointLineEntity.entitiesPoint;
    that.usaForecastLineEntities = creatUSAForecastPointLineEntity.entitiesLine;
    //中国台湾预测点线实体创建
    let creatTaiWanForecastPointLineEntity = that.creatTaiWanForecastPointLineEntity()
    that.taiwanForecastPointEntities = creatTaiWanForecastPointLineEntity.entitiesPoint;
    that.taiwanForecastLineEntities = creatTaiWanForecastPointLineEntity.entitiesLine;
    //中国香港预测点线实体创建
    // let creatHKForecastPointLineEntity = that.creatHKForecastPointLineEntity()
    // that.hkForecastPointEntities = creatHKForecastPointLineEntity.entitiesPoint;
    // that.hkForecastLineEntities = creatHKForecastPointLineEntity.entitiesLine;
    //添加台风html中标签
    that.addTyphoonHtmlChangePosition();
    //定时器100ms，动态的塞入坐标数据
    that.setIntervalTime = setInterval(
        function () {
            //循环台风路径中的每个点，设置定时器依次描绘
            if (that.count < that.pointlength) {
                let drawinfo = that.pointInfo[that.count];
                let imgSrc = that.pointlayerImage[that.count];
                that.count++;
                //台风点传入的信息
                var infopoint = {
                    id: that.typhoonName + (that.count - 1),
                    name: drawinfo.strong,
                    lon: drawinfo.lng,
                    lat: drawinfo.lat,
                    imgSrc: imgSrc,
                    properties: {
                        number: that.typhoonNumber,
                        typhoonName: that.typhoonName,
                        isCurrent: that.isCurrent
                    },
                    billboardName: "主点",
                    scale: that.typhoonPointscale
                };
                //台风风圈传入的信息
                var typhoonCircleInfo = {
                    lon: drawinfo.lng,
                    lat: drawinfo.lat,
                    radius7: drawinfo.radius7,
                    radius10: drawinfo.radius10,
                    radius12: drawinfo.radius12,
                };
                if (that.count === that.pointlength) {
                    //台风线传入的数据
                    var infoline = {
                        name: "台风线",
                        lonStart: that.pointInfo[that.count - 2].lng,
                        latStart: that.pointInfo[that.count - 2].lat,
                        lonEnd: that.pointInfo[that.count - 1].lng,
                        latEnd: that.pointInfo[that.count - 1].lat,
                        width: that.polylineWith,
                        color: that.polylineColor,
                        clampToGround: that.clampToGround
                    };
                    let lineEntity = that.addPolyline(infoline)
                    that.TyphoonLineEntities.push(lineEntity)
                    let pointentity = that.addBillboard(infopoint)
                    that.TyphoonPointEntities.push(pointentity)
                    //绘制最后一个中点中国预测点线并保存全局对象globelForecastPointLineEntities中
                    that.changemainlandForecastPointLinePropertiesInfo(that.mainlandForecastinfo[that.count - 1])
                    //绘制日本预测电线
                    that.changeJapanForecastPointLinePropertiesInfo(that.japanForecastinfo[that.count - 1]);
                    //绘制美国预测点线
                    that.changeUSAForecastPointLinePropertiesInfo(that.usaForecastinfo[that.count - 1]);
                    //绘制中国台湾预测点线
                    that.changeTaiwanForecastPointLinePropertiesInfo(that.taiwanForecastinfo[that.count - 1]);
                    //绘制中国香港预测点线
                    // that.changeHKForecastPointLinePropertiesInfo(that.hkForecastinfo[that.count - 1]);
                    //绘制台风风圈效果
                    that.removeTyPrimitives(that.tyPrimitives);
                    that.tyPrimitives = that.SingleprimitiveFillEntities(typhoonCircleInfo)
                    //台风模型】
                    if (that.TyphoonModelEntities)
                        that.viewer.entities.remove(that.TyphoonModelEntities)
                    that.TyphoonModelEntities = that.addBillboardRotation({ lon: drawinfo.lng, lat: drawinfo.lat });
                } else {
                    if (that.count >= 2) {
                        var infoline = {
                            name: "台风线",
                            lonStart: that.pointInfo[that.count - 2].lng,
                            latStart: that.pointInfo[that.count - 2].lat,
                            lonEnd: that.pointInfo[that.count - 1].lng,
                            latEnd: that.pointInfo[that.count - 1].lat,
                            width: that.polylineWith,
                            color: that.polylineColor,
                            clampToGround: that.clampToGround
                        };
                        let lineEntity = that.addPolyline(infoline)
                        that.TyphoonLineEntities.push(lineEntity)
                    }
                    let pointentity = that.addBillboard(infopoint)
                    that.TyphoonPointEntities.push(pointentity)
                    //绘制中国预测点线
                    that.changemainlandForecastPointLinePropertiesInfo(that.mainlandForecastinfo[that.count - 1])
                    //绘制日本预测点线
                    that.changeJapanForecastPointLinePropertiesInfo(that.japanForecastinfo[that.count - 1]);
                    //绘制美国预测点线
                    that.changeUSAForecastPointLinePropertiesInfo(that.usaForecastinfo[that.count - 1]);

                    //绘制中国台湾预测点线
                    that.changeTaiwanForecastPointLinePropertiesInfo(that.taiwanForecastinfo[that.count - 1]);
                    //绘制中国香港预测点线
                    // that.changeHKForecastPointLinePropertiesInfo(that.hkForecastinfo[that.count - 1]);
                    //绘制台风风圈效果
                    that.removeTyPrimitives(that.tyPrimitives);
                    that.tyPrimitives = that.SingleprimitiveFillEntities(typhoonCircleInfo)
                    //台风模型
                    if (that.TyphoonModelEntities)
                        that.viewer.entities.remove(that.TyphoonModelEntities)
                    that.TyphoonModelEntities = that.addBillboardRotation({ lon: drawinfo.lng, lat: drawinfo.lat });
                }
            } else {
                //取完数据后清除定时器
                clearInterval(that.setIntervalTime);
            }
        }, that.typhoonSpeed);
}

/*
根据数轴时间绘制当前台风效果
timeNumber每一个点对应的时间戳
 */
typhoon.prototype.ByTimerDrewCurrentTyphoon = function (timeNumber) {

}

/*
根据数轴时间绘制对应台风效果
timeNumber每一个点对应的时间戳
 */
typhoon.prototype.ByTimerShaftDrawTyphoon = function (timeNumber) {
    var that = this;
    if (that.isCreateTyphoonPointLine) {
        that.creatTyphoonPointLineEntity();//创建
        that.isCreateTyphoonPointLine = false;
    }

    let typhoonTimeIndex = getTimeIndex(that.typhoonPointTime, timeNumber);
    if (!typhoonTimeIndex) {
        return;
    }
    let drawinfo = that.pointInfo[typhoonTimeIndex];
    //台风风圈传入的信息
    var typhoonCircleInfo = {
        lon: drawinfo.lng,
        lat: drawinfo.lat,
        radius7: drawinfo.radius7,
        radius10: drawinfo.radius10,
        radius12: drawinfo.radius12,
    };
    //绘制台风风圈效果
    that.removeTyPrimitives(that.tyPrimitives);
    that.tyPrimitives = that.SingleprimitiveFillEntities(typhoonCircleInfo)
    //台风模型】
    if (that.TyphoonModelEntities)
        that.viewer.entities.remove(that.TyphoonModelEntities)
    that.TyphoonModelEntities = that.addBillboardRotation({ lon: drawinfo.lng, lat: drawinfo.lat });
    //绘制出前半段平铺台风
    //绘制最后一个中点中国预测点线并保存全局对象globelForecastPointLineEntities中
    that.changemainlandForecastPointLinePropertiesInfo(that.mainlandForecastinfo[typhoonTimeIndex])
    //绘制日本预测电线
    that.changeJapanForecastPointLinePropertiesInfo(that.japanForecastinfo[typhoonTimeIndex]);
    //绘制美国预测点线
    that.changeUSAForecastPointLinePropertiesInfo(that.usaForecastinfo[typhoonTimeIndex]);
    //绘制中国台湾预测点线
    that.changeTaiwanForecastPointLinePropertiesInfo(that.taiwanForecastinfo[typhoonTimeIndex]);
    //绘制中国香港预测点线
    // that.changeHKForecastPointLinePropertiesInfo(that.hkForecastinfo[typhoonTimeIndex - 1]);
    that.ShowTimeNumberTyphoonPoint(typhoonTimeIndex)

}



/*
传入固定得时间戳对应的下标，将台风下标前半段台风进行显示，后半段隐藏
typhoonTimeIndex台风下标下得index
 */
typhoon.prototype.ShowTimeNumberTyphoonPoint = function (typhoonTimeIndex) {
    var that = this;
    for (let i = 0; i < that.TyphoonPointEntities.length; i++) {
        var typhoonPointEntity = that.TyphoonPointEntities[i]
        if (i <= typhoonTimeIndex) {
            typhoonPointEntity._show = true;
        } else {
            typhoonPointEntity._show = false;
        }
    }
    for (let index = 0; index < that.TyphoonLineEntities.length; index++) {
        var typhoonLineEntity = that.TyphoonLineEntities[index]
        if (index < typhoonTimeIndex) {
            typhoonLineEntity.show = true;
        } else {
            typhoonLineEntity.show = false;
        }

    }
}
/*
清除台风
 */
typhoon.prototype.removeTyphoon = function () {
    var that = this;
    //清除点线模型
    that.removeEntitiesArry(that.TyphoonPointEntities);//清除主点
    that.removeEntitiesArry(that.TyphoonLineEntities);//清除主线
    that.removeSingleEntitiesArry(that.TyphoonModelEntities);
    //清除香港预测点线
    that.removeEntitiesArry(that.hkForecastLineEntities);
    that.removeEntitiesArry(that.hkForecastPointEntities);
    //清除日本点线
    that.removeEntitiesArry(that.japanForecastLineEntities);
    that.removeEntitiesArry(that.japanForecastPointEntities);
    //清除中国大陆点线
    that.removeEntitiesArry(that.mainlandForecastLineEntities);
    that.removeEntitiesArry(that.mainlandForecastPointEntities);
    //清除中国台湾点线
    that.removeEntitiesArry(that.taiwanForecastLineEntities);
    that.removeEntitiesArry(that.taiwanForecastPointEntities);
    //清除美国点线
    that.removeEntitiesArry(that.usaForecastLineEntities);
    that.removeEntitiesArry(that.usaForecastPointEntities);
    //清除风圈数组
    that.removeTyPrimitives(that.tyPrimitives);
    //清除标签
    if (that.setIntervalTime) {
        clearInterval(that.setIntervalTime);
    }
    //清除台风标签对象
    let typhoonMarkerHtml = document.getElementsByClassName('typhoon_marker_' + that.typhoonNumber)[0];
    if (typhoonMarkerHtml) {
        typhoonMarkerHtml.remove();
    }
    //清除台风标签对象
    let typhoonMarkerHtmlSmall = document.getElementsByClassName('typhoon_marker_small_' + that.typhoonNumber)[0];
    if (typhoonMarkerHtmlSmall) {
        typhoonMarkerHtmlSmall.remove();
    }
    if (that.tyNameListener) {
        that.tyNameListener();
    }

    that.destroy();
}

/*
是否显示那种预测路线
 */
typhoon.prototype.isShowForecastline = function (isShowinfo) {
    this.chinaForecastPointLineIsshow = isShowinfo.maindland
    this.usaForecastPointLineIsshow = isShowinfo.usa
    this.jpanForecastPointLineIsshow = isShowinfo.japan
    this.taiwanForecastPointLineIsshow = isShowinfo.taiwan
    this.hkForecastPointLineIsshow = isShowinfo.hk
    var that = this;
    //中国预测点线隐藏显示
    that.isShowSinglePointLine(isShowinfo.maindland, that.mainlandForecastPointEntities, that.mainlandForecastLineEntities)
    //美国预测点线隐藏显示
    that.isShowSinglePointLine(isShowinfo.usa, that.usaForecastPointEntities, that.usaForecastLineEntities)
    //日本预测点线隐藏显示
    that.isShowSinglePointLine(isShowinfo.japan, that.japanForecastPointEntities, that.japanForecastLineEntities)
    //中国台湾点线隐藏显示
    that.isShowSinglePointLine(isShowinfo.taiwan, that.taiwanForecastPointEntities, that.taiwanForecastLineEntities)
    //中国香港点线隐藏显示
    that.isShowSinglePointLine(isShowinfo.hk, that.hkForecastPointEntities, that.hkForecastLineEntities)
}

typhoon.prototype.isShowSinglePointLine = function (isShow, EntitiesPointArray, EntitiesLineArray) {
    if (EntitiesPointArray) {
        for (let index = 0; index < EntitiesPointArray.length; index++) {
            let entitiesPoint = EntitiesPointArray[index];
            entitiesPoint.show = isShow;

        }
    }
    if (EntitiesLineArray) {
        for (let index = 0; index < EntitiesLineArray.length; index++) {
            let entitiesLine = EntitiesLineArray[index];
            entitiesLine.show = isShow;
        }
    }
}
/*
清除集合数组
 */
typhoon.prototype.removeEntitiesArry = function (arrayEntity) {
    var that = this;
    if (arrayEntity) {
        for (let index = 0; index < arrayEntity.length; index++) {
            const element = arrayEntity[index];
            that.viewer.entities.remove(element)
        }
    }
}
/*
清除单个实体entity
 */
typhoon.prototype.removeSingleEntitiesArry = function (arrayEntity) {
    var that = this;
    if (arrayEntity)
        that.viewer.entities.remove(arrayEntity)
}

/*

根据数组创建出所有台风得点和线实体适合并将点线设置为false
 */
typhoon.prototype.creatTyphoonPointLineEntity = function () {
    var that = this;
    //中国测点线实体创建
    let createmainlandForecastPointLineEntity = that.createmainlandForecastPointLineEntity()
    that.mainlandForecastPointEntities = createmainlandForecastPointLineEntity.entitiesPoint;
    that.mainlandForecastLineEntities = createmainlandForecastPointLineEntity.entitiesLine;
    //日本测点线实体创建
    let createJapanForecastPointLineEntity = that.createJapanForecastPointLineEntity()
    that.japanForecastPointEntities = createJapanForecastPointLineEntity.entitiesPoint;
    that.japanForecastLineEntities = createJapanForecastPointLineEntity.entitiesLine;
    //美国预测点线实体创建
    let creatUSAForecastPointLineEntity = that.creatUSAForecastPointLineEntity()
    that.usaForecastPointEntities = creatUSAForecastPointLineEntity.entitiesPoint;
    that.usaForecastLineEntities = creatUSAForecastPointLineEntity.entitiesLine;
    //中国台湾预测点线实体创建
    let creatTaiWanForecastPointLineEntity = that.creatTaiWanForecastPointLineEntity()
    that.taiwanForecastPointEntities = creatTaiWanForecastPointLineEntity.entitiesPoint;
    that.taiwanForecastLineEntities = creatTaiWanForecastPointLineEntity.entitiesLine;
    //中国香港预测点线实体创建
    // let creatHKForecastPointLineEntity = that.creatHKForecastPointLineEntity()
    // that.hkForecastPointEntities = creatHKForecastPointLineEntity.entitiesPoint;
    // that.hkForecastLineEntities = creatHKForecastPointLineEntity.entitiesLine;

    that.addTyphoonHtmlChangePosition();
    for (let index = 0; index < that.pointlength; index++) {
        let drawinfo = that.pointInfo[index];
        let imgSrc = that.pointlayerImage[index];
        //台风点传入的信息
        var infopoint = {
            id: that.typhoonName + index,
            name: drawinfo.strong,
            lon: drawinfo.lng,
            lat: drawinfo.lat,
            imgSrc: imgSrc,
            properties: {
                number: that.typhoonNumber,
                typhoonName: that.typhoonName,
                isCurrent: that.isCurrent
            },
            billboardName: "主点",
            scale: that.typhoonPointscale,
            isShow: false
        };
        if (index === that.pointlength - 1) {
            //台风线传入的数据
            var infoline = {
                name: "台风线",
                lonStart: that.pointInfo[index - 1].lng,
                latStart: that.pointInfo[index - 1].lat,
                lonEnd: that.pointInfo[index].lng,
                latEnd: that.pointInfo[index].lat,
                width: that.polylineWith,
                color: that.polylineColor,
                clampToGround: that.clampToGround,
                isShow: false
            };
            let lineEntity = that.addPolyline(infoline)
            that.TyphoonLineEntities.push(lineEntity)
            let pointentity = that.addBillboard(infopoint)
            that.TyphoonPointEntities.push(pointentity)
            //台风模型
            // that.TyphoonModelEntities = that.addBillboardRotation({ lon: drawinfo.lng, lat: drawinfo.lat });
        } else {
            if (index < that.pointlength - 1) {
                var infoline = {
                    name: "台风线",
                    lonStart: that.pointInfo[index].lng,
                    latStart: that.pointInfo[index].lat,
                    lonEnd: that.pointInfo[index + 1].lng,
                    latEnd: that.pointInfo[index + 1].lat,
                    width: that.polylineWith,
                    color: that.polylineColor,
                    clampToGround: that.clampToGround,
                    isShow: false
                };
                let lineEntity = that.addPolyline(infoline)
                that.TyphoonLineEntities.push(lineEntity)
            }
            let pointentity = that.addBillboard(infopoint)
            that.TyphoonPointEntities.push(pointentity)
        }

    }
}

/*
根据台风中主点中中国预测点数最多的点，按照点数创建Entities的点线集合
 */
typhoon.prototype.createmainlandForecastPointLineEntity = function () {
    var that = this;
    var entitiesPoint = [];
    var entitiesLine = [];
    if (that.mainlandForecastMaxCount != 0) {
        for (let index = 0; index < that.mainlandForecastMaxCount; index++) {
            if (index != 0) {
                let infopoint = {
                    id: "中国预测点" + that.typhoonNumber + "-" + index,
                    name: "预测点",
                    lon: "",
                    lat: "",
                    imgSrc: "static/typhoonImage/blankImage.png",
                    properties: {
                        organ: "中国",
                        pressure: 0,
                        speed: 0,
                        strong: "",
                        time: "",
                        power: 0,
                        number: that.typhoonNumber,
                        typhoonName: that.typhoonName,
                        isCurrent: that.isCurrent,
                        lat: 0,
                        lng: 0
                    },
                    billboardName: "日本预测点",
                    scale: that.ForecastPointScale,
                    isShow: that.chinaForecastPointLineIsshow
                };
                let ForecastPoint = that.addBillboard(infopoint)
                entitiesPoint.push(ForecastPoint)
            }
            if (index < that.mainlandForecastMaxCount - 1) {
                let infoline = {
                    name: "预测线",
                    lonStart: "",
                    latStart: "",
                    lonEnd: "",
                    latEnd: "",
                    isShow: that.chinaForecastPointLineIsshow,
                    color: that.chinaForecastLineColor,
                    width: that.chinaForecastLineWith
                };
                let ForecastLine = that.addDashPolyline(infoline);
                entitiesLine.push(ForecastLine)
            }
        }
    }
    return {
        entitiesPoint: entitiesPoint,
        entitiesLine: entitiesLine
    };
}


/*
根据台风中主点中日本预测点数最多的点，按照点数创建Entities的点线集合
 */
typhoon.prototype.createJapanForecastPointLineEntity = function () {
    var that = this;
    var entitiesPoint = [];
    var entitiesLine = [];
    if (that.japanForecastMaxCount != 0) {
        for (let index = 0; index < that.japanForecastMaxCount; index++) {
            if (index != 0) {
                let infopoint = {
                    id: "日本预测点" + that.typhoonNumber + "-" + index,
                    name: "预测点",
                    lon: "",
                    lat: "",
                    imgSrc: "static/typhoonImage/blankImage.png",
                    properties: {
                        organ: "日本",
                        pressure: 0,
                        speed: 0,
                        strong: "",
                        time: "",
                        power: 0,
                        number: that.typhoonNumber,
                        typhoonName: that.typhoonName,
                        isCurrent: that.isCurrent,
                        lat: 0,
                        lng: 0
                    },
                    billboardName: "日本预测点",
                    scale: that.ForecastPointScale,
                    isShow: that.jpanForecastPointLineIsshow
                };
                let ForecastPoint = that.addBillboard(infopoint)
                entitiesPoint.push(ForecastPoint)
            }
            if (index < that.japanForecastMaxCount - 1) {
                let infoline = {
                    name: "预测线",
                    lonStart: "",
                    latStart: "",
                    lonEnd: "",
                    latEnd: "",
                    isShow: that.jpanForecastPointLineIsshow,
                    color: that.japanForecastLineColor,
                    width: that.japanForecastLineWith
                };
                let ForecastLine = that.addDashPolyline(infoline);
                entitiesLine.push(ForecastLine)
            }
        }
    }
    return {
        entitiesPoint: entitiesPoint,
        entitiesLine: entitiesLine
    };
}

/*
根据台风中主点中美国预测点数最多的点，按照点数创建Entities的点线集合
 */
typhoon.prototype.creatUSAForecastPointLineEntity = function () {
    var that = this;
    var entitiesPoint = [];
    var entitiesLine = [];
    if (that.usaForecastMaxCount != 0) {
        for (let index = 0; index < that.usaForecastMaxCount; index++) {
            if (index != 0) {
                let infopoint = {
                    id: "美国预测点" + that.typhoonNumber + "-" + index,
                    name: "预测点",
                    lon: "",
                    lat: "",
                    imgSrc: "static/typhoonImage/blankImage.png",
                    properties: {
                        organ: "美国",
                        pressure: 0,
                        speed: 0,
                        strong: "",
                        time: "",
                        power: 0,
                        number: that.typhoonNumber,
                        typhoonName: that.typhoonName,
                        isCurrent: that.isCurrent,
                        lat: 0,
                        lng: 0
                    },
                    billboardName: "美国预测点",
                    scale: that.ForecastPointScale,
                    isShow: that.usaForecastPointLineIsshow
                };
                let ForecastPoint = that.addBillboard(infopoint)
                entitiesPoint.push(ForecastPoint)
            }
            if (index < that.usaForecastMaxCount - 1) {
                let infoline = {
                    name: "预测线",
                    lonStart: "",
                    latStart: "",
                    lonEnd: "",
                    latEnd: "",
                    isShow: that.usaForecastPointLineIsshow,
                    color: that.usaForecastLineColor,
                    width: that.usaForecastLineWith
                };
                let ForecastLine = that.addDashPolyline(infoline);
                entitiesLine.push(ForecastLine)
            }
        }
    }
    return {
        entitiesPoint: entitiesPoint,
        entitiesLine: entitiesLine
    };
}

/*
根据台风中主点中中国台湾预测点数最多的点，按照点数创建Entities的点线集合
 */
typhoon.prototype.creatTaiWanForecastPointLineEntity = function () {
    var that = this;
    var entitiesPoint = [];
    var entitiesLine = [];
    if (that.taiwanForecastMaxCount != 0) {
        for (let index = 0; index < that.taiwanForecastMaxCount; index++) {
            if (index != 0) {
                let infopoint = {
                    id: "中国台湾预测点" + that.typhoonNumber + "-" + index,
                    name: "预测点",
                    lon: "",
                    lat: "",
                    imgSrc: "static/typhoonImage/blankImage.png",
                    properties: {
                        organ: "中国台湾",
                        pressure: 0,
                        speed: 0,
                        strong: "",
                        time: "",
                        power: 0,
                        number: that.typhoonNumber,
                        typhoonName: that.typhoonName,
                        isCurrent: that.isCurrent,
                        lat: 0,
                        lng: 0
                    },
                    billboardName: "台湾预测点",
                    scale: that.ForecastPointScale,
                    isShow: that.taiwanForecastPointLineIsshow
                };
                let ForecastPoint = that.addBillboard(infopoint)
                entitiesPoint.push(ForecastPoint)
            }
            if (index < that.taiwanForecastMaxCount - 1) {
                let infoline = {
                    name: "预测线",
                    lonStart: "",
                    latStart: "",
                    lonEnd: "",
                    latEnd: "",
                    isShow: that.taiwanForecastPointLineIsshow,
                    color: that.taiwanForecastLineColor,
                    width: that.taiwanForecastLineWith
                };
                let ForecastLine = that.addDashPolyline(infoline);
                entitiesLine.push(ForecastLine)
            }
        }
    }
    return {
        entitiesPoint: entitiesPoint,
        entitiesLine: entitiesLine
    };
}

/*
根据台风中主点中中国香港预测点数最多的点，按照点数创建Entities的点线集合
 */
typhoon.prototype.creatHKForecastPointLineEntity = function () {
    var that = this;
    var entitiesPoint = [];
    var entitiesLine = [];
    if (that.hkForecastMaxCount != 0) {
        for (let index = 0; index < that.hkForecastMaxCount; index++) {
            if (index != 0) {
                let infopoint = {
                    id: "中国香港预测点" + that.typhoonNumber + "-" + index,
                    name: "预测点",
                    lon: "",
                    lat: "",
                    imgSrc: "static/typhoonImage/blankImage.png",
                    properties: {
                        organ: "中国香港",
                        pressure: 0,
                        speed: 0,
                        strong: "",
                        time: "",
                        power: 0,
                        number: that.typhoonNumber,
                        typhoonName: that.typhoonName,
                        isCurrent: that.isCurrent,
                        lat: 0,
                        lng: 0
                    },
                    billboardName: "中国香港预测点",
                    scale: that.ForecastPointScale,
                    isShow: that.hkForecastPointLineIsshow
                };
                let ForecastPoint = that.addBillboard(infopoint)
                entitiesPoint.push(ForecastPoint)
            }
            if (index < that.hkForecastMaxCount - 1) {
                let infoline = {
                    name: "预测线",
                    lonStart: "",
                    latStart: "",
                    lonEnd: "",
                    latEnd: "",
                    isShow: that.hkForecastPointLineIsshow,
                    color: that.hkForecastLineColor,
                    width: that.hkForecastLineWith
                };
                let ForecastLine = that.addDashPolyline(infoline);
                entitiesLine.push(ForecastLine)
            }
        }
    }
    return {
        entitiesPoint: entitiesPoint,
        entitiesLine: entitiesLine
    };
}
/*
更改中国台风预测点线中的位置
mainlandForecastList 参数为每一个点中的中国大陆台风预测数据
 */
typhoon.prototype.changemainlandForecastPointLinePropertiesInfo = function (mainlandForecastList) {
    var that = this;
    if (that.mainlandForecastMaxCount != 0 && mainlandForecastList) {
        for (let index = 0; index < that.mainlandForecastPointEntities.length; index++) {
            let entitiesPoint = that.mainlandForecastPointEntities[index];
            let entitiesLine = that.mainlandForecastLineEntities[index];
            let infoPoint = mainlandForecastList[index + 1]

            let entitiesLineStart = mainlandForecastList[index];
            let entitiesLineEnd = mainlandForecastList[index + 1];
            if (infoPoint) {
                let strong = infoPoint.strong;
                let imgSrc = TyphoonImageRank(strong)
                let value = that.Cesium.Cartesian3.fromDegrees(infoPoint.lng, infoPoint.lat, 50);
                let name = "预测点";
                let isShow = that.chinaForecastPointLineIsshow;
                entitiesPoint._position._value = value;
                entitiesPoint._billboard._image._value = imgSrc;
                entitiesPoint._show = isShow;
                entitiesPoint._name = name;
                entitiesPoint._properties._power._value = infoPoint.power;
                entitiesPoint._properties._speed._value = infoPoint.speed;
                entitiesPoint._properties._strong._value = infoPoint.strong;
                entitiesPoint._properties._pressure._value = infoPoint.pressure;
                entitiesPoint._properties._time._value = infoPoint.time;
                entitiesPoint._properties._lng._value = infoPoint.lng;
                entitiesPoint._properties._lat._value = infoPoint.lat;

            } else {
                entitiesPoint._billboard._image._value = "static/typhoonImage/blankImage.png";
                entitiesPoint._show = false;
                entitiesPoint._name = "";
            }
            if (entitiesLineStart && entitiesLineEnd) {
                let isShow = that.chinaForecastPointLineIsshow;
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([entitiesLineStart.lng, entitiesLineStart.lat, 0, entitiesLineEnd.lng, entitiesLineEnd.lat, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = isShow;
            } else {
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 0, 0, 0, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = false;
            }
        }
    }
}


/*
更改日本台风预测点线中的位置
japanForecastList 参数为每一个点中的日本台风预测数据
 */
typhoon.prototype.changeJapanForecastPointLinePropertiesInfo = function (japanForecastList) {
    var that = this;
    if (that.japanForecastMaxCount != 0 && japanForecastList) {
        for (let index = 0; index < that.japanForecastPointEntities.length; index++) {
            let entitiesPoint = that.japanForecastPointEntities[index];
            let entitiesLine = that.japanForecastLineEntities[index];
            let infoPoint = japanForecastList[index + 1]

            let entitiesLineStart = japanForecastList[index];
            let entitiesLineEnd = japanForecastList[index + 1];
            if (infoPoint) {
                let strong = infoPoint.strong;
                let imgSrc = TyphoonImageRank(strong)
                let value = that.Cesium.Cartesian3.fromDegrees(infoPoint.lng, infoPoint.lat, 50);
                let name = "预测点";
                let isShow = that.jpanForecastPointLineIsshow;
                entitiesPoint._position._value = value;
                entitiesPoint._billboard._image._value = imgSrc;
                entitiesPoint._show = isShow;
                entitiesPoint._name = name;
                entitiesPoint._properties._power._value = infoPoint.power;
                entitiesPoint._properties._speed._value = infoPoint.speed;
                entitiesPoint._properties._strong._value = infoPoint.strong;
                entitiesPoint._properties._pressure._value = infoPoint.pressure;
                entitiesPoint._properties._time._value = infoPoint.time;
                entitiesPoint._properties._lng._value = infoPoint.lng;
                entitiesPoint._properties._lat._value = infoPoint.lat;
            } else {
                entitiesPoint._billboard._image._value = "static/typhoonImage/blankImage.png";
                entitiesPoint._show = false;
                entitiesPoint._name = "";
            }
            if (entitiesLineStart && entitiesLineEnd) {
                let isShow = that.jpanForecastPointLineIsshow;
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([entitiesLineStart.lng, entitiesLineStart.lat, 0, entitiesLineEnd.lng, entitiesLineEnd.lat, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = isShow;
            } else {
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 0, 0, 0, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = false;
            }
        }
    }
}

/*
更改美国台风预测点线中的位置
usaForecastList 参数为每一个点中的美国台风预测数据
 */
typhoon.prototype.changeUSAForecastPointLinePropertiesInfo = function (usaForecastList) {
    var that = this;
    if (that.usaForecastMaxCount != 0 && usaForecastList) {
        for (let index = 0; index < that.usaForecastPointEntities.length; index++) {
            let entitiesPoint = that.usaForecastPointEntities[index];
            let entitiesLine = that.usaForecastLineEntities[index];
            let infoPoint = usaForecastList[index + 1]
            let entitiesLineStart = usaForecastList[index];
            let entitiesLineEnd = usaForecastList[index + 1];
            if (infoPoint) {
                let strong = infoPoint.strong;
                let imgSrc = TyphoonImageRank(strong)
                let value = that.Cesium.Cartesian3.fromDegrees(infoPoint.lng, infoPoint.lat, 50);
                let name = "预测点";
                let isShow = that.usaForecastPointLineIsshow;
                entitiesPoint._position._value = value;
                entitiesPoint._billboard._image._value = imgSrc;
                entitiesPoint._show = isShow;
                entitiesPoint._name = name;
                entitiesPoint._properties._power._value = infoPoint.power;
                entitiesPoint._properties._speed._value = infoPoint.speed;
                entitiesPoint._properties._strong._value = infoPoint.strong;
                entitiesPoint._properties._pressure._value = infoPoint.pressure;
                entitiesPoint._properties._time._value = infoPoint.time;
                entitiesPoint._properties._lng._value = infoPoint.lng;
                entitiesPoint._properties._lat._value = infoPoint.lat;
            } else {
                entitiesPoint._billboard._image._value = "static/typhoonImage/blankImage.png";
                entitiesPoint._show = false;
                entitiesPoint._name = "";
            }
            if (entitiesLineStart && entitiesLineEnd) {
                let isShow = that.usaForecastPointLineIsshow;
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([entitiesLineStart.lng, entitiesLineStart.lat, 0, entitiesLineEnd.lng, entitiesLineEnd.lat, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = isShow;
            } else {
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 0, 0, 0, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = false;
            }
        }
    }
}

/*
更改中国台湾台风预测点线中的位置
taiwanForecastList 参数为每一个点中的中国台湾台风预测数据
 */
typhoon.prototype.changeTaiwanForecastPointLinePropertiesInfo = function (taiwanForecastList) {
    var that = this;
    if (that.taiwanForecastMaxCount != 0 && taiwanForecastList) {
        for (let index = 0; index < that.taiwanForecastPointEntities.length; index++) {
            let entitiesPoint = that.taiwanForecastPointEntities[index];
            let entitiesLine = that.taiwanForecastLineEntities[index];
            let infoPoint = taiwanForecastList[index + 1]
            let entitiesLineStart = taiwanForecastList[index];
            let entitiesLineEnd = taiwanForecastList[index + 1];
            if (infoPoint) {
                let strong = infoPoint.strong;
                let imgSrc = TyphoonImageRank(strong)
                let value = that.Cesium.Cartesian3.fromDegrees(infoPoint.lng, infoPoint.lat, 50);
                let name = "预测点";
                let isShow = that.taiwanForecastPointLineIsshow;
                entitiesPoint._position._value = value;
                entitiesPoint._billboard._image._value = imgSrc;
                entitiesPoint._show = isShow;
                entitiesPoint._name = name;
                entitiesPoint._properties._power._value = infoPoint.power;
                entitiesPoint._properties._speed._value = infoPoint.speed;
                entitiesPoint._properties._strong._value = infoPoint.strong;
                entitiesPoint._properties._pressure._value = infoPoint.pressure;
                entitiesPoint._properties._time._value = infoPoint.time;
                entitiesPoint._properties._lng._value = infoPoint.lng;
                entitiesPoint._properties._lat._value = infoPoint.lat;
            } else {
                entitiesPoint._billboard._image._value = "static/typhoonImage/blankImage.png";
                entitiesPoint._show = false;
                entitiesPoint._name = "";
            }
            if (entitiesLineStart && entitiesLineEnd) {
                let isShow = that.taiwanForecastPointLineIsshow;
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([entitiesLineStart.lng, entitiesLineStart.lat, 0, entitiesLineEnd.lng, entitiesLineEnd.lat, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = isShow;
            } else {
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 0, 0, 0, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = false;
            }
        }
    }
}

/*
更改中国香港台风预测点线中的位置
hkForecastList 参数为每一个点中的中国香港台风预测数据
 */
typhoon.prototype.changeHKForecastPointLinePropertiesInfo = function (hkForecastList) {
    var that = this;
    if (that.hkForecastMaxCount != 0 && hkForecastList) {
        for (let index = 0; index < that.hkForecastPointEntities.length; index++) {
            let entitiesPoint = that.hkForecastPointEntities[index];
            let entitiesLine = that.hkForecastLineEntities[index];
            let infoPoint = hkForecastList[index + 1]
            let entitiesLineStart = hkForecastList[index];
            let entitiesLineEnd = hkForecastList[index + 1];
            if (infoPoint) {
                let strong = infoPoint.strong;
                let imgSrc = TyphoonImageRank(strong)
                let value = that.Cesium.Cartesian3.fromDegrees(infoPoint.lng, infoPoint.lat, 50);
                let name = "预测点";
                let isShow = that.hkForecastPointLineIsshow;
                entitiesPoint._position._value = value;
                entitiesPoint._billboard._image._value = imgSrc;
                entitiesPoint._show = isShow;
                entitiesPoint._name = name;
                entitiesPoint._properties._power._value = infoPoint.power;
                entitiesPoint._properties._speed._value = infoPoint.speed;
                entitiesPoint._properties._strong._value = infoPoint.strong;
                entitiesPoint._properties._pressure._value = infoPoint.pressure;
                entitiesPoint._properties._time._value = infoPoint.time;
                entitiesPoint._properties._lng._value = infoPoint.lng;
                entitiesPoint._properties._lat._value = infoPoint.lat;
            } else {
                entitiesPoint._billboard._image._value = "static/typhoonImage/blankImage.png";
                entitiesPoint._show = false;
                entitiesPoint._name = "";
            }
            if (entitiesLineStart && entitiesLineEnd) {
                let isShow = that.hkForecastPointLineIsshow;
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([entitiesLineStart.lng, entitiesLineStart.lat, 0, entitiesLineEnd.lng, entitiesLineEnd.lat, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = isShow;
            } else {
                let valueline = Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 0, 0, 0, 0]);
                entitiesLine.polyline.positions = valueline;
                entitiesLine.show = false;
            }
        }
    }
}
//计算出台风所有需要的数据对象
function dataHandler(typhoonTestData) {
    //获取台风坐标点数据对象
    // var forecast = typhoonTestData[0]['points'];
    var forecast = typhoonTestData['points'];
    //定义折线点数据的新数组
    var pointInfo = {};//主所有风圈信息、点中信息
    var pointlayerImage = {};//主点图片信息
    //台风名称
    // var typhoonName = typhoonTestData[0].name;//台风name
    var typhoonName = typhoonTestData.name;//台风name
    // var typhoonNumber = typhoonTestData[0].tfid;//台风编号
    var typhoonNumber = typhoonTestData.tfid;//台风编号
    var mainlandForecastinfo = {};//大陆预测点信息
    var japanForecastinfo = {};//日本预测点信息
    var taiwanForecastinfo = {};//台湾预测点信息
    var usaForecastinfo = {};//美国预测点信息
    var hkForecastinfo = {};//美国预测点信息
    var typhoonPointTime = {}//台风点数时间戳
    var mainlandForecastMaxCount = 0;
    var japanForecastMaxCount = 0;
    var taiwanForecastMaxCount = 0;
    var usaForecastMaxCount = 0;
    var hkForecastMaxCount = 0;
    var mainlandtempCount = null;
    var japantempCount = null;
    var taiwantempCount = null;
    var usatempCount = null;
    var hktempCount = null;
    var firstPointlat = null;
    var firstPointlon = null;
    var pointlength = forecast.length;
    //找到经纬度数据，存放在新数组中shuzu
    for (var i = 0; i < forecast.length; i++) {
        var points = forecast[i];
        var typhoon_Rank_name = points.strong;
        var typhoonImage = TyphoonImageRank(typhoon_Rank_name)
        var thisTime = points.time.replace(/-/g, '/');
        var typhoonTime = new Date(thisTime).getTime();
        typhoonPointTime[typhoonTime] = i;
        if (i == 0) {
            firstPointlat = points.lat;
            firstPointlon = points.lng;
        }
        pointInfo[i] = {
            radius7: points.radius7,
            radius10: points.radius10,
            radius12: points.radius12,
            lat: points.lat,
            lng: points.lng,
            movedirection: points.movedirection,
            movespeed: points.movespeed,
            power: points.power,
            pressure: points.pressure,
            speed: points.speed,
            strong: points.strong,
            time: points.time,
            name: typhoonName,
            number: typhoonNumber,
        }
        pointlayerImage[i] = typhoonImage
        //添加预测点线的经纬度
        var forecastPointData = forecast[i].forecast
        for (let index = 0; index < forecastPointData.length; index++) {
            const item = forecastPointData[index];
            let mainlandinfo = [];
            let japaninfo = [];
            let usainfo = [];
            let taiwaninfo = [];
            let hkinfo = [];
            if (item.tm == "中国") {
                let chinalength = item.forecastpoints.length
                if (chinalength > mainlandForecastMaxCount) {
                    mainlandtempCount = chinalength;
                    chinalength = mainlandForecastMaxCount;
                    mainlandForecastMaxCount = mainlandtempCount;
                }
                item.forecastpoints.forEach((item, index) => {
                    let mainlandForecastListinfo = {
                        lat: item.lat,
                        lng: item.lng,
                        power: item.power,
                        pressure: item.pressure,
                        speed: item.speed,
                        strong: item.strong,
                        time: item.time,
                        tm: "中国",
                        name: typhoonName,
                        number: typhoonNumber,
                    }
                    mainlandinfo.push(mainlandForecastListinfo);
                });
                mainlandForecastinfo[i] = mainlandinfo;
            }
            if (item.tm == "日本") {
                let japanlength = item.forecastpoints.length
                if (japanlength > japanForecastMaxCount) {
                    japantempCount = japanlength;
                    japanlength = japanForecastMaxCount;
                    japanForecastMaxCount = japantempCount;
                }
                item.forecastpoints.forEach((item, index) => {
                    let japanForecastListinfo = {
                        lat: item.lat,
                        lng: item.lng,
                        power: item.power,
                        pressure: item.pressure,
                        speed: item.speed,
                        strong: item.strong,
                        time: item.time,
                        tm: "日本",
                        name: typhoonName,
                        number: typhoonNumber,
                    }
                    japaninfo.push(japanForecastListinfo);
                });
                japanForecastinfo[i] = japaninfo;
            }
            if (item.tm == "美国") {
                let usalength = item.forecastpoints.length
                if (usalength > usaForecastMaxCount) {
                    usatempCount = usalength;
                    usalength = usaForecastMaxCount;
                    usaForecastMaxCount = usatempCount;
                }
                item.forecastpoints.forEach((item, index) => {
                    let usaForecastListinfo = {
                        lat: item.lat,
                        lng: item.lng,
                        power: item.power,
                        pressure: item.pressure,
                        speed: item.speed,
                        strong: item.strong,
                        time: item.time,
                        tm: "美国",
                        name: typhoonName,
                        number: typhoonNumber
                    }
                    usainfo.push(usaForecastListinfo)
                });
                usaForecastinfo[i] = usainfo;
            }
            if (item.tm == "中国台湾") {
                let taiwanlength = item.forecastpoints.length
                if (taiwanlength > taiwanForecastMaxCount) {
                    taiwantempCount = taiwanlength;
                    taiwanlength = taiwanForecastMaxCount;
                    taiwanForecastMaxCount = taiwantempCount;
                }
                item.forecastpoints.forEach((item, index) => {
                    let taiwanForecastListinfo = {
                        lat: item.lat,
                        lng: item.lng,
                        power: item.power,
                        pressure: item.pressure,
                        speed: item.speed,
                        strong: item.strong,
                        time: item.time,
                        tm: "中国台湾",
                        name: typhoonName,
                        number: typhoonNumber
                    };
                    taiwaninfo.push(taiwanForecastListinfo);
                });
                taiwanForecastinfo[i] = taiwaninfo;
            }
            if (item.tm == "中国香港") {
                let hklength = item.forecastpoints.length
                if (hklength > hkForecastMaxCount) {
                    hktempCount = hklength;
                    hklength = hkForecastMaxCount;
                    hkForecastMaxCount = hktempCount;
                }
                item.forecastpoints.forEach((item, index) => {
                    let hkForecastListinfo = {
                        lat: item.lat,
                        lng: item.lng,
                        power: item.power,
                        pressure: item.pressure,
                        speed: item.speed,
                        strong: item.strong,
                        time: item.time,
                        tm: "中国香港",
                        name: typhoonName,
                        number: typhoonNumber
                    };
                    hkinfo.push(hkForecastListinfo);
                });
                hkForecastinfo[i] = hkinfo;
            }
        };
    }
    var info = {
        pointInfo: pointInfo,
        pointlayerImage: pointlayerImage,
        typhoonName: typhoonName,
        typhoonNumber: typhoonNumber,
        mainlandForecastinfo: mainlandForecastinfo,
        japanForecastinfo: japanForecastinfo,
        taiwanForecastinfo: taiwanForecastinfo,
        usaForecastinfo: usaForecastinfo,
        hkForecastinfo: hkForecastinfo,
        typhoonPointTime: typhoonPointTime,
        mainlandForecastMaxCount: mainlandForecastMaxCount,
        japanForecastMaxCount: japanForecastMaxCount,
        taiwanForecastMaxCount: taiwanForecastMaxCount,
        usaForecastMaxCount: usaForecastMaxCount,
        hkForecastMaxCount: hkForecastMaxCount,
        firstPointlat: firstPointlat,
        firstPointlon: firstPointlon,
        pointlength: pointlength
    };
    return info;
};



//台风图片样式转换
function TyphoonImageRank(typhoon_Rank_name) {
    var typhoon_point_image = "";
    switch (typhoon_Rank_name) {
        case "热带风暴":
            typhoon_point_image = "static/typhoonImage/Tropical_Storm_Point_image.png";
            break;

        case "台风":
            typhoon_point_image = "static/typhoonImage/Typhoon_Point_image.png";
            break;

        case "强台风":
            typhoon_point_image = "static/typhoonImage/Violent_Typhoon_Point_image.png";
            break;

        case "超强台风":
            typhoon_point_image = "static/typhoonImage/Super_Typhoon_Point_image.png";
            break;

        case "强热带风暴":
            typhoon_point_image = "static/typhoonImage/Server_Tropical_Storm_Point_image.png";
            break;

        case "热带低压":
            typhoon_point_image = "static/typhoonImage/Tropical_Depression_Point_image.png";
            break;
        default:
            typhoon_point_image = "static/typhoonImage/Typhoon_Point_image.png";
    }
    return typhoon_point_image;
}
/*
添加广告牌添加台风点数据
 */
typhoon.prototype.addBillboard = function (info) {
    var that = this;
    var entity = that.viewer.entities.add({
        id: info.id,
        name: info.name,
        show: info.isShow,
        position: that.Cesium.Cartesian3.fromDegrees(info.lon, info.lat, 100),
        billboard: {
            image: info.imgSrc,
            scale: info.scale
        },
        properties: info.properties,
        billboardName: info.billboardName
    })
    return entity;
}

/*
添加台风中实线线段
 */
typhoon.prototype.addPolyline = function (info) {
    var that = this
    var redLine = that.viewer.entities.add({
        name: info.name,
        show: info.isShow,
        polyline: {
            positions: that.Cesium.Cartesian3.fromDegreesArrayHeights([info.lonStart, info.latStart, 5, info.lonEnd, info.latEnd, 5]),
            width: that.polylineWith,
            material: that.polylineColor,
            clampToGround: that.clampToGround,
        },
    });
    return redLine;
}

/*
添加预测点中的虚线
 */
typhoon.prototype.addDashPolyline = function (info) {
    var that = this;
    var redLine = that.viewer.entities.add({
        name: info.name,
        show: info.isShow,
        polyline: {
            positions: that.Cesium.Cartesian3.fromDegreesArrayHeights([info.lonStart, info.latStart, 5, info.lonEnd, info.latEnd, 5]),
            width: info.width,
            material: new that.Cesium.PolylineDashMaterialProperty({
                color: info.color,
            }),
            clampToGround: that.clampToGround,
        },
    });

    return redLine;
}



/*
根据数据添加一组风圈
TyphoonCircleinfo每一个点一组台风数据
 */
typhoon.prototype.SingleprimitiveFillEntities = function (TyphoonCircleinfo) {
    var that = this;
    var SingleAllPrimitiveFill = [];
    var lat = parseFloat(TyphoonCircleinfo.lat)
    var lon = parseFloat(TyphoonCircleinfo.lon)
    var radius7 = TyphoonCircleinfo.radius7
    var radius10 = TyphoonCircleinfo.radius10
    var radius12 = TyphoonCircleinfo.radius12
    radius7 = radius7.split('|')
    radius10 = radius10.split('|')
    radius12 = radius12.split('|')
    let radiusNorthEast7 = radius7[0] * 1000
    let radiusSouthEast7 = radius7[1] * 1000
    let radiusNorthWast7 = radius7[2] * 1000
    let radiusSouthWest7 = radius7[3] * 1000
    let radiusNorthEast10 = radius10[0] * 1000
    let radiusSouthEast10 = radius10[1] * 1000
    let radiusNorthWast10 = radius10[2] * 1000
    let radiusSouthWest10 = radius10[3] * 1000
    let radiusNorthEast12 = radius12[0] * 1000
    let radiusSouthEast12 = radius12[1] * 1000
    let radiusNorthWast12 = radius12[2] * 1000
    let radiusSouthWest12 = radius12[3] * 1000
    //七级风圈
    var primitiveFill = that.setvisible(lat, lon, radiusNorthEast7, that.directionNorthEast, that.anglex, that.TyphoonCircleColor7.R7, that.TyphoonCircleColor7.G7, that.TyphoonCircleColor7.B7, that.TyphoonCircleColor7.A7)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusNorthWast7, that.directionNorthWast, that.anglex, that.TyphoonCircleColor7.R7, that.TyphoonCircleColor7.G7, that.TyphoonCircleColor7.B7, that.TyphoonCircleColor7.A7)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusSouthEast7, that.directionSouthEast, that.anglex, that.TyphoonCircleColor7.R7, that.TyphoonCircleColor7.G7, that.TyphoonCircleColor7.B7, that.TyphoonCircleColor7.A7)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusSouthWest7, that.directionSouthWest, that.anglex, that.TyphoonCircleColor7.R7, that.TyphoonCircleColor7.G7, that.TyphoonCircleColor7.B7, that.TyphoonCircleColor7.A7)
    SingleAllPrimitiveFill.push(primitiveFill)
    //十级风圈
    primitiveFill = that.setvisible(lat, lon, radiusNorthEast10, that.directionNorthEast, that.anglex, that.TyphoonCircleColor10.R10, that.TyphoonCircleColor10.G10, that.TyphoonCircleColor10.B10, that.TyphoonCircleColor10.A10)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusNorthWast10, that.directionNorthWast, that.anglex, that.TyphoonCircleColor10.R10, that.TyphoonCircleColor10.G10, that.TyphoonCircleColor10.B10, that.TyphoonCircleColor10.A10)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusSouthEast10, that.directionSouthEast, that.anglex, that.TyphoonCircleColor10.R10, that.TyphoonCircleColor10.G10, that.TyphoonCircleColor10.B10, that.TyphoonCircleColor10.A10)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusSouthWest10, that.directionSouthWest, that.anglex, that.TyphoonCircleColor10.R10, that.TyphoonCircleColor10.G10, that.TyphoonCircleColor10.B10, that.TyphoonCircleColor10.A10)
    SingleAllPrimitiveFill.push(primitiveFill)
    //十二级风圈
    primitiveFill = that.setvisible(lat, lon, radiusNorthEast12, that.directionNorthEast, that.anglex, that.TyphoonCircleColor12.R12, that.TyphoonCircleColor12.G12, that.TyphoonCircleColor12.B12, that.TyphoonCircleColor12.A12)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusNorthWast12, that.directionNorthWast, that.anglex, that.TyphoonCircleColor12.R12, that.TyphoonCircleColor12.G12, that.TyphoonCircleColor12.B12, that.TyphoonCircleColor12.A12)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusSouthEast12, that.directionSouthEast, that.anglex, that.TyphoonCircleColor12.R12, that.TyphoonCircleColor12.G12, that.TyphoonCircleColor12.B12, that.TyphoonCircleColor12.A12)
    SingleAllPrimitiveFill.push(primitiveFill)
    primitiveFill = that.setvisible(lat, lon, radiusSouthWest12, that.directionSouthWest, that.anglex, that.TyphoonCircleColor12.R12, that.TyphoonCircleColor12.G12, that.TyphoonCircleColor12.B12, that.TyphoonCircleColor12.A12)
    SingleAllPrimitiveFill.push(primitiveFill)

    return SingleAllPrimitiveFill;
}

/*
清除上一个台风风圈效果
 */
typhoon.prototype.removeTyPrimitives = function (SingleAllPrimitiveFill) {
    if (SingleAllPrimitiveFill) {
        for (var j = 0; j < SingleAllPrimitiveFill.length; j++) {
            let Primitive = SingleAllPrimitiveFill[j]
            if (Primitive) {
                Primitive.remove()
            }

        }
    }
}

/*
      风圈扇形调用方法
      lat:风圈经度
      lon:风圈纬度
      semiMinorAxis：风圈半径
      direction四个扇形的不同方位东北2.5，东南2，西北1，西南1.5R, G, B, A台风颜色值
    */
typhoon.prototype.setvisible = function (lat, lon, semiMinorAxis, direction, anglex, R, G, B, A) {
    var that = this;
    var center = new that.Cesium.Cartographic(that.Cesium.Math.toRadians(lon), that.Cesium.Math.toRadians(lat), 0)
    var eopt = {}
    eopt.semiMinorAxis = semiMinorAxis
    eopt.semiMajorAxis = semiMinorAxis
    eopt.rotation = Math.PI * direction//Math.PI;//逆时针转
    eopt.center = that.Cesium.Cartesian3.fromRadians(center.longitude, center.latitude, center.height)
    eopt.granularity = Math.PI * 2.0 / parseFloat(180)
    //正南为0度
    eopt.angle = Math.PI * 3.0 / anglex
    var ellipse = EllipseGeometryLibraryEx.computeSectorEdgePositions(eopt)
    var raiseopt = {}
    raiseopt.ellipsoid = that.ellipsoid
    raiseopt.height = center.height
    raiseopt.extrudedHeight = 0
    ellipse.outerPositions = EllipseGeometryLibraryEx.raisePositionsToHeight(ellipse.outerPositions, raiseopt, false)
    //转换
    var cartesians = []
    if (!ellipse.outerPositions) {
        return
    }
    for (var i = 0; i < ellipse.outerPositions.length; i += 3) {
        var cartesianTemp = new that.Cesium.Cartesian3(ellipse.outerPositions[i], ellipse.outerPositions[i + 1], ellipse.outerPositions[i + 2])
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
        'viewer': that.viewer,
        'Cartesians': cartesiansPointsFill,
        'Colors': colorsFill
    })
    return primitiveFill
}

typhoon.prototype.destroy = function () {
    this.viewer = null;
    this.Cesium = null;
    this.setIntervalTime = null;//定时器
    this.typhoonSpeed = null;
    this.typhoonData = null;//台风数据
    this.pointlayerImage = null;//图片对象组
    this.pointInfo = null;//主点信息组
    this.typhoonNumber = null;//台风编号
    this.typhoonName = null;//台风名称
    this.mainlandForecastinfo = null;//中国大陆预测点得信息
    this.japanForecastinfo = null;//日本预测点信息组
    this.taiwanForecastinfo = null;//台湾预测点信息组
    this.usaForecastinfo = null;//美国预测点的信息组
    this.hkForecastinfo = null;//中国香港预测点信息组
    this.count = null;//采用定时器绘制半路预测计数器
    this.pointlength = null;//采用定时器方法绘制半路预测点数长度
    this.typhoonPointTime = null;//台风主点绘制的所以时间戳

    this.polylineColor = null;//台风线得颜色
    this.clampToGround = null;//台风线段是否贴地
    this.typhoonPointscale = null;//台风点像素大小
    this.ForecastPointScale = null;//中国预测点像素大小
    this.polylineWith = null;//台风线得宽度
    this.chinaForecastLineWith = null;//中国预测线宽度
    this.japanForecastLineWith = null;//日本预测线宽度
    this.taiwanForecastLineWith = null;//中国台湾预测线宽度
    this.usaForecastLineWith = null;//美国预测线宽度
    this.hkForecastLineWith = null;//中国香港预测线宽度
    this.chinaForecastLineColor = null;//中国预测线颜色
    this.japanForecastLineColor = null;//日本预测线颜色
    this.taiwanForecastLineColor = null;//中国台湾预测线颜色
    this.usaForecastLineColor = null;//美国预测线颜色
    this.hkForecastLineColor = null;//美国预测线颜色

    this.chinaForecastPointLineIsshow = null;//中国预测点线是否显示
    this.jpanForecastPointLineIsshow = null;//日本预测点线是否显示
    this.taiwanForecastPointLineIsshow = null;//台湾预测点线是否显示
    this.usaForecastPointLineIsshow = null;//美国预测点线是否显示
    this.hkForecastPointLineIsshow = null;//香港预测点线是否显示
    this.mainlandForecastMaxCount = null;
    this.japanForecastMaxCount = null;
    this.taiwanForecastMaxCount = null;
    this.usaForecastMaxCount = null;
    this.hkForecastMaxCount = null;
    this.TyphoonPointEntities = null;//台风主点中所有点的集合得entity信息
    this.TyphoonLineEntities = null;//台风主点中所有线的集合得entity信息
    this.mainlandForecastPointEntities = null;//中国预测点实体集合
    this.mainlandForecastLineEntities = null;//中国预测线实体集合
    this.japanForecastPointEntities = null;//日本预测点实体集合
    this.japanForecastLineEntities = null;//日本预测点实体集合
    this.usaForecastPointEntities = null;//美国预测点实体集合
    this.usaForecastLineEntities = null;//美国预测点实体集合
    this.taiwanForecastPointEntities = null;//中国台湾预测点实体集合
    this.taiwanForecastLineEntities = null;//中国台湾预测点实体集合
    this.hkForecastPointEntities = null;//中国台湾预测点实体集合
    this.hkForecastLineEntities = null;//中国台湾预测点实体集合
    this.TyphoonModelEntities = null;//台风模型实体点
    this.firstPointlat = null;//第一个点的纬度信息
    this.firstPointlon = null;//第一个点的经度信息
    this.rotationSpeed = null;//风圈旋转速率
    this.typhoonMarkerWorld = null;//台风标签全局World坐标
    //台风扇形属性定义
    this.directionNorthEast = null;//扇形方向东北2.5
    this.directionSouthEast = null;//扇形方向东南2
    this.directionNorthWast = null;//扇形西北方向1
    this.directionSouthWest = null;//扇形方向西南1.5
    this.anglex = null;//扇形角度,现在为90度
    this.TyphoonCircleColor7 = null;//台风七级风圈色值rgba定义
    this.TyphoonCircleColor10 = null;//台风十级风圈色值rgba定义
    this.TyphoonCircleColor12 = null;//台风十二级风圈色值rgba定义
    this.tyPrimitives = null;//台风风圈数组
    this.ellipsoid = null;//台风采用的坐标系
}
/*
添加风圈image旋转效果
 */
typhoon.prototype.addBillboardRotation = function (info) {
    var that = this;
    var entity = that.viewer.entities.add({
        id: that.typhoonNumber + that.typhoonName,
        name: 'typhoonCircle',
        position: that.Cesium.Cartesian3.fromDegrees(info.lon, info.lat, 6),
        billboard: {
            image: "static/typhoonImage/cirecleImage.png",
            rotation: new that.Cesium.CallbackProperty(getRotationValue, false),
            stRotation: new that.Cesium.CallbackProperty(getRotationValue, false),
            scale: 0.8
        }
    });
    var rotation = that.Cesium.Math.toRadians(that.rotationSpeed)
    function getRotationValue() {
        rotation += 0.09;
        return rotation;
    }
    return entity;

}

typhoon.prototype.addTyphoonHtmlChangePosition = function () {
    var that = this;
    that.typhoonMarkerWorld = that.Cesium.Cartesian3.fromDegrees(that.firstPointlon, that.firstPointlat)
    var screenLocation = that.Cesium.SceneTransforms.wgs84ToWindowCoordinates(that.viewer.scene, that.typhoonMarkerWorld)
    var simTyLocation = { x: screenLocation.x, y: screenLocation.y }
    var leftXMarker = screenLocation.x + 18
    var topYMarker = screenLocation.y + 54
    that.CreateTyphoonHtml(leftXMarker, topYMarker);

    that.tyNameListener = that.viewer.scene.postRender.addEventListener(function () {
        var simTyLocation02 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(that.viewer.scene, that.typhoonMarkerWorld)
        if (simTyLocation02 && simTyLocation !== simTyLocation02) {
            var changeLeftX = simTyLocation02.x + 18
            var changeTopY = simTyLocation02.y + 54
            if (menuStatus == "水情专题大屏") {
                that.changeHtmlMarkerPosition(changeLeftX + 5, changeTopY - 70)
            } else if (that.typhoonViewer == "viewer") {
                that.changeHtmlMarkerPosition(changeLeftX, changeTopY)
            } else if (that.typhoonViewer == "viewerTy") {
                that.changeHtmlMarkerPosition(changeLeftX, changeTopY - 70)
            }

        }
    })
}



// 台风标签
typhoon.prototype.CreateTyphoonHtml = function (leftX, topY) {
    var that = this;
    let TyphoonmarkerHtml = "";
    if (that.typhoonViewer == "viewer") {
        TyphoonmarkerHtml = '<div class="typhoon_marker typhoon_marker_' + that.typhoonNumber + '">' +
            '<span></span>' +
            '<p>' + that.typhoonNumber + '-' + that.typhoonName + '</p>' +
            '</div>'
        $('body').append(TyphoonmarkerHtml)
    } else if (that.typhoonViewer == "viewerTy") {
        TyphoonmarkerHtml = '<div class="typhoon_marker_small typhoon_marker_small_' + that.typhoonNumber + '">' +
            '<span></span>' +
            '<p>' + that.typhoonNumber + '-' + that.typhoonName + '</p>' +
            '</div>'
        $('.typhoonContaner').append(TyphoonmarkerHtml)
    }
    that.changeHtmlMarkerPosition(leftX, topY)
}

typhoon.prototype.changeHtmlMarkerPosition = function (leftX, topY) {
    var that = this;
    if (that.typhoonViewer == "viewer") {
        $('.typhoon_marker_' + that.typhoonNumber).css({
            left: leftX,
            top: topY
        })
    } else if (that.typhoonViewer == "viewerTy") {
        $('.typhoon_marker_small_' + that.typhoonNumber).css({
            left: leftX,
            top: topY
        })
    }
}


/*
判断时间和那个点位时间戳相近，并返回其中对应得下标
 */
function getTimeIndex(typhoonPointTime, timeNumber) {
    for (let key in typhoonPointTime) {
        if (key > timeNumber) {
            return typhoonPointTime[key]
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
        if (pick && pick.id && pick.id.id && (pick.id.name === '热带风暴' || pick.id.name === '热带低压' || pick.id.name === '强热带风暴' || pick.id.name === '台风' || pick.id.name === '强台风' || pick.id.name === '超强台风' || pick.id.name === '预测点') && pick.id._properties) {
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
 * 台风点信息弹窗删除
 */
function typhoonInfoDelete() {
    $('.typhone_info').hide()
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