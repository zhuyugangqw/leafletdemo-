
var url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
L.TileLayer.WebDogTileLayer = L.TileLayer.extend({
    getTileUrl: function (tilePoint) {
        var urlArgs,
            getUrlArgs = this.options.getUrlArgs;

        if (getUrlArgs) {
            var urlArgs = getUrlArgs(tilePoint);
        } else {
            urlArgs = {
                z: tilePoint.z,
                x: tilePoint.x,
                y: tilePoint.y
            };
        }

        return L.Util.template(this._url, L.extend(urlArgs, this.options, { s: this._getSubdomain(tilePoint) }));
    }
});

L.tileLayer.webdogTileLayer = function (url, options) {
    return new L.TileLayer.WebDogTileLayer(url, options);
};
var map = L.map('map',
    {
        // crs: L.CRS.EPSG4326,
        zoomControl: true,
        editable: true,
        worldCopyJump: true
    }).setView([22.27231859990752, 113.56710553339326], 13);
const txUrl = 'http://p{s}.map.gtimg.com/demTiles/{z}/{x}/{y}/{x}_{y}.jpg';
// const txUrl = 'http://p{s}.map.gtimg.com/sateTiles/{z}/{x16}/{y16}/{x}_{y}.jpg';
// const txUrl = 'http://p{s}.map.gtimg.com/sateTiles/{z}/{x}/{y}/{x}_{y}.jpg?version=239'
const options = {
    subdomains: '0123',
    minZoom: 3,
    tms: true,
    getUrlArgs: function (tilePoint) {
        return {
            z: tilePoint.z,
            x: tilePoint.x,
            y: Math.pow(2, tilePoint.z) - 1 - tilePoint.y
        };
    }
};
const txLayer = L.tileLayer.webdogTileLayer(txUrl, options).addTo(map);
// 将图层加载到地图上，并设置最大的聚焦还有map样式
// 添加电子地图影像
// var vector_map = L.tileLayer("https://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&LAYER=vec&TILEMATRIXSET=c&FORMAT=tiles&VERSION=1.0.0&STYLE=default&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=93724b915d1898d946ca7dc7b765dda5", {
//     maxZoom: 17,
//     tileSize: 256,
//     zoomOffset: 1,
//     minZoom: 3
// }).addTo(map);
// //添加注记
// var vector_note = L.tileLayer("https://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&LAYER=cva&TILEMATRIXSET=c&FORMAT=tiles&VERSION=1.0.0&STYLE=default&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=93724b915d1898d946ca7dc7b765dda5", {
//     maxZoom: 17,
//     tileSize: 256,
//     zoomOffset: 1,
//     zIndex: 5,
//     minZoom: 3
// }).addTo(map);
// L.control.scale().addTo(map);
// var normalm1 = L.tileLayer.chinaProvider('Geoq.Normal.Map', {
//     maxZoom: 18,
//     minZoom: 1
// });
// var normalm2 = L.tileLayer.chinaProvider('Geoq.Normal.Color', {
//     maxZoom: 18,
//     minZoom: 1
// });
// var normalm3 = L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', {
//     maxZoom: 18,
//     minZoom: 1
// });
// var normalm4 = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {
//     maxZoom: 18,
//     minZoom: 1
// });
// var normalm5 = L.tileLayer.chinaProvider('Geoq.Normal.Warm', {
//     maxZoom: 18,
//     minZoom: 1
// });
// var normalm6 = L.tileLayer.chinaProvider('Geoq.Normal.Cold', {
//     maxZoom: 18,
//     minZoom: 1
// });
// /**  
//  * 天地图内容  
//  */
// var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
//     maxZoom: 18,
//     minZoom: 1
// }),
//     normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
//         maxZoom: 18,
//         minZoom: 1
//     }),
//     imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
//         maxZoom: 18,
//         minZoom: 1
//     }),
//     imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
//         maxZoom: 18,
//         minZoom: 1
//     });

// var normal = L.layerGroup([normalm, normala]),
//     image = L.layerGroup([imgm, imga]);
// /**  
//  * 谷歌  
//  */
// var normalMap = L.tileLayer.chinaProvider('Google.Normal.Map', {
//     maxZoom: 18,
//     minZoom: 5
// }),
//     satelliteMap = L.tileLayer.chinaProvider('Google.Satellite.Map', {
//         maxZoom: 18,
//         minZoom: 5
//     });
// /**  
//  * 高德地图  
//  */
// var Gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
//     maxZoom: 18,
//     minZoom: 5
// });
// var Gaodimgem = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
//     maxZoom: 18,
//     minZoom: 5
// });
// var Gaodimga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
//     maxZoom: 18,
//     minZoom: 5
// });
// var Gaodimage = L.layerGroup([Gaodimgem, Gaodimga]);



// var baseLayers = {
//     "智图地图": normalm1,
//     "智图午夜蓝": normalm3,
//     "智图灰色": normalm4,
//     "智图暖色": normalm5,
//     "天地图": normal,
//     "天地图影像": image,
//     "谷歌地图": normalMap,
//     "谷歌影像": satelliteMap,
//     "高德地图": Gaode,
//     "高德影像": Gaodimage,

// }

// var map = L.map("map", {
//     center: [31.59, 120.29],
//     zoom: 12,
//     layers: [normal],
//     // zoomControl: false
// });




// L.control.layers(baseLayers, null).addTo(map);
// L.control.scale().addTo(map);
console.log(map)
var change_image_map;
var change_vector_map;
function changeLayer(map_name) {



    if (map_name == "遥感") {
        map.removeLayer(normal);
        map.addLayer(image);
    } else if (map_name == "电子") {
        map.removeLayer(image);
        map.addLayer(normal);
    }

    // if (map_name == "遥感") {

    //     map.removeLayer(vector_map);
    //     if (change_vector_map) {
    //         map.removeLayer(change_vector_map);
    //     }
    //     change_image_map = L.tileLayer("http://t1.tianditu.com/img_c/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=93724b915d1898d946ca7dc7b765dda5", {
    //         maxZoom: 17,
    //         tileSize: 256,
    //         zoomOffset: 1
    //     }).addTo(map);
    // }
    // if (map_name == "电子") {
    //     map.removeLayer(change_image_map);
    //     change_vector_map = L.tileLayer("http://t1.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=93724b915d1898d946ca7dc7b765dda5", {
    //         maxZoom: 17,
    //         tileSize: 256,
    //         zoomOffset: 1
    //     }).addTo(map);

    // }
}
var typhoons = [];
var typhoonOne

//天气
function getForecastData(url, fn) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: function (data) {
            if (fn) fn(data)
        },
        error: function () { }

    });
}
function addTyphoonByNumber(number) {

    var path = ""
    switch (number) {
        case 201822:
            path = "data/201822.json"
            break;
        case 201823:
            path = "data/201823.json"
            break;
        case 201824:
            path = "data/201824.json"
            break;
        case 201825:
            path = "data/201825.json"
            break;
        case 201826:
            path = "data/201826.json"
            break;
    }
    getForecastData(path, function (res) {
        //    if(res.code==200&&res.data){
        //     var landCity = res.data;
        //     typhoonOne = new typhoon(map, number, landCity)  
        //    }
        var landCity = res.array;
        console.log(res);
        typhoonOne = new typhoon(map, number, landCity)
        typhoons.push(typhoonOne);
        // drawTyphoon(landCity)
    })
}

function ReplayTyphoon() {
    typhoonOne.Replay();
}


function drawTyphoon(typhoonTestData) {
    //台风模块
    var pointlayerImage = {};//台风图片颜色
    //先分析台风的数据格式，与leafLet提供给的polyline方法不一样
    //需要做一个数据转换
    //定义数据转换的函数
    //折线图层
    var lineLayer;
    //点图层
    var pointLayer;
    //台风风圈对象
    var primitiveFill;
    //台风风圈数组
    var tyPrimitives = [];
    //台风标志图层
    var marker;
    var mainlandForecastList = [];
    var mainlandForecastinfo = {};
    var japanForecastList = [];
    var japanForecastinfo = {};
    var taiwanForecastList = [];
    var taiwanForecastinfo = {};
    var usaForecastList = [];
    var usaForecastinfo = {};
    var radius = {};
    var typhoonName;
    var typhoonNumber;
    var allpoints = dataHandler();
    // //绘制蓝色台风路径
    // polyline = L.polyline(allpoints, {color: "#00BFFF"}).addTo(map);
    // // //校正地图中心位置
    // map.fitBounds(polyline.getBounds());
    // //移除静态路径折线
    // map.removeLayer(polyline);
    //调用使折线动态绘制的函数
    // animateDrawLine();
    var typhoonIcon = L.icon({
        iconUrl: 'image/typhoon.png',
        iconSize: [28, 28],
        // iconAnchor: [15, 15]
    });
    function dataHandler() {
        //获取台风坐标点数据对象
        var forecast = typhoonTestData[0]['points'];
        //定义折线点数据的新数组
        var polylinePoints = [];
        //台风名称
        typhoonName = typhoonTestData[0].name;
        typhoonNumber = typhoonTestData[0].tfid;
        //找到经纬度数据，存放在新数组中
        for (var i = 0; i < forecast.length; i++) {
            var points = forecast[i];
            polylinePoints.push([Number(points['lat']), Number(points['lng'])])
            var typhoon_Rank_name = points.strong;
            var typhoonImage = TyphoonImageRank(typhoon_Rank_name)
            radius[i] = {
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
                number: typhoonNumber
            }
            pointlayerImage[i] = {
                icon: L.icon({
                    iconUrl: typhoonImage,
                    iconSize: [10, 10]
                })
            }
            //添加预测点线的经纬度
            if (i == forecast.length - 1) {
                console.log(typhoonTestData);
                var forecastPointData = forecast[i].forecast
                console.log(forecastPointData);
                forecastPointData.forEach((item, index, arr) => {
                    if (item.tm == "中国") {
                        item.forecastpoints.forEach((item, index) => {
                            mainlandForecastList.push([Number(item.lat), Number(item.lng)])
                            mainlandForecastinfo[index] = {
                                lat: item.lat,
                                lng: item.lng,
                                power: item.power,
                                pressure: item.pressure,
                                speed: item.speed,
                                strong: item.strong,
                                time: item.time,
                                tm: "中国",
                                name: typhoonName,
                                number: typhoonNumber
                            };
                        });
                    } else {
                        if (item.tm == "日本") {
                            item.forecastpoints.forEach((item, index) => {
                                japanForecastList.push([Number(item.lat), Number(item.lng)])
                                japanForecastinfo[index] = {
                                    lat: item.lat,
                                    lng: item.lng,
                                    power: item.power,
                                    pressure: item.pressure,
                                    speed: item.speed,
                                    strong: item.strong,
                                    time: item.time,
                                    tm: "日本",
                                    name: typhoonName,
                                    number: typhoonNumber
                                };
                            });
                        } else {
                            if (item.tm == "美国") {
                                item.forecastpoints.forEach((item, index) => {
                                    usaForecastList.push([Number(item.lat), Number(item.lng)])
                                    usaForecastinfo[index] = {
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
                                    };
                                });
                            } else {
                                if (item.tm == "中国台湾") {
                                    item.forecastpoints.forEach((item, index) => {
                                        taiwanForecastList.push([Number(item.lat), Number(item.lng)])
                                        taiwanForecastinfo[index] = {
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
                                    });
                                }
                            }
                        }
                    }
                });
            }

        }
        return polylinePoints;
    };

    console.log(radius);
    function drawForecastPointLine() {
        L.polyline(mainlandForecastList, { weight: 3, className: 'mainlandtestSvg', opacity: 0.5 }).addTo(map);
        L.polyline(japanForecastList, { weight: 3, className: 'japantestSvg', opacity: 0.5 }).addTo(map);
        L.polyline(usaForecastList, { weight: 3, className: 'usatestSvg', opacity: 0.5 }).addTo(map);
        L.polyline(taiwanForecastList, { weight: 3, className: 'taiwantestSvg', opacity: 0.5 }).addTo(map);
        mainlandForecastList.forEach((item, index) => {
            var strong = mainlandForecastinfo[index].strong;
            var Image = TyphoonImageRank(strong)
            var forcePointImage = L.icon({
                iconUrl: Image,
                iconSize: [10, 10]
            });
            L.marker(item, { icon: forcePointImage }).addTo(map).bindPopup(
                "<b>" +
                "台风编号：" + mainlandForecastinfo[index].number + "-" + mainlandForecastinfo[index].name +
                "</b><br>" +
                "预报机构：" + mainlandForecastinfo[index].tm +
                "<br>" +
                "登录时间" + mainlandForecastinfo[index].time +
                "<br>经度：" + mainlandForecastinfo[index].lng +
                "<br>纬度：" + mainlandForecastinfo[index].lat +
                "<br>强度：" + mainlandForecastinfo[index].strong +
                "<br>"
                ,
                {
                    offset: [0, -30],
                    className: "typhoonInfo"
                }
            ).closePopup();
        });
        japanForecastList.forEach((item, index) => {
            var strong = japanForecastinfo[index].strong;
            console.log(strong);
            var Image = TyphoonImageRank(strong)
            var forcePointImage = L.icon({
                iconUrl: Image,
                iconSize: [10, 10]
            });
            L.marker(item, { icon: forcePointImage }).addTo(map).bindPopup(
                "<b>" +
                "台风编号：" + japanForecastinfo[index].number + "-" + japanForecastinfo[index].name +
                "</b><br>" +
                "预报机构：" + japanForecastinfo[index].tm +
                "<br>" +
                "登录时间" + japanForecastinfo[index].time +
                "<br>经度：" + japanForecastinfo[index].lng +
                "<br>纬度：" + japanForecastinfo[index].lat +
                "<br>强度：" + japanForecastinfo[index].strong +
                "<br>"
                ,
                {
                    offset: [0, -30],
                    className: "typhoonInfo"
                }
            ).closePopup();
        });
        usaForecastList.forEach((item, index) => {
            var strong = usaForecastinfo[index].strong;
            var Image = TyphoonImageRank(strong)
            var forcePointImage = L.icon({
                iconUrl: Image,
                iconSize: [10, 10]
            });

            L.marker(item, { icon: forcePointImage }).addTo(map).bindPopup(
                "<b>" +
                "台风编号：" + usaForecastinfo[index].number + "-" + usaForecastinfo[index].name +
                "</b><br>" +
                "预报机构：" + usaForecastinfo[index].tm +
                "<br>" +
                "登录时间" + usaForecastinfo[index].time +
                "<br>经度：" + usaForecastinfo[index].lng +
                "<br>纬度：" + usaForecastinfo[index].lat +
                "<br>强度：" + usaForecastinfo[index].strong +
                "<br>"
                ,
                {
                    offset: [0, -30],
                    className: "typhoonInfo"
                }
            ).closePopup();
        });
        taiwanForecastList.forEach((item, index) => {
            var strong = taiwanForecastinfo[index].strong;
            var Image = TyphoonImageRank(strong)
            var forcePointImage = L.icon({
                iconUrl: Image,
                iconSize: [10, 10]
            });
            L.marker(item, { icon: forcePointImage }).addTo(map).bindPopup(
                "<b>" +
                "台风编号：" + taiwanForecastinfo[index].number + "-" + taiwanForecastinfo[index].name +
                "</b><br>" +
                "预报机构：" + taiwanForecastinfo[index].tm +
                "<br>" +
                "登录时间" + taiwanForecastinfo[index].time +
                "<br>经度：" + taiwanForecastinfo[index].lng +
                "<br>纬度：" + taiwanForecastinfo[index].lat +
                "<br>强度：" + taiwanForecastinfo[index].strong +
                "<br>"
                ,
                {
                    offset: [0, -30],
                    className: "typhoonInfo"
                }
            ).closePopup();
        });
    }





    function TyphoonImageRank(typhoon_Rank_name) {
        var typhoon_point_image = "";
        switch (typhoon_Rank_name) {
            case "热带风暴":
                typhoon_point_image = "image/typhoonimage/Tropical_Storm_Point_image.png";
                break;

            case "台风":
                typhoon_point_image = "image/typhoonimage/Typhoon_Point_image.png";
                break;

            case "强台风":
                typhoon_point_image = "image/typhoonimage/Violent_Typhoon_Point_image.png";
                break;

            case "超强台风":
                typhoon_point_image = "image/typhoonimage/Super_Typhoon_Point_image.png";
                break;

            case "强热带风暴":
                typhoon_point_image = "image/typhoonimage/Server_Tropical_Storm_Point_image.png";
                break;

            case "热带低压":
                typhoon_point_image = "image/typhoonimage/Tropical_Depression_Point_image.png";
                break;
            default:
                typhoon_point_image = "image/typhoonimage/Typhoon_Point_image.png";
        }
        return typhoon_point_image;
    }
    //数据转换后得到经纬度数据


    //获取台风具体的描述信息
    var land = typhoonTestData[0]['land'][0];
    //动态绘制折线
    function animateDrawLine() {
        var length = allpoints.length;
        //定义用来存放递增元素的经纬度数据
        var drawPoints = [];
        var count = 0;
        //定时器100ms，动态的塞入坐标数据
        var timer = setInterval(
            function () {
                //循环台风路径中的每个点，设置定时器依次描绘
                if (count < length) {
                    drawPoints.push(allpoints[count]);
                    count++;
                    //清除之前绘制的折线图层
                    if (lineLayer && count !== length) {
                        map.removeLayer(lineLayer);
                        lineLayer = null;
                    }
                    //清除之前的marker图层
                    if (marker && count !== length) {
                        map.removeLayer(marker);
                        marker = null;
                    }
                    if (tyPrimitives.length != 0) {
                        romovecircle()
                    }
                    //最新数据点drawPoints绘制折线
                    lineLayer = L.polyline(drawPoints, { color: "#00BFFF" }).addTo(map);

                    //根据最新的数据组最后一个绘制marker
                    if (count === length) {
                        map.removeLayer(marker);
                        drawForecastPointLine()
                        drawSingleCircle(drawPoints[count - 1], count - 1)
                        pointLayer = L.marker(drawPoints[count - 1], { icon: pointlayerImage[count - 1].icon }).addTo(map);
                        //如果是路径最后一个点，自动弹出信息框
                        marker = L.marker(drawPoints[length - 1],
                            {
                                icon: L.divIcon({
                                    className: "dIcon",
                                    html: `<div class="live"><img src="image/typhoon.png"></div>`,
                                    iconSize: [20, 20],
                                })
                            })
                            .addTo(map).bindPopup(
                                "<b>" +
                                "台风编号：" + radius[count - 1].number + "-" + radius[count - 1].name +
                                "</b><br>" +
                                "过去时间：" + radius[count - 1].time +
                                "<br>" +
                                "中心位置：" + radius[count - 1].lat + "  " + radius[count - 1].lng +
                                "<br>" +
                                "最大风力：" + radius[count - 1].strong +
                                "<br>" +
                                "最大风速：" + radius[count - 1].speed +
                                "<br>" +
                                "中心气压：" + radius[count - 1].pressure +
                                "<br>" +
                                "移动速度：" + radius[count - 1].movespeed +
                                "<br>" +
                                "移动风向：" + radius[count - 1].movedirection +
                                "<br>" +
                                "七级风圈：" + radius[count - 1].radius7 +
                                "<br>" +
                                "10级风圈：" + radius[count - 1].radius10 +
                                "<br>" +
                                "12级风圈：" + radius[count - 1].radius12 +
                                "<br>"
                                ,
                                {
                                    offset: [0, -120],
                                    className: "typhoonInfo"
                                }
                            ).closePopup();

                    } else {
                        drawSingleCircle(drawPoints[count - 1], count)
                        pointLayer = L.marker(drawPoints[count - 1], {
                            icon: pointlayerImage[count - 1].icon,
                            title: "我是谁",
                            riseOnHover: true,
                            keyboard: true
                        }).addTo(map).bindPopup(
                            "<b>" +
                            "台风编号：" + radius[count - 1].number + "-" + radius[count - 1].name +
                            "</b><br>" +
                            "过去时间：" + radius[count - 1].time +
                            "<br>" +
                            "中心位置：" + radius[count - 1].lat + "  " + radius[count - 1].lng +
                            "<br>" +
                            "最大风力：" + radius[count - 1].strong +
                            "<br>" +
                            "最大风速：" + radius[count - 1].speed +
                            "<br>" +
                            "中心气压：" + radius[count - 1].pressure +
                            "<br>" +
                            "移动速度：" + radius[count - 1].movespeed +
                            "<br>" +
                            "移动风向：" + radius[count - 1].movedirection +
                            "<br>" +
                            "七级风圈：" + radius[count - 1].radius7 +
                            "<br>" +
                            "10级风圈：" + radius[count - 1].radius10 +
                            "<br>" +
                            "12级风圈：" + radius[count - 1].radius12 +
                            "<br>"
                            ,
                            {
                                offset: [0, -120],
                                className: "typhoonInfo"
                            }
                        ).closePopup();
                        //取已绘制点数组中最后一个点，放置台风标志
                        marker = L.marker(drawPoints[count - 1],
                            {
                                icon: typhoonIcon
                            }).addTo(map);

                    }


                } else {
                    //取完数据后清除定时器
                    clearInterval(timer);
                }
            }, 50);
    }

    animateDrawLine();
    var typhoonIconfirst = L.icon({
        iconUrl: 'image/blankImage.png',
        iconSize: [1, 1],
        // iconAnchor: [15, 15]
    });
    pointLayer = L.marker([radius[0].lat, radius[0].lng], {
        icon: typhoonIconfirst,
        title: "我是谁",
        riseOnHover: true,
        keyboard: true

    }).addTo(map).bindTooltip(typhoonNumber + "-" + typhoonName,
        {
            direction: 'right',
            offset: [10, 0],
            permanent: true,
            opacity: "1",
            className: "labelName"
        }).openTooltip();
    function drawSingleCircle(latlng, count) {
        var radius7 = radius[count].radius7;
        var radius10 = radius[count].radius10;
        var radius12 = radius[count].radius12;
        var radius7 = radius7.split('|')
        var radius10 = radius10.split('|')
        var radius12 = radius12.split('|')
        //绘制七级风圈
        if (radius7.length > 1) {
            var radiusNorthEast7 = radius7[0] / 100
            var radiusSouthEast7 = radius7[1] / 100
            var radiusNorthWast7 = radius7[2] / 100
            var radiusSouthWest7 = radius7[3] / 100
            setvisible(latlng, radiusNorthEast7, "NorthEast", "green")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusSouthEast7, "SouthEast", "green")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusNorthWast7, "NorthWest", "green")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusSouthWest7, "SouthWest", "green")
            // tyPrimitives.push(primitiveFill);
        }
        //绘制十级风圈
        if (radius10.length > 1) {
            var radiusNorthEast10 = radius10[0] / 100
            var radiusSouthEast10 = radius10[1] / 100
            var radiusNorthWast10 = radius10[2] / 100
            var radiusSouthWest10 = radius10[3] / 100
            setvisible(latlng, radiusNorthEast10, "NorthEast", "pink")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusSouthEast10, "SouthEast", "pink")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusNorthWast10, "NorthWest", "pink")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusSouthWest10, "SouthWest", "pink")
            // tyPrimitives.push(primitiveFill);
        } if (radius12.length > 1) {
            //绘制十二级风圈
            var radiusNorthEast12 = radius12[0] / 100
            var radiusSouthEast12 = radius12[1] / 100
            var radiusNorthWast12 = radius12[2] / 100
            var radiusSouthWest12 = radius12[3] / 100
            setvisible(latlng, radiusNorthEast12, "NorthEast", "red")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusSouthEast12, "SouthEast", "red")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusNorthWast12, "NorthWest", "red")
            // tyPrimitives.push(primitiveFill);
            setvisible(latlng, radiusSouthWest12, "SouthWest", "red")
            // tyPrimitives.push(primitiveFill);
        }
    }


    function setvisible(latlng, semiMinorAxis, anglex, color) {
        var anglexdirection = {
            NorthEast: [0, 90], SouthEast: [90, 180], SouthWest: [180, 270], NorthWest: [270, 360]
        };
        var points3 = getPoints(latlng, semiMinorAxis, anglexdirection[anglex][0], anglexdirection[anglex][1], 500);
        primitiveFill = new L.polygon(points3, {
            color: color,
            fillColor: color,
            fillOpacity: 0.4,
            weight: 0
        }).addTo(map).bindPopup("一个白痴");
        tyPrimitives.push(primitiveFill);
        function getPoints(center, radius, startAngle, endAngle, pointNum) {
            var sin;
            var cos;
            var x;
            var y;
            var angle;
            var points = new Array();
            points.push(center);
            for (var i = 0; i <= pointNum; i++) {
                angle = startAngle + (endAngle - startAngle) * i / pointNum;
                sin = Math.sin(angle * Math.PI / 180);
                cos = Math.cos(angle * Math.PI / 180);
                y = center[0] + radius * cos;
                x = center[1] + radius * sin;
                points[i] = [y, x];
            }
            var point = points;
            point.push(center);
            return point;
        }



    }

    function romovecircle() {
        for (var j = 0; j < tyPrimitives.length; j++) {
            map.removeLayer(tyPrimitives[j]);
        }
        tyPrimitives = [];
    }

}



function removetyphoon() {
    map.removeLayer(marker);
    for (var j = 0; j < tyPrimitives.length; j++) {
        map.removeLayer(tyPrimitives[j]);
    }
    tyPrimitives = [];
}




var myLayerchinaforceline = new L.LayerGroup();//中国预测线段
var myLayerchinaforcepoint = new L.LayerGroup();//中国预测线点
var myLayerjapanforcepoint = new L.LayerGroup();//日本预测点
var myLayerjapanforceline = new L.LayerGroup();//日本预测线
var myLayertaiwanforcepoint = new L.LayerGroup();//台湾预测点
var myLayertaiwanforceline = new L.LayerGroup();//台湾预测线
var myLayerAmericanforcepoint = new L.LayerGroup();//美国预测点
var myLayerAmericanforceline = new L.LayerGroup();//美国预测线


var areaMeasure = {
    array: [],
    points: [],
    color: "red",
    layers: L.layerGroup(),
    polygon: null,
    init: function () {
        areaMeasure.points = [];
        areaMeasure.polygon = null;
        map.on('click', areaMeasure.click).on('dblclick', areaMeasure.dblclick);
    },
    // close:function(){
    //     var lab = rectangleMeasure.tips.getLabel();
    //     var tt = document.createTextNode(rectangleMeasure.tips.getLabel()._content);
    //     lab._container.innerHTML = "";
    //     lab._container.appendChild(tt);
    //     var span = document.createElement("span");
    //     span.innerHTML = "【关闭】";
    //     span.style.color = "#00ff40";
    //     lab._container.appendChild(span);
    //     L.DomEvent.addListener(span,"click",function(){
    //         rectangleMeasure.destory();
    //     });
    // },
    click: function (e) {
        map.doubleClickZoom.disable();
        // 添加点信息
        areaMeasure.points.push(e.latlng);
        // 添加面
        map.on('mousemove', areaMeasure.mousemove);
        areaMeasure.array.push([e.latlng.lat, e.latlng.lng]);
    },
    mousemove: function (e) {
        areaMeasure.points.push(e.latlng);
        if (areaMeasure.polygon)
            map.removeLayer(areaMeasure.polygon);
        areaMeasure.polygon = L.polygon(areaMeasure.points, { showMeasurements: false, color: 'red' });
        //areaMeasure.polygon.addTo(map);
        areaMeasure.polygon.addTo(areaMeasure.layers);
        areaMeasure.layers.addTo(map);
        areaMeasure.points.pop();
    },
    dblclick: function (e) { // 双击结束
        areaMeasure.polygon.addTo(areaMeasure.layers);
        areaMeasure.polygon.enableEdit();
        map.on('editable:vertex:drag editable:vertex:deleted', areaMeasure.polygon.updateMeasurements, areaMeasure.polygon);
        map.off('click', areaMeasure.click).off('mousemove', areaMeasure.mousemove).off('dblclick', areaMeasure.dblclick);
        areaMeasure.array.push([e.latlng.lat, e.latlng.lng]);
        console.log(areaMeasure.array);
    },
    destory: function () {
        areaMeasure.layers.clearLayers();
    }
}