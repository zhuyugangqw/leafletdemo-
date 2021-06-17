var agency = '1';//预报机构默认为中国
var ensemble = '1';//集合预报类型默认为中国
var forecastTab = 0;
var area = localStorage.getItem('areaId');//用户区域
var userId = localStorage.getItem('id');//用户ID
var menuCalculateType = '0';//主菜单预报机构

//统计检验站点选择
var selectDataStatisticForecast = [];
var stationNumberListStatisticForecast = [], stationNameListStatisticForecast = [];
//统计检验导出
var stationAllListStatisticForecast;
//实测数据曲线图站点选择
var selectDataRealDataForecast = [];
var stationNumberListRealDataForecast = [], stationNameListRealDataForecast = [];
//统计检验预报模型、预报路径选择
var forecastAgencyType = 1, calculateType = 0;
//统计检验图例选中
var selectedLegendStatistic = {
	"警戒潮位": true,
	"天文潮": true,
	"预测水位": true,
	"增水": true,
	"实测水位": true,
};
//选择站点
var selectData = [];
var stationNumberList = [], stationNameList = [];
var startTime, endTime, stationNum;
var aLLStation = [];//遍历出的站点编号列表,对应地图站点交互
var outdateStationList = []//没有更新的站点
function getStation() {
	$('.forecastCorrection-collection').show();
	if (hasTyphoon) {
		$(".forecastCorrection-list").css("height", (height - 560) + 'px');
	} else {
		$('#forecastCorrection-typhoon').empty();
		$(".forecastCorrection-list").css("height", (height - 460) + 'px');
	}
	//获取站点
	$ajax('/web/station/queryStationByCity', { queryIsWarn: false }, function (res) {
		stationNumberList = [], stationNameList = [], selectData = [];
		for (var i = 0; i < res.data.length; i++) {
			var children = [];
			for (var j = 0; j < res.data[i].stationList.length; j++) {
				children.push({
					name: res.data[i].stationList[j].stationName,
					value: res.data[i].stationList[j].stationNumber
				})
			}
			if (localStorage.getItem('cityName') == '广东省') {
				selectData.push({
					name: res.data[i].cityName,
					value: res.data[i].areaId,
					children: children,
					selected: true
				});
				for (var m = 0; m < children.length; m++) {
					stationNumberList.push(children[m].value);
					stationNameList.push(children[m].name);
				}
			} else {
				if (res.data[i].areaId == area) {
					selectData.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
						selected: true
					});
					for (var n = 0; n < children.length; n++) {
						stationNumberList.push(children[n].value);
						stationNameList.push(children[n].name);
					}
				} else {
					selectData.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
					})
				}
			}
		}
		getStationInfo();
		var select = xmSelect.render({
			el: '#station',
			model: {
				label: {
					type: 'block',
					block: {
						//最大显示数量, 0:不限制
						showCount: 1,
						//是否显示删除图标
						showIcon: false,
					}
				}
			},
			cascader: {
				show: true,
				indent: 285,
			},
			height: 'auto',
			theme: {
				color: '#3850D5',
			},
			data() {
				return selectData
			},
			on: function (data) {
				//arr:  当前多选已选中的数据
				var arr = data.arr;
				stationNumberList = [], stationNameList = []
				for (var i = 0; i < arr.length; i++) {
					stationNumberList.push(arr[i].value);
					stationNameList.push(arr[i].name);
				}
				if (stationNumberList.length === 0) {
					$('.stationInfo').hide();
					$('.forecastCorrection-bottom').hide();
					$('#forecastChartListPop').hide();
					$('.forecastCorrectionNormalEchart').hide();
				} else {
					$('.stationInfo').show();
					$('.forecastCorrection-bottom').show();
				}
				//change, 此次选择变化的数据,数组
				var change = data.change;
				//isAdd, 此次操作是新增还是删除
				var isAdd = data.isAdd;
				//可以return一个数组, 代表想选中的数据
				//return []
				if (!isAdd) {
					$(".waterProject-list-item").each(function () {
						for (var i = 0; i < change.length; i++) {
							if ($(this).attr('data-stationNum') == change[i].value) {
								$(this).remove();
								var changeItem = outdateStationList.indexOf(change[i].value)
								if (changeItem != -1) {
									outdateStationList.splice(changeItem, 1)
								}

							}
						}
					});
					if (outdateStationList.length == 0) {
						$('.hasOutdateStationList').hide();
					}
					console.log(outdateStationList)
				} else {
					getStationInfo();
				}
			},
		});
	});
}
// 获取站点信息
function getStationInfo() {
	var url = '';
	var params = null;
	if (stationNumberList.length === 0) {
		return;
	}
	if (forecastTab) {
		url = '/web/station/stationInfo/probability';
		params = {
			'userId': localStorage.getItem('id'),
			'stationNumberList': stationNumberList,
			'probabilityCircleType': ensemble,
			'calculateType': menuCalculateType
		}
	} else {
		url = '/web/station/stationInfo';
		params = {
			'stationNumberList': stationNumberList,
			'agencyType': agency,
			'calculateType': menuCalculateType
		}
	}
	$ajax(url, params, function (res) {
		var resData = res.data;
		$('.forecastCorrectionNormalEchart').hide();
		$('.forecastCorrection-list').animate({
			scrollTop: 0
		}, 500);
		// 选择预报模型
		layui.use(['form'], function () {
			var form = layui.form;
			layui.form.render();
			form.on('select(forecastCorrectionSelectType)', function (data) {
				// 选中日期操作
				if (data.value === '3') {
					customEchart(stationNum, startTime, endTime, forecastTab);
					$('.forecastCorrection-edit-btn').show();
				} else {
					$('.forecastCorrection-edit-btn').hide();
					if (forecastTab) {
						ensembleForecastAjax(stationNum, startTime, endTime, data.value)
					} else {
						if (hasTyphoon) {
							hasTyphoonAjax(stationNum, startTime, endTime, data.value)
						} else {
							noTyphoonAjax(stationNum, startTime, endTime)
						}
					}
				}
			});
		});
		if (resData.outdateStationList.length > 0) {
			$('.hasOutdateStationList').show();
			for (var n = 0; n < resData.outdateStationList.length; n++) {
				var item = resData.outdateStationList[n].stationNumber;
				if (outdateStationList.indexOf(item) == -1) {
					outdateStationList.push(item)
				}
			}
		} else {
			$('.hasOutdateStationList').hide();
		}
		var stationList = resData.stationList.concat(resData.outdateStationList);
		aLLStation = [];
		var stationLen = resData.stationList.length;
		$('.forecastCorrection-list').empty();
		for (var i = 0; i < stationList.length; i++) {
			aLLStation.push(stationList[i].stationNumber);
			var warnLevel = stationList[i].warnLevel ? stationList[i].warnLevel : '-'
			var realLevel = stationList[i].realLevel ? stationList[i].realLevel : '-'
			var compareLastLevel;
			var maxLevelTime = stationList[i].maxLevelTime ? timeStampTurnTime(stationList[i].maxLevelTime) : '-'
			var maxLevel = stationList[i].maxLevel ? stationList[i].maxLevel : '-'
			var isWaring = stationList[i].distanceWarn
			var waringTxt;
			if (stationList[i].realLevel == 0) {
				realLevel = 0
			}
			if (isWaring) {
				if (isWaring > 0) {
					waringTxt = '距警戒' + Math.abs(isWaring).toFixed(2) + 'm'
				} else {
					waringTxt = '超警' + Math.abs(isWaring).toFixed(2) + 'm'
				}
			} else {
				waringTxt = ''
			}
			if (stationList[i].compareLastLevel) {
				if (stationList[i].compareLastLevel > 0) {
					compareLastLevel = '+' + stationList[i].compareLastLevel
				} else {
					compareLastLevel = stationList[i].compareLastLevel
				}
			} else {
				compareLastLevel = '-'
			}
			$('.forecastCorrection-list').append(
				'<div class="waterProject-list-item" data-stationNum=' + stationList[i].stationNumber + '>' +
				'<div class="waterProject-item-box">' +
				'<div class="waterProject-item-left">' +
				'<span class="alertBox">' + waringTxt + '</span>' +
				'</div>' +
				'<div class="waterProject-item-right">' +
				'<img src="images/timeListIcon.png">' +
				'<span class="waterProject-item-time">' + timeStampTurnTime(stationList[i].time) + '</span>' +
				'</div>' +
				'</div>' +
				'<div class="waterProject-item-box">' +
				'<div class="waterProject-item-left waterProject-left-margin">' +
				'<p class="waterProject-item-word">' + stationList[i].stationName + '</p>' +
				'<p class="waterProject-item-txt">' + stationList[i].stationNumber + '</p>' +
				'</div>' +
				'<div class="waterProject-item-right waterProject-right-margin">' +
				'<span class="waterProject-item-txt waterProject-txt-margin">警戒值(m)</span>' +
				'<span class="waterProject-fontColor-normal waterProject-font-normal">' + warnLevel + '</span>' +
				'</div>' +
				'</div>' +
				'<div class="waterProject-item-box waterProject-item-margin">' +
				'<div class="waterProject-item-left">' +
				'<span class="waterProject-item-txt">实测水位(m)</span>' +
				'<span class="waterProject-fontColor-normal waterProject-font-big waterProject-margin-big">' + realLevel + '</span>' +
				'</div>' +
				'<div class="waterProject-item-right waterProject-item-padding">' +
				'<span class="waterProject-item-txt waterProject-txt-margin">对比上次</span>' +
				'<span class="waterProject-font-samll compareLastLevel">' + compareLastLevel + '</span>' +
				'</div>' +
				'</div>' +
				'<div class="waterProject-item-box">' +
				'<div class="waterProject-item-left waterProject-item-margin">' +
				'<span class="waterProject-item-txt waterProject-txt-margin">预计</span>' +
				'<span class="waterProject-fontColor-normal waterProject-font-normal">' + maxLevelTime + '</span>' +
				'<span class="waterProject-item-txt waterProject-txt-margin waterProject-txt-padding">水位达到</span>' +
				'<span class="waterProject-fontColor-normal waterProject-font-normal">' + maxLevel + '</span>' +
				'<span class="waterProject-item-txt waterProject-txt-padding">最高值</span>' +
				'</div>' +
				'</div>' +
				'</div>'
			)
		}
		$('.compareLastLevel').each(function () {
			if (parseFloat($(this).html()) > 0) {
				$(this).addClass('waterProject-fontColor-red');
			} else {
				$(this).addClass('waterProject-fontColor-green');
			}

		})
		$('.alertBox').each(function () {
			if ($(this).html() != '') {
				if ($(this).html().indexOf("距警戒") != -1) {
					$(this).addClass('alertGreen');
				} else {
					$(this).addClass('alertRed');
				}
			}
		})
		$('.waterProject-list-item').unbind('click');
		$('.waterProject-list-item').click(function () {
			//曲线图弹窗显示
			$(".forecastChartCloseOpenIcon").removeClass("forecastChartCloseOpenClick");
			$(".forecastChartList").animate({ 'right': '20px' }, 900);
			$(this).addClass('click').siblings().removeClass('click');
			stationNum = parseFloat($(this).find('.waterProject-item-txt').html())
			var type = parseFloat($('#forecastCorrectionSelectType').val())
			flyToStationByNum(stationNum);//找到地图上的站点
			if (type == 3) {
				customEchart(stationNum, startTime, endTime, forecastTab);
				$('.forecastCorrection-edit-btn').show();
			} else {
				$('.forecastCorrection-edit-btn').hide();
				if (forecastTab) {
					ensembleForecastAjax(stationNum, startTime, endTime, type)
					gatherForecastSimialrityChart(userId, stationNum);//集合预报相似台风增水曲线
				} else {
					if (hasTyphoon) {
						hasTyphoonAjax(stationNum, startTime, endTime, type)
					} else {
						noTyphoonAjax(stationNum, startTime, endTime)
					}
					if (typhoonCurrentNum == "" || typhoonCurrentNum == undefined || typhoonCurrentNum == null) {
						$(".simialrityChart").html("暂无数据").css({ "marginTop": "50px", 'text-align': 'center', 'color': 'rgba(145, 145, 145, 1)' });
					} else {
						for (var i = 0; i < typhoonCurrentNum.length; i++) {
							var typhoonNumber = typhoonCurrentNum[0].number;
							normalForecastSimialrityChart(typhoonNumber, stationNum);//常规预报相似台风增水曲线
						}
					}
				}
			}

		});
		$('.viewOutdateStation').unbind('click');
		$('.viewOutdateStation').click(function () {
			$('.waterProject-list-item').eq(stationLen).click();
			$('.forecastCorrection-list').animate({
				scrollTop: stationLen * ($('.waterProject-list-item').height() + 19)
			}, 500)
		});
		// 地图样式切换
		$ajax('/web/station/map/list', {}, function (res) {
			var mapStationList = res.data;
			updateStation(mapStationList);
		})

	})

}
// 水位过程图与地图交互
function getMapEchart(Num) {
	$("#forecastCorrectionSelectType").val(menuCalculateType);
	layui.form.render();
	stationNum = Num
	if (aLLStation.indexOf(Num) != -1) {
		$('.waterProject-list-item').eq(aLLStation.indexOf(Num)).click();
		$('.forecastCorrection-list').animate({
			scrollTop: $('.waterProject-list-item').eq(aLLStation.indexOf(Num)).offset().top - $('.forecastCorrection-list').height() - 120
		}, 500)
	}
	if (forecastTab) {
		ensembleForecastAjax(Num, startTime, endTime, menuCalculateType)
		gatherForecastSimialrityChart(userId, stationNum);//集合预报相似台风增水曲线
	} else {
		if (hasTyphoon) {
			hasTyphoonAjax(Num, startTime, endTime, menuCalculateType)
		} else {
			noTyphoonAjax(Num, startTime, endTime)
		}
		if (typhoonCurrentNum == "" || typhoonCurrentNum == undefined || typhoonCurrentNum == null) {
			$(".simialrityChart").html("暂无数据").css({ "marginTop": "50px", 'text-align': 'center', 'color': 'rgba(145, 145, 145, 1)' });
		} else {
			for (var i = 0; i < typhoonCurrentNum.length; i++) {
				var typhoonNumber = typhoonCurrentNum[0].number;
				normalForecastSimialrityChart(typhoonNumber, stationNum);//常规预报相似台风增水曲线
			}
		}
	}
}
// 隐藏水位过程图
function hideMapEchart() {
	$('.forecastCorrectionNormalEchart').hide();
}
// 设置水位过程图位置
function setEchartsPosition(left, top) {
	$(".forecastCorrectionNormalEchart").css({
		"left": left,
		"top": top
	});
}
// 清空播放内容
function clearPlayContent() {
	$('#timelineBar').hide();
	$('#typhoonContaner').hide();
	$('.arbitrarilyPoint').hide();
	$('.timeline-tig').css('left', 8 + 'px')
	$('.timeline-bar').css('width', 0 + 'px');
	viewerTy.clockViewModel.shouldAnimate = false
	removeStormForecastKMZ();
}
$(function () {
	// 预报订正tab
	$('.forecastCorrection-tab-item').click(function () {
		var index = $(this).index();
		$(this).addClass('click').siblings().removeClass('click');
		$('.forecastCorrection-collection-item').eq(index).show().siblings().hide();
		forecastTab = index;
		if (hasTyphoon) {
			if (index == 0) {
				$(".forecastCorrection-list").css("height", (height - 560) + 'px');
			}
		} else {
			if (index == 0) {
				$('#forecastCorrection-typhoon').empty();
				$(".forecastCorrection-list").css("height", (height - 460) + 'px');
			}
		}
		if (index == 1) {
			$(".forecastCorrection-list").css("height", (height - 560) + 'px');
		}
		getStationInfo();
		$("#forecastChartListPop").hide();
		clearPlayContent();
		$('.playContent .layui-anim dd').eq(0).click();
		startTime
		endTime
	});
	// 台风预报机构选择
	$('#forecastCorrection-typhoon li').click(function () {
		var index = $(this).index();
		$(this).addClass('click').siblings().removeClass('click');
		agency = (index + 1) + '';
		getStationInfo()

	});
	// 风暴潮集合预报
	$('#forecastCorrection-aggregate li').click(function () {
		var index = $(this).index();
		$(this).addClass('click').siblings().removeClass('click');
		ensemble = (index + 1) + '';
		getStationInfo()
	});

	// 播放内容选择
	layui.use(['form'], function () {
		var form = layui.form;
		form.on('select(playContent)', function (data) {
			var val = data.value
			clearPlayContent();//清空播放内容
            showRiver(true); //动态水纹显示与否
			if (val == '1') {//风暴潮
				if (forecastTab) {
					loadStormForecast(ensemble, 2)
				} else {
					loadStormForecast(agency, 1)
				}
				$(".forecastCorrectionLegendBox").show();
				$(".forecastCorrectionDamLegendBox").hide();
				$(".forecastCorrectionFloodLegendBox").hide();
				$(".forecastCorrectionLegend").show();
				$(".forecastCorrectionDamLegend").hide();
				$(".forecastCorrectionFloodLegend").hide();
				$(".typhoonInfo-legend").hide();
				$(".typhoonInfo-legend-box").find('.layui-icon').addClass('rotate');
				showRiver(false); //动态水纹显示与否
			}
			if (val == '3') {//漫提预报
				showEmbankmentLine(1);
				var parmas = {
					'type': 7
				}
				if (forecastTab) {
					parmas['ensemble'] = ensemble
				} else {
					parmas['agency'] = agency
				}
				if (typhoonCurrentNum != '') {
					// parmas['typhoonNumber'] = typhoonCurrentNum[0].number.toString();
				}
				viewerTy.clockViewModel.shouldAnimate = true
				$ajax('/web/opendap/netcdf/storm/forecast/time', parmas, function (res) {
					var data = res.data;
					var startTime = data.startTime;
					var endTime = data.endTime;
					changeTimeLineText(startTime, endTime);
					viewerTy.timeline.container.style.visibility = 'visible'
					viewerTy.timeline.container.style.display = 'block'
					$('#timelineBar').show();
					$('#typhoonContaner').show();
					viewerTy.clockViewModel.multiplier = 2500
					viewerTy.clockViewModel.shouldAnimate = false;
					stopTime = endTime;
					localStorage.setItem('startTime',startTime)
				})
				$(".forecastCorrectionLegendBox").hide();
				$(".forecastCorrectionDamLegendBox").show();
				$(".forecastCorrectionFloodLegendBox").hide();
				$(".forecastCorrectionLegend").hide();
				$(".forecastCorrectionDamLegend").show();
				$(".forecastCorrectionFloodLegend").hide();
				$(".typhoonInfo-legend").hide();
				$(".typhoonInfo-legend-box").find('.layui-icon').addClass('rotate');
			} else {
				deleteEmbankmentLine()
			}
			if(val == '2'){ //最大增水预报
				$(".forecastCorrectionLegendBox").show();
				$(".forecastCorrectionDamLegendBox").hide();
				$(".forecastCorrectionFloodLegendBox").hide();
				$(".forecastCorrectionLegend").show();
				$(".forecastCorrectionDamLegend").hide();
				$(".forecastCorrectionFloodLegend").hide();
				$(".typhoonInfo-legend").hide();
				$(".typhoonInfo-legend-box").find('.layui-icon').addClass('rotate');
			}
			if (val == '4') {//最高水位
				if (forecastTab) {
					loadHighestWaterLevel(ensemble, 2)
				} else {
					loadHighestWaterLevel(agency, 1)
				}
				$(".forecastCorrectionLegendBox").show();
				$(".forecastCorrectionDamLegendBox").hide();
				$(".forecastCorrectionFloodLegendBox").hide();
				$(".forecastCorrectionLegend").show();
				$(".forecastCorrectionDamLegend").hide();
				$(".forecastCorrectionFloodLegend").hide();
				$(".typhoonInfo-legend").hide();
				$(".typhoonInfo-legend-box").find('.layui-icon').addClass('rotate');
			}
			if(val == '5'){ //防洪水位预警
				showEmbankmentLine(2);
				var parmas = {
					'type': 7
				}
				if (forecastTab) {
					parmas['ensemble'] = ensemble
				} else {
					parmas['agency'] = agency
				}
				if (typhoonCurrentNum != '') {
					// parmas['typhoonNumber'] = typhoonCurrentNum[0].number.toString();
				}
				viewerTy.clockViewModel.shouldAnimate = true
				$ajax('/web/opendap/netcdf/storm/forecast/time', parmas, function (res) {
					var data = res.data;
					var startTime = data.startTime;
					var endTime = data.endTime;
					changeTimeLineText(startTime, endTime);
					viewerTy.timeline.container.style.visibility = 'visible'
					viewerTy.timeline.container.style.display = 'block'
					$('#timelineBar').show();
					$('#typhoonContaner').show();
					viewerTy.clockViewModel.multiplier = 2500
					viewerTy.clockViewModel.shouldAnimate = false;
					stopTime = endTime;
					localStorage.setItem('startTime',startTime)
				})
				$(".forecastCorrectionLegendBox").hide();
				$(".forecastCorrectionDamLegendBox").hide();
				$(".forecastCorrectionFloodLegendBox").show();
				$(".forecastCorrectionLegend").hide();
				$(".forecastCorrectionDamLegend").hide();
				$(".forecastCorrectionFloodLegend").show();
				$(".typhoonInfo-legend").hide();
				$(".typhoonInfo-legend-box").find('.layui-icon').addClass('rotate');

			}
		});
	});
	// 预报模型选择
	layui.use(['form'], function () {
		var form = layui.form;
		form.on('select(stationList)', function (data) {
			menuCalculateType = data.value;
			getStationInfo();
		});
	});

	/************************统计检验模块************************/
	//统计检验弹窗关闭
	$(".statistic-closeBtn").click(function () {
		$(this).parent().parent().hide();
	});
	//统计检验过程曲线和统计列表导航切换
	$(".statistic-title-txt").click(function () {
		var index = $(this).index();
		$(this).addClass("statistic-title-txtClick");
		$(this).siblings(".statistic-title-txt").removeClass("statistic-title-txtClick");
		$(this).parent().siblings(".statistic-test-body").find(".statistic-body-item").eq(index).show();
		$(this).parent().siblings(".statistic-test-body").find(".statistic-body-item").eq(index).siblings().hide();
		if (stationNumberListStatisticForecast == "") {
			$(".statistic-chart-list").html("");
			$(".statistic-table-body").html("");
		} else {
			forecastAgencyType = parseInt($("#forecastRouteList").find("option:selected").val());
			calculateType = parseInt($("#forecastModuleList").find("option:selected").val());
			var startTime = ($("#timeForecast").text()).split(" 至 ")[0];
			var endTime = ($("#timeForecast").text()).split(" 至 ")[1];
			if (index == 0) {
				statisticChartForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
			} else {
				statisticTableForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
			}
		}
		$(".statistic-legend-item").removeClass("statistic-legend-itemClick");
		selectedLegendStatistic = {
			"警戒潮位": true,
			"天文潮": true,
			"预测水位": true,
			"增水": true,
			"实测水位": true,
		};
	});
	//$(".statistic-title-txt").eq(0).trigger("click");
	$('.forecastCorrection-btn').click(function () {
		forecastAgencyType = parseInt($("#forecastRouteList").find("option:selected").val());
		calculateType = parseInt($("#forecastModuleList").find("option:selected").val());
		stationStatistic(forecastAgencyType, calculateType);
		$('#statisticPop').show();
		$(".statistic-legend-item").removeClass("statistic-legend-itemClick");
		selectedLegendStatistic = {
			"警戒潮位": true,
			"天文潮": true,
			"预测水位": true,
			"增水": true,
			"实测水位": true,
		};
		//默认加载
		var startTime = ($("#timeForecast").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecast").text()).split(" 至 ")[1];
		statisticChartForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
		$(".statistic-title-txt").eq(0).trigger("click");
	});
	//站点选择
	$("#statisticStation").bind("click").on("click", function () {
		forecastAgencyType = parseInt($("#forecastRouteList").find("option:selected").val());
		calculateType = parseInt($("#forecastModuleList").find("option:selected").val());
		stationStatistic(forecastAgencyType, calculateType);
	});
	//$("#statisticStation").trigger("click");
	//预报模型、预报路径选择
	layui.use(['form'], function () {
		var form = layui.form;
		var startTime = ($("#timeForecast").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecast").text()).split(" 至 ")[1];
		form.on('select(forecastModuleList)', function (data) {
			calculateType = parseInt(data.value);
			forecastAgencyType = parseInt($("#forecastRouteList").find("option:selected").val());
			if ($(".statistic-title-txtClick").text() == "过程曲线") {
				statisticChartForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
			} else {
				statisticTableForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
			}
			//stationStatistic(forecastAgencyType, calculateType);
		});
		form.on('select(forecastRouteList)', function (data) {
			forecastAgencyType = parseInt(data.value);
			calculateType = parseInt($("#forecastModuleList").find("option:selected").val());
			if ($(".statistic-title-txtClick").text() == "过程曲线") {
				statisticChartForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
			} else {
				statisticTableForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
			}
			//stationStatistic(forecastAgencyType, calculateType);
		});
	});
	//统计检验预测时间
	var now = new Date((new Date()).getTime()).Format("yyyy-MM-dd hh:mm");
	var oneDayPrev = new Date((new Date()).getTime() - 1 * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' 00:00:00';
	var twoAfterDay = new Date((new Date()).getTime() + 2 * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' 23:59:59';
	$("#timeForecast").text(oneDayPrev + ' 至 ' + twoAfterDay);
	//统计检验模块图例选择
	var warnStatus = true, tideStatus = true, predictStatus = true, waterStatus = true, realStatus = true;
	$(".statistic-legend-item").click(function () {
		$(this).toggleClass("statistic-legend-itemClick");
		if ($(this).hasClass("statistic-legend-itemClick")) {
			if ($(this).find(".statistic-legend-txt").text() == "警戒潮位") {
				warnStatus = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "天文潮") {
				tideStatus = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "预测水位") {
				predictStatus = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "增水") {
				waterStatus = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "实测水位") {
				realStatus = false;
			}
		} else {
			if ($(this).find(".statistic-legend-txt").text() == "警戒潮位") {
				warnStatus = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "天文潮") {
				tideStatus = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "预测水位") {
				predictStatus = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "增水") {
				waterStatus = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "实测水位") {
				realStatus = true;
			}
		}
		selectedLegendStatistic = {
			"警戒潮位": warnStatus,
			"天文潮": tideStatus,
			"预测水位": predictStatus,
			"增水": waterStatus,
			"实测水位": realStatus,
		};
		var startTime = ($("#timeForecast").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecast").text()).split(" 至 ")[1];
		forecastAgencyType = parseInt($("#forecastRouteList").find("option:selected").val());
		calculateType = parseInt($("#forecastModuleList").find("option:selected").val());
		statisticChartForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
	});
	//统计检验模块导出
	$(".statistic-export").click(function () {
		if (stationAllListStatisticForecast.length == 0 || stationAllListStatisticForecast == "" || stationAllListStatisticForecast == null || stationAllListStatisticForecast == undefined) {

		} else {
			statisticExport(stationAllListStatisticForecast);
		}
	});

	/**********相似台风增水曲线、实测数据曲线图************/
	//显示隐藏
	$(".forecastChartCloseOpenIcon").click(function () {
		$(this).toggleClass("forecastChartCloseOpenClick");
		if ($(this).hasClass('forecastChartCloseOpenClick')) {
			$(".forecastChartList").animate({ 'right': '-430px' }, 900);
		} else {
			$(".forecastChartList").animate({ 'right': '20px' }, 900);
		}
	});
	//导航切换
	var isFirst = 0;
	$(".forecastChartTxt").click(function () {
		var index = $(this).index();
		$(this).siblings().removeClass("forecastChartTxtClick");
		$(this).addClass("forecastChartTxtClick");
		$(this).parent().siblings(".forecastChartBody").find(".forecastChartBox").eq(index).show();
		$(this).parent().siblings(".forecastChartBody").find(".forecastChartBox").eq(index).siblings().hide();
		if ($(this).text() == "相似台风增水曲线") {
			// if (forecastTab) {
			// 	gatherForecastSimialrityChart(useId, stationNumber); //集合预报相似台风增水曲线
			// }else{
			// 	normalForecastSimialrityChart(typhoonNumber, stationNumber); //常规预报相似台风增水曲线
			// }
		} else if ($(this).text() == "实测数据曲线图") {
			if (isFirst == 1) {
				realDataChartStation();
			} else {

			}
			//realDataChartStation();
			//realDataForecastChart(stationNumberListRealDataForecast);
		}
		isFirst = isFirst + 1;
	});
	$(".forecastChartTxt").eq(0).trigger("click");
	//实测数据曲线图站点选择
	$("#forecastChartStation").unbind("click").on("click", function () {
		realDataChartStation();
	});
	//$("#forecastChartStation").trigger("click");

	/*预报订正过程图*/
	// 日期范围
	layui.use('laydate', function () {
		var nextTime = moment(Date.now() + (24 * 60 * 60 * 1000 * 2)).format('YYYY-MM-DD');//默认后两天
		var yesterday = moment(Date.now() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD');//昨天
		startTime = yesterday + ' 00:00:00';
		endTime = nextTime + ' 23:59:59';
		var laydate = layui.laydate;
		var forecastCorrectionDate = laydate.render({
			elem: '#forecastCorrectionDate',
			range: true,
			theme: '#3850D5',
			btns: ['confirm'],
			max: nextTime,
			value: yesterday + '\xa0' + '-' + '\xa0' + nextTime,
			change: function (value, date, endDate) {
				var d = value.split(' - ');
				var s = new Date(d[0]);
				var e = new Date(d[1]);
				//计算两个时间间隔天数
				var d = (e - s) / (1000 * 60 * 60 * 24);
				if (d > 6) {
					forecastCorrectionDate.hint('最多选择7天')
					$('.laydate-btns-confirm').addClass('btnDisabled')
				} else {
					$('.laydate-btns-confirm').removeClass('btnDisabled')
				}
			},
			done: function (value, date, endDate) {
				var type = parseFloat($('#forecastCorrectionSelectType').val())
				var date = value.split(' - ');
				startTime = date[0] + ' 00:00:00';
				endTime = date[1] + ' 23:59:59';
				if (type == 3) {
					customEchart(stationNum, startTime, endTime, forecastTab);
					$('.forecastCorrection-edit-btn').show();
				} else {
					$('.forecastCorrection-edit-btn').hide();
					if (forecastTab) {
						ensembleForecastAjax(stationNum, startTime, endTime, type)
					} else {
						if (hasTyphoon) {
							hasTyphoonAjax(stationNum, startTime, endTime, type)
						} else {
							noTyphoonAjax(stationNum, startTime, endTime)
						}
					}
				}
			}
		});
	});

	// 关闭弹窗
	$('.arbitrarilyPoint .forecastCorrection-echarts-close').click(function () {
		$('.arbitrarilyPoint').hide();
	});
	$('.forecastCorrectionNormalEchart .forecastCorrection-echarts-close').click(function () {
		$('.forecastCorrectionNormalEchart').hide();
		$('.forecastCorrection-edit-btn').hide();
	});
	$('.forecastCorrection-line-close').click(function () {
		$('.forecastCorrection-line-checkbox').hide();
	});
	$('.forecastCorrection-editData-close').click(function () {
		$('.forecastCorrection-editData-box-mask').hide();
	});

});

//预报订正漫堤风险预警过程图显示、隐藏、位置
function produceDamForecastChartShow(cityId, dikeId, left, top, lon, lat) {
	var agency = 1;
	if($(".forecastCorrection-tab-item.click").text() == "常规预报"){
		if($(".normal-tab").find("li.click").text() == "中国"){
			agency = 1;
		}else if($(".normal-tab").find("li.click").text() == "美国"){
			agency = 2;
		}else if($(".normal-tab").find("li.click").text() == "日本"){
			agency = 4;
		}else if($(".normal-tab").find("li.click").text() == "中国台湾"){
			agency = 3;
		}
	}else{
		agency = 1;
	}
    var params = {
        "agency": parseInt(agency),
        "cityId":parseInt(cityId),
		"dikeId":parseInt(dikeId),
		"warnType":parseInt(1)
	}
    $ajax('/web/opendap/netcdf/dike/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastProduceDamForecastSelf").show();
        $("#forecastProduceDamForecastSelf").css({
            "left": left,
            "top": top
        });
		$("#produceDamForecastChartLonAndLat").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.dikeName == "" || data.dikeName == null || data.dikeName == undefined){
			$(".produceDamForecastName").html("");
		}else{
			$(".produceDamForecastName").html(data.dikeName);
		}
        if(data.defenseStandards == "" || data.defenseStandards == null || data.defenseStandards == undefined){
			$(".produceDamForecastStandar").html("");
		}else{
			$(".produceDamForecastStandar").html(data.defenseStandards);
		}
        if(data.length == 0){
            $("#produceDamForecastChart").html("");
        }else{
            produceDamForecastChart("produceDamForecastChart",data);
        }
    });
}
function produceDamForecastChartHide() {
    $("#forecastProduceDamForecastSelf").hide();
}
function produceDamForecastChartPosition(left, top) {
    $("#forecastProduceDamForecastSelf").css({
        "left": left,
        "top": top
    });
}
//预报订正防洪水位预警过程图显示、隐藏、位置
function produceFloodForecastChartShow(cityId, dikeId, left, top, lon, lat) {
	var agency = 1;
	if($(".forecastCorrection-tab-item.click").text() == "常规预报"){
		if($(".normal-tab").find("li.click").text() == "中国"){
			agency = 1;
		}else if($(".normal-tab").find("li.click").text() == "美国"){
			agency = 2;
		}else if($(".normal-tab").find("li.click").text() == "日本"){
			agency = 4;
		}else if($(".normal-tab").find("li.click").text() == "中国台湾"){
			agency = 3;
		}
	}else{
		agency = 1;
	}
    var params = {
        "agency": parseInt(agency),
        "cityId":parseInt(cityId),
        "dikeId":parseInt(dikeId),
		"warnType":parseInt(2)
	}
    $ajax('/web/opendap/netcdf/dike/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastProduceFloodForecastSelf").show();
        $("#forecastProduceFloodForecastSelf").css({
            "left": left,
            "top": top
        });
		$("#produceFloodForecastChartLonAndLat").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.dikeName == "" || data.dikeName == null || data.dikeName == undefined){
			$(".produceFloodForecastName").html("");
		}else{
			$(".produceFloodForecastName").html(data.dikeName);
		}
        if(data.defenseStandards == "" || data.defenseStandards == null || data.defenseStandards == undefined){
			$(".produceFloodForecastStandar").html("");
		}else{
			$(".produceFloodForecastStandar").html(data.defenseStandards);
		}
        if(data.length == 0){
            $("#produceFloodForecastChart").html("");
        }else{
            produceFloodForecastChart("produceFloodForecastChart",data);
        }
    });
}
function produceFloodForecastChartHide() {
    $("#forecastProduceFloodForecastSelf").hide();
}
function produceFloodForecastChartPosition(left, top) {
    $("#forecastProduceFloodForecastSelf").css({
        "left": left,
        "top": top
    });
}

//常规预报相似台风增水曲线图
function normalForecastSimialrityChart(typhoonNumber, stationNumber) {
	if (typhoonNumber == "" || typhoonNumber == undefined || typhoonNumber == null) {
		$("#forecastChartListPop").show();
		//$(".forecastChartTxt").eq(1).trigger("click");
		$(".simialrityChart").html("暂无数据").css({ "marginTop": "50px", 'text-align': 'center', 'color': 'rgba(145, 145, 145, 1)' });
	} else {
		var params = {
			"typhoonNumber": typhoonNumber,
			"stationNumber": stationNumber
		}
		$ajax('/web/station/similarTyphoon/waterLevel', params, function (res) {
			$("#forecastChartListPop").show();
			//$(".forecastChartTxt").eq(1).trigger("click");
			var data = res.data.levelList;
			var warnLevel = res.data.warnLevel;
			$(".simialrityChart").html("");
			if (data.length == 0) {
				$(".simialrityChart").html("");
			} else {
				for (var i = 0; i < data.length; i++) {
					var chartListBox = document.createElement('div');
					chartListBox.setAttribute('id', 'simialrityChartItem' + i);
					chartListBox.setAttribute('class', 'simialrityChartItem');
					chartListBox.setAttribute('style', 'width: 350px;height: 200px;');
					$(".simialrityChart").append(chartListBox);
					simialrityForecastChart('simialrityChartItem' + i, data[i], warnLevel);
				}
			}
		});
	}
}
//normalForecastSimialrityChart(202002, 81204050);

//集合预报相似台风增水曲线图
function gatherForecastSimialrityChart(userId, stationNumber) {
	if (userId == "" || userId == undefined || userId == null) {
		$("#forecastChartListPop").show();
		//$(".forecastChartTxt").eq(1).trigger("click");
		$(".simialrityChart").html("暂无数据").css({ "marginLeft": "20px", "marginTop": "50px" });
	} else {
		var params = {
			"userId": userId,
			"stationNumber": stationNumber
		}
		$ajax('/web/station/similarTyphoon/waterLevel/probability', params, function (res) {
			$("#forecastChartListPop").show();
			//$(".forecastChartTxt").eq(1).trigger("click");
			var data = res.data.levelInfo;
			var warnLevel = res.data.warnLevel;
			$(".simialrityChart").html("");
			if (data == "" || data == undefined || data == null) {
				$(".simialrityChart").html("");
			} else {
				var chartListBox = document.createElement('div');
				chartListBox.setAttribute('id', 'simialrityChartItem01');
				chartListBox.setAttribute('class', 'simialrityChartItem');
				chartListBox.setAttribute('style', 'width: 350px;height: 200px;');
				$(".simialrityChart").append(chartListBox);
				simialrityForecastChart('simialrityChartItem01', data, warnLevel);
			}
		});
	}
}
//gatherForecastSimialrityChart("test", 81204050);

//实测数据曲线图
function realDataForecastChart(stationNumberList) {
	var params = {
		"stationNumberList": stationNumberList
	}
	$ajax('/web/station/realLevelCurve', params, function (res) {
		$("#forecastChartListPop").show();
		//$(".forecastChartTxt").eq(1).trigger("click");
		var data = res.data.levelList;
		$(".realDataChartList").html("");
		if (data.length == 0) {
			$(".realDataChartList").html("");
		} else {
			for (var i = 0; i < data.length; i++) {
				var chartListBox = document.createElement('div');
				chartListBox.setAttribute('data-id', stationNumberList[i]);
				chartListBox.setAttribute('id', 'realDataChartItem' + i);
				chartListBox.setAttribute('class', 'realDataChartItem');
				chartListBox.setAttribute('style', 'width: 350px;height: 200px;');
				$(".realDataChartList").append(chartListBox);
				realDataForecastChartList('realDataChartItem' + i, data[i]);
			}
		}
	});
}
//realDataForecastChart([81204350,81301200]);

//实测数据曲线图站点选择
function realDataChartStation() {
	$ajax('/web/station/queryStationByCity', {}, function (res) {
		stationNumberListRealDataForecast = [], stationNameListRealDataForecast = [], selectDataRealDataForecast = [];
		for (var i = 0; i < res.data.length; i++) {
			var children = [];
			for (var j = 0; j < res.data[i].stationList.length; j++) {
				children.push({
					name: res.data[i].stationList[j].stationName,
					isWarn: res.data[i].stationList[j].isWarn,
					value: res.data[i].stationList[j].stationNumber
				})
			}
			if (localStorage.getItem('cityName') == '广东省') {
				selectDataRealDataForecast.push({
					name: res.data[i].cityName,
					value: res.data[i].areaId,
					children: children,
					selected: true
				});
				for (var m = 0; m < children.length; m++) {
					stationNumberListRealDataForecast.push(children[m].value);
					stationNameListRealDataForecast.push(children[m].name);
				}
			} else {
				if (res.data[i].areaId == area) {
					selectDataRealDataForecast.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
						selected: true
					});
					for (var n = 0; n < children.length; n++) {
						stationNumberListRealDataForecast.push(children[n].value);
						stationNameListRealDataForecast.push(children[n].name);
					}
				} else {
					selectDataRealDataForecast.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
					})
				}
			}
		}
		realDataForecastChart(stationNumberListRealDataForecast);
		var forecastChartStation = xmSelect.render({
			el: '#forecastChartStation',
			model: {
				label: {
					type: 'block',
					block: {
						//最大显示数量, 0:不限制
						showCount: 1,
						//是否显示删除图标
						showIcon: false
					}
				}
			},
			cascader: {
				show: true,
				indent: 180,
			},
			height: 'auto',
			theme: {
				color: '#3850D5',
			},
			data() {
				return selectDataRealDataForecast
			},
			on: function (data) {
				//arr:  当前多选已选中的数据
				var arr = data.arr;
				stationNumberListRealDataForecast = [], stationNameListRealDataForecast = []
				for (var i = 0; i < arr.length; i++) {
					stationNumberListRealDataForecast.push(arr[i].value);
					stationNameListRealDataForecast.push(arr[i].name);
				}
				//console.log(stationNumberListRealDataForecast,stationNameListRealDataForecast);
				//change, 此次选择变化的数据,数组
				var change = data.change;
				//isAdd, 此次操作是新增还是删除
				var isAdd = data.isAdd;
				//可以return一个数组, 代表想选中的数据
				//return []
				if (!isAdd) {
					$(".realDataChartItem").each(function () {
						for (var i = 0; i < change.length; i++) {
							if ($(this).attr('data-id') == change[i].value) {
								$(this).remove();
							}
						}
					});
				} else {
					realDataForecastChart(stationNumberListRealDataForecast);
				}
			},
		});
	});
}

//统计检验模块站点选择
function stationStatistic(forecastAgencyType, calculateType) {
	var params = {
		"queryIsWarn": true,
		"forecastAgencyType": forecastAgencyType,
		"calculateType": calculateType
	};
	$ajax('/web/station/queryStationByCity', params, function (res) {
		stationNumberListStatisticForecast = [], stationNameListStatisticForecast = [], selectDataStatisticForecast = [];
		for (var i = 0; i < res.data.length; i++) {
			var children = [];
			for (var j = 0; j < res.data[i].stationList.length; j++) {
				children.push({
					name: res.data[i].stationList[j].stationName,
					isWarn: res.data[i].stationList[j].isWarn,
					value: res.data[i].stationList[j].stationNumber
				})
			}
			if (localStorage.getItem('cityName') == '广东省') {
				selectDataStatisticForecast.push({
					name: res.data[i].cityName,
					value: res.data[i].areaId,
					children: children,
					selected: true
				});
				for (var m = 0; m < children.length; m++) {
					stationNumberListStatisticForecast.push(children[m].value);
					stationNameListStatisticForecast.push(children[m].name);
				}
			} else {
				if (res.data[i].areaId == area) {
					selectDataStatisticForecast.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
						selected: true
					});
					for (var n = 0; n < children.length; n++) {
						stationNumberListStatisticForecast.push(children[n].value);
						stationNameListStatisticForecast.push(children[n].name);
					}
				} else {
					selectDataStatisticForecast.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
					});
				}
			}
		}
		var startTime = ($("#timeForecast").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecast").text()).split(" 至 ")[1];
		forecastAgencyType = parseInt($("#forecastRouteList").find("option:selected").val());
		calculateType = parseInt($("#forecastModuleList").find("option:selected").val());
		if ($(".statistic-title-txtClick").text() == "过程曲线") {
			statisticChartForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
		} else {
			statisticTableForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
		}
		var stationStatistic = xmSelect.render({
			el: '#statisticStation',
			template({ item, sels, name, value }) {
				var span = item.isWarn ? '<span class="alertIconStatistic"></span>' : ''
				return item.name + '<span style="position: absolute; right: 10px; color: #8799a3">' + span + '</span>';

			},
			model: {
				label: {
					type: 'block',
					block: {
						//最大显示数量, 0:不限制
						showCount: 1,
						//是否显示删除图标
						showIcon: false
					}
				}
			},
			cascader: {
				show: true,
				indent: 285,
			},
			height: 'auto',
			theme: {
				color: '#3850D5',
			},
			data() {
				return selectDataStatisticForecast
			},
			on: function (data) {
				//arr:  当前多选已选中的数据
				var arr = data.arr;
				stationNumberListStatisticForecast = [], stationNameListStatisticForecast = []
				for (var i = 0; i < arr.length; i++) {
					stationNumberListStatisticForecast.push(arr[i].value);
					stationNameListStatisticForecast.push(arr[i].name);
				}
				//console.log(stationNumberListStatisticForecast,stationNameListStatisticForecast);
				//change, 此次选择变化的数据,数组
				var change = data.change;
				//isAdd, 此次操作是新增还是删除
				var isAdd = data.isAdd;
				//可以return一个数组, 代表想选中的数据
				//return []
				var startTime = ($("#timeForecast").text()).split(" 至 ")[0];
				var endTime = ($("#timeForecast").text()).split(" 至 ")[1];
				forecastAgencyType = parseInt($("#forecastRouteList").find("option:selected").val());
				calculateType = parseInt($("#forecastModuleList").find("option:selected").val());
				if (!isAdd) {
					$(".statisticChartForecastStatistic").each(function () {
						for (var i = 0; i < change.length; i++) {
							if ($(this).attr('data-id') == change[i].value) {
								$(this).remove();
							}
						}
					});
					$(".statistic-table-list").each(function () {
						for (var i = 0; i < change.length; i++) {
							if ($(this).find('.statistic-table-name').text() == change[i].name) {
								$(this).remove();
							}
						}
					});
				} else {
					if ($(".statistic-title-txtClick").text() == "过程曲线") {
						statisticChartForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
					} else {

					}
				}
				if ($(".statistic-title-txtClick").text() == "统计列表") {
					statisticTableForecast(stationNumberListStatisticForecast, forecastAgencyType, calculateType, startTime, endTime);
				}
			},
		});
	});
}

//统计检验过程曲线
function statisticChartForecast(stationNumberList, forecastAgencyType, calculateType, startTime, endTime) {
	if (stationNumberList.length == 0) {
		$(".statistic-chart-list").html("");
	} else {
		var params = {
			'stationNumberList': stationNumberList,
			'forecastAgencyType': forecastAgencyType,
			'calculateType': calculateType,
			'startTime': startTime,
			"endTime": endTime
		}
		$ajax('/web/station/verify/process', params, function (res) {
			var data = res.data.stationList;
			if (data.length == 0) {
				$(".statistic-chart-list").html("");
			} else {
				$(".statistic-chart-list").html("");
				for (var i = 0; i < data.length; i++) {
					var chartListBox = document.createElement('div');
					chartListBox.setAttribute('data-id', stationNumberList[i]);
					chartListBox.setAttribute('class', 'statisticChartForecastStatistic');
					chartListBox.setAttribute('id', 'statisticChartForecast' + i);
					chartListBox.setAttribute('style', 'width: 820px;height: 200px;');
					$(".statistic-chart-list").append(chartListBox);
					statisticChart('statisticChartForecast' + i, data[i], selectedLegendStatistic);
				}
			}
		});

	}
}

//统计检验统计列表
function statisticTableForecast(stationNumberList, forecastAgencyType, calculateType, startTime, endTime) {
	if (stationNumberList.length == 0) {
		$(".statistic-table-body").html("");
	} else {
		var params = {
			'stationNumberList': stationNumberList,
			'forecastAgencyType': forecastAgencyType,
			"calculateType": calculateType,
			'startTime': startTime,
			"endTime": endTime
		}
		$ajax('/web/station/verify/list', params, function (res) {
			var stationList = res.data.stationList;
			stationAllListStatisticForecast = JSON.parse(JSON.stringify(stationList));
			var data = res.data;
			$("#statisticNum").text(data.warnStationCount + '个');
			if (data.warnStationCount == 0) {
				$("#statisticTimeRange").text('');
			} else {
				$("#statisticTimeRange").text(data.effectStartTime + '-' + data.effectEndTime);
			}
			var dataTable = JSON.parse(JSON.stringify(stationList));
			if (dataTable.length == 0) {
				$(".statistic-table-body").html("");
			} else {
				var tableHtml = '';
				var trHtml = '';
				for (var i = 0; i < dataTable.length; i++) {
					var tableLength = dataTable[i].levelInfo;
					if (dataTable[i].warnLevel == null || dataTable[i].warnLevel == undefined || dataTable[i].warnLevel == "") {
						dataTable[i].warnLevel = '-';
					} else {
						dataTable[i].warnLevel = dataTable[i].warnLevel;
					}
					if (tableLength.length == 0) {
						tableHtml = tableHtml + `<div class="statistic-table-list">
							<div class="statistic-table-name">`+ dataTable[i].stationName + `</div>
							<div class="statistic-table-listItem">
								<div class="statistic-table-item">
									<span>-</span>
									<span>-</span>
									<span>-</span>
									<span>` + dataTable[i].warnLevel + `</span>
									<span>-</span>
									<span>-</span>
								</div>
							</div>
						</div>`;
					} else {
						trHtml = '';
						for (var j = 0; j < tableLength.length; j++) {
							if (tableLength[j].date == "" || tableLength[j].date == undefined || tableLength[j].date == null) {
								tableLength[j].date = '-';
							} else {
								tableLength[j].date = tableLength[j].date;
							}
							if (tableLength[j].time == "" || tableLength[j].time == undefined || tableLength[j].time == null) {
								tableLength[j].time = '-';
							} else {
								tableLength[j].time = tableLength[j].time;
							}
							if (tableLength[j].maxPredictLevel == "" || tableLength[j].maxPredictLevel == undefined || tableLength[j].maxPredictLevel == null) {
								tableLength[j].maxPredictLevel = '-';
							} else {
								tableLength[j].maxPredictLevel = tableLength[j].maxPredictLevel;
							}
							if (tableLength[j].distanceWarn == "" || tableLength[j].distanceWarn == undefined || tableLength[j].distanceWarn == null) {
								tableLength[j].distanceWarn = '-';
							} else {
								tableLength[j].distanceWarn = tableLength[j].distanceWarn;
							}
							if (tableLength[j].maxWaterLevel == "" || tableLength[j].maxWaterLevel == undefined || tableLength[j].maxWaterLevel == null) {
								tableLength[j].maxWaterLevel = '-';
							} else {
								tableLength[j].maxWaterLevel = tableLength[j].maxWaterLevel;
							}
							trHtml = trHtml + `<div class="statistic-table-item">
								<span>`+ tableLength[j].date + `</span>
								<span>`+ tableLength[j].time + `</span>
								<span>`+ tableLength[j].maxPredictLevel + `</span>
								<span>`+ dataTable[i].warnLevel + `</span>
								<span>`+ tableLength[j].distanceWarn + `</span>
								<span>`+ tableLength[j].maxWaterLevel + `</span>
							</div>`;
						}
						tableHtml = tableHtml + `<div class="statistic-table-list">
							<div class="statistic-table-name">`+ dataTable[i].stationName + `</div>
							<div class="statistic-table-listItem">`+ trHtml + `</div>
						</div>`;
					}
				}
				$(".statistic-table-body").html(tableHtml);
			}
		});
	}
}

//统计检验导出
function statisticExport(stationList) {
	var token = localStorage.getItem('token');
	var url = hqxurl + "/web/station/verify/list/export";
	var xhr = new XMLHttpRequest();
	xhr.open('post', url, true);
	xhr.responseType = "blob";
	xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
	xhr.setRequestHeader("token", token);
	xhr.onload = function () {
		if (this.status === 200) {
			var blob = this.response;
			var a = document.createElement('a');
			a.download = '统计列表.xls';
			a.href = window.URL.createObjectURL(blob);
			$("body").append(a);
			a.click();
			$(a).remove();
		}
	};
	xhr.send(JSON.stringify({
		"stationList": stationList
	}));
}
