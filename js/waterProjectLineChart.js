//潮位过程图
function waterProjectTideProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
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
        // 水位
        seriesTwoData.push([item.time, item.realLevel]);
        // 天文潮
        seriesThreeData.push([item.time, item.tideLevel]);
        // 风暴增水
        seriesFourData.push([item.time, item.waterLevel]);
        //seriesTime.push(item.time);
    });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>水位(m)</p></li>'
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
                    htmlText += '<li><h4>-</h4><p>水位(m)</p></li>'
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:20,
            symbolKeepAspect: true,
            width: 550,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '警戒线',
                icon: 'image://../images/waterProject/icon/red.png'
            },  {
                name: '堤高',
                icon: 'image://../images/waterProject/icon/purple.png'
            },  {
                name: '水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/waterProject/icon/purpleLight.png'
                    }, {
                name: '风暴增水',
                icon: 'image://../images/waterProject/icon/orangeLight.png'
            }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
            lineStyle: {
                normal: {
                    color: '#EC4040',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#EC4040',
                    borderColor: '#EC4040'
                },
                emphasis: {
                    color: '#EC4040'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnLevel ? [{
                    yAxis: data.warnLevel,
                    name: '警戒线'
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
            name: '堤高',
            type: 'line',
            data: [[new Date().getTime, data.dikeHeight]],
            lineStyle: {
                normal: {
                    color: '#8B69FF',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#8B69FF',
                    borderColor: '#8B69FF'
                },
                emphasis: {
                    color: '#8B69FF'
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
            name: '水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(30,203,94,0.83)'
                }
            },
            symbol: 'none',
            smooth:true,
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
                    color: '#B85DFF',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(255,213,44,0.85)'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#B85DFF'
                }
            }
        }, {
            name: '风暴增水',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(25,171,255,0.87)'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#FFA119'
                }
            }
        }]
    }
    myEchart.setOption(option);
}

//风暴潮预报过程图
function forecastPlayStormProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
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
        // 水位
        seriesTwoData.push([item.time, item.predictLevel]);
        // 天文潮
        seriesThreeData.push([item.time, item.tideLevel]);
        // 风暴增水
        seriesFourData.push([item.time, item.waterLevel]);
        seriesTime.push(item.time);
    });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>水位(m)</p></li>'
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
                    htmlText += '<li><h4>-</h4><p>水位(m)</p></li>'
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:30,
            symbolKeepAspect: true,
            width: 600,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/waterProject/icon/red.png'
            },  {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },  {
                name: '堤高',
                icon: 'image://../images/waterProject/icon/purple.png'
            },  {
                name: '水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/waterProject/icon/purpleLight.png'
                    }, {
                name: '风暴增水',
                icon: 'image://../images/waterProject/icon/orangeLight.png'
            }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
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
            name: '堤高',
            type: 'line',
            data: [[new Date().getTime, data.dikeHeight]],
            lineStyle: {
                normal: {
                    color: '#8B69FF',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#8B69FF',
                    borderColor: '#8B69FF'
                },
                emphasis: {
                    color: '#8B69FF'
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
            name: '水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
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
                    color: '#B85DFF',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#B85DFF'
                }
            }
        }, {
            name: '风暴增水',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#FFA119'
                }
            }
        }]
    }
    myEchart.setOption(option);
}

//漫堤风险预警
function forecastPlayDamProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
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
    data.chartList.forEach(function(item, index) {
        // 预测水位
        seriesTwoData.push([item.time, item.predictLevel]);
        //seriesTime.push(item.time);
    });
    // data.tideLevel.forEach(function(item, index) {
    //     // 天文潮
    //     seriesThreeData.push([item.time, item.level]);
    // });
    // data.waterLevel.forEach(function(item, index) {
    //     // 风暴增水
    //     seriesFourData.push([item.time, item.level]);
    // });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '预测水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    // if(item.seriesName === '天文潮') {
                    //     htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    // }
                    // if(item.seriesName === '风暴增水') {
                    //     htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>风暴增水(m)</p></li>'
                    // }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>'
                }
                // if(htmlThree !== '') {
                //     htmlText += htmlThree
                // } else {
                //     htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>'
                // }
                // if(htmlFour !== '') {
                //     htmlText += htmlFour
                // } else {
                //     htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>'
                // }
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:16,
            symbolKeepAspect: true,
            width: 700,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/waterProject/icon/red.png'
            }, {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            }, {
                name: '预测水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            }]
            // }, {
            //     name: '橙色警戒线',
            //     icon: 'image://../images/waterProject/icon/orange.png'
            // },  {
            //     name: '蓝色警戒线',
            //     icon: 'image://../images/waterProject/icon/blue.png'
            // },  {
            //     name: '堤高',
            //     icon: 'image://../images/waterProject/icon/purple.png'
            // },    {
            //     name: '天文潮',
            //     icon: 'image://../images/waterProject/icon/purpleLight.png'
            //         }, {
            //     name: '风暴增水',
            //     icon: 'image://../images/waterProject/icon/orangeLight.png'
            // }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '红色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.redWarn]],
            lineStyle: {
                normal: {
                    color: '#EC4040',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#EC4040',
                    borderColor: '#EC4040'
                },
                emphasis: {
                    color: '#EC4040'
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
        },
        // {
        //     name: '橙色警戒线',
        //     type: 'line',
        //     data: [[new Date().getTime, data.orange]],
        //     lineStyle: {
        //         normal: {
        //             color: '#FF9100',
        //             width: '2',
        //             type:'dashed'
        //         }
        //     },
        //     symbol: 'none',
        //     itemStyle: {
        //         normal: {
        //             color: '#FF9100',
        //             borderColor: '#FF9100'
        //         },
        //         emphasis: {
        //             color: '#FF9100'
        //         }
        //     },
        //     markLine: {
        //         symbol: '',
        //         data: data.orange ? [{
        //             yAxis: data.orange,
        //             name: '橙色警戒线'
        //         }] : [],
        //         lineStyle: {
        //             type: 'dashed',
        //             color: '#FF9100'
        //         },
        //         label: {
        //             formatter: '{c}'
        //         }
        //     }
        // },  
        {
            name: '黄色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.yellowWarn]],
            lineStyle: {
                normal: {
                    color: '#ABD01E',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#ABD01E',
                    borderColor: '#ABD01E'
                },
                emphasis: {
                    color: '#ABD01E'
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
        },  
        // {
        //     name: '蓝色警戒线',
        //     type: 'line',
        //     data: [[new Date().getTime, data.blue]],
        //     lineStyle: {
        //         normal: {
        //             color: '#40A7EC',
        //             width: '2',
        //             type:'dashed'
        //         }
        //     },
        //     symbol: 'none',
        //     itemStyle: {
        //         normal: {
        //             color: '#40A7EC',
        //             borderColor: '#40A7EC'
        //         },
        //         emphasis: {
        //             color: '#40A7EC'
        //         }
        //     },
        //     markLine: {
        //         symbol: '',
        //         data: data.blue ? [{
        //             yAxis: data.blue,
        //             name: '蓝色警戒线'
        //         }] : [],
        //         lineStyle: {
        //             type: 'dashed',
        //             color: '#40A7EC'
        //         },
        //         label: {
        //             formatter: '{c}'
        //         }
        //     }
        // },  
        {
            name: '预测水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#75D8A3'
                }
            }
        },  
        // {
        //     name: '天文潮',
        //     type: 'line',
        //     data: seriesThreeData,
        //     connectNulls: false,
        //     lineStyle: {
        //         normal: {
        //             color: '#B85DFF',
        //             width: '2',
        //         }
        //     },
        //     symbol: 'none',
        //     smooth:true,
        //     itemStyle: {
        //         normal: {
        //             color: '#B85DFF',
        //             borderColor: '#B85DFF'
        //         },
        //         emphasis: {
        //             color: '#B85DFF'
        //         }
        //     }
        // }, {
        //     name: '风暴增水',
        //     type: 'line',
        //     data: seriesFourData,
        //     connectNulls: false,
        //     lineStyle: {
        //         normal: {
        //             color: '#FFA119',
        //             width: '2',
        //         }
        //     },
        //     symbol: 'none',
        //     smooth:true,
        //     itemStyle: {
        //         normal: {
        //             color: '#FFA119',
        //             borderColor: '#FFA119'
        //         },
        //         emphasis: {
        //             color: '#FFA119'
        //         }
        //     }
        // }
    ]
    }
    myEchart.setOption(option);
}

//警戒潮位预警
function forecastPlayWarnProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
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
    data.predictLevel.forEach(function(item, index) {
        // 水位
        seriesTwoData.push([item.time, item.level]);
    });
    data.tideLevel.forEach(function(item, index) {
        // 天文潮
        seriesThreeData.push([item.time, item.level]);
    });
    data.waterLevel.forEach(function(item, index) {
        // 风暴增水
        seriesFourData.push([item.time, item.level]);
    });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>水位(m)</p></li>'
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
                    htmlText += '<li><h4>-</h4><p>水位(m)</p></li>'
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:16,
            symbolKeepAspect: true,
            width: 700,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/waterProject/icon/red.png'
            },  {
                name: '橙色警戒线',
                icon: 'image://../images/waterProject/icon/orange.png'
            },  {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },  {
                name: '蓝色警戒线',
                icon: 'image://../images/waterProject/icon/blue.png'
            },  {
                name: '堤高',
                icon: 'image://../images/waterProject/icon/purple.png'
            },  {
                name: '水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/waterProject/icon/purpleLight.png'
                    }, {
                name: '风暴增水',
                icon: 'image://../images/waterProject/icon/orangeLight.png'
            }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '红色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.red]],
            lineStyle: {
                normal: {
                    color: '#EC4040',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#EC4040',
                    borderColor: '#EC4040'
                },
                emphasis: {
                    color: '#EC4040'
                }
            },
            markLine: {
                symbol: '',
                data: data.red ? [{
                    yAxis: data.red,
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
        },{
            name: '橙色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.orange]],
            lineStyle: {
                normal: {
                    color: '#FF9100',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FF9100',
                    borderColor: '#FF9100'
                },
                emphasis: {
                    color: '#FF9100'
                }
            },
            markLine: {
                symbol: '',
                data: data.orange ? [{
                    yAxis: data.orange,
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
            data: [[new Date().getTime, data.yellow]],
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#ABD01E',
                    borderColor: '#ABD01E'
                },
                emphasis: {
                    color: '#ABD01E'
                }
            },
            markLine: {
                symbol: '',
                data: data.yellow ? [{
                    yAxis: data.yellow,
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
            data: [[new Date().getTime, data.blue]],
            lineStyle: {
                normal: {
                    color: '#40A7EC',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#40A7EC',
                    borderColor: '#40A7EC'
                },
                emphasis: {
                    color: '#40A7EC'
                }
            },
            markLine: {
                symbol: '',
                data: data.blue ? [{
                    yAxis: data.blue,
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
            name: '水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
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
                    color: '#B85DFF',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#B85DFF'
                }
            }
        }, {
            name: '风暴增水',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#FFA119'
                }
            }
        }]
    }
    myEchart.setOption(option);
}

//最高水位
function forecastPlayWaterProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
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
        // 水位
        seriesTwoData.push([item.time, item.predictLevel]);
        // 天文潮
        seriesThreeData.push([item.time, item.tideLevel]);
        // 风暴增水
        seriesFourData.push([item.time, item.waterLevel]);
        seriesTime.push(item.time);
    });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>水位(m)</p></li>'
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
                    htmlText += '<li><h4>-</h4><p>水位(m)</p></li>'
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            symbolKeepAspect: true,
            width: 550,
            itemGap:30,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '堤高',
                icon: 'image://../images/waterProject/icon/purple.png'
            },  {
                name: '水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/waterProject/icon/purpleLight.png'
                    }, {
                name: '风暴增水',
                icon: 'image://../images/waterProject/icon/orangeLight.png'
            }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '堤高',
            type: 'line',
            data: [[new Date().getTime, data.dikeHeight]],
            lineStyle: {
                normal: {
                    color: '#8B69FF',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#8B69FF',
                    borderColor: '#8B69FF'
                },
                emphasis: {
                    color: '#8B69FF'
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
            name: '水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
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
                    color: '#B85DFF',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#B85DFF'
                }
            }
        }, {
            name: '风暴增水',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#FFA119'
                }
            }
        }]
    }
    myEchart.setOption(option);
}

//最大漫堤风险预警
function forecastPlayDamMaxProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
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
    data.predictLevel.forEach(function(item, index) {
        // 水位
        seriesTwoData.push([item.time, item.level]);
    });
    data.tideLevel.forEach(function(item, index) {
        // 天文潮
        seriesThreeData.push([item.time, item.level]);
    });
    data.waterLevel.forEach(function(item, index) {
        // 风暴增水
        seriesFourData.push([item.time, item.level]);
    });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>水位(m)</p></li>'
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
                    htmlText += '<li><h4>-</h4><p>水位(m)</p></li>'
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:16,
            symbolKeepAspect: true,
            width: 700,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '红色警戒线',
                icon: 'image://../images/waterProject/icon/red.png'
            },  {
                name: '橙色警戒线',
                icon: 'image://../images/waterProject/icon/orange.png'
            },  {
                name: '黄色警戒线',
                icon: 'image://../images/selfIcon/yellowLine.png'
            },  {
                name: '蓝色警戒线',
                icon: 'image://../images/waterProject/icon/blue.png'
            },  {
                name: '堤高',
                icon: 'image://../images/waterProject/icon/purple.png'
            },  {
                name: '水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/waterProject/icon/purpleLight.png'
                    }, {
                name: '风暴增水',
                icon: 'image://../images/waterProject/icon/orangeLight.png'
            }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '红色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.red]],
            lineStyle: {
                normal: {
                    color: '#EC4040',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#EC4040',
                    borderColor: '#EC4040'
                },
                emphasis: {
                    color: '#EC4040'
                }
            },
            markLine: {
                symbol: '',
                data: data.red ? [{
                    yAxis: data.red,
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
        },{
            name: '橙色警戒线',
            type: 'line',
            data: [[new Date().getTime, data.orange]],
            lineStyle: {
                normal: {
                    color: '#FF9100',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FF9100',
                    borderColor: '#FF9100'
                },
                emphasis: {
                    color: '#FF9100'
                }
            },
            markLine: {
                symbol: '',
                data: data.orange ? [{
                    yAxis: data.orange,
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
            data: [[new Date().getTime, data.yellow]],
            lineStyle: {
                normal: {
                    color: '#ABD01E',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#ABD01E',
                    borderColor: '#ABD01E'
                },
                emphasis: {
                    color: '#ABD01E'
                }
            },
            markLine: {
                symbol: '',
                data: data.yellow ? [{
                    yAxis: data.yellow,
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
            data: [[new Date().getTime, data.blue]],
            lineStyle: {
                normal: {
                    color: '#40A7EC',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#40A7EC',
                    borderColor: '#40A7EC'
                },
                emphasis: {
                    color: '#40A7EC'
                }
            },
            markLine: {
                symbol: '',
                data: data.blue ? [{
                    yAxis: data.blue,
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
            name: '水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
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
                    color: '#B85DFF',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#B85DFF'
                }
            }
        }, {
            name: '风暴增水',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#FFA119'
                }
            }
        }]
    }
    myEchart.setOption(option);
}

//防洪水位预警过程图
function forecastPlayFloodProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
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
    data.chartList.forEach(function(item, index) {
        // 预测水位
        seriesTwoData.push([item.time, item.predictLevel]);
        //seriesTime.push(item.time);
    });
    // data.tideLevel.forEach(function(item, index) {
    //     // 天文潮
    //     seriesThreeData.push([item.time, item.level]);
    // });
    // data.waterLevel.forEach(function(item, index) {
    //     // 风暴增水
    //     seriesFourData.push([item.time, item.level]);
    // });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '预测水位') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
                    // if(item.seriesName === '天文潮') {
                    //     htmlThree += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>天文潮(m)</p></li>'
                    // }
                    // if(item.seriesName === '风暴增水') {
                    //     htmlFour += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>风暴增水(m)</p></li>'
                    // }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>'
                }
                // if(htmlThree !== '') {
                //     htmlText += htmlThree
                // } else {
                //     htmlText += '<li><h4>-</h4><p>天文潮(m)</p></li>'
                // }
                // if(htmlFour !== '') {
                //     htmlText += htmlFour
                // } else {
                //     htmlText += '<li><h4>-</h4><p>风暴增水(m)</p></li>'
                // }
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:16,
            symbolKeepAspect: true,
            width: 700,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '100年一遇',
                icon: 'image://../images/waterProject/icon/red.png'
            }, {
                name: '50年一遇',
                icon: 'image://../images/waterProject/icon/orange.png'
            }, {
                name: '20年一遇',
                icon: 'image://../images/selfIcon/yellowLine.png'
            }, {
                name: '10年一遇',
                icon: 'image://../images/waterProject/icon/blue.png'
            }, {
                name: '预测水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            }]
            // }, {
            //     name: '橙色警戒线',
            //     icon: 'image://../images/waterProject/icon/orange.png'
            // },  {
            //     name: '蓝色警戒线',
            //     icon: 'image://../images/waterProject/icon/blue.png'
            // },  {
            //     name: '堤高',
            //     icon: 'image://../images/waterProject/icon/purple.png'
            // },    {
            //     name: '天文潮',
            //     icon: 'image://../images/waterProject/icon/purpleLight.png'
            //         }, {
            //     name: '风暴增水',
            //     icon: 'image://../images/waterProject/icon/orangeLight.png'
            // }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '100年一遇',
            type: 'line',
            data: [[new Date().getTime, data.redWarn]],
            lineStyle: {
                normal: {
                    color: '#EC4040',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#EC4040',
                    borderColor: '#EC4040'
                },
                emphasis: {
                    color: '#EC4040'
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
        },
        {
            name: '50年一遇',
            type: 'line',
            data: [[new Date().getTime, data.orangeWarn]],
            lineStyle: {
                normal: {
                    color: '#FF9100',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#FF9100',
                    borderColor: '#FF9100'
                },
                emphasis: {
                    color: '#FF9100'
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
        },  
        {
            name: '20年一遇',
            type: 'line',
            data: [[new Date().getTime, data.yellowWarn]],
            lineStyle: {
                normal: {
                    color: '#ABD01E',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#ABD01E',
                    borderColor: '#ABD01E'
                },
                emphasis: {
                    color: '#ABD01E'
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
        },  
        {
            name: '10年一遇',
            type: 'line',
            data: [[new Date().getTime, data.blueWarn]],
            lineStyle: {
                normal: {
                    color: '#40A7EC',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#40A7EC',
                    borderColor: '#40A7EC'
                },
                emphasis: {
                    color: '#40A7EC'
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
        },  
        {
            name: '预测水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#75D8A3'
                }
            }
        },  
    ]
    }
    myEchart.setOption(option);
}

//站点观测数据过程图
function forecastPlayStationProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
    var seriesOneData = [];
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
    data.tideLevel.forEach(function(item, index) {
        // 天文潮
        seriesThreeData.push([item.time, item.level]);
    });
    data.waterLevel.forEach(function(item, index) {
        // 风暴增水
        seriesTwoData.push([item.time, item.level]);
    });
    data.realLevel.forEach(function(item, index) {
        // 实测水位
        seriesFourData.push([item.time, item.level]);
    });
    data.predictLevel.forEach(function(item, index) {
        // 预测水位
        seriesOneData.push([item.time, item.level]);
    });
    var timeLength=seriesTime.length;
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlOne = '';
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '预测水位') {
                        htmlOne += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
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
                if(htmlOne !== '') {
                    htmlText += htmlOne
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>'
                }
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
                color: '#FFFFFF',
                fontSize:12
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:20,
            symbolKeepAspect: true,
            width: 750,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '警戒线',
                icon: 'image://../images/waterProject/icon/red.png'
            },  {
                name: '左堤高',
                icon: 'image://../images/waterProject/icon/purple.png'
            },  {
                name: '右堤高',
                icon: 'image://../images/waterProject/icon/cyan.png'
            },  {
                name: '历史最高水位',
                icon: 'image://../images/selfIcon/greenDarkLine.png'
            },  {
                name: '实测水位',
                icon: 'image://../images/waterProject/icon/blueLight.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/waterProject/icon/greenLight.png'
            },  {
                name: '天文潮',
                icon: 'image://../images/waterProject/icon/purpleLight.png'
                    }, {
                name: '风暴增水',
                icon: 'image://../images/waterProject/icon/orangeLight.png'
            }]
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
            fillerColor: '#E9E9E9'
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '警戒线',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
            lineStyle: {
                normal: {
                    color: '#EC4040',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#EC4040',
                    borderColor: '#EC4040'
                },
                emphasis: {
                    color: '#EC4040'
                }
            },
            markLine: {
                symbol: '',
                data: data.warnLevel ? [{
                    yAxis: data.warnLevel,
                    name: '警戒线'
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
            name: '左堤高',
            type: 'line',
            data: [[new Date().getTime, data.leftDikeHeight]],
            lineStyle: {
                normal: {
                    color: '#8B69FF',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#8B69FF',
                    borderColor: '#8B69FF'
                },
                emphasis: {
                    color: '#8B69FF'
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
                    color: '#8B69FF'
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
                    color: '#00CCFF',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#00CCFF',
                    borderColor: '#00CCFF'
                },
                emphasis: {
                    color: '#00CCFF'
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
                    color: '#00CCFF'
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
            name: '实测水位',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#58B1FE',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(30,203,94,0.83)'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#58B1FE',
                    borderColor: '#58B1FE'
                },
                emphasis: {
                    color: '#58B1FE'
                }
            }
        },{
            name: '预测水位',
            type: 'line',
            data: seriesOneData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(30,203,94,0.83)'
                }
            },
            symbol: 'none',
            smooth:true,
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
                    color: '#B85DFF',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(255,213,44,0.85)'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#B85DFF'
                }
            }
        }, {
            name: '风暴增水',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(25,171,255,0.87)'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#FFA119'
                }
            }
        }]
    }
    myEchart.setOption(option);
}

//站点水位过程
function stationWaterProduce(id,data) {
    var myEchart = echarts.init(document.getElementById(id));
    var seriesOneData = [];
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
    data.tideLevel.forEach(function(item, index){
        // 天文潮
        seriesThreeData.push([item.time, item.level]);
    });
    data.realLevel.forEach(function(item, index){
        // 实测水位
        seriesTwoData.push([item.time, item.level]);
    });
    data.predictLevel.forEach(function(item, index){
        // 预测水位
        seriesOneData.push([item.time, item.level]);
    });
    data.waterLevel.forEach(function(item, index){
        // 增水
        seriesFourData.push([item.time, item.level]);
    });
    var timeLength=seriesTime.length;
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
            subtext: data.stationName,
            left: 12,
            top: -10,
            subtextStyle: {
                fontSize: 10,
                color: '#FFFFFF'
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
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            position:['10%', '30%'],
            formatter: function(params) {
                var htmlOne = '';
                var htmlTwo = '';
                var htmlThree = '';
                var htmlFour = '';
                var htmlText = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+timeStampTurnTime(item.data[0])+'</p><ul class="levelWater">';
                    if(item.seriesName === '预测水位') {
                        htmlOne += '<li><h4>'+(item && !isNaN(item.data[1]) ? item.data[1].toFixed(2) : '-')+'</h4><p>预测水位(m)</p></li>'
                    }
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
                if(htmlOne !== '') {
                    htmlText += htmlOne
                } else {
                    htmlText += '<li><h4>-</h4><p>预测水位(m)</p></li>'
                }
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
            y2: 60
        },
        legend: {
            show: true,
            left: 0,
            top: 23,
            textStyle: {
                color: '#FFFFFF',
                fontSize:9
            },
            itemWidth: 21,
            itemHeight: 7,
            itemGap:0,
            symbolKeepAspect: true,
            width: 560,
            borderColor: '#fff',
            inactiveColor: '#666666',
            data: [{
                name: '警戒潮位',
                icon: 'image://../images/waterProject/icon/redSmall.png'
            },  {
                name: '左堤高',
                icon: 'image://../images/waterProject/icon/purpleSmall.png'
            },  {
                name: '右堤高',
                icon: 'image://../images/waterProject/icon/cyanSmall.png'
            },  
            // {
            //     name: '历史最高水位',
            //     icon: 'image://../images/selfIcon/greenDarkLine.png'
            // },  
            {
                name: '天文潮',
                icon: 'image://../images/waterProject/icon/purpleLightSmall.png'
            },  {
                name: '预测水位',
                icon: 'image://../images/waterProject/icon/greenLightSmall.png'
            },  {
                name: '风暴增水',
                icon: 'image://../images/waterProject/icon/orangeLightSmall.png'
            },  {
                name: '实测水位',
                icon: 'image://../images/waterProject/icon/blueLightSmall.png'
            }]
        },
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                padding: [10, 0, 0, 0]
            },
            splitLine: {
                show: false
            },
            axisTick:{
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
                    color: 'rgba(145, 145, 145, 1)'
                },
                formatter: function(value, index) {
                    return value.toFixed(1)
                }
            },
            axisTick:{
                show:false
            }
        },
        series: [{
            name: '警戒潮位',
            type: 'line',
            data: [[new Date().getTime, data.warnLevel]],
            lineStyle: {
                normal: {
                    color: '#EC4040',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#EC4040',
                    borderColor: '#EC4040'
                },
                emphasis: {
                    color: '#EC4040'
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
                    color: '#EC4040'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  {
            name: '左堤高',
            type: 'line',
            data: [[new Date().getTime, data.leftDikeHeight]],
            lineStyle: {
                normal: {
                    color: '#2C26E8',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#2C26E8',
                    borderColor: '#2C26E8'
                },
                emphasis: {
                    color: '#2C26E8'
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
                    color: '#2C26E8'
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
                    color: '#00CCFF',
                    width: '2',
                    type:'dashed'
                }
            },
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: '#00CCFF',
                    borderColor: '#00CCFF'
                },
                emphasis: {
                    color: '#00CCFF'
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
                    color: '#00CCFF'
                },
                label: {
                    formatter: '{c}'
                }
            }
        },  
        // {
        //     name: '历史最高水位',
        //     type: 'line',
        //     data: [[new Date().getTime, data.historyHighestLevel]],
        //     lineStyle: {
        //         normal: {
        //             type: 'dashed',
        //             color: '##135A4A',
        //             width: '2'
        //         }
        //     },
        //     symbol: 'none',
        //     itemStyle: {
        //         normal: {
        //             color: '##135A4A',
        //             borderColor: '##135A4A'
        //         },
        //         emphasis: {
        //             color: '#ffffff'
        //         }
        //     },
        //     markLine: {
        //         symbol: '',
        //         data: data.historyHighestLevel ? [{
        //             yAxis: data.historyHighestLevel,
        //             name: '历史最高水位'
        //         }] : [],
        //         lineStyle: {
        //             type: 'dashed',
        //             color: '##135A4A'
        //         },
        //         label: {
        //             formatter: '{c}'
        //         }
        //     }
        // },  
        {
            name: '天文潮',
            type: 'line',
            data: seriesThreeData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#B85DFF',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(255,213,44,0.85)'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#B85DFF',
                    borderColor: '#B85DFF'
                },
                emphasis: {
                    color: '#B85DFF'
                }
            }
        },  {
            name: '预测水位',
            type: 'line',
            data: seriesOneData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#75D8A3',
                    width: '2'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#75D8A3',
                    borderColor: '#75D8A3'
                },
                emphasis: {
                    color: '#75D8A3'
                }
            }
        },  {
            name: '风暴增水',
            type: 'line',
            data: seriesFourData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#FFA119',
                    type: 'dashed',
                    width: '2'
                }
            },
            symbol: 'none',
            smooth:true,
            itemStyle: {
                normal: {
                    color: '#FFA119',
                    borderColor: '#FFA119'
                },
                emphasis: {
                    color: '#FFA119'
                }
            }
        },  {
            name: '实测水位',
            type: 'line',
            data: seriesTwoData,
            connectNulls: false,
            lineStyle: {
                normal: {
                    color: '#58B1FE',
                    width: '2',
                    // shadowBlur:3,
                    // shadowColor:'rgba(30,203,94,0.83)'
                }
            },
            symbol: 'none',
            smooth:true,
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

$(function(){
    // var data = [
    //     {"name":"长来站",value:"50"},
    //     {"name":"长潭站",value:"100"},
    //     {"name":"金鸡站",value:"75"},
    // ];
    // rainCondition('rainBarChart',data);
});
//降水情况
function rainCondition(id,data){
    var dataX = [], dataY = [];
    for(var i=0;i<data.length;i++){
        dataX.push(data[i].name);
        dataY.push(data[i].value);
    }
    var myEchart = echarts.init(document.getElementById(id));
    var option = {
        color:['#62D0FE'],
        title:{
            text:'日降雨量',
            textStyle:{
                color:'#C8C8C8',
                fontSize:12
            },
            top:'20px'
        },
        legend:{
            top:'5px',
            right:'0',
            textStyle:{
                color:'#fff'
            },
            itemWidth:11,
            itemHeight:11,
        },
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
                show: true,
                type: 'line',
                lineStyle: {
                    type: 'solid',
                    width: 1,
                    color: '#62D0FE'
                }
            },
            backgroundColor: 'rgba(3,30,27,0.92)',
            padding: 16,
            formatter: function(params) {
                var htmlTwo = '';
                params.forEach(function(item, index) {
                    htmlText = '<p class="titleWater">'+item.name+'</p><ul class="levelWater">';
                    if(item.seriesName === '日降雨量') {
                        htmlTwo += '<li><h4>'+(item && !isNaN(item.data) ? item.data : '-')+'</h4></li>'
                    }
                });
                if(htmlTwo !== '') {
                    htmlText += htmlTwo
                } else {
                    htmlText += '<li><h4>-</h4></li>'
                }
                htmlText += '</ul>'
                return htmlText
            }
        },
        grid: {
            left: '0',
            right: '10px',
            bottom: '0px',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: dataX,
                axisLine:{
                    lineStyle:{
                        color:'#5D5D5D'
                    }
                },
                axisLabel:{
                    color:'#C8C8C8',
                    fontSize:12
                },
                axisTick:{
                    show:false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:'#5D5D5D'
                    }
                },
                axisLabel:{
                    color:'#C8C8C8',
                    fontSize:12
                },
                axisTick:{
                    show:false
                }
            }
        ],
        series: [
            {
                name: '日降雨量',
                type: 'bar',
                barWidth: '20',
                data: dataY,
                itemStyle:{
                    borderColor:'#44FFF3',
                    barBorderRadius:120
                }
            }
        ]
    };
    myEchart.setOption(option);
}