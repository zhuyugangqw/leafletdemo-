//相似台风模块超警信息统计图
function waterProjectWarningAll(id, data) {
    var provinceNotWarn = (data.provinceNotWarn).slice(0,(data.provinceNotWarn).length-1);
    var provinceWarn = (data.provinceWarn).slice(0,(data.provinceWarn).length-1);
    var provinceNoData = (data.provinceNoData).slice(0,(data.provinceNoData).length-1);
    var myEchart = echarts.init(document.getElementById(id));
    var option = {
        legend:{
            left:16,
            top:140,
            itemGap:6,
            itemWidth:10,
            itemHeight:10,
            icon:'circle',
            textStyle:{
                color:'#fff',
                fontSize:10
            },
            width:220
        },
        series: [
            {
                type: 'pie',
                radius: '60%',
                center: ['50%', '40%'],
                labelLine:{
                    length:10
                },
                data:[
                    {
                        name:'未超警站点',
                        value:provinceNotWarn,
                        itemStyle:{
                            color:'#20ADEB'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#20ADEB'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'超警站点',
                        value:provinceWarn,
                        itemStyle:{
                            color:'#3FFCFC'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#3FFCFC'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'无数据站点',
                        value:provinceNoData,
                        itemStyle:{
                            color:'#FCDA00'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#FCDA00'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    }
                ],
                //roseType: 'radius',
                label: {
                    color: '#FDBD24',
                    fontSize:12
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    myEchart.setOption(option);
}
function waterProjectWarningCity(id, data) {
    var cityNotWarn = (data.cityNotWarn).slice(0,(data.cityNotWarn).length-1);
    var cityWarn = (data.cityWarn).slice(0,(data.cityWarn).length-1);
    var cityNoData = (data.cityNoData).slice(0,(data.cityNoData).length-1);
    var myEchart = echarts.init(document.getElementById(id));
    var option = {
        // legend:{
        //     left:16,
        //     top:140,
        //     itemGap:6,
        //     itemWidth:10,
        //     itemHeight:10,
        //     icon:'circle',
        //     textStyle:{
        //         color:'#fff',
        //         fontSize:10
        //     },
        //     width:220
        // },
        series: [
            {
                type: 'pie',
                radius: ['60%', '40%'],
                center: ['50%', '40%'],
                labelLine:{
                    length:10
                },
                data: [
                    {
                        value: cityNotWarn,
                        name: '未超警站点',
                        itemStyle:{
                            color:'#31BBF4'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#31BBF4'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        },
                        label:{
                            color:'#FDBD24',
                            fontSize:9,
                            formatter:data.city +"市 "+"{d}%"
                        }
                    },
                    {
                        value: cityWarn,
                        name: '超警站点',
                        itemStyle:{
                            color:'#3FFCFC'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#3FFCFC'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        },
                        label:{
                            color:'#FDBD24',
                            fontSize:9,
                            formatter:data.city +'市 '+'{d}%'
                        }
                    },
                    {
                        value: cityNoData,
                        name: '无数据站点',
                        itemStyle:{
                            color:'#FDBD24'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#FDBD24'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        },
                        label:{
                            color:'#FDBD24',
                            fontSize:9,
                            formatter:data.city +'市 '+'{d}%'
                        }
                    }
                ]
            }
        ]
    };
    myEchart.setOption(option);
}
function waterProjectWarningCityAll(id, data) {
    var provinceNotWarn = (data.provinceNotWarn).slice(0,(data.provinceNotWarn).length-1);
    var provinceWarn = (data.provinceWarn).slice(0,(data.provinceWarn).length-1);
    var provinceNoData = (data.provinceNoData).slice(0,(data.provinceNoData).length-1);
    var myEchart = echarts.init(document.getElementById(id));
    var option = {
        // legend:{
        //     left:16,
        //     top:140,
        //     itemGap:6,
        //     itemWidth:10,
        //     itemHeight:10,
        //     icon:'circle',
        //     textStyle:{
        //         color:'#fff',
        //         fontSize:10
        //     },
        //     width:220
        // },
        series: [
            {
                type: 'pie',
                radius: '60%',
                center: ['50%', '40%'],
                labelLine:{
                    length:10
                },
                data:[
                    {
                        name:'未超警站点',
                        value:provinceNotWarn,
                        itemStyle:{
                            color:'#20ADEB'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#20ADEB'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'超警站点',
                        value:provinceWarn,
                        itemStyle:{
                            color:'#3FFCFC'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#3FFCFC'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'无数据站点',
                        value:provinceNoData,
                        itemStyle:{
                            color:'#FCDA00'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#FCDA00'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    }
                ],
                //roseType: 'radius',
                label: {
                    color: '#FDBD24',
                    fontSize:12
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    myEchart.setOption(option);
}
//过程统计超警信息统计图
function waterStationWarningAll(id, data) {
    var provinceNotWarn = (data.provinceNotWarn).slice(0,(data.provinceNotWarn).length-1);
    var provinceWarn = (data.provinceWarn).slice(0,(data.provinceWarn).length-1);
    var provinceNoData = (data.provinceNoData).slice(0,(data.provinceNoData).length-1);
    var myEchart = echarts.init(document.getElementById(id));
    var option = {
        legend:{
            left:16,
            top:200,
            itemGap:6,
            itemWidth:10,
            itemHeight:10,
            icon:'circle',
            textStyle:{
                color:'#fff',
                fontSize:10
            },
            width:220
        },
        series: [
            {
                type: 'pie',
                radius: '50%',
                center: ['50%', '40%'],
                labelLine:{
                    length:15
                },
                data:[
                    {
                        name:'未超警站点',
                        value:provinceNotWarn,
                        itemStyle:{
                            color:'#20ADEB'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#20ADEB'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'超警站点',
                        value:provinceWarn,
                        itemStyle:{
                            color:'#3FFCFC'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#3FFCFC'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'无数据站点',
                        value:provinceNoData,
                        itemStyle:{
                            color:'#FCDA00'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#FCDA00'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    }
                ],
                //roseType: 'radius',
                label: {
                    color: '#FDBD24',
                    fontSize:12
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    myEchart.setOption(option);
}
function waterStationWarningCity(id, data) {
    var cityNotWarn = (data.cityNotWarn).slice(0,(data.cityNotWarn).length-1);
    var cityWarn = (data.cityWarn).slice(0,(data.cityWarn).length-1);
    var cityNoData = (data.cityNoData).slice(0,(data.cityNoData).length-1);
    var myEchart = echarts.init(document.getElementById(id));
    var option = {
        // legend:{
        //     left:16,
        //     top:200,
        //     itemGap:6,
        //     itemWidth:10,
        //     itemHeight:10,
        //     icon:'circle',
        //     textStyle:{
        //         color:'#fff',
        //         fontSize:10
        //     },
        //     width:220
        // },
        series: [
            {
                type: 'pie',
                radius: ['50%', '30%'],
                center: ['50%', '55%'],
                labelLine:{
                    length:15
                },
                data: [
                    {
                        value: cityNotWarn,
                        name: '未超警站点',
                        itemStyle:{
                            color:'#31BBF4'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#31BBF4'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        },
                        label:{
                            color:'#FDBD24',
                            fontSize:9,
                            formatter:data.city +"市 "+"{d}%"
                        }
                    },
                    {
                        value: cityWarn,
                        name: '超警站点',
                        itemStyle:{
                            color:'#3FFCFC'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#3FFCFC'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        },
                        label:{
                            color:'#FDBD24',
                            fontSize:9,
                            formatter:data.city +'市 '+'{d}%'
                        }
                    },
                    {
                        value: cityNoData,
                        name: '无数据站点',
                        itemStyle:{
                            color:'#FDBD24'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#FDBD24'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        },
                        label:{
                            color:'#FDBD24',
                            fontSize:9,
                            formatter:data.city +'市 '+'{d}%'
                        }
                    }
                ]
            }
        ]
    };
    myEchart.setOption(option);
}
function waterStationWarningCityAll(id, data) {
    var provinceNotWarn = (data.provinceNotWarn).slice(0,(data.provinceNotWarn).length-1);
    var provinceWarn = (data.provinceWarn).slice(0,(data.provinceWarn).length-1);
    var provinceNoData = (data.provinceNoData).slice(0,(data.provinceNoData).length-1);
    var myEchart = echarts.init(document.getElementById(id));
    var option = {
        // legend:{
        //     left:16,
        //     top:200,
        //     itemGap:6,
        //     itemWidth:10,
        //     itemHeight:10,
        //     icon:'circle',
        //     textStyle:{
        //         color:'#fff',
        //         fontSize:10
        //     },
        //     width:220
        // },
        series: [
            {
                type: 'pie',
                radius: '50%',
                center: ['50%', '40%'],
                labelLine:{
                    length:15
                },
                data:[
                    {
                        name:'未超警站点',
                        value:provinceNotWarn,
                        itemStyle:{
                            color:'#20ADEB'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#20ADEB'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'超警站点',
                        value:provinceWarn,
                        itemStyle:{
                            color:'#3FFCFC'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#3FFCFC'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    },
                    {
                        name:'无数据站点',
                        value:provinceNoData,
                        itemStyle:{
                            color:'#FCDA00'
                        },
                        label:{
                            formatter:'{d}%'
                        },
                        markLine:{
                            lineStyle:{
                                color:'#FCDA00'
                            },
                            symbolSize:5,
                            symbol:'circle'
                        }
                    }
                ],
                //roseType: 'radius',
                label: {
                    color: '#FDBD24',
                    fontSize:12
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };
    myEchart.setOption(option);
}