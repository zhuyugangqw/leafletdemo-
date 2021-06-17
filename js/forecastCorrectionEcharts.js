var normalLineList = [];//常规预报折线选择
var ensembleLineList = [];//集合预报折线选择

var editOption = {};
// 有台风的
function setOption(resData, mainlandPredict, usaPredict, japanPredict, taiwanPredict, tideLevel, realLevel) {
  var option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: false
        }
      }
    },
    title: {
      subtext: 'm',
      left: 12,
      top: -10
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        show: true,
        type: 'line',
        lineStyle: {
          type: 'dashed',
          width: 1,
          // color: '#75D8A3'
        }
      },
      backgroundColor: '#fff',
      padding: 10,
      formatter: function (params) {
        var htmlText = '<p class="title">' + moment(params[0].data[0]).format('YYYY-MM-DD HH:mm') + '</p><ul class="level">'
        var htmlOne = ''
        var htmlTwo = ''
        var htmlThree = ''
        var htmlFour = ''
        var htmlFive = ''
        var htmlSix = ''
        var htmlSeven = ''
        params.forEach(function (item, index) {
          if (item.seriesName === '天文潮') {
            htmlOne += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>天文潮(m)</p></li>'
          }
          if (item.seriesName === '中国') {
            htmlTwo += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>中国(m)</p></li>'
          }
          if (item.seriesName === '美国') {
            htmlThree += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>美国(m)</p></li>'
          }
          if (item.seriesName === '日本') {
            htmlFour += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>日本(m)</p></li>'
          }
          if (item.seriesName === '中国台湾') {
            htmlFive += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>中国台湾(m)</p></li>'
          }
          if (item.seriesName === '实测水位') {
            htmlSix += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>实测水位(m)</p></li>'
          }
          if (item.seriesName === '自定义' && htmlSeven == '') {
            htmlSeven += '<li><h4>' + (item && !isNaN(item.data[1]) ? parseFloat(item.data[1]).toFixed(2) : '-') + '</h4><p>自定义(m)</p></li>'
          }
        })

        if (htmlOne !== '') {
          htmlText += htmlOne
        } else {
          htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>'
        }
        if (htmlTwo !== '') {
          htmlText += htmlTwo
        } else {
          htmlText += '<li><h4>-</h4><p>中国(m)</p></li>'
        }
        if (htmlThree !== '') {
          htmlText += htmlThree
        } else {
          htmlText += '<li><h4>-</h4><p>美国(m)</p></li>'
        }
        if (htmlFour !== '') {
          htmlText += htmlFour
        } else {
          htmlText += '<li><h4>-</h4><p>日本(m)</p></li>'
        }
        if (htmlFive !== '') {
          htmlText += htmlFive
        } else {
          htmlText += '<li><h4>-</h4><p>中国台湾(m)</p></li>'
        }
        if (htmlSix !== '') {
          htmlText += htmlSix
        } else {
          htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>'
        }
        if (htmlSeven !== '') {
          htmlText += htmlSeven
        } else {
          htmlText += ''
        }
        htmlText += '</ul>'
        return htmlText
      }
    },
    grid: {
      x: 40,
      y: 30,
      x2: 40,
      y2: 70
    },
    legend: {
      show: true,
      right: 20,
      top: 0,
      textStyle: {
        color: '#171718'
      },
      itemWidth: 21,
      itemHeight: 7,
      symbolKeepAspect: true,
      width: 750,
      borderColor: '#fff',
      inactiveColor: '#666666',
      data: [
        {
          name: '左堤高',
          icon: 'image://./images/echartsIcon/black.png'
        },
        {
          name: '右堤高',
          icon: 'image://./images/echartsIcon/blue.png'
        },
        {
          name: '警戒值',
          icon: 'image://./images/echartsIcon/red.png'
        },
        {
          name: '历史最高水位',
          icon: 'image://./images/selfIcon/greenDarkLine.png'
        },
        {
          name: '天文潮',
          icon: 'image://./images/echartsIcon/orange.png'
        },
        {
          name: '中国',
          icon: 'image://./images/echartsIcon/yellow.png'
        },
        {
          name: '美国',
          icon: 'image://./images/echartsIcon/violet.png'
        },
        {
          name: '日本',
          icon: 'image://./images/echartsIcon/green.png'
        },
        {
          name: '中国台湾',
          icon: 'image://./images/echartsIcon/lightBlue.png'
        },
        {
          name: '实测水位',
          icon: 'image://./images/echartsIcon/lightGreen.png'
        },

      ],
    },
    dataZoom: [{
      type: 'slider',
      width: '90%',
      height: 12,
      left: 44,
      bottom: 6,
      textStyle: {
        color: '#5E5E5E'
      },
      show: true,
      handleSize: 24,
    }, {
      type: 'inside',
      show: true,
      xAxisIndex: [0]
    }],
    xAxis: {
      type: 'time',
      boundaryGap: false,
      // data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      axisLabel: {
        show: true,
        interval: 2,
        textStyle: {
          color: '#707070'
        },
        padding: [10, 0, 0, 0],
        //设置x轴显示样式
        formatter: function (params) {
          var timeDate = moment(params).format('M月D日')
          var timeDetail = moment(params).format('HH:mm')
          var lableText = ''
          if (timeDetail === '12:00') {
            lableText = '12:00'
          } else {
            lableText = timeDate + '\n' + timeDetail
          }
          return lableText
        }
      },
      splitLine: {
        show: false
      },
      // min: new Date(dateBegin),
      // max: new Date(dateEnd),
      // maxInterval: 3600 * 12 * 1000,
      // data: (function () {
      //   var dateCurrent = dateBegin
      //   while (dateCurrent.isBefore(dateEnd)) {
      //     var timeDetail = dateCurrent.format('HH:mm')
      //     if (timeDetail === '00:00' || timeDetail === '24:00') {
      //       var timeDate = dateCurrent.format('M月D日')
      //       xAxisData.push(timeDate + '\n' + timeDetail)
      //     } else if (timeDetail === '12:00') {
      //       xAxisData.push('12:00')
      //     }
      //     dateCurrent.add(12, 'hours')
      //   }
      //   return xAxisData
      // })()
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['rgba(112, 112, 112, 0.25)'],
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#707070'
        },
        formatter: function (value, index) {
          return value.toFixed(1)
        }
      },
      // min: function(value) {
      // 	return 0.0
      // },
      // max: function(value) {
      // 	return 5.0
      // }
    },
    series: [
      {
        name: '天文潮',
        type: 'line',
        data: tideLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FF7700',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF7700',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FF7700'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '中国',
        type: 'line',
        data: mainlandPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FFC500',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FFC500',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FFC500'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '美国',
        type: 'line',
        data: usaPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#B85DFF',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#B85DFF',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#B85DFF'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '日本',
        type: 'line',
        data: japanPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#75D8A3',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#75D8A3',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#75D8A3'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '中国台湾',
        type: 'line',
        data: taiwanPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#58B1FE',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#58B1FE',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#58B1FE'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '实测水位',
        type: 'line',
        data: realLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#30D7DC',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#30D7DC',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#30D7DC'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '左堤高',
        type: 'line',
        data: [[new Date().getTime, resData.leftDikeHeight]],
        lineStyle: {
          normal: {
            type: 'dotted',
            shadowColor: '#000002',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#000002',
            borderColor: '#000002'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.leftDikeHeight ? [{
            yAxis: resData.leftDikeHeight,
            name: '左堤高'
          }] : [],
          lineStyle: {
            type: 'dotted',
            color: '#000002'
          },
          label: {
            formatter: '{c}'
          }
        }
      },
      {
        name: '右堤高',
        type: 'line',
        data: [[new Date().getTime, resData.rightDikeHeight]],
        lineStyle: {
          normal: {
            type: 'dotted',
            shadowColor: '#142F96',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#142F96',
            borderColor: '#142F96'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.rightDikeHeight ? [{
            yAxis: resData.rightDikeHeight,
            name: '右堤高'
          }] : [],
          lineStyle: {
            type: 'dotted',
            color: '#142F96'
          },
          label: {
            formatter: '{c}'
          }
        }
      },
      {
        name: '历史最高水位',
        type: 'line',
        data: [[new Date().getTime, resData.historyHighestLevel]],
        lineStyle: {
          normal: {
            type: 'dotted',
            shadowColor: '#CD6A1F',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#CD6A1F',
            borderColor: '#CD6A1F'
          },
          emphasis: {
            color: '#CD6A1F'
          }
        },
        markLine: {
          symbol: '',
          data: resData.historyHighestLevel ? [{
            yAxis: resData.historyHighestLevel,
            name: '历史最高水位'
          }] : [],
          lineStyle: {
            type: 'dotted',
            color: '#CD6A1F'
          },
          label: {
            formatter: '{c}'
          }
        }
      },
      {
        name: '警戒值',
        type: 'line',
        data: [[new Date().getTime, resData.warnLevel]],
        lineStyle: {
          normal: {
            type: 'dotted',
            shadowColor: '#FF2B2B',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#FF2B2B',
            borderColor: '#FF2B2B'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.warnLevel ? [{
            yAxis: resData.warnLevel,
            name: '警戒值'
          }] : [],
          lineStyle: {
            type: 'dotted',
            color: 'rgba(255, 90, 90, 1)'
          },
          label: {
            formatter: '{c}'
          }
        }
      }
    ]
  };
  return option
}
function renderLineEchart(option) {
  $('.echart-edit-box').hide();
  var myEchart = echarts.init(document.getElementById('main'))
  myEchart.clear()
  myEchart.setOption(option);
  myEchart.off('click');
  myEchart.on('click', function (param) {
    $('.normal-line').show();
    $('.echart-edit-box').hide();
    // 选择预报曲线
    layui.use(['form', 'element'], function () {
      var form = layui.form;
      $ajax('/web/station/waterLevelAgency/customize/query', {
        "userId": localStorage.getItem('id'),
        "stationNumber": stationNum,
        "predictType": forecastTab + 1,
        "calculateType": parseFloat($('#forecastCorrectionSelectType').val())
      }, function (res) {
        $("input[name='forecastLine']").prop("checked", false)
        normalLineList = res.data.forecastAgencyType
        if (normalLineList.length > 0) {
          for (var j = 0; j < normalLineList.length; j++) {
            var Checkbox = $("input[name='forecastLine']");
            for (var i = 0; i < Checkbox.length; i++) {
              if (Checkbox[i].value == normalLineList[j]) {
                Checkbox[i].checked = true;
              }
            }
          }
        } else {
          $("input[name='forecastLine']").prop("checked", false)
        }
        form.render();
      })
      //监听复选框-单个
      form.on('checkbox(forecastLine)', function (data) {
        if ($(this).prop("checked")) {
          if (normalLineList.length >= 2) {
            toastr.warning('只能添加两条预报曲线');
            $(this).prop("checked", false)
            form.render('checkbox');
            return
          }
          normalLineList.push(parseFloat(data.value));
        } else {
          normalLineList = normalLineList.filter(function (item) {
            return item != data.value
          })
        }
      });
    });

  });
}
function hasTyphoonAjax(stationNumber, startTime, endTime, calculateType) {
  var mainlandPredict = [],
    usaPredict = [],
    japanPredict = [],
    taiwanPredict = [],
    tideLevel = [],
    realLevel = [];
  // var isCopy = calculateType == 3 ? true : false;
  $ajax('/web/station/waterLevelProcess', {
    "stationNumber": stationNumber,
    "startTime": startTime,
    "endTime": endTime,
    "calculateType": calculateType
  }, function (res) {
    var resData = res.data;
    $('.forecastCorrectionNormalEchart').show();
    $('.forecastCorrection-select-type').show();
    $('.arbitrarilyPoint').hide();
    $('.echart-btn').show();
    $('.forecastCorrectionNormalEchart .forecastCorrection-echarts-title h3').html(resData.stationName + '站水位过程线');
    $('.forecastCorrectionNormalEchart .forecastCorrection-position').html(resData.stationLocation);
    $('.forecastCorrectionNormalEchart .forecastCorrection-grid').html(resData.lng + '\xa0' + '；' + '\xa0' + resData.lat);
    resData.mainlandPredict.forEach(function (item) {
      mainlandPredict.push([item.time, item.level])
    });
    resData.usaPredict.forEach(function (item) {
      usaPredict.push([item.time, item.level])
    });
    resData.japanPredict.forEach(function (item) {
      japanPredict.push([item.time, item.level])
    });
    resData.taiwanPredict.forEach(function (item) {
      taiwanPredict.push([item.time, item.level])
    });
    resData.tideLevel.forEach(function (item) {
      tideLevel.push([item.time, item.level])
    });
    resData.realLevel.forEach(function (item) {
      realLevel.push([item.time, item.level])
    });
    var newOption = setOption(resData, mainlandPredict, usaPredict, japanPredict, taiwanPredict, tideLevel, realLevel);
    renderLineEchart(newOption)
  });
}
// 没台风
function renderNoTyphoonEchart(resData, predictLevel, chaoSuanTideLevel, hydrologyTideLevel, hoHaiTideLevel, realLevel) {
  var myEchart = echarts.init(document.getElementById('main'))
  myEchart.clear()
  var option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: false
        }
      }
    },
    title: {
      subtext: 'm',
      left: 12,
      top: -10
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        show: true,
        type: 'line',
        lineStyle: {
          type: 'dashed',
          width: 1,
          // color: '#75D8A3'
        }
      },
      backgroundColor: '#fff',
      padding: 10,
      formatter: function (params) {
        var htmlText = '<p class="title">' + moment(params[0].data[0]).format('YYYY-MM-DD HH:mm') + '</p><ul class="level">'
        var htmlOne = ''
        var htmlTwo = ''
        var htmlThree = ''
        var htmlFour = ''
        var htmlFive = ''
        params.forEach(function (item, index) {
          if (item.seriesName === '预测水位') {
            htmlOne += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>天文潮(m)</p></li>'
          }
          if (item.seriesName === '超算天文潮') {
            htmlTwo += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>中国(m)</p></li>'
          }
          if (item.seriesName === '水文局天文潮') {
            htmlThree += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>美国(m)</p></li>'
          }
          if (item.seriesName === '河海天文潮') {
            htmlFour += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>日本(m)</p></li>'
          }
          if (item.seriesName === '实测水位') {
            htmlFive += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>中国台湾(m)</p></li>'
          }
        })
        if (htmlOne !== '') {
          htmlText += htmlOne
        } else {
          htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>'
        }
        if (htmlTwo !== '') {
          htmlText += htmlTwo
        } else {
          htmlText += '<li><h4>-</h4><p>超算天文潮(m)</p></li>'
        }
        if (htmlThree !== '') {
          htmlText += htmlThree
        } else {
          htmlText += '<li><h4>-</h4><p>水文局天文潮(m)</p></li>'
        }
        if (htmlFour !== '') {
          htmlText += htmlFour
        } else {
          htmlText += '<li><h4>-</h4><p>河海天文潮(m)</p></li>'
        }
        if (htmlFive !== '') {
          htmlText += htmlFive
        } else {
          htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>'
        }
        htmlText += '</ul>'
        return htmlText
      }
    },
    grid: {
      x: 40,
      y: 30,
      x2: 40,
      y2: 70
    },
    legend: {
      show: true,
      right: 20,
      top: 0,
      textStyle: {
        color: '#171718'
      },
      itemWidth: 21,
      itemHeight: 7,
      symbolKeepAspect: true,
      width: 700,
      borderColor: '#fff',
      inactiveColor: '#666666',
      data: [
        {
          name: '左堤高',
          icon: 'image://./images/echartsIcon/black.png'
        },
        {
          name: '右堤高',
          icon: 'image://./images/echartsIcon/blue.png'
        },
        {
          name: '警戒值',
          icon: 'image://./images/echartsIcon/red.png'
        },
        {
          name: '预测水位',
          icon: 'image://./images/echartsIcon/orange.png'
        },
        {
          name: '超算天文潮',
          icon: 'image://./images/echartsIcon/yellow.png'
        },
        {
          name: '水文局天文潮',
          icon: 'image://./images/echartsIcon/violet.png'
        },
        {
          name: '河海天文潮',
          icon: 'image://./images/echartsIcon/green.png'
        },
        {
          name: '实测水位',
          icon: 'image://./images/echartsIcon/lightBlue.png'
        },
      ],
    },
    dataZoom: [{
      type: 'slider',
      width: '90%',
      height: 12,
      left: 44,
      bottom: 6,
      textStyle: {
        color: '#5E5E5E'
      },
      show: true,
      handleSize: 24,
    }, {
      type: 'inside',
      show: true,
      xAxisIndex: [0]
    }],
    xAxis: {
      type: 'time',
      boundaryGap: false,
      // data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      axisLabel: {
        show: true,
        interval: 2,
        textStyle: {
          color: '#707070'
        },
        padding: [10, 0, 0, 0],
        //设置x轴显示样式
        formatter: function (params) {
          var timeDate = moment(params).format('M月D日')
          var timeDetail = moment(params).format('HH:mm')
          var lableText = ''
          if (timeDetail === '12:00') {
            lableText = '12:00'
          } else {
            lableText = timeDate + '\n' + timeDetail
          }
          return lableText
        }
      },
      splitLine: {
        show: false
      },
      // min: new Date(dateBegin),
      // max: new Date(dateEnd),
      // maxInterval: 3600 * 12 * 1000,
      // data: (function () {
      //   var dateCurrent = dateBegin
      //   while (dateCurrent.isBefore(dateEnd)) {
      //     var timeDetail = dateCurrent.format('HH:mm')
      //     if (timeDetail === '00:00' || timeDetail === '24:00') {
      //       var timeDate = dateCurrent.format('M月D日')
      //       xAxisData.push(timeDate + '\n' + timeDetail)
      //     } else if (timeDetail === '12:00') {
      //       xAxisData.push('12:00')
      //     }
      //     dateCurrent.add(12, 'hours')
      //   }
      //   return xAxisData
      // })()
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['rgba(112, 112, 112, 0.25)'],
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#707070'
        },
        formatter: function (value, index) {
          return value.toFixed(1)
        }
      },
      // min: function(value) {
      // 	return 0.0
      // },
      // max: function(value) {
      // 	return 5.0
      // }
    },
    series: [
      {
        name: '预测水位',
        type: 'line',
        data: predictLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FF7700',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF7700',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FF7700'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '超算天文潮',
        type: 'line',
        data: chaoSuanTideLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FFC500',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FFC500',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FFC500'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '水文局天文潮',
        type: 'line',
        data: hydrologyTideLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#B85DFF',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#B85DFF',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#B85DFF'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '河海天文潮',
        type: 'line',
        data: hoHaiTideLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#75D8A3',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#75D8A3',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#75D8A3'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '实测水位',
        type: 'line',
        data: realLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#58B1FE',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#58B1FE',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#58B1FE'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '左堤高',
        type: 'line',
        data: [[new Date().getTime, resData.leftDikeHeight]],
        lineStyle: {
          normal: {
            type: 'solid',
            shadowColor: '#000002',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#000002',
            borderColor: '#000002'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.leftDikeHeight ? [{
            yAxis: resData.leftDikeHeight,
            name: '左堤高'
          }] : [],
          lineStyle: {
            type: 'solid',
            color: '#000002'
          },
          label: {
            formatter: '{c}'
          }
        }
      },
      {
        name: '右堤高',
        type: 'line',
        data: [[new Date().getTime, resData.rightDikeHeight]],
        lineStyle: {
          normal: {
            type: 'solid',
            shadowColor: '#203279',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#203279',
            borderColor: '#203279'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.rightDikeHeight ? [{
            yAxis: resData.rightDikeHeight,
            name: '右堤高'
          }] : [],
          lineStyle: {
            type: 'solid',
            color: '#000002'
          },
          label: {
            formatter: '{c}'
          }
        }
      },
      {
        name: '警戒值',
        type: 'line',
        data: [[new Date().getTime, resData.warnLevel]],
        lineStyle: {
          normal: {
            type: 'dotted',
            shadowColor: '#FF2B2B',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#FF2B2B',
            borderColor: '#FF2B2B'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.warnLevel ? [{
            yAxis: resData.warnLevel,
            name: '警戒值'
          }] : [],
          lineStyle: {
            type: 'dotted',
            color: 'rgba(255, 90, 90, 1)'
          },
          label: {
            formatter: '{c}'
          }
        }
      }
    ]
  };
  myEchart.setOption(option);
}
function noTyphoonAjax(stationNumber, startTime, endTime) {
  $ajax('/web/station/waterLevelProcess/withoutTyphoon', {
    "stationNumber": stationNumber,
    "startTime": startTime,
    "endTime": endTime,
  }, function (res) {
    var resData = res.data;
    var predictLevel = [],
      chaoSuanTideLevel = [],
      hydrologyTideLevel = [],
      hoHaiTideLevel = [],
      realLevel = []
    $('.forecastCorrectionNormalEchart').show();
    $('.arbitrarilyPoint').hide();
    $('.forecastCorrection-select-type').hide();
    $('.echart-btn').hide();
    $('.forecastCorrectionNormalEchart .forecastCorrection-echarts-title h3').html(resData.stationName + '站水位过程线');
    $('.forecastCorrectionNormalEchart .forecastCorrection-position').html(resData.stationLocation);
    $('.forecastCorrectionNormalEchart .forecastCorrection-grid').html(resData.lng + '\xa0' + '；' + '\xa0' + resData.lat);
    resData.predictLevel.forEach(function (item) {
      predictLevel.push([item.time, item.level])
    });
    resData.chaoSuanTideLevel.forEach(function (item) {
      chaoSuanTideLevel.push([item.time, item.level])
    });
    resData.hydrologyTideLevel.forEach(function (item) {
      hydrologyTideLevel.push([item.time, item.level])
    });
    resData.hoHaiTideLevel.forEach(function (item) {
      hoHaiTideLevel.push([item.time, item.level])
    });
    resData.realLevel.forEach(function (item) {
      realLevel.push([item.time, item.level])
    });
    renderNoTyphoonEchart(resData, predictLevel, chaoSuanTideLevel, hydrologyTideLevel, hoHaiTideLevel, realLevel)
  })
}
// 集合预报
function setEnsembleOption(resData, realLevel, tideLevel, normalPredict, leftPredict, rightPredict, fastPredict, slowPredict) {
  var option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: false
        }
      }
    },
    title: {
      subtext: 'm',
      left: 12,
      top: -10
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        show: true,
        type: 'line',
        lineStyle: {
          type: 'dashed',
          width: 1,
          // color: '#75D8A3'
        }
      },
      backgroundColor: '#fff',
      padding: 10,
      formatter: function (params) {
        var htmlText = '<p class="title">' + moment(params[0].data[0]).format('YYYY-MM-DD HH:mm') + '</p><ul class="level">'
        var htmlOne = ''
        var htmlTwo = ''
        var htmlThree = ''
        var htmlFour = ''
        var htmlFive = ''
        var htmlSix = ''
        var htmlSeven = ''
        var htmlEight = ''
        params.forEach(function (item, index) {
          if (item.seriesName === '实测水位') {
            htmlOne += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>实测水位(m)</p></li>'
          }
          if (item.seriesName === '天文潮') {
            htmlTwo += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>天文潮(m)</p></li>'
          }
          if (item.seriesName === '中国') {
            htmlThree += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>中国(m)</p></li>'
          }
          if (item.seriesName === '偏左') {
            htmlFour += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>偏左(m)</p></li>'
          }
          if (item.seriesName === '偏右') {
            htmlFive += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>偏右(m)</p></li>'
          }
          if (item.seriesName === '偏快') {
            htmlSix += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>偏快(m)</p></li>'
          }
          if (item.seriesName === '偏慢') {
            htmlSeven += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>偏慢(m)</p></li>'
          }
          if (item.seriesName === '自定义' && htmlEight == '') {
            htmlEight += '<li><h4>' + (item && !isNaN(item.data[1]) ? parseFloat(item.data[1]).toFixed(2) : '-') + '</h4><p>自定义(m)</p></li>'
          }
        })
        if (htmlOne !== '') {
          htmlText += htmlOne
        } else {
          htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>'
        }
        if (htmlTwo !== '') {
          htmlText += htmlTwo
        } else {
          htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>'
        }
        if (htmlThree !== '') {
          htmlText += htmlThree
        } else {
          htmlText += '<li><h4>-</h4><p>中国(m)</p></li>'
        }
        if (htmlFour !== '') {
          htmlText += htmlFour
        } else {
          htmlText += '<li><h4>-</h4><p>偏左(m)</p></li>'
        }
        if (htmlFive !== '') {
          htmlText += htmlFive
        } else {
          htmlText += '<li><h4>-</h4><p>偏右(m)</p></li>'
        }
        if (htmlSix !== '') {
          htmlText += htmlSix
        } else {
          htmlText += '<li><h4>-</h4><p>偏快(m)</p></li>'
        }
        if (htmlSeven !== '') {
          htmlText += htmlSeven
        } else {
          htmlText += '<li><h4>-</h4><p>偏慢(m)</p></li>'
        }
        if (htmlEight !== '') {
          htmlText += htmlEight
        } else {
          htmlText += ''
        }
        htmlText += '</ul>'
        return htmlText
      }
    },
    grid: {
      x: 40,
      y: 30,
      x2: 40,
      y2: 70
    },
    legend: {
      show: true,
      right: 20,
      top: 0,
      textStyle: {
        color: '#171718'
      },
      itemWidth: 21,
      itemHeight: 7,
      symbolKeepAspect: true,
      width: 800,
      borderColor: '#fff',
      inactiveColor: '#666666',
      data: [
        {
          name: '左堤高',
          icon: 'image://./images/echartsIcon/black.png'
        },
        {
          name: '右堤高',
          icon: 'image://./images/echartsIcon/blue.png'
        },
        {
          name: '警戒值',
          icon: 'image://./images/echartsIcon/red.png'
        },
        {
          name: '实测水位',
          icon: 'image://./images/echartsIcon/lightBlue.png'
        },
        {
          name: '天文潮',
          icon: 'image://./images/echartsIcon/orange.png'
        },
        {
          name: '中国',
          icon: 'image://./images/echartsIcon/yellow.png'
        },
        {
          name: '偏左',
          icon: 'image://./images/echartsIcon/violet.png'
        },
        {
          name: '偏右',
          icon: 'image://./images/echartsIcon/green.png'
        },
        {
          name: '偏快',
          icon: 'image://./images/echartsIcon/lightBlue.png'
        },
        {
          name: '偏慢',
          icon: 'image://./images/echartsIcon/lightRed.png'
        },

      ],
    },
    dataZoom: [{
      type: 'slider',
      width: '90%',
      height: 12,
      left: 44,
      bottom: 6,
      textStyle: {
        color: '#5E5E5E'
      },
      show: true,
      handleSize: 24,
    }, {
      type: 'inside',
      show: true,
      xAxisIndex: [0]
    }],
    xAxis: {
      type: 'time',
      boundaryGap: false,
      // data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      axisLabel: {
        show: true,
        interval: 2,
        textStyle: {
          color: '#707070'
        },
        padding: [10, 0, 0, 0],
        //设置x轴显示样式
        formatter: function (params) {
          var timeDate = moment(params).format('M月D日')
          var timeDetail = moment(params).format('HH:mm')
          var lableText = ''
          if (timeDetail === '12:00') {
            lableText = '12:00'
          } else {
            lableText = timeDate + '\n' + timeDetail
          }
          return lableText
        }
      },
      splitLine: {
        show: false
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['rgba(112, 112, 112, 0.25)'],
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#707070'
        },
        formatter: function (value, index) {
          return value.toFixed(1)
        }
      },
      // min: function(value) {
      // 	return 0.0
      // },
      // max: function(value) {
      // 	return 5.0
      // }
    },
    series: [
      {
        name: '天文潮',
        type: 'line',
        data: tideLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FF7700',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF7700',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FF7700'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '中国',
        type: 'line',
        data: normalPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FFC500',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FFC500',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FFC500'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '偏左',
        type: 'line',
        data: leftPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#B85DFF',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#B85DFF',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#B85DFF'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '偏右',
        type: 'line',
        data: rightPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#75D8A3',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#75D8A3',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#75D8A3'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '偏快',
        type: 'line',
        data: fastPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#58B1FE',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#58B1FE',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#58B1FE'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '偏慢',
        type: 'line',
        stack: 'none',
        data: slowPredict,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#EF4F4F',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#EF4F4F',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#EF4F4F'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '实测水位',
        type: 'line',
        data: realLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#30D7DC',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#30D7DC',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#30D7DC'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '左堤高',
        type: 'line',
        data: [[new Date().getTime, resData.leftDikeHeight]],
        lineStyle: {
          normal: {
            type: 'solid',
            shadowColor: '#000002',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#000002',
            borderColor: '#000002'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.leftDikeHeight ? [{
            yAxis: resData.leftDikeHeight,
            name: '左堤高'
          }] : [],
          lineStyle: {
            type: 'solid',
            color: '#000002'
          },
          label: {
            formatter: '{c}'
          }
        }
      },
      {
        name: '右堤高',
        type: 'line',
        data: [[new Date().getTime, resData.rightDikeHeight]],
        lineStyle: {
          normal: {
            type: 'solid',
            shadowColor: '#203279',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#203279',
            borderColor: '#203279'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.rightDikeHeight ? [{
            yAxis: resData.rightDikeHeight,
            name: '右堤高'
          }] : [],
          lineStyle: {
            type: 'solid',
            color: '#000002'
          },
          label: {
            formatter: '{c}'
          }
        }
      },
      {
        name: '警戒值',
        type: 'line',
        data: [[new Date().getTime, resData.warnLevel]],
        lineStyle: {
          normal: {
            type: 'dotted',
            shadowColor: '#FF2B2B',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#FF2B2B',
            borderColor: '#FF2B2B'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.warnLevel ? [{
            yAxis: resData.warnLevel,
            name: '警戒值'
          }] : [],
          lineStyle: {
            type: 'dotted',
            color: 'rgba(255, 90, 90, 1)'
          },
          label: {
            formatter: '{c}'
          }
        }
      }
    ]
  };
  return option
}
function ensembleForecastEchart(option) {
  $('.echart-edit-box').hide();
  var myEchart = echarts.init(document.getElementById('main'))
  myEchart.clear()
  myEchart.setOption(option);
  // 如果是自定义的专题就开启复制功能
  myEchart.on('click', function (param) {
    $('.ensemble-line').show();
    $('.echart-edit-box').hide();
    layui.use(['form', 'element'], function () {
      var form = layui.form;
      //监听复选框-单个
      $ajax('/web/station/waterLevelAgency/customize/query', {
        "userId": localStorage.getItem('id'),
        "stationNumber": stationNum,
        "predictType": forecastTab + 1,
        "calculateType": parseFloat($('#forecastCorrectionSelectType').val())
      }, function (res) {
        $("input[name='forecastLine2']").prop("checked", false)
        ensembleLineList = res.data.probabilityCircleType
        if (ensembleLineList.length > 0) {
          for (var j = 0; j < ensembleLineList.length; j++) {
            var Checkbox = $("input[name='forecastLine2']");
            for (var i = 0; i < Checkbox.length; i++) {
              if (Checkbox[i].value == ensembleLineList[j]) {
                Checkbox[i].checked = true;
              }
            }
          }
        } else {
          $("input[name='forecastLine2']").prop("checked", false)
        }
        form.render();
      })
      form.on('checkbox(forecastLine2)', function (data) {
        if ($(this).prop("checked")) {
          if (ensembleLineList.length >= 2) {
            toastr.warning('只能添加两条预报曲线');
            $(this).prop("checked", false)
            form.render('checkbox');
            return
          }
          ensembleLineList.push(parseFloat(data.value));
        } else {
          ensembleLineList = ensembleLineList.filter(function (item) {
            return item != data.value
          })
        }
      });
    });

  });
  myEchart.on('mouseover', function (params) {// 鼠标移入
    var name = params.seriesName;
    if (name != null) {
      myEchart.setOption({// 设置 鼠标移入后想要的样式
        series: {
          name: params.seriesName,
          symbolSize: 10,
          lineStyle: {
            width: 4
          }
        }
      })
    }
  })
  myEchart.on('mouseout', function (params) {// 鼠标移出
    myEchart.setOption({// 将样式复原
      series: {
        name: params.seriesName,
        symbolSize: 4,
        lineStyle: {
          width: 2
        }
      }
    })
  })
}
function ensembleForecastAjax(stationNumber, startTime, endTime, calculateType) {
  $ajax('/web/station/waterLevelProcess/probability', {
    "userId": localStorage.getItem('id'),
    "stationNumber": stationNumber,
    "calculateType": calculateType,
    "startTime": startTime,
    "endTime": endTime
  }, function (res) {
    var resData = res.data,
      realLevel = [],
      tideLevel = [],
      normalPredict = [],
      leftPredict = [],
      rightPredict = [],
      fastPredict = [],
      slowPredict = []
    // var isCopy = calculateType == 3 ? true : false;
    $('.forecastCorrectionNormalEchart').show();
    $('.forecastCorrection-select-type').show();
    $('.arbitrarilyPoint').hide();
    $('.echart-btn').show();
    $('.forecastCorrection-echarts-title h3').html(resData.stationName + '站水位过程线');
    $('.forecastCorrection-position').html(resData.stationLocation);
    $('.forecastCorrection-grid').html(resData.lng + '\xa0' + '；' + '\xa0' + resData.lat);
    resData.realLevel.forEach(function (item) {
      realLevel.push([item.time, item.level])
    });
    resData.tideLevel.forEach(function (item) {
      tideLevel.push([item.time, item.level])
    });
    resData.normalPredict.forEach(function (item) {
      normalPredict.push([item.time, item.level])
    });
    resData.leftPredict.forEach(function (item) {
      leftPredict.push([item.time, item.level])
    });
    resData.rightPredict.forEach(function (item) {
      rightPredict.push([item.time, item.level])
    });
    resData.fastPredict.forEach(function (item) {
      fastPredict.push([item.time, item.level])
    });
    resData.slowPredict.forEach(function (item) {
      slowPredict.push([item.time, item.level])
    });
    var newOption = setEnsembleOption(resData, realLevel, tideLevel, normalPredict, leftPredict, rightPredict, fastPredict, slowPredict);
    // ensembleForecastEchart(newOption, isCopy)
    ensembleForecastEchart(newOption)
  })
}

// 任意点过程图
function renderArbitrarilEchart(resData) {
  var predictLevel = [];
  var tideLevel = [];
  var waterLevel = [];
  resData.list.forEach(function (item, index) {
    // 预测水位
    predictLevel.push([item.time, item.predictLevel])
    // 预测潮位
    tideLevel.push([item.time, item.tideLevel])
    // 增水
    waterLevel.push([item.time, item.waterLevel])
  });
  var myEchart = echarts.init(document.getElementById('arbitrarily'))
  myEchart.clear();
  var option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: false
        }
      }
    },
    title: {
      subtext: 'm',
      left: 12,
      top: -10
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        show: true,
        type: 'line',
        lineStyle: {
          type: 'dashed',
          width: 1,
          // color: '#75D8A3'
        }
      },
      backgroundColor: '#fff',
      padding: 10,
      formatter: function (params) {
        var htmlText = '<p class="title">' + moment(params[0].data[0]).format('YYYY-MM-DD HH:mm') + '</p><ul class="level">'
        var htmlOne = ''
        var htmlTwo = ''
        var htmlThree = ''
        params.forEach(function (item, index) {
          if (item.seriesName === '预测水位') {
            htmlOne += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>预测水位(m)</p></li>'
          }
          if (item.seriesName === '天文潮') {
            htmlTwo += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>天文潮(m)</p></li>'
          }
          if (item.seriesName === '风暴增水') {
            htmlThree += '<li><h4>' + (item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-') + '</h4><p>风暴增水(m)</p></li>'
          }
        })
        if (htmlOne !== '') {
          htmlText += htmlOne
        } else {
          htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>'
        }
        if (htmlTwo !== '') {
          htmlText += htmlTwo
        } else {
          htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>'
        }
        if (htmlThree !== '') {
          htmlText += htmlThree
        } else {
          htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>'
        }
        htmlText += '</ul>'
        return htmlText
      }
    },
    grid: {
      x: 40,
      y: 30,
      x2: 40,
      y2: 70
    },
    legend: {
      show: true,
      right: 20,
      top: 0,
      textStyle: {
        color: '#171718'
      },
      itemWidth: 21,
      itemHeight: 7,
      symbolKeepAspect: true,
      width: 700,
      borderColor: '#fff',
      inactiveColor: '#666666',
      data: [
        {
          name: '红色警戒线',
          icon: 'image://../images/selfIcon/redLine.png'
        },
        {
          name: '黄色警戒线',
          icon: 'image://../images/selfIcon/yellowLine.png'
        },
        {
          name: '预测水位',
        },
        {
          name: '天文潮',
        },
        {
          name: '风暴增水',
        },
      ],
    },
    dataZoom: [{
      type: 'slider',
      width: '88%',
      height: 12,
      left: 44,
      bottom: 6,
      textStyle: {
        color: '#5E5E5E'
      },
      show: true,
      handleSize: 24,
    }, {
      type: 'inside',
      show: true,
      xAxisIndex: [0]
    }],
    xAxis: {
      type: 'time',
      boundaryGap: false,
      // data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      axisLabel: {
        show: true,
        interval: 2,
        textStyle: {
          color: '#707070'
        },
        padding: [10, 0, 0, 0],
        //设置x轴显示样式
        formatter: function (params) {
          var timeDate = moment(params).format('M月D日')
          var timeDetail = moment(params).format('HH:mm')
          var lableText = ''
          if (timeDetail === '12:00') {
            lableText = '12:00'
          } else {
            lableText = timeDate + '\n' + timeDetail
          }
          return lableText
        }
      },
      splitLine: {
        show: false
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['rgba(112, 112, 112, 0.25)'],
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#707070'
        },
        formatter: function (value, index) {
          return value.toFixed(2)
        }
      },
      // min: function(value) {
      // 	return 0.0
      // },
      // max: function(value) {
      // 	return 5.0
      // }
    },
    series: [
        {
          name: '红色警戒线',
          type: 'line',
          data: [[new Date().getTime, resData.redWarn]],
          lineStyle: {
              normal: {
                  type: 'dashed',
                  color: '#EC4040',
                  width: '2'
              }
          },
          symbol: 'none',
          itemStyle: {
              normal: {
                  color: '#EC4040',
                  borderColor: '#EC4040'
              },
              emphasis: {
                  color: '#ffffff'
              }
          },
          markLine: {
              symbol: '',
              data: resData.redWarn ? [{
                  yAxis: resData.redWarn,
                  name: '红色警戒线'
              }] : [],
              lineStyle: {
                  type: 'dashed',
                  color: '#EC4040'
              },
              label: {
                  formatter: '{c}'
              }
          }
      },
      {
          name: '黄色警戒线',
          type: 'line',
          data: [[new Date().getTime, resData.yellowWarn]],
          lineStyle: {
              normal: {
                  type: 'dashed',
                  color: '#ABD01E',
                  width: '2'
              }
          },
          symbol: 'none',
          itemStyle: {
              normal: {
                  color: '#ABD01E',
                  borderColor: '#ABD01E'
              },
              emphasis: {
                  color: '#ffffff'
              }
          },
          markLine: {
              symbol: '',
              data: resData.yellowWarn ? [{
                  yAxis: resData.yellowWarn,
                  name: '黄色警戒线'
              }] : [],
              lineStyle: {
                  type: 'dashed',
                  color: '#ABD01E'
              },
              label: {
                  formatter: '{c}'
              }
          }
      },  
      {
        name: '预测水位',
        type: 'line',
        data: predictLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#75D8A3',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#75D8A3',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#75D8A3',
            borderColor: '#75D8A3'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '天文潮',
        type: 'line',
        data: tideLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#B85DFF',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#B85DFF',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#B85DFF',
            borderColor: '#B85DFF'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '风暴增水',
        type: 'line',
        data: waterLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FFA119',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FFA119',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#FFA119',
            borderColor: '#FFA119'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
    ]
  };
  myEchart.setOption(option);
}

// 绘制任意点折线图
function arbitrarilyAjax(lon, lat) {
  var url = forecastTab ? '/web/opendap/netcdf/storm/forecast/correct/ensemble/chart' : '/web/opendap/netcdf/storm/forecast/correct/normal/chart'
  var params = {
    'lonPoint': lon,
    'latPoint': lat,
  }
  if (forecastTab) {
    params['ensemble'] = ensemble;
  } else {
    params['agency'] = agency;
  }
  $ajax(url, params, function (res) {
    var resData = res.data;
    $('.arbitrarilyPoint').show();
    $('.forecastCorrectionNormalEchart').hide();
    $('.arbitrarilyPoint .forecastCorrection-grid').html(lon + '\xa0' + '；' + '\xa0' + lat);
    renderArbitrarilEchart(resData)
  })
};
// 隐藏任意点折线图
function hideArbitrarilyEchart() {
  $('.arbitrarilyPoint').hide();
};
// 任意点折线图定位
function arbitrarilyEchartPosition(left, top) {
  $(".arbitrarilyPoint").css({
    "left": left,
    "top": top
  });
};

// 自定义水位线
function renderCustomLineEchart(option) {
  $('.echart-edit-box').hide();
  $('.forecastCorrection-line-checkbox').hide();
  $('.forecastCorrectionNormalEchart').show();
  $('.arbitrarilyPoint').hide();
  var myEchart = echarts.init(document.getElementById('main'))
  myEchart.clear()
  myEchart.setOption(option);
  // 如果是自定义的专题就开启复制功能
  myEchart.off('click');
  myEchart.on('click', function (param) {
    $('.forecastCorrection-line-checkbox').hide();
    var editData = $('#main').siblings('.echart-edit-box');
    var seriesIndex = param.seriesIndex;
    var name = param.seriesName;
    if (name === null || name === '自定义' || name === '天文潮' || name === '实测水位') {
      $('.echart-edit-box').hide();
      return
    }
    $('.echart-edit-box').hide();
    editData.css('left', param.event.offsetX + 10).show();
    editData.css('top', param.event.offsetY - 50);
    editData.find('.copy-btn').click(function () {
      if (option.legend.data[option.legend.data.length - 1].name === '自定义') {
        option.series.splice(option.series.length - 1, 1);
        option.legend.data.splice(option.legend.data.length - 1, 1);
      }
      var newOption = option;
      var newData = newOption.series[seriesIndex].data
      var newObj = {
        name: '自定义',
        type: 'line',
        data: newData,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FE61A3',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FE61A3',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FE61A3'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      }
      newOption.legend.data.push({
        name: '自定义',
        icon: 'image://./images/echartsIcon/pink.png'
      })
      newOption.series.push(newObj);
      editOption = {};
      editOption = newOption
      renderCustomLineEchart(newOption)
      $('.echart-edit-box').hide();
    });

  });
  myEchart.on('mouseover', function (params) {// 鼠标移入
    var name = params.seriesName;
    if (name != null) {
      myEchart.setOption({// 设置 鼠标移入后想要的样式
        series: {
          name: params.seriesName,
          symbolSize: 10,
          lineStyle: {
            width: 4
          }
        }
      })
    }
  })
  myEchart.on('mouseout', function (params) {// 鼠标移出
    myEchart.setOption({// 将样式复原
      series: {
        name: params.seriesName,
        symbolSize: 4,
        lineStyle: {
          width: 2
        }
      }
    })
  })

}
function customOption(resData) {
  var calculateType = {
    // 0: '超算',
    // 1: '实验室',
    // 2: '河海大学'
    0: '精细化预报',
    1: '智能预报',
    2: '河海预报'
  }
  var agencyType = {
    1: '中国',
    2: '美国',
    3: '日本',
    4: '中国台湾'
  }
  var probabilityCircleType = {
    0: '常规',
    1: '偏左',
    2: '偏右',
    3: '偏快',
    4: '偏慢'
  }
  var icon = {
    0: 'yellow',
    1: 'violet',
    2: 'green',
    3: 'lightBlue',
    4: 'lightRed',
    5: 'blueIcon',

  }
  var color = {
    0: '#FFC500',
    1: '#B85DFF',
    2: '#75D8A3',
    3: '#58B1FE',
    4: '#EF4F4F',
    5: '#3850d5'
  }
  var tideLevel = [],
    realLevel = [];
  resData.tideLevel.forEach(function (item) {
    tideLevel.push([item.time, item.level])
  });
  resData.realLevel.forEach(function (item) {
    realLevel.push([item.time, item.level])
  });
  var option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: false
        }
      }
    },
    title: {
      subtext: 'm',
      left: 12,
      top: -10
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        show: false,
        type: 'line',
        lineStyle: {
          type: 'dashed',
          width: 1,
          color: '#75D8A3'
        }
      },
      backgroundColor: '#fff',
      padding: 10,
      formatter: function (params) {
        var str = '<div style="color: black;font-weight:bold;margin-bottom:5px">' + moment(params[0].axisValue).format('YYYY-MM-DD HH:mm') + '</div>';
        params.forEach((item) => {
          str += '<div style="color: #919191;font-size:10px;margin-bottom:5px">' + item.seriesName + '</span>：' + '<span style="color: black;font-weight:bold;font-size:14px">' + item.data[1] + 'm</div>'
        })
        return str
      }
    },
    grid: {
      x: 40,
      y: 50,
      x2: 40,
      y2: 70
    },
    legend: {
      show: true,
      right: 20,
      top: 0,
      textStyle: {
        color: '#171718'
      },
      itemWidth: 21,
      itemHeight: 7,
      symbolKeepAspect: true,
      width: 800,
      borderColor: '#fff',
      inactiveColor: '#666666',
      data: [
        {
          name: '警戒值',
          icon: 'image://./images/echartsIcon/red.png'
        },
        {
          name: '实测水位',
          icon: 'image://./images/echartsIcon/lightBlue.png'
        },
        {
          name: '天文潮',
          icon: 'image://./images/echartsIcon/orange.png'
        },
      ],
    },
    dataZoom: [{
      type: 'slider',
      width: '90%',
      height: 12,
      left: 44,
      bottom: 6,
      textStyle: {
        color: '#5E5E5E'
      },
      show: true,
      handleSize: 24,
    }, {
      type: 'inside',
      show: true,
      xAxisIndex: [0]
    }],
    xAxis: {
      type: 'time',
      boundaryGap: false,
      // data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      axisLabel: {
        show: true,
        interval: 2,
        textStyle: {
          color: '#707070'
        },
        padding: [10, 0, 0, 0],
        //设置x轴显示样式
        formatter: function (params) {
          var timeDate = moment(params).format('M月D日')
          var timeDetail = moment(params).format('HH:mm')
          var lableText = ''
          if (timeDetail === '12:00') {
            lableText = '12:00'
          } else {
            lableText = timeDate + '\n' + timeDetail
          }
          return lableText
        }
      },
      splitLine: {
        show: false
      },
      // min: new Date(dateBegin),
      // max: new Date(dateEnd),
      // maxInterval: 3600 * 12 * 1000,
      // data: (function () {
      //   var dateCurrent = dateBegin
      //   while (dateCurrent.isBefore(dateEnd)) {
      //     var timeDetail = dateCurrent.format('HH:mm')
      //     if (timeDetail === '00:00' || timeDetail === '24:00') {
      //       var timeDate = dateCurrent.format('M月D日')
      //       xAxisData.push(timeDate + '\n' + timeDetail)
      //     } else if (timeDetail === '12:00') {
      //       xAxisData.push('12:00')
      //     }
      //     dateCurrent.add(12, 'hours')
      //   }
      //   return xAxisData
      // })()
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#707070'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['rgba(112, 112, 112, 0.25)'],
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#707070'
        },
        formatter: function (value, index) {
          return value.toFixed(1)
        }
      },
    },
    series: [
      {
        name: '天文潮',
        type: 'line',
        data: tideLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#FF7700',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF7700',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#FF7700'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '实测水位',
        type: 'line',
        data: realLevel,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: '#30D7DC',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#30D7DC',
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: '#30D7DC'
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      },
      {
        name: '警戒值',
        type: 'line',
        data: [[new Date().getTime, resData.warnLevel]],
        lineStyle: {
          normal: {
            type: 'dotted',
            shadowColor: '#FF2B2B',
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: '#FF2B2B',
            width: '2'
          }
        },
        symbol: 'none',
        itemStyle: {
          normal: {
            color: '#FF2B2B',
            borderColor: '#FF2B2B'
          },
          emphasis: {
            color: '#ffffff'
          }
        },
        markLine: {
          symbol: '',
          data: resData.warnLevel ? [{
            yAxis: resData.warnLevel,
            name: '警戒值'
          }] : [],
          lineStyle: {
            type: 'dotted',
            color: 'rgba(255, 90, 90, 1)'
          },
          label: {
            formatter: '{c}'
          }
        }
      }
    ]
  };
  var list = resData.waterLevelPredictList
  for (var i = 0; i < list.length; i++) {
    if (list[i].hasOwnProperty('agencyType')) {
      //var name = agencyType[list[i].agencyType] + '-' + calculateType[list[i].calculateType]
      var name = calculateType[list[i].calculateType] + '-' + agencyType[list[i].agencyType]
      // var lineColor = color[agencyType[list[i].agencyType]];
      var lineColor = color[i];
      var lineData = [];
      for (var j = 0; j < list[i].waterLevelPredict.length; j++) {
        lineData.push([list[i].waterLevelPredict[j].time, list[i].waterLevelPredict[j].level])
      }
      option.legend.data.push({
        name: name,
        icon: 'image://./images/echartsIcon/' + icon[i] + '.png'
      });
      option.series.push({
        name: name,
        type: 'line',
        data: lineData,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: lineColor,
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: lineColor,
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: lineColor
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      })

    }
    if (list[i].hasOwnProperty('probabilityCircleType')) {
      //var name = probabilityCircleType[list[i].probabilityCircleType] + '-' + calculateType[list[i].calculateType]
      var name = calculateType[list[i].calculateType] + '-' + probabilityCircleType[list[i].probabilityCircleType]
      var lineColor = color[probabilityCircleType[list[i].probabilityCircleType]];
      var lineData = [];
      for (var j = 0; j < list[i].waterLevelPredict.length; j++) {
        lineData.push([list[i].waterLevelPredict[j].time, list[i].waterLevelPredict[j].level])
      }
      option.legend.data.push({
        name: name,
        icon: 'image://./images/echartsIcon/' + icon[probabilityCircleType[list[i].probabilityCircleType]] + '.png'
      });
      option.series.push({
        name: name,
        type: 'line',
        data: lineData,
        connectNulls: true,
        lineStyle: {
          normal: {
            shadowColor: lineColor,
            shadowOffsetX: 0,
            shadowOffsetY: 1,
            shadowBlur: 10,
            color: lineColor,
            width: '1'
          }
        },
        symbol: 'circle',
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: lineColor
          },
          emphasis: {
            color: '#ffffff'
          }
        }
      })

    }
  }
  if (resData.customizeLevel.length > 0) {
    var customizeLevel = [];
    resData.customizeLevel.forEach(function (item) {
      customizeLevel.push([item.time, item.level])
    })
    var newCustom = {
      name: '自定义',
      type: 'line',
      data: customizeLevel,
      connectNulls: true,
      lineStyle: {
        normal: {
          shadowColor: '#FE61A3',
          shadowOffsetX: 0,
          shadowOffsetY: 1,
          shadowBlur: 10,
          color: '#FE61A3',
          width: '1'
        }
      },
      symbol: 'circle',
      itemStyle: {
        normal: {
          color: '#fff',
          borderColor: '#FE61A3'
        },
        emphasis: {
          color: '#ffffff'
        }
      }
    }
    option.legend.data.push({
      name: '自定义',
      icon: 'image://./images/echartsIcon/pink.png'
    })
    option.series.push(newCustom);
    editOption = option
  } else {
    editOption = {}
  }
  return option
}
function customEchart(stationNumber, startTime, endTime, predictType) {
  $ajax('/web/station/waterLevel/customize/query', {
    "userId": localStorage.getItem('id'),
    "stationNumber": stationNumber,
    "predictType": predictType + 1,
    "startTime": startTime,
    "endTime": endTime
  }, function (res) {
    renderCustomLineEchart(customOption(res.data))
  })
}
$(function () {
  // 确定选择的预报曲线
  $('.forecastCorrection-line-comfirmBtn').click(function () {
    var param = {
      "userId": localStorage.getItem('id'),
      "stationNumber": stationNum,
      "predictType": forecastTab + 1,
      'calculateType': parseFloat($('#forecastCorrectionSelectType').val())
    }
    if (forecastTab) {
      param['probabilityCircleType'] = ensembleLineList
    } else {
      param['forecastAgencyType'] = normalLineList
    }
    $ajax('/web/station/waterLevelAgency/customize/save', param, function (res) {
      toastr.success('保存成功');
      $('.forecastCorrection-line-checkbox').hide();
    })
  });
  // 修改折线图数据
  var editTime = [], editData = [], editList = [];
  $('.forecastCorrection-edit-btn').click(function () {
    if ($.isEmptyObject(editOption)) {
      toastr.warning('请先添加自定义折线')
      return
    }
    editTime = [];
    editData = [];
    editList = [];
    editList = editOption.series[editOption.series.length - 1].data;
    for (var i = 0; i < editList.length; i++) {
      editTime.push(editList[i][0]);
      editData.push(editList[i][1]);
    }
    $('.editTime-box').empty();
    $('.editData-box').empty();
    for (var n = 0; n < editTime.length; n++) {
      $('.editTime-box').append('<th>' + timeStampTurnTime(editTime[n]) + '</th>')
    }
    for (var m = 0; m < editData.length; m++) {
      $('.editData-box').append('<td><input type="text" value=' + editData[m] + '></td>')
    }
    $('.editData-box').find('td').find('input').unbind('blur');
    $('.editData-box').find('td').find('input').unbind('focus');
    var value = '';
    $('.editData-box').find('td').find('input').focus(function () {
      value = $(this).val()
    })
    $('.editData-box').find('td').find('input').blur(function () {
      var index = $(this).parent().index()
      var reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (!reg.test($(this).val())) {
        toastr.warning('请输入数字')
        $(this).val(value);
      } else {
        editData[index] = parseFloat($(this).val());
      }
    })
    $('.forecastCorrection-editData-box-mask').show();
  });
  // 整体调整
  $('.editNumber').blur(function () {
    if (!$(this).val()) {
      return
    }
    for (var i = 0; i < editData.length; i++) {
      editData[i] = (parseFloat(editData[i]) + parseFloat($(this).val())).toFixed(2)
    }
    $('.editData-box').empty();
    for (var m = 0; m < editData.length; m++) {
      $('.editData-box').append('<td><input type="text" value=' + editData[m] + '></td>')
    }
    $('.editData-box').find('td').find('input').unbind('blur');
    $('.editData-box').find('td').find('input').unbind('focus');
    var value = '';
    $('.editData-box').find('td').find('input').focus(function () {
      value = $(this).val()
    })
    $('.editData-box').find('td').find('input').blur(function () {
      var index = $(this).parent().index()
      var reg = /^(\-|\+)?\d+(\.\d+)?$/;
      if (!reg.test($(this).val())) {
        toastr.warning('请输入数字')
        $(this).val(value);
      } else {
        editData[index] = parseFloat($(this).val());
      }
    })
  });
  // 确定修改数据
  $('.editData-box-btn').click(function () {
    var editComplete = [], customizeLevel = [];
    for (var i = 0; i < editTime.length; i++) {
      editComplete.push([editTime[i], editData[i]])
      customizeLevel.push({
        "time": moment(editTime[i]).format('YYYY-MM-DD HH:mm:ss'),
        "level": parseFloat(editData[i]),
      })
    }
    editOption.series[editOption.series.length - 1].data = editComplete;
    $ajax('/web/station/waterLevel/customize/save', {
      "userId": localStorage.getItem('id'),
      "stationNumber": stationNum,
      'customizeLevel': customizeLevel,
      'predictType': forecastTab + 1
    }, function (res) {
      customEchart(stationNum, startTime, endTime, forecastTab);
      $('.forecastCorrection-editData-box-mask').hide();
    })
  });
  // 任意点过程图
  // arbitrarilyAjax(113.75, 22.63);


})