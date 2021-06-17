function stationChartOne(data){
    var myEchart = echarts.init(document.getElementById('procedureChartTyphoon'));
    var seriesTwoData = [];
    var seriesThreeData = [];
    var seriesFourData = [];
    var seriesTime=[];
    // x轴时间范围
    var isLeftDisk = false
    var isRightDisk = false
    if (data.leftDike < data.rightDike) {
        isLeftDisk = true
    } else {
        isRightDisk = true
    }
    data.list.forEach(function(item, index) {
        // 实测数据
        seriesTwoData.push([item.time, item.realLevel]);
        // 天文潮
        seriesThreeData.push([item.time, item.tideLevel]);
        // 风暴增水
        seriesFourData.push([item.time, item.waterLevel]);
        seriesTime.push(item.time);
    });
    var timeLength=seriesTime.length;
    var option = {
        title:{
            text:data.stationName+'站增水情况过程线（'+new Date(seriesTime[0]).Format('yyyy年MM月dd日')+'-'+new Date(seriesTime[timeLength-1]).Format('dd日')+'）',
            textStyle:{
                color:'#333333',
                fontSize:14,
                fontWeight:'normal'
            }
        },
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
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '实测水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>实测水位(m)</p></li>'
                    }
                    if(item.seriesName === '天文潮') {
                        htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '风暴增水') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>风暴增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo
                } else {
                    htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>'
                }
                if(htmlThree !== '') {
                    htmlText += htmlThree
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>'
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour
                } else {
                    htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>'
                }
                htmlText += '</ul>'
                return htmlText
            }
        },
        grid: {
            x: 40,
            y: 60,
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
            itemWidth: 21,
            itemHeight: 7,
            symbolKeepAspect: true,
            width: 550,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '警戒潮位',
                icon: 'image://../images/echartsIcon/red.png'
            },  {
                name: '实测水位',
                icon: 'image://../images/echartsIcon/green.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/echartsIcon/yellow.png'
                    }, {
                name: '风暴增水',
                icon: 'image://../images/echartsIcon/lightBlue.png'
            }]
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
            data: [[new Date().getTime, data.warnLevel]],
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
            symbolSize:0,
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
            symbolSize:0,
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
            symbolSize:0,
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