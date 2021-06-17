$(function () {
    var data = {"list":[
        {time:1592285738000,level:2.05,predictLevel:2.50,tideLevel:2.10,waterLevel:2.00,hehaiLevel:3.00,zhinengLevel:2.56,jingxiLevel:2.38},
        {time:1592372138000,level:2.50,predictLevel:3.10,tideLevel:2.30,waterLevel:2.40,hehaiLevel:2.50,zhinengLevel:2.86,jingxiLevel:2.08},
        {time:1592458538000,level:2.55,predictLevel:3.20,tideLevel:2.45,waterLevel:3.20,hehaiLevel:2.23,zhinengLevel:2.36,jingxiLevel:1.08},
        {time:1592544938000,level:2.05,predictLevel:2.50,tideLevel:2.10,waterLevel:2.00,hehaiLevel:3.00,zhinengLevel:2.56,jingxiLevel:2.38},
        {time:1592631338000,level:2.50,predictLevel:3.10,tideLevel:2.30,waterLevel:2.40,hehaiLevel:2.50,zhinengLevel:2.86,jingxiLevel:2.08},
        {time:1592717738000,level:2.55,predictLevel:3.20,tideLevel:2.45,waterLevel:3.20,hehaiLevel:2.23,zhinengLevel:2.36,jingxiLevel:1.08},
        {time:1592804138000,level:2.05,predictLevel:2.50,tideLevel:2.10,waterLevel:2.00,hehaiLevel:3.00,zhinengLevel:2.56,jingxiLevel:2.38},
        {time:1592890538000,level:2.50,predictLevel:3.10,tideLevel:2.30,waterLevel:2.40,hehaiLevel:2.50,zhinengLevel:2.86,jingxiLevel:2.08},
        {time:1592976938000,level:2.55,predictLevel:3.20,tideLevel:2.45,waterLevel:3.20,hehaiLevel:2.23,zhinengLevel:2.36,jingxiLevel:1.08}
    ],"warnLevel":2.8,"warnLevel1":3.08,"warnLevel2":0.92,"warnLevel3":0.05,"dikeHeight":3.6,"leftDikeHeight":2.5,"rightDikeHeight":3.9};
    //自定义台风
    // stormProducePointSelf("producePointSelfChart", data);
    // stormProduceStationSelf("produceStationSelfChart", data);
    // stormProduceStormForecastSelf("produceStormForecastSelfChart", data);
    // stormProduceDamForecastSelf("produceDamForecastSelfChart", data);
    // stormProduceWarningForecastSelf("produceWarningForecastSelfChart",data);
    // stormProduceWaterForecastSelf("produceWaterForecastSelfChart", data);
    // stormProduceMaxDamForecastSelf("produceMaxDamForecastSelfChart", data);
    //风暴潮场景库
    // stormProduceStationSelf("produceStationHistoryChart", data);
    // stormProduceStormForecastSelf("produceStormForecastHistoryChart", data);
    // stormProduceDamForecastSelf("produceDamForecastHistoryChart", data);
    // stormProduceWarningForecastSelf("produceWarningForecastHistoryChart",data);
    // stormProduceWaterForecastSelf("produceWaterForecastHistoryChart", data);
    // stormProduceMaxDamForecastSelf("produceMaxDamForecastHistoryChart", data);
    // stormProduceFloodForecastSelf("produceFloodForecastHistoryChart",data);
});
/***************历史场景库、自定义台风*****************/
//任意一点过程图
function stormProducePointSelf(id, data) {
    myChart = echarts.init(document.getElementById(id)); 
    // 天文潮
    let seriesTideData = [];
    // 预测水位
    let seriesPredictData = [];
    // 风暴增水
    let seriesWaterData = [];
    data.list.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.tideLevel]);
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
        // 风暴增水
        seriesWaterData.push([item.time, item.waterLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '堤高',
                icon: 'image://../images/selfIcon/black.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/selfIcon/purpleLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/selfIcon/yellowLight.png'
            }, {
                name: '风暴增水',
                icon: 'image://../images/selfIcon/blueReal.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '天文潮') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive;
                } else {
                    htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '堤高',
            type: 'line',
            data: [[new Date().getTime, data.dikeHeight]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#5D5E62',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#5D5E62',
                    borderColor: '#5D5E62'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.dikeHeight ? [{
                    yAxis: data.dikeHeight,
                    name: '堤高'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#5D5E62'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#B85DFF',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            id: '天文潮',
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: '#FFC52B',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFC52B',
                    borderColor: '#FFC52B'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            name: '风暴增水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: '#58B1FE',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#58B1FE',
                    borderColor: '#58B1FE'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//站点过程图
function stormProduceStationSelf(id, data) {
    myChart = echarts.init(document.getElementById(id));
    // 天文潮
    let seriesTideData = [];
    // 预测水位
    let seriesPredictData = [];
    // 风暴增水
    let seriesWaterData = [];
    //实测水位
    let seriesRealLevelData = [];
    data.list.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.tideLevel]);
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
        // 风暴增水
        seriesWaterData.push([item.time, item.waterLevel]);
        //实测水位
        seriesRealLevelData.push([item.time, item.realLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '左堤高',
                icon: 'image://../images/selfIcon/black.png'
            },  {
                name: '右堤高',
                icon: 'image://../images/selfIcon/blue.png'
            },  {
                name: '警戒潮位',
                icon: 'image://../images/selfIcon/red.png'
            },  {
                name: '历史最高水位',
                icon: 'image://../images/selfIcon/greenDarkLine.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/selfIcon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/selfIcon/purpleLight.png'
            }, {
                name: '风暴增水',
                icon: 'image://../images/selfIcon/yellowLight.png'
            }, {
                name: '实测水位',
                icon: 'image://../images/echartsIcon/lightGreen.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '天文潮') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                    if(item.seriesName === '实测水位') {
                        htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>实测水位(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive;
                } else {
                    htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>';
                }
                if(htmlThree !== '') {
                    htmlText += htmlThree;
                } else {
                    htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '左堤高',
            type: 'line',
            data: [[new Date().getTime, data.leftDikeHeight]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#5D5E62',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#5D5E62',
                    borderColor: '#5D5E62'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.leftDikeHeight ? [{
                    yAxis: data.leftDikeHeight,
                    name: '左堤高'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#5D5E62'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '右堤高',
            type: 'line',
            data: [[new Date().getTime, data.rightDikeHeight]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#58B1FE',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#58B1FE',
                    borderColor: '#58B1FE'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.rightDikeHeight ? [{
                    yAxis: data.rightDikeHeight,
                    name: '右堤高'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#58B1FE'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '历史最高水位',
            type: 'line',
            data: [[new Date().getTime, data.historyHighestLevel]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#CD6A1F',
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
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.historyHighestLevel ? [{
                    yAxis: data.historyHighestLevel,
                    name: '历史最高水位'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#CD6A1F'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '警戒潮位',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#FF5A5A',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FF5A5A',
                    borderColor: '#FF5A5A'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnLevel ? [{
                    yAxis: data.warnLevel,
                    name: '警戒潮位'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#FF5A5A'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            id: '天文潮',
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: '#B85CFF',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85CFF',
                    borderColor: '#B85CFF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            name: '风暴增水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            name: '实测水位',
            type: 'line',
            data: seriesRealLevelData,
            lineStyle: {
                normal: {
                    color: '#30D7DC',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#30D7DC',
                    borderColor: '#30D7DC'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//风暴潮预报过程图
function stormProduceStormForecastSelf(id, data) {
    myChart = echarts.init(document.getElementById(id)); 
    // 天文潮
    let seriesTideData = [];
    // 预测水位
    let seriesPredictData = [];
    // 风暴增水
    let seriesWaterData = [];
    data.list.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.tideLevel]);
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
        // 风暴增水
        seriesWaterData.push([item.time, item.waterLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/selfIcon/redLine.png'
            },  {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/selfIcon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/selfIcon/purpleLight.png'
            }, {
                name: '风暴增水',
                icon: 'image://../images/selfIcon/yellowLight.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '天文潮') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive;
                } else {
                    htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '红色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.redWarn]],
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
                data: data.redWarn ? [{
                    yAxis: data.redWarn,
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
        },  {
            name: '黄色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.yellowWarn]],
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
                data: data.yellowWarn ? [{
                    yAxis: data.yellowWarn,
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
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            id: '天文潮',
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: '#B85CFF',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85CFF',
                    borderColor: '#B85CFF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            name: '风暴增水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//漫堤风险预警过程图
function stormProduceDamForecastSelf(id, data) {
    myChart = echarts.init(document.getElementById(id)); 
    // 预测水位
    let seriesPredictData = [];
    data.chartList.forEach(function(item, index){
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/selfIcon/redLine.png'
            },{
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },{
                name: '预测水位',
                icon: 'image://../images/selfIcon/greenLight.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                });
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '红色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.redWarn]],
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
                data: data.redWarn ? [{
                    yAxis: data.redWarn,
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
        },  {
            name: '黄色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.yellowWarn]],
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
                data: data.yellowWarn ? [{
                    yAxis: data.yellowWarn,
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
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//警戒潮位预警过程图
function stormProduceWarningForecastSelf(id, data) {
    myChart = echarts.init(document.getElementById(id)); 
    // 天文潮
    let seriesTideData = [];
    // 预测水位
    let seriesPredictData = [];
    // 风暴增水
    let seriesWaterData = [];
    data.list.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.tideLevel]);
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
        // 风暴增水
        seriesWaterData.push([item.time, item.waterLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/selfIcon/redLine.png'
            },  {
                name: '橙色警戒线',
                icon: 'image://../images/selfIcon/orangeLine.png'
            },  {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },  {
                name: '蓝色警戒线',
                icon: 'image://../images/selfIcon/blueLine.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/selfIcon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/selfIcon/purpleLight.png'
            }, {
                name: '风暴增水',
                icon: 'image://../images/selfIcon/yellowLight.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '天文潮') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive;
                } else {
                    htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '红色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
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
                data: data.warnLevel ? [{
                    yAxis: data.warnLevel,
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
        },  {
            name: '橙色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel1]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#FF9100',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FF9100',
                    borderColor: '#FF9100'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnLevel1 ? [{
                    yAxis: data.warnLevel1,
                    name: '橙色警戒线'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#FF9100'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '黄色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel2]],
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
                data: data.warnLevel2 ? [{
                    yAxis: data.warnLevel2,
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
        },  {
            name: '蓝色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel3]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#40A7EC',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#40A7EC',
                    borderColor: '#40A7EC'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnLevel3 ? [{
                    yAxis: data.warnLevel3,
                    name: '蓝色警戒线'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#40A7EC'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            id: '天文潮',
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: '#B85CFF',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85CFF',
                    borderColor: '#B85CFF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            name: '风暴增水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//最高水位过程图
function stormProduceWaterForecastSelf(id, data) {
    myChart = echarts.init(document.getElementById(id)); 
    // 天文潮
    let seriesTideData = [];
    // 预测水位
    let seriesPredictData = [];
    // 风暴增水
    let seriesWaterData = [];
    data.list.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.tideLevel]);
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
        // 风暴增水
        seriesWaterData.push([item.time, item.waterLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '堤高',
                icon: 'image://../images/selfIcon/purple.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/selfIcon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/selfIcon/purpleLight.png'
            }, {
                name: '风暴增水',
                icon: 'image://../images/selfIcon/yellowLight.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '天文潮') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive;
                } else {
                    htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '堤高',
            type: 'line',
            data: [[new Date().getTime, data.dikeHeight]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#8B69FF',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#8B69FF',
                    borderColor: '#8B69FF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.dikeHeight ? [{
                    yAxis: data.dikeHeight,
                    name: '堤高'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#8B69FF'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            id: '天文潮',
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: '#B85CFF',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85CFF',
                    borderColor: '#B85CFF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            name: '风暴增水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//最大漫堤风险过程图
function stormProduceMaxDamForecastSelf(id, data) {
    myChart = echarts.init(document.getElementById(id)); 
    // 天文潮
    let seriesTideData = [];
    // 预测水位
    let seriesPredictData = [];
    // 风暴增水
    let seriesWaterData = [];
    data.list.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.tideLevel]);
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
        // 风暴增水
        seriesWaterData.push([item.time, item.waterLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/selfIcon/redLine.png'
            },  {
                name: '橙色警戒线',
                icon: 'image://../images/selfIcon/orangeLine.png'
            },  {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },  {
                name: '蓝色警戒线',
                icon: 'image://../images/selfIcon/blueLine.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/selfIcon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/selfIcon/purpleLight.png'
            }, {
                name: '风暴增水',
                icon: 'image://../images/selfIcon/yellowLight.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '天文潮') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive;
                } else {
                    htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '红色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
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
                data: data.warnLevel ? [{
                    yAxis: data.warnLevel,
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
        },  {
            name: '橙色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel1]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#FF9100',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FF9100',
                    borderColor: '#FF9100'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnLevel1 ? [{
                    yAxis: data.warnLevel1,
                    name: '橙色警戒线'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#FF9100'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '黄色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel2]],
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
                data: data.warnLevel2 ? [{
                    yAxis: data.warnLevel2,
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
        },  {
            name: '蓝色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel3]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#40A7EC',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#40A7EC',
                    borderColor: '#40A7EC'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnLevel3 ? [{
                    yAxis: data.warnLevel3,
                    name: '蓝色警戒线'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#40A7EC'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            id: '天文潮',
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: '#B85CFF',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85CFF',
                    borderColor: '#B85CFF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        },  {
            name: '风暴增水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//防洪水位预警过程图
function stormProduceFloodForecastSelf(id, data) {
    myChart = echarts.init(document.getElementById(id)); 
    // 预测水位
    let seriesPredictData = [];
    data.chartList.forEach(function(item, index){
        // 预测水位
        seriesPredictData.push([item.time, item.predictLevel]);
    });
    let option = {
        toolbox: {
            show: true,
            feature: {
            saveAsImage: {
                show: false
            }
            }
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            itemWidth: 22,
            itemHeight: 10,
            itemGap:20,
            symbolKeepAspect: true,
            width: 820,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '100年一遇',
                icon: 'image://../images/selfIcon/redLine.png'
            },{
                name: '50年一遇',
                icon: 'image://../images/selfIcon/orangeLine.png'
            },{
                name: '20年一遇',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },{
                name: '10年一遇',
                icon: 'image://../images/selfIcon/blueLine.png'
            },{
                name: '预测水位',
                icon: 'image://../images/selfIcon/greenLight.png'
            }]
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
                    color: '#3850D5'
                }
            },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                });
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 80
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff',
                fontSize:0
            },
            show: true,
            handleSize: 30,
            fillerColor: '#D8DAE0'
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#707070'
                }
            },
            axisLabel: {
                show: true,
                interval: 2,
                textStyle: {
                    color: '#919191'
                },
                padding: [10, 0, 0, 0],
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show:false
            },
            maxInterval: 3600 * 12 * 1000
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
                    color: '#919191'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick: {
                show:false
            }
        },
        series: [{
            name: '100年一遇',
            type: 'line',
            data: [[new Date().getTime, data.redWarn]],
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
                data: data.redWarn ? [{
                    yAxis: data.redWarn,
                    name: '100年一遇'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#EC4040'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '50年一遇',
            type: 'line',
            data: [[new Date().getTime, data.orangeWarn]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#FF9100',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FF9100',
                    borderColor: '#FF9100'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.orangeWarn ? [{
                    yAxis: data.orangeWarn,
                    name: '50年一遇'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#FF9100'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '20年一遇',
            type: 'line',
            data: [[new Date().getTime, data.yellowWarn]],
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
                data: data.yellowWarn ? [{
                    yAxis: data.yellowWarn,
                    name: '20年一遇'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#ABD01E'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '10年一遇',
            type: 'line',
            data: [[new Date().getTime, data.blueWarn]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#40A7EC',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#40A7EC',
                    borderColor: '#40A7EC'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: data.blueWarn ? [{
                    yAxis: data.blueWarn,
                    name: '10年一遇'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: '#40A7EC'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}