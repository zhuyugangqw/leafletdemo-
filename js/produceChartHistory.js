$(function(){
    var data = {"list":[
        {time:1592285738000,level:2.05,predictLevel:2.50,tideLevel:2.10,waterLevel:2.00},
        {time:1592372138000,level:2.50,predictLevel:3.10,tideLevel:2.30,waterLevel:2.40},
        {time:1592458538000,level:2.55,predictLevel:3.20,tideLevel:2.45,waterLevel:3.20},
        {time:1592544938000,level:2.05,predictLevel:2.50,tideLevel:2.10,waterLevel:2.00},
        {time:1592631338000,level:2.50,predictLevel:3.10,tideLevel:2.30,waterLevel:2.40},
        {time:1592717738000,level:2.55,predictLevel:3.20,tideLevel:2.45,waterLevel:3.20},
        {time:1592804138000,level:2.05,predictLevel:2.50,tideLevel:2.10,waterLevel:2.00},
        {time:1592890538000,level:2.50,predictLevel:3.10,tideLevel:2.30,waterLevel:2.40},
        {time:1592976938000,level:2.55,predictLevel:3.20,tideLevel:2.45,waterLevel:3.20}
    ],"warnValue":2.8};
    /*data.list = [{
        time: new Date().getTime(),
        predictLevel: 1
    }, {
        time: new Date().getTime() + 1000,
        predictLevel: 2
    }, {
        time: new Date().getTime() + 2000,
        predictLevel: 3
    }];*/
    var myEchart = echarts.init(document.getElementById('procedureChartHistory'));
    var xAxisData = [];
    var seriesOneData = [];
    var seriesTwoData = [];
    var seriesThreeData = [];
    var seriesFourData = [];
    var seriesFiveData = [];
    // x轴时间范围
    var isLeftDisk = false
    var isRightDisk = false
    if (data.leftDike < data.rightDike) {
        isLeftDisk = true
    } else {
        isRightDisk = true
    }
    data.list.forEach(function(item, index) {
        //警戒潮位
        //seriesOneData.push([item.time, item.warningLevel]);
        // 实测数据
        seriesTwoData.push([item.time, item.level]);
        // 预测数据
        seriesThreeData.push([item.time, item.predictLevel]);
        // 天文潮
        seriesFourData.push([item.time, item.tideLevel]);
        // 风暴增水
        seriesFiveData.push([item.time, item.waterLevel]);
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: 10,
            formatter: function(params) {
                //var htmlText = '<p class="title">YYYY-MM-DD HH:mm</p><ul class="level">';
                //var htmlOne = '';
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    /*if(item.seriesName === '警戒潮位') {
                        htmlOne += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>警戒潮位(m)</p></li>'
                    }*/
                    if(item.seriesName === '实测水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>实测水位(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '天文潮') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>风暴增水(m)</p></li>'
                    }
                });
                /*if(htmlOne !== '') {
                    htmlText += htmlOne
                } else {
                    htmlText += '<li><h4>-</h4><p>警戒潮位(m)</p></li>'
                }*/
                if(htmlTwo !== '') {
                    htmlText += htmlTwo
                } else {
                    htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>'
                }
                if(htmlThree !== '') {
                    htmlText += htmlThree
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>'
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>'
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive
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
            y2: 80
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            textStyle: {
                color: '#171718',
                fontSize:12
            },
            itemWidth: 22,
            itemHeight: 13,
            symbolKeepAspect: true,
            width: 550,
            borderColor: '#fff',
            inactiveColor: '#666666',
            // data: [{
            //     name: '警戒潮位',
            //     icon: 'image://'+urlLink+'/images/legend/produceIcon1.png'
            // },  {
            //     name: '实测水位',
            //     icon: 'image://'+urlLink+'/images/legend/produceIcon2.png'
            // },  {
            //     name: '预测水位',
            //     icon: 'image://'+urlLink+'/images/legend/produceIcon3.png'
            // },  {
            //     name: '天文潮',
            //     icon: 'image://'+urlLink+'/images/legend/produceIcon4.png'
            //         }, {
            //     name: '风暴增水',
            //     icon: 'image://'+urlLink+'/images/legend/produceIcon5.png'
            // }]
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff'
            },
            show: true,
            handleSize: 24,
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                offset: 0,
                color: 'rgba(255, 255, 255, 0.95)'
            }, {
                offset: 1,
                color: 'rgba(167, 183, 204, 0.4)'
            }])
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type : 'time',
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
                    color: '#707070'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
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
                    color: '#707070'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            }
        },
        series: [{
            name: '警戒潮位',
            type: 'line',
            //data: seriesOneData,
            //connectNulls: false,
            data: [[new Date().getTime, data.warnValue]],
            lineStyle: {
                normal: {
                    color: '#FD5A5A',
                    width: '1',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FD5A5A',
                    borderColor: '#FD5A5A'
                },
                emphasis: {
                    color: '#FD5A5A'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnValue ? [{
                    yAxis: data.warnValue,
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
        },  {
            name: '实测水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '1',
                    shadowBlur:3,
                    shadowColor:'rgba(30,203,94,0.83)'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#77D5A1'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesThreeData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#B95DFF',
                    width: '1',
                    shadowBlur:3,
                    shadowColor:'rgba(233,31,255,0.84)'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            itemStyle: {
                normal: {
                    color: '#B95DFF',
                    borderColor: '#B95DFF'
                },
                emphasis: {
                    color: '#B95DFF'
                }
            }
        },  {
            name: '天文潮',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFC52B',
                    width: '1',
                    shadowBlur:3,
                    shadowColor:'rgba(255,213,44,0.85)'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            itemStyle: {
                normal: {
                    color: '#FFC52B',
                    borderColor: '#FFC52B'
                },
                emphasis: {
                    color: '#FFC52B'
                }
            }
        }, {
            name: '风暴增水',
            type: 'line',
            data: seriesFiveData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#58B1FE',
                    width: '1',
                    shadowBlur:3,
                    shadowColor:'rgba(25,171,255,0.87)'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            itemStyle: {
                normal: {
                    color: '#58B1FE',
                    borderColor: '#58B1FE'
                },
                emphasis: {
                    color: '#58B1FE'
                }
            }
        }]
    }
    myEchart.setOption(option);

    //forecastReportHistoryStorm(113.62265,22.78826,"1","2","1");
});

//水情专题/历史播报/风暴潮
function forecastReportHistoryStorm(lonPoint,latPoint,typhoonNumber,forecastType,agency){
    $("#forecastHistoryStormPop").show();
    //历史播报风暴潮的过程图和报表导航切换
    $(".forecastHistoryStorm-title-txt").click(function(){
        var index=$(this).index();
        $(this).addClass("forecastHistoryStorm-title-txtClick");
        $(this).siblings(".forecastHistoryStorm-title-txt").removeClass("forecastHistoryStorm-title-txtClick");
        $(this).parent().siblings(".forecast-case-body").find(".forecast-body-item").eq(index).show();
        $(this).parent().siblings(".forecast-case-body").find(".forecast-body-item").eq(index).siblings().hide();
    });
    $(".forecastHistoryStorm-title-txt").eq(0).trigger("click");
    var params={
        'lonPoint' : lonPoint,
        'latPoint' : latPoint,
        'typhoonNumber' : typhoonNumber,
        'forecastType' : forecastType,
        'agency' : agency
    }
    $ajax('/web/opendap/netcdf/storm/water/regime/history/typhoon/chart',params,function(res){
        var data = res.data;
        if(data.length == 0){
            
        }else{
            stormChartHistory(data);
            var tableHtml='';
            for(var i=0;i<data.list.length;i++){
                if((data.list)[i].predictLevel == undefined || (data.list)[i].predictLevel == null || (data.list)[i].predictLevel==""){
                    (data.list)[i].predictLevel = '-';
                }else{
                    (data.list)[i].predictLevel = ((data.list)[i].predictLevel).toFixed(2);
                }
                if((data.list)[i].tideLevel == undefined || (data.list)[i].tideLevel == null || (data.list)[i].tideLevel==""){
                    (data.list)[i].tideLevel = '-';
                }else{
                    (data.list)[i].tideLevel = ((data.list)[i].tideLevel).toFixed(2);
                }
                if((data.list)[i].waterLevel == undefined || (data.list)[i].waterLevel == null || (data.list)[i].waterLevel==""){
                    (data.list)[i].waterLevel = '-';
                }else{
                    (data.list)[i].waterLevel = ((data.list)[i].waterLevel).toFixed(2);
                }
                tableHtml=tableHtml+'<tr>'+
                    '<td>'+timeStampTurnTime((data.list)[i].time)+'</td>'+
                    '<td>'+(data.list)[i].predictLevel+'</td>'+
                    '<td>'+(data.list)[i].tideLevel+'</td>'+
                    '<td>'+(data.list)[i].waterLevel+'</td>'+
                '</tr>';
            }
            $(".forecastHistoryStormTableBody").html(tableHtml);
        }
        $("#forecastHistoryStormLonLat").text(lonPoint+' ；'+latPoint);
    });
}
//风暴潮统计图
function stormChartHistory(data){
    var myEchart = echarts.init(document.getElementById('procedureChartHistoryStorm'));
    var xAxisData = [];
    var seriesTwoData = [];;
    var seriesThreeData = [];
    var seriesFourData = [];
    // x轴时间范围
    var isLeftDisk = false
    var isRightDisk = false
    if (data.leftDike < data.rightDike) {
        isLeftDisk = true
    } else {
        isRightDisk = true
    }
    data.list.forEach(function(item, index) {
        // 预测数据
        seriesTwoData.push([item.time, item.predictLevel]);
        // 天文潮
        seriesThreeData.push([item.time, item.tideLevel]);
        // 增水
        seriesFourData.push([item.time, item.waterLevel]);
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: 10,
            formatter: function(params) {
                var htmlOne = '';
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '预测水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '天文潮') {
                        htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '增水') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlThree !== '') {
                    htmlText += htmlThree;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>增水(m)</p></li>';
                }
                htmlText += '</ul>';
                return htmlText;
            }
        },
        grid: {
            x: 40,
            y: 30,
            x2: 40,
            y2: 80
        },
        legend: {
            show: true,
            right: 20,
            top: 0,
            textStyle: {
                color: '#171718',
                fontSize:12
            },
            itemWidth: 22,
            itemHeight: 13,
            symbolKeepAspect: true,
            width: 550,
            borderColor: '#fff',
            inactiveColor: '#666666',
    //         data: [{
    //       name: '预测水位',
    //       icon: 'image://'+urlLink+'/images/legend/produceIcon3.png'
    //   },  {
    //             name: '天文潮',
    //     icon: 'image://'+urlLink+'/images/legend/produceIcon4.png'
    //         }, {
    //             name: '增水',
    //     icon: 'image://'+urlLink+'/images/legend/produceIcon5.png'
    //         }]
        },
        dataZoom: [{
            type: 'slider',
            width: 720,
            height: 12,
            left: 44,
            bottom: 6,
            textStyle: {
                color: '#fff'
            },
            show: true,
            handleSize: 24,
            fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                offset: 0,
                color: 'rgba(255, 255, 255, 0.95)'
            }, {
                offset: 1,
                color: 'rgba(167, 183, 204, 0.4)'
            }])
        }, {
            type: 'inside',
            show: true,
            xAxisIndex: [0]
        }],
        xAxis: {
            type : 'time',
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
                    color: '#707070'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
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
                    color: '#707070'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            }
        },
        series: [{
            name: '预测水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#B95DFF',
                    width: '1',
                    shadowBlur:3,
                    shadowColor:'rgba(233,31,255,0.84)'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            itemStyle: {
                normal: {
                    color: '#B95DFF',
                    borderColor: '#B95DFF'
                },
                emphasis: {
                    color: '#B95DFF'
                }
            }
        },  {
            name: '天文潮',
            type: 'line',
            data: seriesThreeData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFC52B',
                    width: '1',
                    shadowBlur:3,
                    shadowColor:'rgba(255,213,44,0.85)'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            itemStyle: {
                normal: {
                    color: '#FFC52B',
                    borderColor: '#FFC52B'
                },
                emphasis: {
                    color: '#FFC52B'
                }
            }
        }, {
            name: '增水',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#58B1FE',
                    width: '1',
                    shadowBlur:3,
                    shadowColor:'rgba(25,171,255,0.87)'
                }
            },
            symbol: 'circle',
            symbolSize:6,
            itemStyle: {
                normal: {
                    color: '#58B1FE',
                    borderColor: '#58B1FE'
                },
                emphasis: {
                    color: '#58B1FE'
                }
            }
        }]
    }
    myEchart.setOption(option);
}