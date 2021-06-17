var userId = localStorage.getItem('id');//用户ID
var area = localStorage.getItem('areaId');//用户区域
//相似台风绘制
var waterProjectSimialitityObject={};
//实时台风
var waterProjectCurrentObject={};
//相似台风编号
var waterProjectSimialirityTyphoonNum;
//相似台风选择列表
var waterProjectSimialirityList=[];
//菜单模块划分
var waterProjectMenuListStatus;
//水情专题菜单栏状态
var waterProjectMenuStatus;
var stopTime;
//水位预报模块切换
var waterTitle;
$(function(){
    //主菜单开启
    $(".waterProjectMenu").click(function () {
       $(".menuContainer").show(); 
    });
    //主菜单栏关闭
    $(".menuClose").click(function () {
       $(this).parent().parent().parent().hide(); 
    });
    //主菜单栏切换
    $(".menuMainItem").click(function () {
        var text = $(this).text();
        $(this).addClass("menuMainItemClick");
        $(this).siblings().removeClass("menuMainItemClick");
        $(this).parent().siblings(".menuMainList").find(".menuMainItem").removeClass("menuMainItemClick");
        $("#typhoonContaner").hide();
        //台风信息框
        $(".typhone_info").hide();
        clearPlayContent();//清空播放内容
        if(text == "台风路径"){
            allHide();
            exitScreen();
            $(".nav-list-item").eq(0).trigger("click");
            viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(103.486138, 30.465411, 21000000.0)});
        }else if(text == "预报订正"){
            allHide();
            exitScreen();
            $(".nav-list-item").eq(1).trigger("click");
        }else if(text == "风暴潮场景库"){
            allHide();
            exitScreen();
            $(".nav-list-item").eq(2).trigger("click");
        }else if(text == "历史相似台风"){
            allShow();
            waterProjectStationCity();
            $("#waterProjectCase").show();
            $("#forecastPlayCase").hide();
            $("#stationPredictdataCase").hide();
            $(".waterProjectBodyItem").hide();
            $(".waterProjectNavItem").eq(0).trigger("click");
            $(".rainLegendTitle").removeClass("rainRotate");
            $(".rainLegendBody").hide();
            var typhoonCurrentNumber = $("#typhoonSelectWater").find("option:selected").val();
            waterProjectSimialirityListData(typhoonCurrentNumber,true); //获取当前台风的相似台风
        }else if(text == "水位预报"){
            allShow();
            $("#forecastPlayCase").show();
            $("#waterProjectCase").hide();
            $("#stationPredictdataCase").hide();
            $(".forecastPlayList").eq(0).trigger("click");
            var typhoonCurrentNumber = $("#typhoonSelectWater").find("option:selected").val();
            loadWaterStormForecast();  //加载风暴潮预报
            // getTyphoonDataByMultiplier(7500,function (res) {
            //     waterProjectCurrentObject[typhoonCurrentNumber] = new typhoon(viewerTy, typhoonCurrentNumber, res.data, true);
            //     $(".stop").click();
            // });
            // getTyphoonDataByInterval(typhoonCurrentNumber, function (res) {
            //     console.log(res);
            //     waterProjectCurrentObject[typhoonCurrentNumber] = new typhoon(viewerTy, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewerTy"});
            //     waterProjectCurrentObject[typhoonCurrentNumber].ByIntervalDrawTyphoon();
            //     $(".stop").click();
            // });
            $(".waterProjectForecastLegendBox").show();
            $(".waterProjectDamLegendBox").hide();
            $(".waterProjectFloodLegendBox").hide();
        }else if(text == "站点预测"){
            allShow();
            $("#stationPredictdataCase").show();
            $("#waterProjectCase").hide();
            $("#forecastPlayCase").hide();
            $(".waterStationMenuItem").eq(0).trigger("click");
            area = $("#cityListWaterStation").find("option:selected").attr("data-id");
            removeStationList();//清除站点
            loadWaterStationProduceData(area);
            var areaCity = $("#cityListWaterStation").find("option:selected").text();
            setCameraByArea(areaCity);
        }
        $(".menuContainer").hide();
        waterProjectMenuListStatus = text;
        waterProjectMenuStatus = "";
        //清除台风绘制
        for(var i=0;i<waterProjectSimialirityList.length;i++){
            var item = waterProjectSimialirityList[i];
            if(item == "" || item == undefined || item == null){

            }else{
                waterProjectSimialitityObject[item].removeTyphoon();
            }
        }
        waterProjectSimialitityObject = {};
        waterProjectSimialirityList = [];
        removeStationList();//清除站点
        $(".waterProjectProducePop").hide();
        $(".waterProjectTidePop").remove();
        deleteEmbankmentLine();//删除堤岸线
        removeRainfallLayer();//清除雨情
    });
    //过程图弹窗关闭
    $(".produceClose").click(function () {
        $(this).parent().parent().parent().hide();
    });
    /******************水情专题********************/
    //降水图例、预报图例、漫堤图例
    $(".rainLegendTitle").click(function(){
        $(this).toggleClass("rainRotate");
        $(this).siblings("div.rainLegendBody").toggle();
    });
    //菜单栏切换
    $(".waterProjectNavItem").click(function () {
        var index = $(this).index();
        var text = $(this).find("span").text();
        $(this).addClass("waterProjectNavItemClick");
        $(this).siblings().removeClass("waterProjectNavItemClick");
        $(this).parent().parent().siblings("div.waterProjectListBody").find(".waterProjectBodyItem").eq(index).show();
        waterProjectMenuStatus = text;
        waterProjectMenuListStatus = "";
        if(text == "潮位"){
            var typhoonCurrentNumber = parseInt($(".waterProjectSimialirityItemClick").find(".simialirity-num").text());
            area = $("#cityListWaterProject").find("option:selected").attr("data-id");
            var areaCity = $("#cityListWaterProject").find("option:selected").text();
            removeStationList();//清除站点
            $(".waterProjectTidePop").remove();
            loadTideStation(typhoonCurrentNumber,area);
            setCameraByArea(areaCity);
        }else{
            viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(103.486138, 30.465411, 21000000.0)});
            removeStationList();//清除站点
            $(".waterProjectTidePop").remove();
        }
        if(text == "雨情"){
            $(".rainTimeSelect").show();
            $(".rainLegendBox").show();
            var typhoonCurrentNumber = parseInt($(".waterProjectSimialirityItemClick").find(".simialirity-num").text());
            removeRainfallLayer();//清除雨情
            rainTimeList(typhoonCurrentNumber);
        }else{
            $(".rainTimeSelect").hide();
            $(".rainLegendBox").hide();
            removeRainfallLayer();//清除雨情
        }
    });
    //降水时间选择
    $(".rainTimeItem").click(function(){
        $(this).addClass("rainRadioClick");
        $(this).siblings().removeClass("rainRadioClick");
    });
    $(".rainTimeItem").eq(0).trigger("click");
    
    /*****************预报播放***********************/
    //菜单栏切换
    $(".forecastPlayList").click(function () {
        var text = $(this).text();
        $(this).addClass("forecastPlayListClick"); 
        $(this).siblings().removeClass("forecastPlayListClick");
        clearPlayContent();//清空播放内容
        showRiver(true); //动态水纹显示与否
        waterTitle = text;
        var typhoonCurrentNumber = $("#typhoonSelectWater").find("option:selected").val();
        getTyphoonDataByInterval(typhoonCurrentNumber, function (res) {
            var data = res.data;
            getTyphoonDataTimeByNumber(typhoonCurrentNumber, function (res) {
                //console.log(res);
                waterProjectCurrentObject[typhoonCurrentNumber] = new typhoon(viewerTy, Cesium, data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewerTy"});
                waterProjectCurrentObject[typhoonCurrentNumber].ByTimerShaftDrawTyphoon(res.data.ncStartTime);
            });
        });
        for(var key in waterProjectCurrentObject){
            waterProjectCurrentObject[key].removeTyphoon();
            delete waterProjectCurrentObject[key];
        }
        if(text == "风暴潮预报"){
            loadWaterStormForecast();  //加载风暴潮预报
            // getTyphoonDataByMultiplier(7500,function (res) {
            //     waterProjectCurrentObject[typhoonCurrentNumber] = new typhoon(viewerTy, typhoonCurrentNumber, res.data, true);
            // });
            $(".waterProjectForecastLegendBox").show();
            $(".waterProjectDamLegendBox").hide();
            $(".waterProjectFloodLegendBox").hide();
            $(".waterProjectForecastLegendBox").find(".rainLegendTitle").removeClass('rainRotate');
            $(".rainLegendBody").hide();
            showRiver(false); //动态水纹显示与否
        }else if(text == "漫堤风险预警"){
            showEmbankmentLine(1);
            forecastTimeControl(7);
            $("#typhoonContaner").show();
            $('#timelineBar').show();
            $(".waterProjectForecastLegendBox").hide();
            $(".waterProjectDamLegendBox").show();
            $(".waterProjectFloodLegendBox").hide();
            $(".rainLegendBody").hide();
            $(".waterProjectDamLegendBox").find(".rainLegendTitle").removeClass('rainRotate');
        }else if(text == "最大增水预报"){
            $(".waterProjectForecastLegendBox").show();
            $(".waterProjectDamLegendBox").hide();
            $(".waterProjectFloodLegendBox").hide();
            $(".rainLegendBody").hide();
            $(".waterProjectForecastLegendBox").find(".rainLegendTitle").removeClass('rainRotate');
        }else if(text == "最高水位"){
            loadWaterHightestWaterLevel();
            $(".waterProjectForecastLegendBox").show();
            $(".waterProjectDamLegendBox").hide();
            $(".waterProjectFloodLegendBox").hide();
            $(".rainLegendBody").hide();
            $(".waterProjectForecastLegendBox").find(".rainLegendTitle").removeClass('rainRotate');
        }else if(text == "最大漫堤风险"){
            $(".waterProjectForecastLegendBox").hide();
            $(".waterProjectDamLegendBox").show();
            $(".waterProjectFloodLegendBox").hide();
            $(".rainLegendBody").hide();
            $(".waterProjectDamLegendBox").find(".rainLegendTitle").removeClass('rainRotate');
        }else if(text == "防洪水位预警"){
            showEmbankmentLine(2);
            forecastTimeControl(7);
            $("#typhoonContaner").show();
            $('#timelineBar').show();
            $(".waterProjectForecastLegendBox").hide();
            $(".waterProjectDamLegendBox").hide();
            $(".waterProjectFloodLegendBox").show();
            $(".rainLegendBody").hide();
            $(".waterProjectFloodLegendBox").find(".rainLegendTitle").removeClass('rainRotate');
        }
        deleteEmbankmentLine();//删除堤岸线
    });

    /***********************站点预测数据************************/
    //菜单栏切换
    $(".waterStationMenuItem").click(function () {
        var index = $(this).index();
       $(this).addClass("waterStationMenuItemClick");
       $(this).siblings().removeClass("waterStationMenuItemClick");
       $(this).parent().siblings(".waterStationTable").find(".waterStationInfoItem").eq(index).show();
       $(this).parent().siblings(".waterStationTable").find(".waterStationInfoItem").eq(index).siblings().hide();
    });
});

//站点城市列表
function waterProjectStationCity() {
    $ajax('/web/station/cityList', {}, function(res){
        var data = res.data;
        if(data.length == 0){

        }else{
            $('#cityListWaterProject').html("");
            $('#cityListWaterStation').html("");
            for(var j=0;j<data.length;j++){
                var cityName;
                if(data[j].cityName.length == 2){
                    cityName = data[j].cityName + '市';
                }else{
                    cityName = data[j].cityName;
                }
                $('#cityListWaterProject').append('<option value=' + data[j].areaId + ' data-id=' + data[j].areaId + '>' + cityName + '</option>');
                $('#cityListWaterStation').append('<option value=' + data[j].areaId + ' data-id=' + data[j].areaId + '>' + cityName + '</option>');
                if(data[j].areaId == area){
                    //默认选中
                    var cityListWaterStation = data[j].areaId;
                    var citySelectWaterStation = data[j].areaId; 
                    $('#cityListWaterProject').find("option").eq(j).attr("selected",true);
                    $('#cityListWaterStation').find("option").eq(j).attr("selected",true);
                    //默认水情专题超警信息
                    var typhoonNum = $(".waterProjectSimialirityItemClick").find(".simialirity-num").text();
                    if(typhoonNum == "" || typhoonNum == undefined || typhoonNum == null){

                    }else{
                        waterProjectSimialirityWarningData(typhoonNum, cityListWaterStation);
                    }
                    //默认站点预测数据站点水位过程图、统计列表、超警信息
                    waterStationProduceChartData(userId,citySelectWaterStation);
                    waterStationStatisticData(userId,citySelectWaterStation);
                    waterProjectWarningData(userId, citySelectWaterStation);
                }else{

                }
            }
            layui.use(['form'], function () {
                var form = layui.form;
                //水情专题城市选择
                form.on('select(cityListWaterProject)', function (data) {
                    var city;
                    city = data.value;
                    var typhoonNum = $(".waterProjectSimialirityItemClick").find(".simialirity-num").text();
                    var areaCity = $("#cityListWaterProject").find("option:selected").text();
                    //area = $("#cityListWaterProject").find("option:selected").attr("data-id");
                    if(typhoonNum == "" || typhoonNum == undefined || typhoonNum == null){

                    }else{
                        waterProjectSimialirityWarningData(typhoonNum, city);
                        if($(".waterProjectNavItem").eq(2).hasClass("waterProjectNavItemClick")){
                            removeStationList();//清除站点
                            $(".waterProjectTidePop").remove();
                            loadTideStation(typhoonNum,city);
                            setCameraByArea(areaCity);
                        }else{

                        }
                    }
                });
                //站点预测城市选择
                form.on('select(cityListWaterStation)', function (data) {
                    var city;
                    city = data.value;
                    //area = $("#cityListWaterStation").find("option:selected").attr("data-id");
                    removeStationList();//清除站点
                    loadWaterStationProduceData(city);
                    waterStationProduceChartData(userId,city);
                    waterStationStatisticData(userId,city);
                    waterProjectWarningData(userId, city);
                    var areaCity = $("#cityListWaterStation").find("option:selected").text();
                    setCameraByArea(areaCity);
                });
                form.render();
            });
        }
    });
}

//相似台风
function waterProjectSimialirityListData(number,isFirst) {
    var params = {
        "number": number,
        "sort": 1
    };  
    $ajax('/web/typhoon/similar/list', params, function(res){
        //console.log(res);
        var data = res.data;
        if(data.length == 0){
            $(".waterProjectBody").html("");
            $(".waterProjectTyphoonBold").html("");
        }else{
            var listHtml = "";
            for(var i=0;i<data.length;i++){
                listHtml = listHtml + `<div class="waterProjectSimialirityItem">
                    <div class="waterSimialirityText">
                        <i class="waterSimialirityCheckIcon"></i>
                        <span class="simialirity-num">`+ data[i].number +`</span>
                        <span class="simialirity-name">`+ data[i].name +`</span>
                    </div>
                    <div class="waterSimialirityNum">
                        <span class="waterSimialirityNumText">`+ data[i].speedSimilarity +`%</span>
                        <span class="waterSimialirityWordText">匹配</span>
                    </div>
                </div>`;
            }
            $(".waterProjectBody").html(listHtml);
            $(".waterProjectSimialirityItem").click(function () {
                var num = $(this).find("span.simialirity-num").text();
                $(this).addClass("waterProjectSimialirityItemClick");
                $(this).siblings().removeClass("waterProjectSimialirityItemClick");
                waterProjectSimialirityInfoData(num);
                var city = $("#cityListWaterProject").find("option:selected").val();
                waterProjectSimialirityWarningData(num, city);
                
                var typhoonCurrentNumber = parseInt($(".waterProjectSimialirityItemClick").find(".simialirity-num").text());
                area = $("#cityListWaterProject").find("option:selected").attr("data-id");
                //var areaCity = $("#cityListWaterProject").find("option:selected").text();
                //setCameraByArea(areaCity);
                if($(".waterProjectNavItemClick").find("span").text() == "潮位"){
                    removeStationList();//清除站点
                    $(".waterProjectTidePop").remove();
                    loadTideStation(typhoonCurrentNumber,area);
                }else if($(".waterProjectNavItemClick").find("span").text() == "雨情"){
                    removeRainfallLayer();//清除雨情
                    rainTimeList(typhoonCurrentNumber);
                }
            });
            //相似台风选择
            $(".waterSimialirityCheckIcon").click(function (e) {
                var num = $(this).siblings("span.simialirity-num").text();
                var name = $(this).siblings("span.simialirity-name").text();
                $(this).toggleClass("waterSimialirityCheckIconClick"); 
                if($(this).hasClass("waterSimialirityCheckIconClick")){
                    if(waterProjectSimialirityList.length > 4){
                        $(this).removeClass('waterSimialirityCheckIconClick');
                        toastr.warning('最多只能选择5条台风');
                        return
                    }
                    waterProjectSimialirityList.push(num);
                    getTyphoonDataByNumber(num, function (res) {
                        waterProjectSimialitityObject[num] = new typhoon(viewer, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewer"});
                        waterProjectSimialitityObject[num].ByIntervalDrawTyphoon();
                    });
                }else{
                    waterProjectSimialitityObject[num].removeTyphoon();
                    for(var i=0;i<waterProjectSimialirityList.length;i++){
                        if(waterProjectSimialirityList[i] == num){
                            waterProjectSimialirityList.splice(i,1);
                        }
                    }
                }
                e.stopPropagation();
                e.cancelBubble = true;
            });
            if(isFirst){
                $(".waterProjectSimialirityItem").eq(0).find(".waterSimialirityCheckIcon").trigger("click"); //默认选中第一条数据   
                $(".waterProjectSimialirityItem").eq(0).trigger("click");  
            }else{

            }
            //已选择对应列表
            $(".waterProjectSimialirityItem").each(function () {
                var num = $(this).find(".simialirity-num").text();
                var name = $(this).find(".simialirity-name").text();
                if (waterProjectSimialirityList.indexOf(num) != -1) {
                    $(this).find(".waterSimialirityCheckIcon").addClass("waterSimialirityCheckIconClick");
                }
                if($(".waterProjectTyphoonItem").eq(0).find(".waterProjectTyphoonBold").text() == name){
                    $(this).addClass("waterProjectSimialirityItemClick");
                }
            });

        }
    });
}

//相似台风信息
function waterProjectSimialirityInfoData(number) {
    var params = {
        "number": parseInt(number)
    }
    $ajax('/web/typhoon/land/query',params,function (res) {
        //console.log(res);
        var data = res.data;
        $(".waterProjectTyphoonBold").text("");
        $(".waterProjectTyphoonItem").eq(0).find(".waterProjectTyphoonBold").text(data.name);
        $(".waterProjectTyphoonItem").eq(1).find(".waterProjectTyphoonBold").text(data.landAddress);
        $(".waterProjectTyphoonItem").eq(2).find(".waterProjectTyphoonBold").text(data.landStrong);
        $(".waterProjectTyphoonItem").eq(3).find(".waterProjectTyphoonBold").text(timeStampTurnTime(data.landTime));
    });
}

//相似台风超警信息
function waterProjectSimialirityWarningData(typhoonNumber, areaId) {
    var params = {
        "typhoonNumber": parseInt(typhoonNumber),
        "areaId": parseInt(areaId)
    }
    $ajax('/web/station/similarTyphoon/warnInfo', params, function(res){
        //console.log(res);
        var data = res.data;
        if(data == "" || data == undefined || data == null){
            $("#allWarning").html("");
            $("#cityWarning").html("");
        }else{
            var city = $("#cityListWaterProject").find("option:selected").text();
            if(city == "广东省"){
                waterProjectWarningAll("allWarning",data);
                waterProjectWarningCityAll("cityWarning",data);
            }else{
                waterProjectWarningAll("allWarning",data);
                waterProjectWarningCity("cityWarning",data);
            }
        }
    });
}

//潮位过程图显示、隐藏、位置
function waterProjectTideProduceShow(stationList, left, top, lon, lat) {
    //var typhoonNumber = parseInt($("#typhoonSelectWater").find("option:selected").val());
    //var typhoonNumber = 201907;
    var typhoonNumber = parseInt($(".waterProjectSimialirityItemClick").find(".simialirity-num").text());
    if(typhoonNumber == "" || typhoonNumber == null || typhoonNumber == undefined){

    }else{
        $ajax('/web/station/chart/history', { 'typhoonNumber': typhoonNumber, 'stationList': stationList }, function (res) {
            var data = res.data;
            //console.log(data);
            $("#waterProjectTideProducePop").show();
            $("#waterProjectTideProducePop").css({
                "left": left,
                "top": top
            });
            $("#waterProjectTideProduceLonLat").text(lon.toFixed(2) + '；' + lat.toFixed(2));
            if (data.length == 0) {
                $("#waterProjectTideProduce").html("");
            } else {
                waterProjectTideProduce("waterProjectTideProduce",data[0]);
            }
        });
    }
}
//waterProjectTideProduceShow([81204900], 500, 200, 123.36, 23.36);
function waterProjectTideProduceHide() {
    $("#waterProjectTideProducePop").hide();
}
function waterProjectTideProducePosition(left, top) {
    $("#waterProjectTideProducePop").css({
        "left": left,
        "top": top
    });
}
//潮位信息弹窗显示、隐藏、位置
function waterProjectTideInfoShowLevelOne(left, top, name, time, waterLevel) {
    if(waterLevel == "" || waterLevel == null || waterLevel == undefined){
        waterLevel = "-";
    }else{
        waterLevel = waterLevel;
    }
    if(time == "" || time == null || time == undefined){
        time = "-";
    }else{
        time = new Date(time).Format("MM月dd日 hh:mm");
    }
    var htmlInfo = `<div class="waterProjectTidePop waterProjectTidePopLevelOne" data-id="` + name +`">
        <h3>` + name + `</h3>
        <div class="waterProjectTideList">
            <div class="waterProjectTideItem">
                <span>最高水位</span>
                <span class="waterProjectTideItemNum">` + waterLevel + `</span>
            </div>
            <div class="waterProjectTideItem">
                <span>发生时间</span>
                <span class="waterProjectTideItemTime">` + time + `</span>
            </div>
        </div>
    </div>`;
    $("body").append(htmlInfo);
    $(".waterProjectTidePop").css({
        "left": left,
        "top": top
    });
}
function waterProjectTideInfoHideLevelOne() {
    $(".waterProjectTidePopLevelOne").hide();
}
function waterProjectTideInfoShowLevelTwo(left, top, name, time, waterLevel) {
    if(waterLevel == "" || waterLevel == null || waterLevel == undefined){
        waterLevel = "-";
    }else{
        waterLevel = waterLevel;
    }
    if(time == "" || time == null || time == undefined){
        time = "-";
    }else{
        time = new Date(time).Format("MM月dd日 hh:mm");
    }
    var htmlInfo = `<div class="waterProjectTidePop waterProjectTidePopLevelTwo" data-id="` + name +`">
        <h3>` + name + `</h3>
        <div class="waterProjectTideList">
            <div class="waterProjectTideItem">
                <span>最高水位</span>
                <span class="waterProjectTideItemNum">` + waterLevel + `</span>
            </div>
            <div class="waterProjectTideItem">
                <span>发生时间</span>
                <span class="waterProjectTideItemTime">` + time + `</span>
            </div>
        </div>
    </div>`;
    $("body").append(htmlInfo);
    $(".waterProjectTidePop").css({
        "left": left,
        "top": top
    });
}
function waterProjectTideInfoHideLevelTwo() {
    $(".waterProjectTidePopLevelTwo").hide();
}
function waterProjectTideInfoShowLevelThree(left, top, name, time, waterLevel) {
    if(waterLevel == "" || waterLevel == null || waterLevel == undefined){
        waterLevel = "-";
    }else{
        waterLevel = waterLevel;
    }
    if(time == "" || time == null || time == undefined){
        time = "-";
    }else{
        time = new Date(time).Format("MM月dd日 hh:mm");
    }
    var htmlInfo = `<div class="waterProjectTidePop waterProjectTidePopLevelThree" data-id="` + name +`">
        <h3>` + name + `</h3>
        <div class="waterProjectTideList">
            <div class="waterProjectTideItem">
                <span>最高水位</span>
                <span class="waterProjectTideItemNum">` + waterLevel + `</span>
            </div>
            <div class="waterProjectTideItem">
                <span>发生时间</span>
                <span class="waterProjectTideItemTime">` + time + `</span>
            </div>
        </div>
    </div>`;
    $("body").append(htmlInfo);
    $(".waterProjectTidePop").css({
        "left": left,
        "top": top
    });
}
function waterProjectTideInfoHideLevelThree() {
    $(".waterProjectTidePopLevelThree").hide();
}
function waterProjectTideInfoShowLevelFour(left, top, name, time, waterLevel) {
    if(waterLevel == "" || waterLevel == null || waterLevel == undefined){
        waterLevel = "-";
    }else{
        waterLevel = waterLevel;
    }
    if(time == "" || time == null || time == undefined){
        time = "-";
    }else{
        time = new Date(time).Format("MM月dd日 hh:mm");
    }
    var htmlInfo = `<div class="waterProjectTidePop waterProjectTidePopLevelFour" data-id="` + name +`">
        <h3>` + name + `</h3>
        <div class="waterProjectTideList">
            <div class="waterProjectTideItem">
                <span>最高水位</span>
                <span class="waterProjectTideItemNum">` + waterLevel + `</span>
            </div>
            <div class="waterProjectTideItem">
                <span>发生时间</span>
                <span class="waterProjectTideItemTime">` + time + `</span>
            </div>
        </div>
    </div>`;
    $("body").append(htmlInfo);
    $(".waterProjectTidePop").css({
        "left": left,
        "top": top
    });
}
function waterProjectTideInfoHideLevelFour() {
    $(".waterProjectTidePopLevelFour").hide();
}
function waterProjectTideInfoPosition(left, top, index) {
    $(".waterProjectTidePop").eq(index).css({
        "left": left,
        "top": top
    });
}

//站点预测数据超警信息
function waterProjectWarningData(userId, areaId) {
    var params = {
        "userId": userId,
        "areaId": parseInt(areaId)
    }
    $ajax('/web/station/topic/predictWarnInfo', params, function(res){
        //console.log(res);
        var data = res.data;
        if(data == "" || data == undefined || data == null){
            $("#waterStationAll").html("");
            $("#waterStationCity").html("");
        }else{
            var city = $("#cityListWaterStation").find("option:selected").text();
            if(city == "广东省"){
                waterStationWarningAll("waterStationAll",data);
                waterStationWarningCityAll("waterStationCity",data);
            }else{
                waterStationWarningAll("waterStationAll",data);
                waterStationWarningCity("waterStationCity",data);
            }
        }
    });
}

//站点预测数据水位过程曲线
function waterStationProduceChartData(userId, areaId) {
    var params = {
        "userId": userId,
        "areaId": parseInt(areaId)
    }
    $ajax('/web/station/topic/waterLevelProcess', params, function (res) {
        //console.log(res);
        $(".waterStationInfoChart").html("");
        var data = res.data.stationList;
        if(data.length == 0){
            $(".waterStationInfoChart").html("");
        }else{
            for(var i=0;i<data.length;i++){
                var chartListBox = document.createElement('div');
                chartListBox.setAttribute('id', 'waterStationChartStatistic' + i);
                chartListBox.setAttribute('class', 'waterStationChartStatistic');
                chartListBox.setAttribute('style', 'width: 415px;height: 240px;');
                $(".waterStationInfoChart").append(chartListBox);
                stationWaterProduce('waterStationChartStatistic' + i, data[i]);
            }
        }
    });
}

//站点预测数据统计列表
function waterStationStatisticData(userId, areaId) {
    var params = {
        "userId": userId,
        "areaId": parseInt(areaId)
    }
    $ajax('/web/station/topic/statistics/list', params, function (res) {
        //console.log(res);
        var dataTable = res.data.stationList;
        if(dataTable.length == 0){
            $(".waterStationTableBody").html("");
        }else{
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
                    tableHtml = tableHtml + `<div class="waterStationTableList">
                        <div class="waterStationTableName">`+ dataTable[i].stationName + `</div>
                        <div class="waterStationTableListItem">
                            <div class="waterStationTableItem">
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
                        if (tableLength[j].time == "" || tableLength[j].time == undefined || tableLength[j].time == null) {
                            tableLength[j].time = '-';
                        } else {
                            tableLength[j].time = new Date(tableLength[j].time).Format("MM月dd日hh:mm");
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
                        trHtml = trHtml + `<div class="waterStationTableItem">
                            <span>`+ tableLength[j].time + `</span>
                            <span>`+ tableLength[j].maxPredictLevel + `</span>
                            <span>`+ dataTable[i].warnLevel + `</span>
                            <span>`+ tableLength[j].distanceWarn + `</span>
                            <span>`+ tableLength[j].maxWaterLevel + `</span>
                        </div>`;
                    }
                    tableHtml = tableHtml + `<div class="waterStationTableList">
                        <div class="waterStationTableName">`+ dataTable[i].stationName + `</div>
                        <div class="waterStationTableListItem">`+ trHtml + `</div>
                    </div>`;
                }
            }
            $(".waterStationTableBody").html(tableHtml);
        }
    });
}

//站点预测数据过程图显示、隐藏、位置
function waterStationProduceDataShow(stationNumber, left, top) {
    var params = {
        "userId": userId,
        "stationNumber": parseInt(stationNumber)
    }
    $ajax('/web/station/topic/stationProcess', params, function(res){
        //console.log(res);
        data = res.data;
        $("#forecastPlayStationProducePop").show();
        $("#forecastPlayStationProducePop").css({
            "left": left,
            "top": top
        });
        if(data == "" || data == undefined || data == null){
            $("#waterStationLonAndLat").html("");
            $("#waterStationTimeRange").html("");
            $("#waterStationMaxHeight").html("");
            $("#forecastPlayStationProduce").html("");
        }else{
            if(data.warnStartTime == "" || data.warnStartTime == undefined || data.warnStartTime==null){
                data.warnStartTime = '';
            }
            if(data.warnEndTime == "" || data.warnEndTime == undefined || data.warnEndTime==null){
                data.warnEndTime = '';
            }
            if(data.warnMaxLevel == "" || data.warnMaxLevel == undefined || data.warnMaxLevel==null){
                data.warnMaxLevel = '-';
            }else{
                data.warnMaxLevel = data.warnMaxLevel + 'm';
            }
            $("#waterStationLonAndLat").html(data.lng + ' ；' +data.lat);
            $("#waterStationTimeRange").html(timeStampTurnTime(data.warnStartTime) + '-' + timeStampTurnTime(data.warnEndTime));
            $("#waterStationMaxHeight").html(data.warnMaxLevel);
            forecastPlayStationProduce("forecastPlayStationProduce",data);
        }
    });
}
function waterStationProduceDataHide() {
    $("#forecastPlayStationProducePop").hide();
}
function waterStationProduceDataPosition(left, top) {
    $("#forecastPlayStationProducePop").css({
        "left": left,
        "top": top
    });
}

//预报播放模块风暴潮预报过程图显示、隐藏、位置
function forecastPlayStormProduceShow(left, top, lon, lat) {
    var params = {
        "lonPoint": lon,
        "latPoint": lat
    }
    $ajax('/web/opendap/netcdf/storm/forecast/big/screen/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastPlayStormProducePop").show();
        $("#forecastPlayStormProducePop").css({
            "left": left,
            "top": top
        });
        $("#forecastPlayStormLonAndLat").text(lon.toFixed(2) + ' ；' + lat.toFixed(2));
        if(data.length == 0){
            $("#forecastPlayStormProduce").html("");
        }else{
            forecastPlayStormProduce("forecastPlayStormProduce",data);
        }
    });
}
function forecastPlayStormProduceHide() {
    $("#forecastPlayStormProducePop").hide();
}
function forecastPlayStormProducePosition(left, top) {
    $("#forecastPlayStormProducePop").css({
        "left": left,
        "top": top
    });
}

//预报播放模块漫堤风险预警过程图显示、隐藏、位置
function forecastPlayDamProduceShow(cityId, dikeId, left, top, lon, lat) {
    var params = {
        "agency": parseInt(1),
        "cityId":parseInt(cityId),
        "dikeId":parseInt(dikeId),
		"warnType":parseInt(1)
    }
    $ajax('/web/opendap/netcdf/dike/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastPlayDamProducePop").show();
        $("#forecastPlayDamProducePop").css({
            "left": left,
            "top": top
        });
        $("#forecastPlayDamLonAndLat").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.dikeName == "" || data.dikeName == null || data.dikeName == undefined){
            $(".forecastPlayDamName").html("");
        }else{
            $(".forecastPlayDamName").html(data.dikeName);
        }
        if(data.defenseStandards == "" || data.defenseStandards == null || data.defenseStandards == undefined){
            $(".forecastPlayDamStandar").html("");
        }else{
            $(".forecastPlayDamStandar").html(data.defenseStandards);
        }
        if(data.length == 0){
            $("#forecastPlayDamProduce").html("");
        }else{
            forecastPlayDamProduce("forecastPlayDamProduce",data);
        }
    });
}
function forecastPlayDamProduceHide() {
    $("#forecastPlayDamProducePop").hide();
}
function forecastPlayDamProducePosition(left, top) {
    $("#forecastPlayDamProducePop").css({
        "left": left,
        "top": top
    });
}

//预报播放模块最大增水预报过程图显示、隐藏、位置
function forecastPlayWarningProduceShow(number, left, top, lon, lat) {
    var params = {
        "number": parseInt(number)
    }
    $ajax('/web/opendap/netcdf/storm/forecast/big/screen/warn/tide/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastPlayWarnProducePop").show();
        $("#forecastPlayWarnProducePop").css({
            "left": left,
            "top": top
        });
        $("#orecastPlayWarnLonAndLat").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.length == 0){
            $("#forecastPlayWarnProduce").html("");
        }else{
            forecastPlayWarnProduce("forecastPlayWarnProduce",data);
        }
    });
}
function forecastPlayWarningProduceHide() {
    $("#forecastPlayWarnProducePop").hide();
}
function forecastPlayWarningProducePosition(left, top) {
    $("#forecastPlayWarnProducePop").css({
        "left": left,
        "top": top
    });
}

//预报播放模块最高水位过程图显示、隐藏、位置
function forecastPlayMaxWaterProduceShow(left, top, lon, lat) {
    var params = {
        "lonPoint": parseInt(lon),
        "latPoint": parseInt(lat)
    }
    $ajax('/web/opendap/netcdf/storm/forecast/big/screen/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastPlayWaterProducePop").show();
        $("#forecastPlayWaterProducePop").css({
            "left": left,
            "top": top
        });
        $("#forecastPlayWaterLonAndLat").text(lon.toFixed(2) + ' ；' + lat.toFixed(2));
        if(data.length == 0){
            $("#forecastPlayWaterProduce").html("");
        }else{
            forecastPlayWaterProduce("forecastPlayWaterProduce",data);
        }
    });
}
function forecastPlayMaxWaterProduceHide() {
    $("#forecastPlayWaterProducePop").hide();
}
function forecastPlayMaxWateProducerPosition(left, top) {
    $("#forecastPlayWaterProducePop").css({
        "left": left,
        "top": top
    });
}

//预报播放模块最大漫堤风险过程图显示、隐藏、位置
function forecastPlayMaxDamProduceShow(number, left, top, lon, lat) {
    var params = {
        "number": parseInt(number)
    }
    $ajax('/web/opendap/netcdf/storm/forecast/big/screen/dyke/tide/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastPlayDamMaxProducePop").show();
        $("#forecastPlayDamMaxProducePop").css({
            "left": left,
            "top": top
        });
        $("#forecastPlayDamMaxLonAndLat").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.length == 0){
            $("#forecastPlayDamMaxProduce").html("");
        }else{
            forecastPlayDamMaxProduce("forecastPlayDamMaxProduce",data);
        }
    });
}
function forecastPlayMaxDamProduceHide() {
    $("#forecastPlayDamMaxProducePop").hide();
}
function forecastPlayMaxDamProducePosition(left, top) {
    $("#forecastPlayDamMaxProducePop").css({
        "left": left,
        "top": top
    });
}

//预报播放模块防洪水位预警过程图显示、隐藏、位置
function forecastPlayFloodProduceShow(cityId, dikeId, left, top, lon, lat) {
    var params = {
        "agency": parseInt(1),
        "cityId":parseInt(cityId),
        "dikeId":parseInt(dikeId),
		"warnType":parseInt(2)
    }
    $ajax('/web/opendap/netcdf/dike/chart', params, function (res) {
        //console.log(res);
        var data = res.data;
        $("#forecastPlayFloodProducePop").show();
        $("#forecastPlayFloodProducePop").css({
            "left": left,
            "top": top
        });
        $("#forecastPlayDamLonAndLat").text(lon.toFixed(2) + '  ； ' + lat.toFixed(2));
        if(data.dikeName == "" || data.dikeName == null || data.dikeName == undefined){
            $("#forecastPlayFloodProducePop").find(".forecastPlayFloodName").html("");
        }else{
            $("#forecastPlayFloodProducePop").find(".forecastPlayFloodName").html(data.dikeName);
        }
        if(data.defenseStandards == "" || data.defenseStandards == null || data.defenseStandards == undefined){
            $("#forecastPlayFloodProducePop").find(".forecastPlayFloodStandar").html("");
        }else{
            $("#forecastPlayFloodProducePop").find(".forecastPlayFloodStandar").html(data.defenseStandards);
        }
        if(data.length == 0){
            $("#forecastPlayFloodProduce").html("");
        }else{
            forecastPlayFloodProduce("forecastPlayFloodProduce",data);
        }
    });
}
function forecastPlayFloodProduceHide() {
    $("#forecastPlayFloodProducePop").hide();
}
function forecastPlayFloodProducePosition(left, top) {
    $("#forecastPlayFloodProducePop").css({
        "left": left,
        "top": top
    });
}


//堤坝预警、最大增水预报、防洪水位预警时间轴
function forecastTimeControl(type) {
    viewerTy.clockViewModel.shouldAnimate = true;
    var params = {
        "type": parseInt(type)
    }
    // $ajax('/web/opendap/netcdf/storm/forecast/big/screen/time', params, function (res) {
    //     //console.log(res); 
    //     var data = res.data;
    //     var startTime = data.startTime;
    //     var endTime = data.endTime;
    //     changeTimeLineText(startTime,endTime);
    //     viewerTy.timeline.container.style.visibility = 'visible'
    //     viewerTy.timeline.container.style.display = 'block'
    //     $('#timelineBar').show();
    //     $('#typhoonContaner').show();
    //     viewerTy.clockViewModel.multiplier = 2500
    //     viewerTy.clockViewModel.shouldAnimate = false;
    //     // if($(".forecastPlayListClick").text() == "漫堤风险预警"){
    //     //     setNormalEmbankmentLineByTime(1,startTime,'',1);
    //     // }else if($(".forecastPlayListClick").text() == "防洪水位预警"){
    //     //     setNormalEmbankmentLineByTime(1,startTime,'',2);
    //     // }
    //     stopTime = endTime;
	// 	localStorage.setItem('startTime',startTime);
    // });
    var typhoonCurrentNumber = $("#typhoonSelectWater").find("option:selected").val();
    getTyphoonDataTimeByNumber(typhoonCurrentNumber,function(res){
        //console.log(res);
        var data = res.data;
        var startTime = data.ncStartTime;
        var endTime = data.ncEndTime;
        changeTimeLineText(startTime,endTime);
        viewerTy.timeline.container.style.visibility = 'visible'
        viewerTy.timeline.container.style.display = 'block'
        $('#timelineBar').show();
        $('#typhoonContaner').show();
        viewerTy.clockViewModel.multiplier = 2500
        viewerTy.clockViewModel.shouldAnimate = false;
        // if($(".forecastPlayListClick").text() == "漫堤风险预警"){
        //     setNormalEmbankmentLineByTime(1,startTime,'',1);
        // }else if($(".forecastPlayListClick").text() == "防洪水位预警"){
        //     setNormalEmbankmentLineByTime(1,startTime,'',2);
        // }
        stopTime = endTime;
		localStorage.setItem('startTime',startTime);
    });

    
}

//降水时间列表
function rainTimeList(number){
    $ajax('/web/station/rain/time',{ "number" : parseInt(number) },function(res){
        //console.log(res);
        var dataJson = res.data;
        if(dataJson.length == 0 || dataJson == "" || dataJson == null || dataJson ==undefined){
            var rainHtml = '<div class="rainTimeItem">'+
                '<i class="rainTimeRadioNo"></i>'+
                '<i class="rainTimeRadioYes"></i>'+
                '<span data-id="">累计降水</span>'+
            '</div>';
            $(".rainTimeList").html(rainHtml);
        }else{
            var rainHtml = '<div class="rainTimeItem">'+
                '<i class="rainTimeRadioNo"></i>'+
                '<i class="rainTimeRadioYes"></i>'+
                '<span data-id="">累计降水</span>'+
            '</div>';
            for(var i=0;i<dataJson.length;i++){
                rainHtml = rainHtml + '<div class="rainTimeItem">'+
                    '<i class="rainTimeRadioNo"></i>'+
                    '<i class="rainTimeRadioYes"></i>'+
                    '<span data-id="'+dataJson[i]+'">'+new Date(dataJson[i]).Format("yyyy年MM月dd日")+'</span>'+
                '</div>';
            }
            $(".rainTimeList").html(rainHtml);
        }
        //降水时间选择
        $(".rainTimeItem").click(function(){
            var time = $(this).find("span").attr("data-id");
            $(this).addClass("rainRadioClick");
            $(this).siblings().removeClass("rainRadioClick");
            removeRainfallLayer();//清除雨情
            if(time == "" || time == null ||  time == undefined){
                rainfallList(number);
            }else{
                rainfallListTime(number,time);
            }
        });
        $(".rainTimeItem").eq(0).trigger("click");
    });
}

//雨量列表
function rainfallListTime(number,time){
    var params = {
        "number":number,
        "time":parseInt(time)
    }
    $ajax('/web/station/rain/info',params,function(res){
        //console.log(res);
        var dataJson = res.data;
        loadRainfall(dataJson);
    });
}
function rainfallList(number){
    var params = {
        "number":number
    }
    $ajax('/web/station/rain/info',params,function(res){
        //console.log(res);
        var dataJson = res.data;
        loadRainfall(dataJson);
    });
}

//雨量图例数值
function railfallLegendNum(min,max){
    var railfallNumHtml="<span>"+min+"</span><span>"+max+"</span>";
    $(".forecastNumWater").html(railfallNumHtml);
}

//获取台风插值json数据
function getTyphoonDataByInterval(number,fn){
    var timeOut = setTimeout(function () {
        $('.loading').show();
    }, 500)
    var token = localStorage.getItem('token');
    $.ajax({
        url: hqxurl + "/web/typhoon/interpolation/path/" + number,
        type: 'get',
        contentType: 'application/json',
        timeout: 3000,
        headers: {
            'Content-Type': 'application/json',
            'token':token,
        },
        success: function (res) {
            if (res.code === 200) {
                if (fn) { fn(res) }
            } else if (res.code == 100003) {//token 过期
                window.location.href = '../login.html'
                localStorage.clear();
            } else {//错误信息
                toastr.error(res.msg);
            }
        },
        error: function (err) {
            throw err
        },
        complete: function () {
            $('.loading').hide();
            clearTimeout(timeOut)
        }
    });
}