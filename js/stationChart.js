function stationChart(id,data){
    myChart = echarts.init(document.getElementById(id)); 
    //警戒潮位
    let seriesAlertData=[];
    // 天文潮
    let seriesTideData = [];
    // 实测水位
    let seriesLevelData = [];
    // 增减水
    let seriesWaterData = [];
    data.list.forEach(function(item, index){
        // 天文潮
        seriesTideData.push([item.time, item.tideLevel]);
        // 实测水位
        seriesLevelData.push([item.time, item.realLevel]);
        // 增减水
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
            position:['10%','35%'],
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
            itemWidth: 16,
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