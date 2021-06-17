//统计检验站点选择
var selectDataStatisticStorm = [];
var stationNumberListStatisticStorm = [], stationNameListStatisticStorm = [];
//统计检验导出
var stationAllListStatisticStorm;
//统计检验预报模型、预报路径选择
var forecastAgencyTypeStrom = 1,calculateTypeStrom = 0;
//统计检验图例选中
var selectedLegendStatisticStrom = {
	"警戒潮位": true,
	"天文潮": true,
	"预测水位": true,
	"增水": true,
	"实测水位": true,
};
var typhoonSelectObjectStorm = {};
var typhoonSelectObjectStormMin = {};
var typhoonSelectIdStorm;

$(function () {
    //台风年份
    //getTyphoonYearListStorm();
    //风暴潮场景库导航切换
    $(".stormScene-title-item").click(function () {
        var index = $(this).index();
        var text = $(this).text();
        $(this).addClass("stormScene-title-itemClick");
        $(this).siblings().removeClass("stormScene-title-itemClick");
        $(this).parent().siblings().find(".stormScene-body-item").eq(index).show();
        $(this).parent().siblings().find(".stormScene-body-item").eq(index).siblings().hide();
        // 清空
        for (var item in typhoonSelectObjectStorm) {
            typhoonSelectObjectStorm[item].removeTyphoon();
        }
        for (var item in typhoonSelectObjectStormMin) {
			typhoonSelectObjectStormMin[item].removeTyphoon();
        }
		typhoonSelectObjectStorm = {};
		typhoonSelectObjectStormMin = {};
		typhoonSelectIdStorm = '';
		clearPlayContent();//清空播放内容
		removeStationList();//清除站点
		deleteEmbankmentLine();//删除堤线
        if(text == "自定义台风"){
            var keyword = $("#typhoonSelfSearch").val();
            //typhoonSelfListSearch(keyword);
            removeStationList();//清除站点
        }else{
			$("#typhoonContaner").hide();
			$(".predictStorm-legend").hide();
			$(".predictStorm-legend-box").hide();
			$(".damStorm-legend-box").hide();
			$(".floodStorm-legend-box").hide();
			$(".tstormLegend-item").find('.layui-icon').addClass('rotate');
			removeStationList();//清除站点
			deleteEmbankmentLine();//删除堤线
            loadStationList();
            var keyword = $("#typhoonSelfSearch").val();
            // var year = $("#yeahListHistory").find("option:selected").val();
			// typhoonListByYearStorm(year,keyword);
			typhoonListSearchByKey(keyword);
        }
    });
    $(".stormScene-title-item").eq(0).trigger("click");
	/***********************历史场景库*********************/
	//图例
	$(".stormLegend-item").click(function(){
		$(this).siblings().toggle();
		$(this).find('.layui-icon').toggleClass('rotate');
	});
    //台风搜索
    $("#historyStormSearchIcon").click(function () {
        var keyword = $("#historyStormSearch").val();
        typhoonListSearchByKey(keyword);
    });
    $('#historyStormSearch').keydown(function (event) {
        if (event.keyCode == 13) {
            typhoonListSearchByKey($(this).val());
        }
    });
    //播放内容
	layui.use(['form'], function () {
		var form = layui.form;
		form.on('select(forecastListHistory)', function (data) {
			var val = data.value
            clearPlayContent();//清空播放内容
			$("#typhoonContaner").hide();
			deleteEmbankmentLine();//删除堤线
            showRiver(true); //动态水纹显示与否
			//$(".tstormLegend-item").find('.layui-icon').addClass('rotate');
			$(".typhoonStorm-legend-box").find('.layui-icon').addClass('rotate');
			if(val == 1){  //风暴潮预报
				$(".predictStorm-legend").hide();
				$(".predictStorm-legend-box").show();
				$(".damStorm-legend-box").hide();
				$(".floodStorm-legend-box").hide();
				$(".predictStorm-legend-box").find('.layui-icon').addClass('rotate');
                if(typhoonSelectIdStorm == "" || typhoonSelectIdStorm == null || typhoonSelectIdStorm == undefined){
					toastr.error("请选择台风");
					return false;
                }else{
					loadStormForecast(1, 1, typhoonSelectIdStorm);
                }
				showRiver(false); //动态水纹显示与否
            }
            if(val == 2){  //最大增水预报
				$(".predictStorm-legend").hide();
				$(".predictStorm-legend-box").show();
				$(".damStorm-legend-box").hide();
				$(".floodStorm-legend-box").hide();
				$(".predictStorm-legend-box").find('.layui-icon').addClass('rotate');
            }
            if(val == 3){  //漫堤预报
				$(".predictStorm-legend").hide();
				$(".predictStorm-legend-box").hide();
				$(".damStorm-legend-box").show();
				$(".floodStorm-legend-box").hide();
				$(".damStorm-legend-box").find('.layui-icon').addClass('rotate');
                if(typhoonSelectIdStorm == "" || typhoonSelectIdStorm == null || typhoonSelectIdStorm == undefined){
					toastr.error("请选择台风");
					return false;
                }else{
					showEmbankmentLine(1);
					forecastTimeControlStorm(7);
				}
            }
            if(val == 4){  //最高水位
				$(".predictStorm-legend").hide();
				$(".predictStorm-legend-box").show();
				$(".damStorm-legend-box").hide();
				$(".floodStorm-legend-box").hide();
				$(".predictStorm-legend-box").find('.layui-icon').addClass('rotate');
			}
			if(val == 5){ //防洪水位预警
				$(".predictStorm-legend").hide();
				$(".predictStorm-legend-box").hide();
				$(".damStorm-legend-box").hide();
				$(".floodStorm-legend-box").show();
				$(".floodStorm-legend-box").find('.layui-icon').addClass('rotate');
                if(typhoonSelectIdStorm == "" || typhoonSelectIdStorm == null || typhoonSelectIdStorm == undefined){
					toastr.error("请选择台风");
					return false;
                }else{
					showEmbankmentLine(2);
					forecastTimeControlStorm(7);
				}
			}
		});
	});

    /*************************自定义台风**************************/
    //自定义台风搜索
    $("#typhoonSelfSearchIcon").click(function () {
        var keyword = $("#typhoonSelfSearch").val();
        //typhoonSelfListSearch(keyword);
    });
    $('#typhoonSelfSearch').keydown(function (event) {
        if (event.keyCode == 13) {
            //typhoonSelfListSearch($(this).val());
        }
    });
    //自定义台风选择
    $(".stormScene-tableSelf tbody tr").click(function(){
        $(this).addClass("tableCheckClick");
        $(this).siblings().removeClass("tableCheckClick");
    });

    //过程图关闭
    $(".stormProduceClose").click(function () {
       $(this).parent().parent().parent().hide(); 
    });  

    /***********************************统计检验****************************************/
    //统计检验过程曲线和统计列表导航切换
	$(".statistic-title-txtStorm").click(function () {
		var index = $(this).index();
		$(this).addClass("statistic-title-txtStormClick");
		$(this).siblings(".statistic-title-txtStorm").removeClass("statistic-title-txtStormClick");
		$(this).parent().siblings(".statistic-test-body").find(".statistic-body-itemStorm").eq(index).show();
		$(this).parent().siblings(".statistic-test-body").find(".statistic-body-itemStorm").eq(index).siblings().hide();
		if (stationNumberListStatisticStorm == "") {
			$(".statistic-chart-listStormStorm").html("");
			$(".statistic-table-bodyStorm").html("");
		} else {
			calculateTypeStrom = parseInt($("#forecastModuleListStorm").find("option:selected").val());
			var startTime = ($("#timeForecastStorm").text()).split(" 至 ")[0];
			var endTime = ($("#timeForecastStorm").text()).split(" 至 ")[1];
			if (index == 0) {
				statisticChartForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
			} else {
				statisticTableForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
			}
		}
		$(".statistic-legend-itemStorm").removeClass("statistic-legend-itemStormClick");
		selectedLegendStatisticStrom = {
			"警戒潮位": true,
			"天文潮": true,
			"预测水位": true,
			"增水": true,
			"实测水位": true,
		};
	});
	//$(".statistic-title-txtStorm").eq(0).trigger("click");
	$('#statisicTest').click(function () {
		if(typhoonSelectIdStorm == "" || typhoonSelectIdStorm == null || typhoonSelectIdStorm == undefined){
			toastr.error("请选择台风");
			return false;
		}
		calculateTypeStrom = parseInt($("#forecastModuleListStorm").find("option:selected").val());
		stationStatisticStrom(forecastAgencyTypeStrom, calculateTypeStrom);
		$('#statisticPopStorm').show();
		$(".statistic-legend-itemStorm").removeClass("statistic-legend-itemStormClick");
		selectedLegendStatisticStrom = {
			"警戒潮位": true,
			"天文潮": true,
			"预测水位": true,
			"增水": true,
			"实测水位": true,
		};
		//默认加载
		var startTime = ($("#timeForecastStorm").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecastStorm").text()).split(" 至 ")[1];
		statisticChartForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
		$(".statistic-title-txtStorm").eq(0).trigger("click");
	});
	//站点选择
	$("#statisticStationStorm").bind("click").on("click", function () {
		calculateTypeStrom = parseInt($("#forecastModuleListStorm").find("option:selected").val());
		stationStatisticStrom(forecastAgencyTypeStrom, calculateTypeStrom);
	});
	//$("#statisticStationStorm").trigger("click");
	//预报模型、预报路径选择
	layui.use(['form'], function () {
		var form = layui.form;
		var startTime = ($("#timeForecastStorm").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecastStorm").text()).split(" 至 ")[1];
		form.on('select(forecastModuleListStorm)', function (data) {
			calculateTypeStrom = parseInt(data.value);
			if ($(".statistic-title-txtStormClick").text() == "过程曲线") {
				statisticChartForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
			} else {
				statisticTableForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
			}
			//stationStatisticStrom(forecastAgencyTypeStrom, calculateTypeStrom);
		});
	});
	//统计检验预测时间
	// var now = new Date((new Date()).getTime()).Format("yyyy-MM-dd hh:mm");
	// var oneDayPrev = new Date((new Date()).getTime() - 1 * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' 00:00:00';
	// var twoAfterDay = new Date((new Date()).getTime() + 2 * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd") + ' 23:59:59';
	// $("#timeForecastStorm").text(oneDayPrev + ' 至 ' + twoAfterDay);
	//统计检验模块图例选择
	var warnStatusStorm = true, tideStatusStorm = true, predictStatusStorm = true, waterStatusStorm = true, realStatusStorm = true;
	$(".statistic-legend-itemStorm").click(function () {
		$(this).toggleClass("statistic-legend-itemStormClick");
		if ($(this).hasClass("statistic-legend-itemStormClick")) {
			if ($(this).find(".statistic-legend-txt").text() == "警戒潮位") {
				warnStatusStorm = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "天文潮") {
				tideStatusStorm = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "预测水位") {
				predictStatusStorm = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "增水") {
				waterStatusStorm = false;
			} else if ($(this).find(".statistic-legend-txt").text() == "实测水位") {
				realStatusStorm = false;
			}
		} else {
			if ($(this).find(".statistic-legend-txt").text() == "警戒潮位") {
				warnStatusStorm = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "天文潮") {
				tideStatusStorm = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "预测水位") {
				predictStatusStorm = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "增水") {
				waterStatusStorm = true;
			} else if ($(this).find(".statistic-legend-txt").text() == "实测水位") {
				realStatusStorm = true;
			}
		}
		selectedLegendStatisticStrom = {
			"警戒潮位": warnStatusStorm,
			"天文潮": tideStatusStorm,
			"预测水位": predictStatusStorm,
			"增水": waterStatusStorm,
			"实测水位": realStatusStorm,
		};
		var startTime = ($("#timeForecastStorm").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecastStorm").text()).split(" 至 ")[1];
		calculateTypeStrom = parseInt($("#forecastModuleListStorm").find("option:selected").val());
		statisticChartForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
	});
	//统计检验模块导出
	$(".statistic-exportStorm").click(function () {
		if (stationAllListStatisticStorm.length == 0 || stationAllListStatisticStorm == "" || stationAllListStatisticStorm == null || stationAllListStatisticStorm == undefined) {

		} else {
			statisticExportStorm(stationAllListStatisticStorm);
		}
	});
});

/*********************历史场景库*********************/
//历史场景库台风搜索功能
function typhoonListSearchByKey(keyword) {
    if(keyword == "" ||  keyword == undefined || keyword == null){
        keyword = "";
    }
    var params = {
        "keyword": keyword
    }
    $ajax('/web/typhoon/search/list/scene', params, function (res) {
        //console.log(res);
        var data = res.data;
        if(data.length == 0){
            $(".stormScene-typhoonBody").html("");
        }else{
            var bodyHtml = '';
            var isActive;
            for(var i=0;i<data.length;i++){
                if(data[i].isActive == true){
                    isActive = 'tableCheckClick';
                }else{
                    isActive = '';
                }
                bodyHtml = bodyHtml + `<tr>
                    <td>
                        <span class="tableCheck ` + isActive + `"></span>
                    </td>
                    <td>` + data[i].number + `</td>
                    <td>` + data[i].name + `</td>
                    <td>` + data[i].enName + `</td>
                    <td style="display:none;">` + data[i].ncStartTime + `</td>
                    <td style="display:none;">` + data[i].ncEndTime + `</td>
                </tr>`;
            }
            $(".stormScene-typhoonBody").html(bodyHtml);
            //台风对应选择
            $(".stormScene-typhoonBody tr").each(function(){
                var typhoonNum = $(this).find("td").eq(1).text();
                if(typhoonNum == typhoonSelectIdStorm){
                    $(this).addClass("tableCheckClick");
                }
            });
            //台风选择
            $(".stormScene-typhoonBody tr").click(function(){
                $(this).addClass("tableCheckClick");
                $(this).siblings().removeClass("tableCheckClick");
				typhoonSelectIdStorm = $(this).find("td").eq(1).text();
				var startTimeStorm = new Date(parseInt($(this).find("td").eq(4).text())).Format("yyyy-MM-dd hh:mm:ss");
				var endTimeStorm = new Date(parseInt($(this).find("td").eq(5).text())).Format("yyyy-MM-dd hh:mm:ss");
				$("#timeForecastStorm").text(startTimeStorm + ' 至 ' + endTimeStorm);
				var ncStartTime = $(this).find("td").eq(4).text();
                if($(this).hasClass("tableCheckClick")){
                    getTyphoonDataByNumber(typhoonSelectIdStorm, function (res) {
						typhoonSelectObjectStorm[typhoonSelectIdStorm] = new typhoon(viewer, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewer"});
						typhoonSelectObjectStorm[typhoonSelectIdStorm].ByTimerShaftDrawTyphoon(ncStartTime);
						if(res.data){
							typhoonSelectObjectStormMin[typhoonSelectIdStorm] = new typhoon(viewerTy, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewerTy"});
							typhoonSelectObjectStormMin[typhoonSelectIdStorm].DrawTyphoonTilePath();
							//$(".stop").click();
							$('.typhoonContaner-effect').show();
							$('.typhoonContaner-name').show().html(typhoonSelectIdStorm + '-' + res.data.name);
						}else{
							$('.typhoonContaner-effect').hide();
							$('.typhoonContaner-name').hide().html("");
						}
					});
                    for(var key in typhoonSelectObjectStorm){
						typhoonSelectObjectStorm[key].removeTyphoon();
						delete typhoonSelectObjectStorm[key];
					}
                    for(var key in typhoonSelectObjectStormMin){
                        typhoonSelectObjectStormMin[key].removeTyphoon();
						delete typhoonSelectObjectStormMin[key];
                    }
				}else{

				}
				//播放内容
				deleteEmbankmentLine();//删除堤线
				showRiver(true); //动态水纹显示与否
				if($(".stormScene-forecastStorm-select option:selected").text() == "无"){

				}else if($(".stormScene-forecastStorm-select option:selected").text() == "风暴潮预报"){
					loadStormForecast(1, 1, typhoonSelectIdStorm);
					showRiver(false); //动态水纹显示与否
				}else if($(".stormScene-forecastStorm-select option:selected").text() == "最大增水预报"){
					
				}else if($(".stormScene-forecastStorm-select option:selected").text() == "漫堤预报"){
					showEmbankmentLine(1);
					forecastTimeControlStorm(7);
				}else if($(".stormScene-forecastStorm-select option:selected").text() == "最高水位"){
					
				}else if($(".stormScene-forecastStorm-select option:selected").text() == "防洪水位预警"){
					showEmbankmentLine(2);
					forecastTimeControlStorm(7);
				}
				//统计检验
				if($("#statisticPopStorm").css("display") == "none"){
					
				}else{
					var startTime = ($("#timeForecastStorm").text()).split(" 至 ")[0];
					var endTime = ($("#timeForecastStorm").text()).split(" 至 ")[1];
					if ($(".statistic-title-txtStormClick").text() == "过程曲线") {
						statisticChartForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
					} else {
						statisticTableForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStrom, calculateTypeStrom, startTime, endTime);
					}
				}
            });
        }
    });
}
// 获取台风年份
function getTyphoonYearListStorm() {
    var yeah = new Date().getFullYear();
    var section = yeah - 1945
    var yearList = [];
    for (var i = 0; i <= section; i++) {
        yearList.push(yeah--);
    }
    for (var j = 0; j < yearList.length; j++) {
        $('#yeahListHistory').append('<option value=' + yearList[j] + '>' + yearList[j] + '</option>');
    }
    layui.use(['form'], function () {
        var form = layui.form;
        form.on('select(yeahListHistory)', function (data) {
            // 选中日期操作
            typhoonListByYearStorm(data.value - 0);
        });
    });
}
//历史场景库根据年份获取台风列表
function typhoonListByYearStorm($yearList,$search){
    var params = {};
    if ($yearList) {
        params['year'] = $yearList
    }
    if ($search) {
        params['keyword'] = $search
    }
    $ajax('/web/typhoon/search/list', params, function (res) {
        //console.log(res);
        var data = res.data;
        if(data.length == 0){
            $(".stormScene-typhoonBody").html("");
        }else{
            var bodyHtml = '';
            var isActive;
            for(var i=0;i<data.length;i++){
                if(data[i].isActive == true){
                    isActive = 'tableCheckClick';
                }else{
                    isActive = '';
                }
                bodyHtml = bodyHtml + `<tr>
                    <td>
                        <span class="tableCheck ` + isActive + `"></span>
                    </td>
                    <td>` + data[i].number + `</td>
                    <td>` + data[i].name + `</td>
                    <td>` + data[i].enName + `</td>
                </tr>`;
            }
            $(".stormScene-typhoonBody").html(bodyHtml);
            //台风对应选择
            $(".stormScene-typhoonBody tr").each(function(){
                var typhoonNum = $(this).find("td").eq(1).text();
                if(typhoonNum == typhoonSelectIdStorm){
                    $(this).addClass("tableCheckClick");
                }
            });
            //台风选择
            $(".stormScene-typhoonBody tr").click(function(){
                $(this).addClass("tableCheckClick");
                $(this).siblings().removeClass("tableCheckClick");
                typhoonSelectIdStorm = $(this).find("td").eq(1).text();
                if($(this).hasClass("tableCheckClick")){
                    getTyphoonDataByNumber(typhoonSelectIdStorm, function (res) {
                        typhoonSelectObjectStorm[typhoonSelectIdStorm] = new typhoon(viewer, typhoonSelectIdStorm, res.data);
                    });
                    for(var key in typhoonSelectObjectStorm){
                        typhoonSelectObjectStorm[key].removeTyphoon();
                    }
                }
            });
        }
    });
}
//历史场景库站点过程图显示隐藏、位置
function stormStationHistoryShow(stationNum, left, top, lon, lat){
	if(typhoonSelectIdStorm == "" || typhoonSelectIdStorm == null || typhoonSelectIdStorm == undefined){
		toastr.error("请选择台风");
		return false;
	}
    var params = {
        "stationNumber":parseInt(stationNum),
        "typhoonNumber":parseInt(typhoonSelectIdStorm)
    }
    $ajax('/web/station/chart/scene',params,function(res){
        //console.log(res);
        var data = res.data;
        $("#stormProduceStationHistory").show();
        $("#stormProduceStationHistory").css({
            "left":left,
            "top":top
        });
        var stationNameTxt;
        if(data.stationName == "" || data.stationName == null || data.stationName == undefined){
            stationNameTxt = "";
        }else{
            stationNameTxt = data.stationName + '水位过程线';
        }
        var stationPositionTxt;
        if(data.stationLocation == "" || data.stationLocation == null || data.stationLocation == undefined){
            stationPositionTxt = "";
        }else{
            stationPositionTxt = data.stationLocation;
        }
        $("#stormProduceStationHistory").find(".stormProducePopTitle").find("span").text(stationNameTxt);
        $("#stormProduceStationHistory").find(".strormProduceAddress").find("span").eq(0).text(stationPositionTxt);
        $("#stormProduceStationHistory").find(".strormProduceAddress").find("span").eq(1).text(lon.toFixed(2) + ' ；' + lat.toFixed(2));
        var dataJson = data.list;
        if(dataJson.length == 0){
            $("#produceStationHistoryChart").html("");
        }else{
            stormProduceStationSelf("produceStationHistoryChart",data);
        }
    });
}
function stormStationHistoryHide(){
    $("#stormProduceStationHistory").hide();
}
function stormStationHistoryPosition(left, top){
    $("#stormProduceStationHistory").css({
        "left":left,
        "top":top
    });
}
//历史场景库站点预报
function stormStationPredictTextByStationNum(stationNum){
	// if(typhoonSelectIdStorm == "" || typhoonSelectIdStorm == null || typhoonSelectIdStorm == undefined){
	// 	toastr.error("请选择台风");
	// 	return false;
	// }
	var params = {
		"stationNumber":parseInt(stationNum),
		"typhoonNumber":parseInt(typhoonSelectIdStorm)
	}
	$ajax('/web/station/forecast/scene',params,function(res){
		//console.log(res);
		var data = res.data;
		$(".stormSceneHistorySite").show();
		$(".stormScene-site-list").html("");
		var time,level,stationPredictHtml="";
		if(data.length == 0){
			$(".stormScene-site-list").html("");
		}else{
			for(var i=0;i<data.length;i++){
				if(data[i].time == null || data[i].time == undefined || data[i].time == ""){
					time = "-";
				}else{
					time = timeStampTurnTime(data[i].time);
				}
				if(data[i].level == null || data[i].level == undefined || data[i].level == ""){
					level = "-";
				}else{
					level = data[i].level;
				}
				if(data[i].levelType == null || data[i].levelType == undefined || data[i].levelType == ""){
					
				}else{
					if(data[i].levelType == 1){
						stationPredictHtml = stationPredictHtml + '<div class="stormScene-site-item">'+
							'<div class="stormScene-site-box">'+
								'<div class="stormScene-site-left">'+
									'<div class="stormScene-site-normal">'+time+'</div>'+
									'<div class="stormScene-site-big stormScene-site-margin">预测最大潮位</div>'+
								'</div>'+
								'<div class="stormScene-site-right">'+
									'<span class="stormScene-fontColor-blue stormScene-site-max">'+level+'</span>'+
								'</div>'+
							'</div>'+
						'</div>';
					}else if(data[i].levelType == 2){
						stationPredictHtml = stationPredictHtml +  '<div class="stormScene-site-item">'+
							'<div class="stormScene-site-box">'+
								'<div class="stormScene-site-left">'+
									'<div class="stormScene-site-normal">'+time+'</div>'+
									'<div class="stormScene-site-big stormScene-site-margin">预测最大增水</div>'+
								'</div>'+
								'<div class="stormScene-site-right">'+
									'<span class="stormScene-fontColor-blue stormScene-site-max">'+level+'</span>'+
								'</div>'+
							'</div>'+
						'</div>';
					}
				}
			}
			$(".stormScene-site-list").html(stationPredictHtml);
		}
		$(".stormScene-site-list").html(stationPredictHtml);
	});
}
//历史场景库风暴潮预报过程图显示隐藏、位置
function stormPlayStormProduceShow(left, top, lon, lat){
	var params = {
		"lonPoint":lon,
		"latPoint":lat,
		"agency":1,
		"typhoonNumber":parseInt(typhoonSelectIdStorm)
	}
	$ajax('/web/opendap/netcdf/storm/forecast/correct/normal/chart',params,function(res){
		//console.log(res);
		var data = res.data;
		$("#stormProduceStormForecastHistory").show();
		$("#stormProduceStormForecastHistory").css({
			"left": left,
			"top": top
		});
		$("#stormProduceStormForecastHistory").find(".strormProduceAddress").find("span").text(lon.toFixed(2) + ' ；' + lat.toFixed(2));
		if(data == "" || data == null || data == undefined){
			$("#produceStormForecastHistoryChart").html("");
		}else{
			stormProduceStormForecastSelf("produceStormForecastHistoryChart", data);
		}
	});
}
function stormPlayStormProduceHide(){
    $("#stormProduceStormForecastHistory").hide();
}
function stormPlayStormProducePosition(left, top){
    $("#stormProduceStormForecastHistory").css({
        "left":left,
        "top":top
    });
}
//历史场景库漫堤预报过程图显示隐藏、位置
function stormPlayStormDamProduceShow(cityId, dikeId, left, top, lon, lat){
	var params = {
		"agency":parseInt(1),
		"cityId":parseInt(cityId),
		"dikeId":parseInt(dikeId),
		"typhoonNumber":parseInt(typhoonSelectIdStorm),
		"warnType":parseInt(1)
	}
	$ajax('/web/opendap/netcdf/dike/chart',params,function(res){
		//console.log(res);
		var data = res.data;
		$("#stormProduceDamForecastHistory").show();
		$("#stormProduceDamForecastHistory").css({
			"left":left,
			"top":top
		});
		$("#stormProduceDamForecastHistory").find(".strormProduceAddress").find("span").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.dikeName == "" || data.dikeName == null || data.dikeName == undefined){
			$("#stormProduceDamForecastHistory").find(".forecastPlayDamName").html("");
		}else{
			$("#stormProduceDamForecastHistory").find(".forecastPlayDamName").html(data.dikeName);
		}
        if(data.defenseStandards == "" || data.defenseStandards == null || data.defenseStandards == undefined){
			$("#stormProduceDamForecastHistory").find(".forecastPlayDamStandar").html("");
		}else{
			$("#stormProduceDamForecastHistory").find(".forecastPlayDamStandar").html(data.defenseStandards);
		}
		if(data.chartList.length == 0){
			$("#produceDamForecastHistoryChart").html("");
		}else{
			stormProduceDamForecastSelf("produceDamForecastHistoryChart", data);
		}
	});
}
function stormPlayStormDamProduceHide(){
	$("#stormProduceDamForecastHistory").hide();
}
function stormPlayStormDamProducePosition(left, top){
	$("#stormProduceDamForecastHistory").css({
		"left":left,
		"top":top
	});
}
//历史场景库最大增水预报过程图显示隐藏、位置

//历史场景库最高水位过程图显示隐藏、位置

//历史场景库防洪水位预警过程图显示隐藏、位置
function stormPlayStormFloodProduceShow(cityId, dikeId, left, top, lon, lat){
	var params = {
		"agency":parseInt(1),
		"cityId":parseInt(cityId),
		"dikeId":parseInt(dikeId),
		"typhoonNumber":parseInt(typhoonSelectIdStorm),
		"warnType":parseInt(2)
	}
	$ajax('/web/opendap/netcdf/dike/chart',params,function(res){
		//console.log(res);
		var data = res.data;
		$("#stormProduceFloodWaterLevelForecastHistory").show();
		$("#stormProduceFloodWaterLevelForecastHistory").css({
			"left":left,
			"top":top
		});
		$("#stormProduceFloodWaterLevelForecastHistory").find(".strormProduceAddress").find("span").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.dikeName == "" || data.dikeName == null || data.dikeName == undefined){
			$("#stormProduceFloodWaterLevelForecastHistory").find(".forecastPlayFloodName").html("");
		}else{
			$("#stormProduceFloodWaterLevelForecastHistory").find(".forecastPlayFloodName").html(data.dikeName);
		}
        if(data.defenseStandards == "" || data.defenseStandards == null || data.defenseStandards == undefined){
			$("#stormProduceFloodWaterLevelForecastHistory").find(".forecastPlayFloodStandar").html("");
		}else{
			$("#stormProduceFloodWaterLevelForecastHistory").find(".forecastPlayFloodStandar").html(data.defenseStandards);
		}
		if(data.chartList.length == 0){
			$("#produceFloodForecastHistoryChart").html("");
		}else{
			stormProduceFloodForecastSelf("produceFloodForecastHistoryChart",data);
		}
	});
}
function stormPlayStormFloodProduceHide(){
	$("#stormProduceFloodWaterLevelForecastHistory").hide();
}
function stormPlayStormFloodProducePosition(left, top){
	$("#stormProduceFloodWaterLevelForecastHistory").css({
		"left":left,
		"top":top
	});
}


//统计检验模块站点选择
function stationStatisticStrom(forecastAgencyType, calculateType) {
	var params = {
		"queryIsWarn": true,
		"forecastAgencyType": forecastAgencyType,
		"calculateType": calculateType
	};
	$ajax('/web/station/queryStationByCity', params, function (res) {
		stationNumberListStatisticStorm = [], stationNameListStatisticStorm = [], selectDataStatisticStorm = [];
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
				selectDataStatisticStorm.push({
					name: res.data[i].cityName,
					value: res.data[i].areaId,
					children: children,
					selected: true
				});
				for (var m = 0; m < children.length; m++) {
					stationNumberListStatisticStorm.push(children[m].value);
					stationNameListStatisticStorm.push(children[m].name);
				}
			} else {
				if (res.data[i].areaId == area) {
					selectDataStatisticStorm.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
						selected: true
					});
					for (var n = 0; n < children.length; n++) {
						stationNumberListStatisticStorm.push(children[n].value);
						stationNameListStatisticStorm.push(children[n].name);
					}
				} else {
					selectDataStatisticStorm.push({
						name: res.data[i].cityName,
						value: res.data[i].areaId,
						children: children,
					});
				}
			}
		}
		var startTime = ($("#timeForecastStorm").text()).split(" 至 ")[0];
		var endTime = ($("#timeForecastStorm").text()).split(" 至 ")[1];
		calculateTypeStrom = parseInt($("#forecastModuleListStorm").find("option:selected").val());
		if ($(".statistic-title-txtStormClick").text() == "过程曲线") {
			statisticChartForecastStorm(stationNumberListStatisticStorm, forecastAgencyType, calculateType, startTime, endTime);
		} else {
			statisticTableForecastStorm(stationNumberListStatisticStorm, forecastAgencyType, calculateType, startTime, endTime);
		}
		var stationStatisticStrom = xmSelect.render({
			el: '#statisticStationStorm',
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
				return selectDataStatisticStorm
			},
			on: function (data) {
				//arr:  当前多选已选中的数据
				var arr = data.arr;
				stationNumberListStatisticStorm = [], stationNameListStatisticStorm = []
				for (var i = 0; i < arr.length; i++) {
					stationNumberListStatisticStorm.push(arr[i].value);
					stationNameListStatisticStorm.push(arr[i].name);
				}
				//console.log(stationNumberListStatisticStorm,stationNameListStatisticStorm);
				//change, 此次选择变化的数据,数组
				var change = data.change;
				//isAdd, 此次操作是新增还是删除
				var isAdd = data.isAdd;
				//可以return一个数组, 代表想选中的数据
				//return []
				var startTime = ($("#timeForecastStorm").text()).split(" 至 ")[0];
				var endTime = ($("#timeForecastStorm").text()).split(" 至 ")[1];
				calculateTypeStrom = parseInt($("#forecastModuleListStorm").find("option:selected").val());
				if (!isAdd) {
					$(".statisticChartForecastStormStatistic").each(function () {
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
					if ($(".statistic-title-txtStormClick").text() == "过程曲线") {
						statisticChartForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStorm, calculateTypeStrom, startTime, endTime);
					} else {

					}
				}
				if ($(".statistic-title-txtStormClick").text() == "统计列表") {
					statisticTableForecastStorm(stationNumberListStatisticStorm, forecastAgencyTypeStorm, calculateTypeStrom, startTime, endTime);
				}
			},
		});
	});
}

//统计检验过程曲线
function statisticChartForecastStorm(stationNumberList, forecastAgencyType, calculateType, startTime, endTime) {
	if (stationNumberList.length == 0) {
		$(".statistic-chart-listStorm").html("");
	} else {
		var params = {
			'stationNumberList': stationNumberList,
			'forecastAgencyType': forecastAgencyType,
			'calculateType': calculateType,
			'startTime': startTime,
			"endTime": endTime,
			"typhoonNumber":parseInt(typhoonSelectIdStorm)
		}
		$ajax('/web/station/verify/process', params, function (res) {
			var data = res.data.stationList;
			if (data.length == 0) {
				$(".statistic-chart-listStorm").html("");
			} else {
				$(".statistic-chart-listStorm").html("");
				for (var i = 0; i < data.length; i++) {
					var chartListBox = document.createElement('div');
					chartListBox.setAttribute('data-id', stationNumberList[i]);
					chartListBox.setAttribute('class', 'statisticChartForecastStormStatistic');
					chartListBox.setAttribute('id', 'statisticChartForecastStorm' + i);
					chartListBox.setAttribute('style', 'width: 820px;height: 200px;');
					$(".statistic-chart-listStorm").append(chartListBox);
					statisticChart('statisticChartForecastStorm' + i, data[i], selectedLegendStatistic);
				}
			}
		});

	}
}

//统计检验统计列表
function statisticTableForecastStorm(stationNumberList, forecastAgencyType, calculateType, startTime, endTime) {
	if (stationNumberList.length == 0) {
		$(".statistic-table-bodyStorm").html("");
	} else {
		var params = {
			'stationNumberList': stationNumberList,
			'forecastAgencyType': forecastAgencyType,
			"calculateType": calculateType,
			"startTime":Date.parse(startTime),
			"endTime":Date.parse(endTime),
			"typhoonNumber":parseInt(typhoonSelectIdStorm)
		}
		$ajax('/web/station/verify/list', params, function (res) {
			var stationList = res.data.stationList;
			stationAllListStatisticStorm = JSON.parse(JSON.stringify(stationList));
			var data = res.data;
			$("#statisticNumStorm").text(data.warnStationCount + '个');
			if (data.warnStationCount == 0) {
				$("#statisticTimeRangeStorm").text('');
			} else {
				$("#statisticTimeRangeStorm").text(data.effectStartTime + '-' + data.effectEndTime);
			}
			var dataTable = JSON.parse(JSON.stringify(stationList));
			if (dataTable.length == 0) {
				$(".statistic-table-bodyStorm").html("");
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
				$(".statistic-table-bodyStorm").html(tableHtml);
			}
		});
	}
}

//统计检验导出
function statisticExportStorm(stationList) {
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

//堤坝预警、最大增水、防洪水位预警预报时间轴
function forecastTimeControlStorm(type) {
    viewerTy.clockViewModel.shouldAnimate = true;
    var params = {
		"type": parseInt(type),
		"agency":parseInt(1),
		"typhoonNumber":typhoonSelectIdStorm
	}
	$ajax('/web/opendap/netcdf/storm/forecast/time', params, function (res) {
		//console.log(res); 
		var data = res.data;
		var startTime = data.startTime;
		var endTime = data.endTime;
		// 场景库台风
		var listData = {
			"number": typhoonSelectIdStorm
		}
		listData.interval = 1000
		// getTyphoonDataByNumber(typhoonSelectIdStorm, function (res) {
		// 	if(res.data){
		// 		typhoonSelectObjectStormMin[typhoonSelectIdStorm] = new typhoon(viewerTy, Cesium, res.data, forecastPathStatus, true);
		// 		typhoonSelectObjectStormMin[typhoonSelectIdStorm].DrawTyphoonTilePath();
		// 		//$(".stop").click();
		// 		$('.typhoonContaner-effect').show();
		// 		$('.typhoonContaner-name').show().html(typhoonSelectIdStorm + '-' + res.data.name);
		// 	}else{
		// 		$('.typhoonContaner-effect').hide();
		// 		$('.typhoonContaner-name').hide().html("");
		// 	}
		// });
		// $ajax('/web/typhoon/path/history/tile', listData, function (res) {
		// 	if (res.data) {
		// 		//typhoonSelectObjectStormMin[typhoonSelectIdStorm] = new typhoon(viewerTy, res.data.number, res.data, false);
		// 		$(".stop").click();
		// 		$('.typhoonContaner-effect').show();
		// 		$('.typhoonContaner-name').show().html(res.data.number + '-' + res.data.name);
		// 	} else {
		// 		$('.typhoonContaner-effect').hide();
		// 		$('.typhoonContaner-name').hide()
		// 	}
		// })
		changeTimeLineText(startTime,endTime);
		viewerTy.timeline.container.style.visibility = 'visible'
		viewerTy.timeline.container.style.display = 'block'
		$('#timelineBar').show();
		$('#typhoonContaner').show();
		viewerTy.clockViewModel.multiplier = 2500
		viewerTy.clockViewModel.shouldAnimate = false;
		//localStorage.getItem('areaId')
		// if($(".stormScene-forecastStorm-select option:selected").text() == "漫堤预报"){
		// 	setNormalEmbankmentLineByTime(1,startTime,'',1,typhoonSelectIdStorm);
		// }else if($(".stormScene-forecastStorm-select option:selected").text() == "防洪水位预警"){
		// 	setNormalEmbankmentLineByTime(1,startTime,'',2,typhoonSelectIdStorm);
		// }
		// if($("#forecastListHistory").val() == 3){
		// 	console.log("漫堤预报");
		// 	setNormalEmbankmentLineByTime(1,startTime,'',1,typhoonSelectIdStorm);
		// }else if($("#forecastListHistory").val() == 5){
		// 	console.log("防洪水位预警");
		// 	setNormalEmbankmentLineByTime(1,startTime,'',2,typhoonSelectIdStorm);
		// }
		stopTime = endTime;
		localStorage.setItem('startTime',startTime);
	});
}