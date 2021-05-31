var layers = [];
var warn_layers = [];
var pick_iamge_layer = [];
var myGroup_animation;
var addmarker = null;
var pick_iamge_Group;
var myGroup;

var Movetrack = {
  "1008_001": [
    {
      "time": "2020-08-20 00:00:00",
      "longitude": "113.46",
      "latitude": "22.32"
    },
    {
      "time": "2020-08-20 00:00:00",
      "longitude": "113.65",
      "latitude": "22.291"
    },
    {
      "time": "2020-08-20 00:00:00",
      "longitude": "113.607",
      "latitude": "22.31"
    },
    {
      "time": "2020-08-20 00:00:00",
      "longitude": "113.63",
      "latitude": "22.338"
    }, {
      "time": "2020-08-20 00:00:00",
      "longitude": "113.6856",
      "latitude": "22.3479 "
    }, {
      "time": "2020-08-20 00:00:00",
      "longitude": "113.6751",
      "latitude": "22.34808"
    }, {
      "time": "2020-08-20 00:00:00",
      "longitude": "113.7265",
      "latitude": "22.36593"
    }

  ]
};

var track = function (map, trackdata) {
  var myLayerGroupline = new L.LayerGroup();//主点线清除方法
  var myLayerGrouppoint = new L.LayerGroup();//主点清除方法
  var timer//定时器定义
  var TrackAllInfo = dataHandler(trackdata)
  var allpoints = TrackAllInfo.polylinePoints;
  var timeobj = TrackAllInfo.time;
  //动态折线轨迹绘制
  animateDrawLine()
  function animateDrawLine() {
    myLayerGroupline.clearLayers();
    myLayerGrouppoint.clearLayers();
    var drawPoints = [];
    var count = 0;
    var trackIcon = L.icon({
      iconUrl: "image/typhoonimage/Typhoon_Point_image.png",
      iconSize: [15, 15],
      // iconAnchor: [15, 15]
    });
    var lineLayer
    var pointLayer
    var length = allpoints.length;
    timer = setInterval(
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
          //最新数据点drawPoints绘制折线
          lineLayer = L.polyline(drawPoints, { color: "#00BFFF", dashArray: "5,5" })
          myLayerGroupline.addLayer(lineLayer);
          map.addLayer(myLayerGroupline);
          //根据最新的数据组最后一个绘制marker
          if (count === length) {
            pointLayer = L.marker(drawPoints[count - 1], { icon: trackIcon }).bindPopup(
              `<div class="typhone_info">
                  <div class="flex info_title">
                    <h3>${timeobj[count - 1].latitude}-${timeobj[count - 1].longitude}</h3>
                    <div class="distance">距广州<span>256</span>公里</div>
                  </div>
                  <ul class="info_list">
                    <li>
                      <span>过去时间</span>
                      <p>${timeobj[count - 1].time}</p>
                    </li>
                  </ul>
                </div>`
              ,
              {
                offset: [0, -120],
                className: "typhoonInfo"
              }
            ).closePopup();
            myLayerGrouppoint.addLayer(pointLayer);
            map.addLayer(myLayerGrouppoint);
          } else {
            pointLayer = L.marker(drawPoints[count - 1], {
              icon: trackIcon,
              title: "我是谁",
              riseOnHover: true,
              keyboard: true
            }).bindPopup(
              `<div class="typhone_info">
                  <div class="flex info_title">
                    <h3>${timeobj[count - 1].latitude}-${timeobj[count - 1].longitude}</h3>
                    <div class="distance">距广州<span>256</span>公里</div>
                  </div>
                  <ul class="info_list">
                    <li>
                      <span>过去时间</span>
                      <p>${timeobj[count - 1].time}</p>
                    </li>
                  </ul>
                </div>`
              ,
              {
                offset: [0, -120],
                className: "typhoonInfo"
              }
            ).closePopup();
            myLayerGrouppoint.addLayer(pointLayer);
            map.addLayer(myLayerGrouppoint);
          }
        } else {
          //取完数据后清除定时器
          clearInterval(timer);
        }
      }, 800);
  }

  typhoon.deleteTyphoon = function () {
    clearInterval(timer);
    myLayerGroupline.clearLayers();
    myLayerGrouppoint.clearLayers();
  }
  //计算出漂流浮标所有需要的数据对象
  function dataHandler(trackdata) {
    var polylinePoints = [];//主点线坐标 
    var timeobj = {};
    for (var i = 0; i < trackdata.length; i++) {
      var Point = trackdata[i];
      polylinePoints.push([Number(Point['latitude']), Number(Point['longitude'])])
      timeobj[i] = {
        time: Point.time,
        latitude: Point['latitude'],
        longitude: Point['longitude']
      };
    }
    var info = {
      polylinePoints: polylinePoints,
      time: timeobj
    };
    console.log(timeobj);
    return info;

  }
}

var typhoonOne = new track(map, Movetrack["1008_001"])
function expl() {

  marker = L.marker([23.09147, 113.45897], {
    icon: L.icon({
      iconUrl: 'image/mapImage/warn_water_level.png',
      iconSize: [170, 170]
    })
  }).addTo(map)
  markermode = L.marker([23.09147, 113.45897],
    {
      icon: L.divIcon({
        className: "dIcon",
        html: `<div class="typhone_lable">
              <div class="flex info_title" >
                <h3>珠海情侣中路监测站</h3>
                <div class="distance"><a href="www.baidu.com"><img src="image/lable_station_image.png"></a></div>
              </div>
            </div>`
        ,
        iconSize: [20, 20]
      })
    }).addTo(map);
  markermode = L.marker([23.09147, 113.45897],
    {
      icon: L.divIcon({
        className: "dIcon",
        html: `<div class='circle'>
                <div class='circle1'>&nbsp;</div>
                <div class='circle2'>&nbsp;</div>
                <div class='circle3'>&nbsp;</div>
                <!--<div class='center'></div>-->
                </div>`
        ,
        iconSize: [20, 20]
      })
    }).addTo(map);
}


function addMarker() {
  if (addmarker != null) {
    map.removeLayer(addmarker);
  }

  addmarker = L.marker([23.09147, 113.45897],
    {
      icon: L.icon({
        iconUrl: 'image/mapImage/warn_pick.png',
        iconSize: [160, 160]
      })
    })
  map.addLayer(addmarker);
}

function removeMarker() {
  if (addmarker) {
    map.removeLayer(addmarker);
  }

}


map.on('zoomend ', function (e) {
  let zoom = map.getZoom();
  console.log(zoom);
  if (zoom > 12) {
    $(".maintain_pick").show();
    // $(".typhone_info").show();
    $(".maintain_float").show();
  } else if (zoom <= 12) {
    $(".maintain_pick").hide();
    // $(".typhone_info").hide();
    $(".maintain_float").hide();

  }

});
map.on('click ', function (e) {
  console.log(e);
});

function add_ZhuHai_Allstation() {
  var stationInfo = [
    { id: "001", name: "大湾区", lat: 22.253073456859056, lng: 113.58317494358744, status: 0, type: "浮标" },
    { id: "002", name: "中山区", lat: 22.29085803385715, lng: 113.54784130841836, status: 1, type: "监测站" },
    { id: "003", name: "金山区", lat: 22.29128718729953, lng: 113.58380436689004, status: -1, type: "潮位站" }
  ];
  console.log(stationInfo);

  for (var i = 0; i < stationInfo.length; i++) {
    //添加站点状态
    var status = getStationImage(stationInfo[i].status, stationInfo[i].type)
    var info_common_marker = { image: status.status_iamge, size: 170, attribution: [stationInfo[i].status, stationInfo[i].type] };
    var markers = addMarkers(stationInfo[i].lat, stationInfo[i].lng, "commmon_marker", info_common_marker).on("click", function (e) {
      if (pick_iamge_Group) {
        pick_iamge_Group.clearLayers();
        pick_iamge_layer = [];
      }
      console.log(e);
      var pick_target = e.target;
      //添加点击标签
      var lat = pick_target._latlng.lat, lng = pick_target._latlng.lng;
      var pick_image = getStationImage(pick_target.options.attribution[0], pick_target.options.attribution[1]).pick_image
      var info_common = { image: pick_image, size: 170 };
      var markers = addMarkers(lat, lng, "commmon_marker", info_common)
      pick_iamge_layer.push(markers);
      pick_iamge_Group = L.layerGroup(pick_iamge_layer);
      map.addLayer(pick_iamge_Group);


    });
    layers.push(markers);
    //添加lable显示
    var color = addStationLable(stationInfo[i].status)
    var lable_html = `<div class="typhone_lable" id="${stationInfo[i].id}" style="background:${color}">
                    <div class="flex info_title" >
                      <h3>${stationInfo[i].name}监测站</h3>
                      <div class="distance"><a href="www.baidu.com"><img src="image/lable_station_image.png"></a></div>
                    </div>
                  </div>`

    var lable_marker = { html: lable_html };
    var markers = addMarkers(stationInfo[i].lat, stationInfo[i].lng, "style_marker", lable_marker)

    layers.push(markers);
    //添加报警动画图层
    if (stationInfo[i].status == 1) {
      var warn_html = `<div class='circle'>
                <div class='circle1'>&nbsp;</div>
                <div class='circle2'>&nbsp;</div>
                <div class='circle3'>&nbsp;</div>
                <!--<div class='center'></div>-->
                </div>`
      var markers = addMarkers(stationInfo[i].lat, stationInfo[i].lng, "style_marker", { html: warn_html })
      warn_layers.push(markers);
    }
  }
  myGroup = L.layerGroup(layers);
  map.addLayer(myGroup);

  myGroup_animation = L.layerGroup(warn_layers);
  map.addLayer(myGroup_animation);
}
add_ZhuHai_Allstation()


function addAnimation(name) {
  if (name) {
    myGroup_animation = L.layerGroup(warn_layers);
    map.addLayer(myGroup_animation);

    myGroup = L.layerGroup(layers);
    map.addLayer(myGroup);
  } else {
    myGroup_animation.clearLayers();
    myGroup.clearLayers();

  }
}
//根据状态信息添加站点lable
function addStationLable(status) {
  var color = "";
  switch (status) {
    case 0:
      color = "rgba(49,218,179,1)";
      break;
    case 1:
      color = "rgba(247,98,98,1)";
      break;
    case -1:
      color = "rgba(141,141,141,1)";
      break;
  }
  return color;
}



//根据站点状态返回对应的得图片
function getStationImage(status, type) {
  var status_iamge = "";
  var pick_image = "";
  if (type == "浮标") {
    switch (status) {
      case 0:
        status_iamge = 'image/haiqiimage/haiqipick.png';
        // status_iamge='image/mapImage/normal_float.png';
        pick_image = 'image/mapImage/normal_pick.png';
        break;
      case 1:
        status_iamge = 'image/mapImage/warn_float.png';
        pick_image = 'image/mapImage/warn_pick.png';
        break;
      case -1:
        status_iamge = 'image/mapImage/maintain_float.png';
        pick_image = 'image/mapImage/maintain_pick.png';
        break;
    }
  } else {
    if (type == "监测站") {
      switch (status) {
        case 0:
          status_iamge = 'image/mapImage/normal_storm_tide.png';
          pick_image = 'image/mapImage/normal_pick.png';
          break;
        case 1:
          status_iamge = 'image/mapImage/warn_storm_tide.png';
          pick_image = 'image/mapImage/warn_pick.png';
          break;
        case -1:
          status_iamge = 'image/mapImage/maintain_storm_tide.png';
          pick_image = 'image/mapImage/maintain_pick.png';
          break;
      }
    } else {
      switch (status) {
        case 0:
          status_iamge = 'image/mapImage/normal_water_level.png';
          pick_image = 'image/mapImage/normal_pick.png';
          break;
        case 1:
          status_iamge = 'image/mapImage/warn_water_level.png';
          pick_image = 'image/mapImage/warn_pick.png';
          break;
        case -1:
          status_iamge = 'image/mapImage/maintain_water_level.png';
          pick_image = 'image/mapImage/maintain_pick.png';
          break;
      }
    }
  }
  return {
    status_iamge: status_iamge,
    pick_image: pick_image
  };

}






//单独封装添加marker方法
function addMarkers(lat, lng, name, info) {
  if (name == "style_marker") {
    var marker = new L.marker([lat, lng], {
      icon: L.divIcon({
        className: "dIcon",
        html: info.html
        ,
      })
    })
  } else {
    if (name == "commmon_marker") {
      var marker = new L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: info.image,
          iconSize: [info.size, info.size],
        }),
        zIndexOffset: 20,
        attribution: info.attribution
      })
    }

  }
  return marker;
}





















//测距功能


/*距离测量*/
var measureDistance = function () {
  var resultLayer = L.featureGroup().addTo(map);
  var TempLayer = L.featureGroup().addTo(map);
  // resultLayer.clearLayers();
  map.off('click');
  map.off('dblclick');
  $("#tips").css('display', 'block');
  var isFirstPoint = true; //判断是否是起始点
  var latLngTemp = null;//存储上一点击点临时变量
  var resultDis = 0; //总距
  map.on('click', function (ev) {
    TempLayer.clearLayers();
    $("#tips").css('display', 'none');
    var polyLine;
    if (isFirstPoint) {
      L.marker([ev.latlng.lat, ev.latlng.lng], {
        icon: L.icon({
          iconUrl: 'image/distance_start.png',
          iconSize: [40, 40],
          iconAnchor: [10, 35]
        })
      }).addTo(resultLayer); //起始点
      // var texticon = L.divIcon({ //定义图标
      // 	html: "起点",
      // 	iconSize: [30, 20],
      // 	iconAnchor: [15, 0]
      // });
      // L.marker([ev.latlng.lat, ev.latlng.lng], {
      // 	icon: texticon
      // }).addTo(resultLayer); //marker实现文本框显示
      latLngTemp = ev.latlng; //存储上一点击点
      isFirstPoint = false;
    } else {
      if (!latLngTemp.equals(ev.latlng)) { //避免出现结束双击，导致距离为0
        polyLine = L.polyline([ //与上一点连线
          [latLngTemp.lat, latLngTemp.lng],
          [ev.latlng.lat, ev.latlng.lng]
        ], {
          color: "#9E70F9"
        });
        resultLayer.addLayer(polyLine);
        L.marker([ev.latlng.lat, ev.latlng.lng], {
          icon: L.icon({
            iconUrl: 'image/distance_point.png',
            iconSize: [15, 15]
          })
        }).addTo(resultLayer); // 最后点击点经纬度
        latLngTemp = ev.latlng; //更新临时变量为新点 		
        var distanceMeasureParam = new SuperMap.MeasureParameters(polyLine);
        L.supermap.measureService(url).measureDistance(distanceMeasureParam, function (serviceResult) {
          resultDis += serviceResult.result.distance;
          var content = "距上点：" + Number(serviceResult.result.distance / 1000).toFixed(1) + "千米" + "<br>总距:" + Number(resultDis / 1000).toFixed(1) + "千米";
          var texticon = L.divIcon({
            html: content,
            iconSize: [110, 40],
            iconAnchor: [55, -25] //设置标签偏移避免遮盖
          });
          L.marker([ev.latlng.lat, ev.latlng.lng], {
            icon: texticon
          }).addTo(resultLayer);
        });
      }
    }
    map.on("mousemove", function (ev) {
      //clientMeasure(latLngTemp.lat,latLngTemp.lng,ev.latlng.lat, ev.latlng.lng);  //使用客户端量算
      TempLayer.clearLayers();
      var TempLine = L.polyline([ //虚线临时线段
        [latLngTemp.lat, latLngTemp.lng],
        [ev.latlng.lat, ev.latlng.lng]
      ], {
        color: "#9E70F9",
        dashArray: "5,5"
      });
      TempLayer.addLayer(TempLine);
      var distanceMeasureParam = new SuperMap.MeasureParameters(TempLine);
      L.supermap.measureService(url).measureDistance(distanceMeasureParam, function (serviceResult) {
        TempLayer.clearLayers(); //避免服务端延迟导致文本重叠
        var texticon = L.divIcon({
          html: Number(serviceResult.result.distance / 1000).toFixed(1) + "千米",
          iconSize: 90,
          className: 'my-div-icon',
          iconAnchor: [45, -5]
        });
        TempLayer.addLayer(TempLine);
        L.marker([ev.latlng.lat, ev.latlng.lng], {
          icon: texticon
        }).addTo(TempLayer);
      });
    });
  });
  map.on('dblclick', function (ev) {
    L.marker([ev.latlng.lat, ev.latlng.lng], {
      icon: L.icon({
        iconUrl: 'image/distance_close.png',
        iconSize: [20, 20],
        iconAnchor: [55, -5]
      })
    }).addTo(resultLayer).on("click", function () {
      resultLayer.clearLayers();
    });
    L.marker([ev.latlng.lat, ev.latlng.lng], {
      icon: L.icon({
        iconUrl: 'image/distance_end.png',
        iconSize: [40, 40],
        iconAnchor: [10, 35]
      })
    }).addTo(resultLayer)
    map.off('mousemove');
    map.off('click');
    map.off('dblclick');

  });
}
measureDistance.prototype.clearMeasureDistance = function () {
  resultLayer.clearLayers()
}




var geojson;
var valuesp = [];
var dataArray = [];
function addgeojson() {
  //设置样式
  var myStyle = {
    "color": "#FFFFFF",
    "weight": 2,
    "opacity": 0.4,
    "fillColor": '#1C9BC9',
    "fillOpacity": 0.4,
    dashArray: '4',
  };
  // data\seageojson\A171210.geojsondata\topoJson\forecastArea.json
  $.getJSON('data/topoJson/forecastArea.json', function (data) {
    geojson = L.geoJSON(data, {
      style: function (feature) {
        switch (feature.geometry.type) {
          case 'Polygon': return myStyle;
          case "MultiPolygon": return myStyle;
          // case 'Democrat':   return {color: "#0000ff"};
        }
      },
      onEachFeature: onEachFeature,
      filter: function (feature, layer) {
        return true;
      },
      pointToLayer: function (feature, latlng) {
        console.log(latlng);
      }

    }).addTo(map);


  });

  function onEachFeature(feature, layer) {
    console.log(layer);
    // if(layer.)
    // features[""0""].properties.name
    layer.bindPopup(`<div class="shpName">
          <h3>${feature.properties.NAME}</h3>
      </div>`).on(
      {
        // mouseover: highlightFeature,//鼠标移动上去高亮
        // mouseout: resetHighlight,//鼠标移出还原
        click: clickLayer
      }
    );
  }

  map.on("click", function (e) {
    console.log(e);
    if (Alllayer) {
      Alllayer.setStyle({
        "color": "#FFFFFF",
        "weight": 2,
        "opacity": 0.4,
        "fillColor": '#1C9BC9',
        "fillOpacity": 0.4,
        dashArray: '4',
      });
    }
  })

  //根据要素属性设置特殊渲染样式
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#1C9BC9',
      dashArray: '0',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    // info.update(layer.feature.properties);
  }

  //重置要素样式
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }
  var Alllayer;
  function clickLayer(e) {
    console.log(e);
    dataArray = [];


    if (Alllayer) {
      Alllayer.setStyle({
        "color": "#FFFFFF",
        "weight": 2,
        "opacity": 0.4,
        "fillColor": '#1C9BC9',
        "fillOpacity": 0.4,
        dashArray: '4',
      });
    }
    var layer = e.target;
    var shpBoundData = layer.feature.geometry.coordinates[0]
    dataArray.push(shpBoundData);
    var lat = [];
    var lng = [];
    dataArray[0].forEach((item, index) => {
      lat.push(item[1]);
      lng.push(item[0]);
    });
    console.log(lat.toString());
    console.log(lng.toString());
    console.log(dataArray);
    layer.setStyle({
      "color": "#FFFFFF",
      "weight": 2,
      "opacity": 0.8,
      "fillColor": '#1C9BC9',
      "fillOpacity": 0.8,
      dashArray: '4',
    });
    Alllayer = layer;
  }
}


function changeShpColor() {
  dataArray = [];
  valuesp = [];
  var layer = geojson._layers;

  for (var key in layer) {
    // console.log(layer[key]);

    var value = layer[key]

    if (value.feature.properties.NAME == "北黄海") {
      var shpBoundData = value.feature.geometry.coordinates[0]
      dataArray.push(shpBoundData);
      valuesp.push(layer[key]);
      console.log(valuesp);
      value.setStyle({
        "color": "#FFFFFF",
        "weight": 2,
        "opacity": 0.8,
        "fillColor": '#1C9BC9',
        "fillOpacity": 0.8,
        dashArray: '4',
      });
    }
  }
  console.log(dataArray);
}

var myLayerGroupOffShore;
function loadOffshoreForecastName() {

  myLayerGroupOffShore = new L.LayerGroup();
  var nameJson = [{
    url: 'image/offshoreForecast/northArea/North_Huanghai_Area.png',
    imageBounds: [[38.3113, 122.8601], [38.3313, 123.0601]],

  }, {
    url: 'image/offshoreForecast/northArea/LiaoDongWanNorth_Area.png',
    imageBounds: [[40.4629, 121.113], [40.4829, 121.323]],

  }, {
    url: 'image/offshoreForecast/northArea/LiaoDongWanSorth_Area.png',
    imageBounds: [[39.56773, 120.2233], [39.58773, 120.4333]],

  }, {
    url: 'image/offshoreForecast/northArea/BoHaiWan_Mid_Area.png',
    imageBounds: [[38.6067, 119.8223], [38.6267, 120.0323]],

  }, {
    url: 'image/offshoreForecast/northArea/LaiZhou_East_Area.png',
    imageBounds: [[37.415, 119.62463], [37.435, 119.82463]],

  }, {
    url: 'image/offshoreForecast/northArea/BoHaiWan_Sorth_And_Huang.png',
    imageBounds: [[38.18936, 118.300], [38.20936, 118.500]],

  }, {
    url: 'image/offshoreForecast/northArea/BoHaiWan_North_Area.png',
    imageBounds: [[38.820, 118.234], [38.840, 118.434]],

  }, {
    url: 'image/offshoreForecast/northArea/BoHaiWan_West_Area.png',
    imageBounds: [[38.6781, 117.7294], [38.6981, 117.9294]],

  }]
  for (var i = 0; i < nameJson.length; i++) {
    var imageUrl = nameJson[i].url;
    var imageBounds = nameJson[i].imageBounds;
    var imageLayer = L.imageOverlay(imageUrl, imageBounds, { opacity: 1 });//opacity是透明度
    myLayerGroupOffShore.addLayer(imageLayer);
  }
  map.addLayer(myLayerGroupOffShore);

  // myGroup._layers.forEach((item)=>{
  //   item.options.icon.options.html
  //   if(item.options.icon.options.html){
  //     item.options.icon.options.html=``;
  //   }
  // });
  console.log(document.getElementsByClassName("typhone_lable"));
  map.removeLayer(myGroup);
  var layers = myGroup._layers;
  console.log(layers);
  for (let key in layers) {
    console.log(layers[key])
    if (layers[key].options.icon.options.html) {
      layers[key].options.icon.options.html = `<div class="typhone_lable" id="" style="background:">
        <div class="flex info_title" >
          <h3>$监测站</h3>
          <div class="distance"><a href="www.baidu.com"><img src="image/lable_station_image.png"></a></div>
        </div>
      </div>`;
    }
  }

  map.addLayer(myGroup);
}

var SeaIcarray = [];
function addSeaIceData() {
  var kmz_num = 0;
  var timedata = [
    "data/seaIceData/A171210.geojson", "data/seaIceData/A171212.geojson",
    "data/seaIceData/A171213.geojson", "data/seaIceData/A171214.geojson",
    "data/seaIceData/A171215.geojson", "data/seaIceData/A171216.geojson",
    "data/seaIceData/A171217.geojson", "data/seaIceData/A171218.geojson",
    "data/seaIceData/A171219.geojson", "data/seaIceData/A171220.geojson"
  ];
  for (var i = 0; i < timedata.length; i++) {
    $.getJSON(timedata[i], function (data) {
      var geojson = new L.geoJSON(data, {
      })
      SeaIcarray.push(geojson);
    });
  }
  var i = 0;
  var time = window.setInterval(function () {
    //  var ismap= map.hasLayer(SeaIcarray[i])
    //  console.log(ismap);
    //   if(ismap){
    // map.layerremove(SeaIcarray[i]);

    // }
    map.removeLayer(SeaIcarray[i]);
    map.addLayer(SeaIcarray[i]);
    console.log(map);
    i++;
    if (i == SeaIcarray.length) {
      i = 0;
    }
  }, 2000);
}

var windyArray = [];

function addWindyData() {

  var timedata = [
    "image/windyImage/1.png", "image/windyImage/2.png",
    "image/windyImage/3.png", "image/windyImage/4.png",
    "image/windyImage/5.png", "image/windyImage/6.png",
    "image/windyImage/7.png", "image/windyImage/8.png",
    "image/windyImage/9.png", "image/windyImage/10.png",
    "image/windyImage/11.png",
  ];

  var nameJson = [
    {
      url: 'image/windyImage/1.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/2.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/3.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/4.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/5.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/6.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: '"image/windyImage/7.png"',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/8.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/9.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/10.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }, {
      url: 'image/windyImage/11.png',
      imageBounds: [[16.72, 94.99], [42.59, 144.40]],

    }]
  for (var i = 0; i < nameJson.length; i++) {
    var imageUrl = nameJson[i].url;
    var imageBounds = nameJson[i].imageBounds;
    var imageLayer = L.imageOverlay(imageUrl, imageBounds, { opacity: 1 });//opacity是透明度
    windyArray.push(imageLayer);
  }
  console.log(windyArray);

  var i = 0;
  var time = window.setInterval(function () {

    if (map.hasLayer(windyArray[i])) {
      map.removeLayer(windyArray[i]);

    }
    map.addLayer(windyArray[i]);
    console.log(map);
    i++;
    if (i == windyArray.length) {
      i = 0;

    }
  }, 2000);
}



//添加矩形 100米大概是0.0009 200米0.0018
function rectangle() {
  var gridData = [
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615207740588034",
      "west": 11.000000,
      "south": 11.000000,
      "east": 11.002000,
      "north": 11.002000,
      "centralLongitude": 11.001000,
      "centralLatitude": 11.001000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615207795113985",
      "west": 113.300000,
      "south": 24.000000,
      "east": 113.302000,
      "north": 24.002000,
      "centralLongitude": 113.301000,
      "centralLatitude": 24.001000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615207887388673",
      "west": 1.100000,
      "south": 1.200000,
      "east": 1.102000,
      "north": 1.202000,
      "centralLongitude": 1.101000,
      "centralLatitude": 1.201000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615207946108929",
      "west": 123.300000,
      "south": 23.300000,
      "east": 123.302000,
      "north": 23.302000,
      "centralLongitude": 123.301000,
      "centralLatitude": 23.301000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615207983857665",
      "west": 12.000000,
      "south": 12.000000,
      "east": 12.002000,
      "north": 12.002000,
      "centralLongitude": 12.001000,
      "centralLatitude": 12.001000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208172601346",
      "west": 123.122000,
      "south": 23.230000,
      "east": 123.124000,
      "north": 23.232000,
      "centralLongitude": 123.123000,
      "centralLatitude": 23.231000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208428453889",
      "west": 119.122000,
      "south": 23.230000,
      "east": 119.124000,
      "north": 23.232000,
      "centralLongitude": 119.123000,
      "centralLatitude": 23.231000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208592031745",
      "west": 121.122000,
      "south": 22.230000,
      "east": 121.124000,
      "north": 22.232000,
      "centralLongitude": 121.123000,
      "centralLatitude": 22.231000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208621391873",
      "west": 120.122000,
      "south": 23.230000,
      "east": 120.124000,
      "north": 23.232000,
      "centralLongitude": 120.123000,
      "centralLatitude": 23.231000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208692695042",
      "west": 113.580000,
      "south": 22.466000,
      "east": 113.582000,
      "north": 22.468000,
      "centralLongitude": 113.581000,
      "centralLatitude": 22.467000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208730443777",
      "west": 113.552000,
      "south": 22.472000,
      "east": 113.554000,
      "north": 22.474000,
      "centralLongitude": 113.553000,
      "centralLatitude": 22.473000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208768192514",
      "west": 113.546000,
      "south": 22.464000,
      "east": 113.548000,
      "north": 22.466000,
      "centralLongitude": 113.547000,
      "centralLatitude": 22.465000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208805941250",
      "west": 113.530000,
      "south": 22.480000,
      "east": 113.532000,
      "north": 22.482000,
      "centralLongitude": 113.531000,
      "centralLatitude": 22.481000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208831107073",
      "west": 113.582000,
      "south": 22.264000,
      "east": 113.584000,
      "north": 22.266000,
      "centralLongitude": 113.583000,
      "centralLatitude": 22.265000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208856272898",
      "west": 113.574000,
      "south": 22.270000,
      "east": 113.576000,
      "north": 22.272000,
      "centralLongitude": 113.575000,
      "centralLatitude": 22.271000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208889827330",
      "west": 113.572000,
      "south": 22.290000,
      "east": 113.574000,
      "north": 22.292000,
      "centralLongitude": 113.573000,
      "centralLatitude": 22.291000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208919187458",
      "west": 113.560000,
      "south": 22.286000,
      "east": 113.562000,
      "north": 22.288000,
      "centralLongitude": 113.561000,
      "centralLatitude": 22.287000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208948547586",
      "west": 113.278000,
      "south": 22.036000,
      "east": 113.280000,
      "north": 22.038000,
      "centralLongitude": 113.279000,
      "centralLatitude": 22.037000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615208977907714",
      "west": 113.286000,
      "south": 22.046000,
      "east": 113.288000,
      "north": 22.048000,
      "centralLongitude": 113.287000,
      "centralLatitude": 22.047000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209011462145",
      "west": 113.280000,
      "south": 22.044000,
      "east": 113.282000,
      "north": 22.046000,
      "centralLongitude": 113.281000,
      "centralLatitude": 22.045000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209036627970",
      "west": 113.280000,
      "south": 22.054000,
      "east": 113.282000,
      "north": 22.056000,
      "centralLongitude": 113.281000,
      "centralLatitude": 22.055000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209065988097",
      "west": 114.532000,
      "south": 22.710000,
      "east": 114.534000,
      "north": 22.712000,
      "centralLongitude": 114.533000,
      "centralLatitude": 22.711000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209099542530",
      "west": 114.530000,
      "south": 22.710000,
      "east": 114.532000,
      "north": 22.712000,
      "centralLongitude": 114.531000,
      "centralLatitude": 22.711000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209128902657",
      "west": 114.528000,
      "south": 22.724000,
      "east": 114.530000,
      "north": 22.726000,
      "centralLongitude": 114.529000,
      "centralLatitude": 22.725000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209279897601",
      "west": 114.530000,
      "south": 22.734000,
      "east": 114.532000,
      "north": 22.736000,
      "centralLongitude": 114.531000,
      "centralLatitude": 22.735000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209309257730",
      "west": 113.232000,
      "south": 22.360000,
      "east": 113.234000,
      "north": 22.362000,
      "centralLongitude": 113.233000,
      "centralLatitude": 22.361000,
      "enabled": 0
    },
    {
      "createTime": "2020-10-15 13:41",
      "modifyTime": "2020-10-15 13:41",
      "id": "1316615209342812161",
      "west": 123.000000,
      "south": 23.000000,
      "east": 123.002000,
      "north": 23.002000,
      "centralLongitude": 123.001000,
      "centralLatitude": 23.001000,
      "enabled": 0
    }
  ]
  //   var latlng=[
  //     [22.48877136,  113.5310887], [22.48339809,113.5349926],
  //     [22.48916496,  113.5238281], [22.48195908,  113.537272],
  //     [22.47989795,  113.5408165],

  //     [22.25755523,  113.5862242], [22.47789493,113.5404056],
  //     [22.48416523,  113.5293333], [22.47664486,113.5335347],
  //     [22.48140834,  113.5394549],

  //     [22.49084828,  113.5278199], [22.47629185,113.5315876],
  //     [22.47678574,  113.5377952], [22.48543306,113.5295627],
  //     [22.49080705,  113.5239408],

  //     [22.48899546,  113.5222493], [22.48131756,113.5410745],
  //     [22.48536855,  113.5413106], [22.48531449,113.5335952],
  //     [22.48723324,  113.5278267],

  //     [22.49094225,  113.5296031], [22.47464046,113.5414523],
  //   ]

  //   for(var i=0;i<latlng.length;i++){
  //     var rect=latlng[i]
  //     var bounds = [[rect[0]-0.0009, rect[1]-0.0009], [rect[0]+0.0009, rect[1]+0.0009]];
  //     L.rectangle(bounds, {
  //       color: "#ff7800",
  //        weight: 1,
  //        smoothFactor:0,
  //        fillOpacity:0.7,
  //   }).addTo(map);
  //   }
  //   var bounds = [[22.48877136-0.0009, 113.5310887-0.0009], [22.48877136+0.0009, 113.5310887+0.0009]];

  //   // create an orange rectangle
  //   L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
  //   var bounds = [[22.46027615, 113.5769809], [22.46207615, 113.5787809]];

  //   // create an orange rectangle
  //   L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
  // // zoom the map to the rectangle bounds
  // map.fitBounds(bounds);

  //  "createTime": "2020-10-15 13:41",
  //       "modifyTime": "2020-10-15 13:41",
  //       "id": "1316615207795113985",
  //       "west": 113.300000,
  //       "south": 24.000000,
  //       "east": 113.302000,
  //       "north": 24.002000,
  //       "centralLongitude": 113.301000,
  //       "centralLatitude": 24.001000,
  //       "enabled": 0
  for (var i = 0; i < gridData.length; i++) {
    var grid = gridData[i];
    var bounds = [[grid.south, grid.west], [grid.north, grid.east]];
    // create an orange rectangle
    L.rectangle(bounds, { color: "#ff7800", weight: 5 }).addTo(map);
    // zoom the map to the rectangle bounds
    map.fitBounds(bounds);
  }

}

function RandomColor() {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);

  const a = ((Math.random() * 5 + 5) / 10).toFixed(2)
  //随机颜色返回的是一个0.5到1 的两位小数;
  const color = `rgba(${r},${g},${b},${a})`

  console.log(color)
  return color
}


// L.semiCircle([22.5, 113], {
//   radius: 50000,
//   fill: true,
//   fillColor: '#a1ba03',
//   fillOpacity: 0.5,
//   color: '#a1ba03',
//   opacity: 0.5,
//   startAngle: 0,
//   stopAngle: 360
// }).addTo(map);



// 加载风场 洋流图层 海浪图层 矢量
function addVectorLayer(type, data) {
  console.log(type, data)
  // if(!this.vectorAnimateSwitch){ // 全局 矢量动画 形状
  //   return
  // }
  // this.toggleVectorLayer(this.vectorAnimateSwitch)
  let obj = {
    colorScale: ["rgb(222,255,253)", "rgb(234,234,234)", "rgb(255,255,255)", "rgb(156,156,156)", "rgb(255,106,43)"],
    opacity: this.vectorAnimateSwitch ? 0.7 : 0
  };
  if (type == 'wind') {
    obj = {
      ...obj,
      maxVelocity: 35,
      lineWidth: 1,
      particleMultiplier: 1 / 500,
      frameRate: 20,
    }

  } else if (type == 'wave') {
    obj = {
      ...obj,
      maxVelocity: 10,
      lineWidth: 6,
      // velocityScale:0.11,
      particleMultiplier: 1 / 500,
      frameRate: 30,
    };

  } else {
    obj = {
      ...obj,
      maxVelocity: 5,
      lineWidth: 1,
      velocityScale: 0.1,
      particleMultiplier: 1 / 500,
      frameRate: 20,
    }
  }
  var velocityLayer = new L.velocityLayer({
    displayValues: false,
    displayOptions: {
      velocityType: "",
      displayPosition: "",
      displayEmptyString: ""
    },
    ...obj
  })
  console.log(obj, data)

  velocityLayer.setData(data);
  velocityLayer.onAdd(map)
}



function addWindResult() {
  addVectorLayer('wind', windData)
}





