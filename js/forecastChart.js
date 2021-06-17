$(function () {
    // var data = {"list":[
    //     {time:1592285738000,realLevel:2.05,tideLevel:2.10,waterLevel:2.00},
    //     {time:1592372138000,realLevel:2.50,tideLevel:2.30,waterLevel:2.40},
    //     {time:1592458538000,realLevel:2.55,tideLevel:2.45,waterLevel:3.20},
    //     {time:1592544938000,realLevel:2.05,tideLevel:2.10,waterLevel:2.00}
    // ],"warnLevel":4.5,"stationName":'中大'};
    // $(".simialrityChartItem").each(function(){
    //     var id=$(this).attr("id");
    //     simialrityForecastChart(id,data);
    // });
    // $(".realDataChartItem").each(function(){
    //     var id=$(this).attr("id");
    //     simialrityForecastChart(id,data);
    // });
});
//相似
function simialrityForecastChart(id,data, warnLevel){
    myChart = echarts.init(document.getElementById(id)); 
    //警戒潮位
    let seriesAlertData=[];
    // 天文潮
    let seriesTideData = [];
    // 实测水位
    let seriesLevelData = [];
    // 增减水
    let seriesWaterData = [];
    data.realLevel.forEach(function(item, index){
        // 实测水位
        seriesLevelData.push([item.time, item.level]);
    });
    data.waterLevel.forEach(function(item, index){
        // 增减水
        seriesWaterData.push([item.time, item.level]);
    });
    data.tideLevel.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.level]);
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
        title: {
            subtext: data.typhoonName,
            left: 0,
            top: 0,
            subtextStyle: {
                fontSize: 14,
                color: 'rgba(15,27,65,1)',
                fontWeight:'bold'
            }
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
            position:['10%','35%'],
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '实测水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>实测水位(m)</p></li>'
                    }
                    if(item.seriesName === '增减水') {
                        htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增减水(m)</p></li>'
                    }
                    if(item.seriesName === '天文潮') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>';
                }
                if(htmlThree !== '') {
                    htmlText += htmlThree;
                } else {
                    htmlText += '<li><h4>-</h4><p>增减水(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 50
        },
        legend: {
            show: true,
            right: 0,
            top: 10,
            textStyle: {
                color: 'rgba(23, 23, 24, 1)',
                fontSize: 10
            },
            itemWidth: 22,
            itemHeight: 13,
            symbolKeepAspect: true,
            borderColor: '#fff',
            data: [{
                name: '实测水位',
                icon: 'image://../images/legend/chart01.png'
            },  {
                name: '增减水',
                icon: 'image://../images/legend/chart02.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/legend/chart03.png'
            },  {
                name: '警戒潮位',
                icon: 'image://../images/legend/chart04.png'
            }]
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: 'rgba(231, 237, 241, 1)'
                }
            },
            axisLabel: {
            show: true,
            interval: 2,
            textStyle: {
                color: 'rgba(67, 66, 93, 1)'
            },
            padding: [10, 0, 0, 0],
            
            },
            splitLine: {
                show: false
            },
            maxInterval: 3600 * 12 * 1000 * 2
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: 'rgba(231, 237, 241, 1)'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['rgba(231, 237, 241, 1)'],
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: 'rgba(67, 66, 93, 1)'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            }
        },
        series: [{
            id: '实测水位',
            name: '实测水位',
            type: 'line',
            data: seriesLevelData,
            lineStyle: {
                normal: {
                    color: 'rgba(117, 216, 163, 1)',
                    width: '2'
                }
            },
            symbolSize:0,
            smooth:true,
            itemStyle: {
                normal: {
                    color: 'rgba(117, 216, 163, 1)',
                    borderColor: 'rgba(117, 216, 163, 1)'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '增减水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: 'rgba(185, 93, 255, 1)',
                    width: '2'
                }
            },
            symbolSize:0,
            smooth:true,
            itemStyle: {
                normal: {
                    color: 'rgba(185, 93, 255, 1)',
                    borderColor: 'rgba(185, 93, 255, 1)'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: 'rgba(255, 197, 43, 1)',
                    width: '2'
                }
            },
            symbolSize:0,
            smooth:true,
            itemStyle: {
                normal: {
                    color: 'rgba(255, 197, 43, 1)',
                    borderColor: 'rgba(255, 197, 43, 1)'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '警戒潮位',
            type: 'line',
            data: [[new Date().getTime, warnLevel]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: 'rgba(255, 15, 15, 1)',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: 'rgba(255, 15, 15, 1)',
                    borderColor: 'rgba(255, 15, 15, 1)'
                },
                emphasis: {
                    color: '#ffffff'
                }
            },
            markLine: {
                symbol: '',
                data: warnLevel ? [{
                    yAxis: warnLevel,
                    name: '警戒潮位'
                }] : [],
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(255, 90, 90, 1)'
                },
                label: {
                    formatter: '{c}'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//实时数据
function realDataForecastChartList(id,data){
    myChart = echarts.init(document.getElementById(id)); 
    //警戒潮位
    let seriesAlertData=[];
    // 天文潮
    let seriesTideData = [];
    // 实测水位
    let seriesLevelData = [];
    // 增减水
    let seriesWaterData = [];
    data.realLevel.forEach(function(item, index){
        // 实测水位
        seriesLevelData.push([item.time, item.level]);
    });
    data.waterLevel.forEach(function(item, index){
        // 增减水
        seriesWaterData.push([item.time, item.level]);
    });
    data.tideLevel.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.level]);
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
        title: {
            subtext: data.stationName,
            left: 0,
            top: 0,
            subtextStyle: {
                fontSize: 14,
                color: 'rgba(15,27,65,1)',
                fontWeight:'bold'
            }
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
            position:['10%','35%'],
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '实测水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>实测水位(m)</p></li>'
                    }
                    if(item.seriesName === '增减水') {
                        htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增减水(m)</p></li>'
                    }
                    if(item.seriesName === '天文潮') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>';
                }
                if(htmlThree !== '') {
                    htmlText += htmlThree;
                } else {
                    htmlText += '<li><h4>-</h4><p>增减水(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 30,
            y: 50,
            x2: 30,
            y2: 50
        },
        legend: {
            show: true,
            right: 0,
            top: 10,
            textStyle: {
                color: 'rgba(23, 23, 24, 1)',
                fontSize: 10
            },
            itemWidth: 22,
            itemHeight: 13,
            symbolKeepAspect: true,
            borderColor: '#fff',
            data: [{
                name: '实测水位',
                icon: 'image://../images/legend/chart01.png'
            },  {
                name: '增减水',
                icon: 'image://../images/legend/chart02.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/legend/chart03.png'
            },  {
                name: '警戒潮位',
                icon: 'image://../images/legend/chart04.png'
            }]
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: 'rgba(231, 237, 241, 1)'
                }
            },
            axisLabel: {
            show: true,
            interval: 2,
            textStyle: {
                color: 'rgba(67, 66, 93, 1)'
            },
            padding: [10, 0, 0, 0],
            
            },
            splitLine: {
                show: false
            },
            maxInterval: 3600 * 12 * 1000
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: 'rgba(231, 237, 241, 1)'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['rgba(231, 237, 241, 1)'],
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: 'rgba(67, 66, 93, 1)'
                },
                formatter: function (value, index) {
                    return value.toFixed(1)
                }
            }
        },
        series: [{
            id: '实测水位',
            name: '实测水位',
            type: 'line',
            data: seriesLevelData,
            lineStyle: {
                normal: {
                    color: 'rgba(117, 216, 163, 1)',
                    width: '2'
                }
            },
            symbolSize:0,
            smooth:true,
            itemStyle: {
                normal: {
                    color: 'rgba(117, 216, 163, 1)',
                    borderColor: 'rgba(117, 216, 163, 1)'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '增减水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    color: 'rgba(185, 93, 255, 1)',
                    width: '2'
                }
            },
            symbolSize:0,
            smooth:true,
            itemStyle: {
                normal: {
                    color: 'rgba(185, 93, 255, 1)',
                    borderColor: 'rgba(185, 93, 255, 1)'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: 'rgba(255, 197, 43, 1)',
                    width: '2'
                }
            },
            symbolSize:0,
            smooth:true,
            itemStyle: {
                normal: {
                    color: 'rgba(255, 197, 43, 1)',
                    borderColor: 'rgba(255, 197, 43, 1)'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '警戒潮位',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: 'rgba(255, 15, 15, 1)',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: 'rgba(255, 15, 15, 1)',
                    borderColor: 'rgba(255, 15, 15, 1)'
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
                    color: 'rgba(255, 90, 90, 1)'
                },
                label: {
                    formatter: '{c}'
                }
            }
        }]
    }
    myChart.setOption(option);
}
//预报订正漫堤风险
function produceDamForecastChart(id, data) {
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
            },  {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },  {
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
                data: data.redWarn	 ? [{
                    yAxis: data.redWarn	,
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
                    color: '#FFA119',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
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
                    color: '#FFA119'
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
//预报订正防洪水位预警过程图
function produceFloodForecastChart(id, data) {
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