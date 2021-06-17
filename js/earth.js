Cesium.Ion.defaultServer = './Cesium/cesium_ion.json'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYzU3ZGJlZC0wMjc2LTQxNzgtYTZkMS1jMTg1NGM1ZGM2ZDQiLCJpZCI6MTI2MTEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzIzNDA5NjF9.6DiCeUrrG57Z3ok8wOpt6VpP8y9nq_VKxkF1jDMFe9M'

var viewer = new Cesium.Viewer('cesiumContainer', {
    navigationHelpButton: false, // 是否显示右上角的帮助按钮
    infoBox: false, // 是否显示信息框,是否显示点击要素之后显示的信息
    homeButton: false, // 是否显示Home按钮
    selectionIndicator: false, // 是否显示选取指示器组件
    sceneModePicker: false, // 是否显示3D/2D选择器
    baseLayerPicker: false, // 是否显示图层选择器
    fullscreenButton: false, // 是否显示全屏按钮
    geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
    shouldAnimate: true,
    // requestVertexNormals: true // 光照
})
/* 去除Cesium图标 */
viewer._cesiumWidget._creditContainer.style.display = 'none'
/* 隐藏timeline和animation */
viewer.timeline.container.style.visibility = 'hidden'
viewer.timeline.container.style.display = 'none'
viewer.animation.container.style.visibility = 'hidden'
viewer.animation.container.style.display = 'none'
/* 去除大气层效果 */
viewer.scene.globe.showGroundAtmosphere = false
// 更亮的星空
viewer.scene.highDynamicRange = false
/* 指南针插件 */
var optionsNavigation = {}
optionsNavigation.defaultResetView = Cesium.Cartographic.fromDegrees(113.517628, 23.353899, 2000000) //缩放控件的初始位置
viewer.extend(Cesium.viewerCesiumNavigationMixin, optionsNavigation)

/* 初始化图层 */
viewer.imageryLayers.removeAll()
// 服务负载子域
var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
// 服务域名
var tdtUrl = 'https://t{s}.tianditu.gov.cn/'
var token = 'f50c5a9a2a952f5df773fbc0ff6c5aec'
// 天地图底图
var shadedReliefTianditu = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18
})
viewer.imageryLayers.addImageryProvider(shadedReliefTianditu, 0)

/* 加载全球影像中文注记服务 */
let shadedReliefZhuji = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://t7.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' + token,
    layer: 'tdtAnnoLayer',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'GoogleMapsCompatible',
    show: false
})
viewer.imageryLayers.addImageryProvider(shadedReliefZhuji)

// Cartesian 方式确定位置
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(103.486138, 30.465411, 21000000.0)
})

var scene = viewer.scene
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

/**
 * 鼠标双击事件清除跟随实体
 */
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

/**
 * 动态水域设置
 * @param primitive
 * @param scene
 */
function applyWaterMaterial(primitive, scene) {
    primitive.appearance.material = new Cesium.Material({
        fabric: {
        type: 'Water',
        uniforms: {
            specularMap: './images/river.png',
            normalMap: './images/waterNormals.jpg',
            frequency: 18000.0,
            animationSpeed: 0.01,
            amplitude: 3,
            specularIntensity: 1,
            blendColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString('#406cd4'), 0.1),
            baseWaterColor: Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString('#406cd4'), 1)
        }
        },
        translucent: true
    })
}
var primitiveRiver = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(105, 12, 130, 28)
        })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        aboveGround: false
    }),
    show: true
})
var worldRectangle = viewer.scene.primitives.add(primitiveRiver)
worldRectangle.name = 'River'
applyWaterMaterial(worldRectangle, scene)

/* 小地球 */
var viewerTy = new Cesium.Viewer('typhoonContaner', {
    navigationHelpButton: false, // 是否显示右上角的帮助按钮
    infoBox: false, // 是否显示信息框,是否显示点击要素之后显示的信息
    homeButton: false, // 是否显示Home按钮
    selectionIndicator: false, // 是否显示选取指示器组件
    sceneModePicker: false, // 是否显示3D/2D选择器
    baseLayerPicker: false, // 是否显示图层选择器
    geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
    fullscreenButton: false, // 是否显示全屏按钮
    shouldAnimate: true,
})
/* 去除Cesium图标 */
viewerTy._cesiumWidget._creditContainer.style.display = 'none'
/* 隐藏timeline和animation */
viewerTy.timeline.container.style.visibility = 'hidden'
viewerTy.timeline.container.style.display = 'none'
viewerTy.animation.container.style.visibility = 'hidden'
viewerTy.animation.container.style.display = 'none'
// 禁止地球平移
viewerTy.scene.screenSpaceCameraController.enableRotate = false
viewerTy.scene.screenSpaceCameraController.enableTranslate = false
viewerTy.scene.screenSpaceCameraController.enableZoom = true
viewerTy.scene.screenSpaceCameraController.enableTilt = false
viewerTy.clockViewModel.clockRange = Cesium.ClockRange.CLAMPED

/* 初始化图层 */
viewerTy.imageryLayers.removeAll()
viewerTy.imageryLayers.addImageryProvider(shadedReliefTianditu, 0)
viewerTy.imageryLayers.addImageryProvider(shadedReliefZhuji)

// Cartesian 方式确定位置
viewerTy.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(113.517628, 23.353899, 1000000.0)
})

/**
 * 设置图层选择器
 * @param imagery string
 */
function setImageryViewModels(imagery) {
    if (imagery === '电子地图') {
        var isAdd = true
        for (var i = 0; i < viewer.scene.imageryLayers.length; i++) {
            var shadedImagery = viewer.scene.imageryLayers.get(i)
            if (shadedImagery.imageryProvider && shadedImagery.imageryProvider._layer && shadedImagery.imageryProvider._layer === 'tdtVecBasicLayer') {
                isAdd = false
            }
        }
        if (isAdd) {
            var shadedRelief = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                url: 'http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + token,
                layer: 'tdtVecBasicLayer',
                style: 'default',
                format: 'image/jpeg',
                tileMatrixSetID: 'GoogleMapsCompatible',
                show: false
            }), 1)

        }
    }
    if (imagery === '遥感地图') {
        removeImageryProviderByLayer('tdtVecBasicLayer')
    }
}

var lastLineTime;
var isPlay = true;
var clockViewModel = viewerTy.clockViewModel

function changeTimeLineText(startTime, endTime, callback) {
    // resetTimeLine(true)
    // 将进度条显示出来
    var perTime = parseInt((endTime - startTime) / 3)
    var htmlText = ''
    for (var i = 0; i < 4; i++) {
        htmlText += '<li>' + moment(startTime + perTime * i).format('MM-DD HH:mm') + '</li>'
    }
    $('.timeline-node').html(htmlText)
    viewerTy.clockViewModel.startTime = Cesium.JulianDate.fromDate(new Date(startTime))
    viewerTy.clockViewModel.stopTime = Cesium.JulianDate.fromDate(new Date(endTime))
    viewerTy.clockViewModel.currentTime = Cesium.JulianDate.fromDate(new Date(startTime))
    // viewerTy.clockViewModel.shouldAnimate = false
    viewerTy.clockViewModel.multiplier = 7500
    viewerTy.clockViewModel.clockRange = Cesium.ClockRange.CLAMPED
    var satrt = Cesium.JulianDate.fromDate(new Date(startTime))
    var stop = Cesium.JulianDate.fromDate(new Date(endTime))
    viewerTy.timeline.zoomTo(satrt, stop)
    if (callback) {
        callback();
    }
}
$(function () {
    $('.stop').click(function () {
        $(this).toggleClass('play');
        var playContentVal = $('#playContentList').val();
        if (isPlay) {
            var clockViewModel = viewerTy.clockViewModel
            if (clockViewModel.shouldAnimate) {
                clockViewModel.shouldAnimate = false
            } else if (clockViewModel.canAnimate) {
                clockViewModel.shouldAnimate = true
            }
            if($(".nav-list-itemClick").text() == "台风路径"){

            }else if($(".nav-list-itemClick").text() == "预报订正"){
                //预报订正
                if (playContentVal == '3') {
                    if (forecastTab) {
                        setEnsembleEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',1)
                    } else {
                        setNormalEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',1)
                    }
                }else if(playContentVal == '5'){
                    if (forecastTab) {
                        setEnsembleEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',2)
                    } else {
                        setNormalEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',2)
                    }
                }
            }else if($(".nav-list-itemClick").text() == "风暴潮场景库"){
                //风暴潮场景库
                if($(".stormScene-forecastStorm-select option:selected").text() == "漫堤预报"){
                    setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',1,typhoonSelectIdStorm);
                }else if($(".stormScene-forecastStorm-select option:selected").text() == "防洪水位预警"){
                    setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',2,typhoonSelectIdStorm);
                }
            }else if($(".nav-list-itemClick").text() == "水情专题大屏"){
                //水情专题大屏
                if($(".forecastPlayListClick").text() == "漫堤风险预警"){
                    setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',1);
                }else if($(".forecastPlayListClick").text() == "防洪水位预警"){
                    setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',2);
                }
            }
        } else {
            isPlay = true
            $(this).click();
            $('.replay').click();
        }
    });
    $('.replay').click(function () {
        viewerTy.clockViewModel.currentTime = Cesium.JulianDate.fromDate(new Date(parseFloat(localStorage.getItem('startTime'))))
        $('.timeline-tig').css('left', 8 + 'px')
        $('.timeline-bar').css('width', 0 + 'px');
        viewerTy.clockViewModel.shouldAnimate = true;
        isPlay = true;
        if($(".nav-list-itemClick").text() == "台风路径"){

        }else if($(".nav-list-itemClick").text() == "预报订正"){
            //预报订正
            if ($('#playContentList').val() == '3') {
                if (forecastTab) {
                    setEnsembleEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',1)
                } else {
                    setNormalEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',1)
                }
            }else if ($('#playContentList').val() == '5') {
                if (forecastTab) {
                    setEnsembleEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',2)
                } else {
                    setNormalEmbankmentLineByTime(1, parseInt(localStorage.getItem('startTime')),'',2)
                }
            }
        }else if($(".nav-list-itemClick").text() == "风暴潮场景库"){
            //风暴潮场景库
            if($(".stormScene-forecastStorm-select option:selected").text() == "漫堤预报"){
                setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',1,typhoonSelectIdStorm);
            }else if($(".stormScene-forecastStorm-select option:selected").text() == "防洪水位预警"){
                setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',2,typhoonSelectIdStorm);
            }
        }else if($(".nav-list-itemClick").text() == "水情专题大屏"){
            //水情专题大屏
            if($(".forecastPlayListClick").text() == "漫堤风险预警"){
                setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',1);
            }else if($(".forecastPlayListClick").text() == "防洪水位预警"){
                setNormalEmbankmentLineByTime(1,parseInt(localStorage.getItem('startTime')),'',2);
            }
        }
    });
})