function statisticChart(id,data,selected){
    myChart = echarts.init(document.getElementById(id)); 
    //警戒潮位
    //let seriesAlertLevel=[];
    // 天文潮
    let seriesTideData = [];
    // 预测水位
    let seriesPredictData = [];
    // 增水
    let seriesWaterData = [];
    // 实测水位
    let seriesRealData = [];
    data.tideLevel.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.level]);
    });
    data.realLevel.forEach(function(item, index){
        // 实测水位
        seriesRealData.push([item.time, item.level]);
    });
    data.predictLevel.forEach(function(item, index){
        // 预测水位
        seriesPredictData.push([item.time, item.level]);
    });
    data.waterLevel.forEach(function(item, index){
        // 增水
        seriesWaterData.push([item.time, item.level]);
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
            top: -10,
            subtextStyle: {
                fontSize: 14,
                color: '#171718'
            }
        },
        legend: {
            show: false,
            selected: selected
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
                var htmlFive = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="title">'+timeStampTurnTime(item.data[0])+'</p><ul class="level">';
                    if(item.seriesName === '天文潮') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    }
                    if(item.seriesName === '实测水位') {
                        htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>实测水位(m)</p></li>'
                    }
                    if(item.seriesName === '预测水位') {
                        htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    if(item.seriesName === '增水') {
                        htmlFive += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>增水(m)</p></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo;
                } else {
                    htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>';
                }
                if(htmlThree !== '') {
                    htmlText += htmlThree;
                } else {
                    htmlText += '<li><h4>-</h4><p>实测水位(m)</p></li>';
                }
                if(htmlFour !== '') {
                    htmlText += htmlFour;
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>';
                }
                if(htmlFive !== '') {
                    htmlText += htmlFive;
                } else {
                    htmlText += '<li><h4>-</h4><p>增水(m)</p></li>';
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
        dataZoom: [],
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
            }
        },
        series: [{
            name: '警戒潮位',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#FD5A5A',
                    width: '2'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FD5A5A',
                    borderColor: '#FD5A5A'
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
        }, {
            id: '天文潮',
            name: '天文潮',
            type: 'line',
            data: seriesTideData,
            lineStyle: {
                normal: {
                    color: '#FFC52B',
                    width: '2'
                }
            },
            symbol: 'none',
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
        }, {
            name: '预测水位',
            type: 'line',
            data: seriesPredictData,
            lineStyle: {
                normal: {
                    color: '#B95DFF',
                    width: '2'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B95DFF',
                    borderColor: '#B95DFF'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '增水',
            type: 'line',
            data: seriesWaterData,
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: '#EA7735',
                    width: '2'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#EA7735',
                    borderColor: '#EA7735'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }, {
            name: '实测水位',
            type: 'line',
            data: seriesRealData,
            lineStyle: {
                normal: {
                    color: '#5DFFAE',
                    width: '2'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#5DFFAE',
                    borderColor: '#5DFFAE'
                },
                emphasis: {
                    color: '#ffffff'
                }
            }
        }]
    }
    myChart.setOption(option);
}