function resize() {
    var width = $(window).width();
    var height = $(window).height();
    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;
    $(".iframe-box").css("height", (height - 70) + 'px');
    $(".pageMenu").css("height", (height - 70) + 'px');
    //$("#cesiumContainer").css("height", (height - 70) + 'px');
    //台风详细信息自适应
    $(".pageMenu-info").css("height", (height - 740) + 'px');
    $(".pageMenu-table-info tbody").css("height", (height - 778) + 'px');
    //相似台风自适应
    $(".similarityBox").css("height", (height - 240) + 'px');
    $(".similarityContent").css("height", (height - 240) + 'px');
    $(".similarity-info").css("height", (height - 775) + 'px');
    $(".similarity-table-info tbody").css("height", (height - 813) + 'px');
    //站点曲线图
    $(".stationChart").css("height", (height - 240) + 'px');
    $(".stationChartContent").css("height", (height - 240) + 'px');
    //添加相似台风弹窗
    $(".similarity-addPop").css({ left: (width - 411) / 2 + 'px', top: (height - 473) / 2 + 'px' });
    //历史增水自适应高度
    $(".historySurge-list").css("height", (height - 360) + 'px');
    //预报播放列表自适应高度
    $(".waterProject-list").css("height", (height - 420) + 'px');

    //预报订正统计检验弹窗
    $(".statistic-test").css({ left: (width - 941) / 2 + 'px', top: (height - 686) / 2 + 'px' });
    //预报订正相似台风增水曲线、实测数据曲线图
    $(".forecastChartList").css("height", (height - 240) + 'px');
    $(".forecastChartListContent").css("height", (height - 240) + 'px');
    //历史播报历史台风站点预报列表自适应高度
    $(".waterProject-site-list").css("height", (height - 810) + 'px');
    //历史播报自定义台风站点预报列表自适应高度
    $(".waterProject-site-custom").css("height", (height - 770) + 'px');
    //水情专题头部阴影
    $(".titleShadow").css("width", width);
    //水情专题菜单栏
    $(".menuMain").css({ left: (width - 620) / 2 + 'px', top: (height - 410) / 2 + 'px' });
    //水情专题统计列表
    $(".waterStationTableBody").css("height", height * 0.41 + 'px');
    //水情专题雨晴信息
    $(".rainSunshine").css("height", height * 0.95 + 'px');
    $(".rainTable").css("height", height * 0.55 + 'px');
    $(".rainTable tbody").css("height", (height * 0.55 - 38)+ 'px');
    //风暴潮场景库站点预报列表
    $(".stormScene-site-list").css("height", (height - 650) + 'px');
    $(".stormScene-site-listSelf").css("height", (height - 600) + 'px');
    window.onresize = function () {
        //$("#cesiumContainer").css("height", (height - 70) + 'px');
        $(".iframe-box").css("height", (height - 70) + 'px');
        $(".pageMenu").css("height", (height - 70) + 'px');
        //台风详细信息自适应
        $(".pageMenu-info").css("height", (height - 740) + 'px');
        $(".pageMenu-table-info tbody").css("height", (height - 778) + 'px');
        //相似台风自适应
        $(".similarityBox").css("height", (height - 240) + 'px');
        $(".similarityContent").css("height", (height - 240) + 'px');
        $(".similarity-info").css("height", (height - 775) + 'px');
        $(".similarity-table-info tbody").css("height", (height - 813) + 'px');
        //站点曲线图
        $(".stationChart").css("height", (height - 240) + 'px');
        $(".stationChartContent").css("height", (height - 240) + 'px');
        //添加相似台风弹窗
        $(".similarity-addPop").css({ left: (width - 411) / 2 + 'px', top: (height - 473) / 2 + 'px' });
        //历史增水自适应高度
        $(".historySurge-list").css("height", (height - 360) + 'px');
        //预报播放列表自适应高度
        $(".waterProject-list").css("height", (height - 420) + 'px');
        //预报订正统计检验弹窗
        $(".statistic-test").css({ left: (width - 941) / 2 + 'px', top: (height - 686) / 2 + 'px' });
        //预报订正相似台风增水曲线、实测数据曲线图
        $(".forecastChartList").css("height", (height - 240) + 'px');
        $(".forecastChartListContent").css("height", (height - 240) + 'px');
        //历史播报历史台风站点预报列表自适应高度
        $(".waterProject-site-list").css("height", (height - 810) + 'px');
        //历史播报自定义台风站点预报列表自适应高度
        $(".waterProject-site-custom").css("height", (height - 770) + 'px');
        //水情专题头部阴影
        $(".titleShadow").css("width", width);
        //水情专题菜单栏
        $(".menuMain").css({ left: (width - 620) / 2 + 'px', top: (height - 410) / 2 + 'px' });
        //水情专题统计列表
        $(".waterStationTableBody").css("height", height * 0.41 + 'px');
        //水情专题雨晴信息
        $(".rainSunshine").css("height", height * 0.95 + 'px');
        $(".rainTable").css("height", height * 0.55 + 'px');
        $(".rainTable tbody").css("height", (height * 0.55 - 38)+ 'px');
        //风暴潮场景库站点预报列表
        $(".stormScene-site-list").css("height", (height - 650) + 'px');
        $(".stormScene-site-listSelf").css("height", (height - 600) + 'px');
    }
}

var menuStatus; //导航菜单状态

$(function () {
    calculateTime();
    resize();
    // 登录之后根据角色判断功能
    $('.nav-other-selectSmall').html(localStorage.getItem('cityName'));
    $('.nav-other-select').html(localStorage.getItem('username'));
    if (localStorage.getItem('roleId') != 0) {
        $('#userMangerment').hide();
        $('#systemLog').hide();
    }
    //导航切换
    $(".nav-list-item").click(function () {
        var index = $(this).index();
        var text = $(this).text();
        $(this).addClass("nav-list-itemClick");
        $(this).siblings().removeClass("nav-list-itemClick");
        $(".pageMenuList").eq(index).show();
        $(".pageMenuList").eq(index).siblings().hide();
        $(".statistic-test").hide();
        $(".userControl").hide();
        $(".userContainer").hide();
        $(".typhone_info").hide();
        $(".typhoon-calculate-btn").hide();
        $(".forecastChartList").hide();
        removeStationList();//清除站点
        deleteEmbankmentLine();//删除堤线
        $(".pageMenu").removeClass("pageMenuRemove");
        $('.typhoonInfo-legend').hide();
        $('.forecast').hide();
        $('.layui-icon-triangle-d').addClass('rotate')
        $(".menuOpenClose").show();
        if ($('.typhoonInfo-forecast').css('display') != 'none') {
            $('.typhoon-calculate-exit').click();
        }
        if ($(this).text() == "水情专题大屏") {
            $(".pageMenu").addClass("pageMenuRemove");
            $(".menuOpenClose").hide();
            if (typhoonCurrentNum == "" || typhoonCurrentNum == undefined || typhoonCurrentNum == null) {
                toastr.warning('无实时台风，无法查看！');
                //return;
            } else {
                viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(103.486138, 30.465411, 21000000.0)});
                fullOrExit();
                //站点城市选择
                waterProjectStationCity();
                $("#typhoonSelectWater").html("");
                for (var i = 0; i < typhoonCurrentNum.length; i++) {
                    $("#typhoonSelectWater").append('<option value="' + typhoonCurrentNum[i].number + '">' + typhoonCurrentNum[i].number + '-' + typhoonCurrentNum[i].name + '</option>');
                }
                $("#typhoonSelectWater").find("option").eq(0).attr("selected", true);
                var typhoonCurrentNumber = $("#typhoonSelectWater").find("option:selected").val();
                waterProjectSimialirityListData(typhoonCurrentNumber, true); //获取当前台风的相似台风
                layui.use(['form'], function () {
                    var form = layui.form;
                    form.on('select(typhoonSelectWater)', function (data) {
                        waterProjectSimialirityListData(data.value, false);
                    });
                });
            }
        }
        if (index == 1) {
            loadStationList();
            getStation();
            $('.playContent .layui-anim dd').eq(0).click();
            $(".typhoonInfo").hide();
        }
        if (index != 0) {
            // 清空
            for (var item in typhoonObj) {
                typhoonObj[item].removeTyphoon();
            }
            typhoonObj = {};
            list = [];
            $('.pageMenu-clearBtn').click();
            removeRainfallLayer();//清除雨情
            $(".rainTimeSelectRoute").hide();
            $(".rainTimeItemRoute").eq(0).addClass("rainRadioClick").siblings().removeClass("rainRadioClick");
        }
        if (index == 0) {
            deleteEmbankmentLine();//删除堤线
            $(".pageMenu-title-item").eq(0).click();
            $(".typhoonInfo").show();
            $(".waterLegendInfo").hide();
            $('.pageMenu-body').show();
            $('.pageMenu-title').show();
            $(".similarityBox").hide();
            $('.historySurge').hide();
            $(".stationChart").hide();
            $(".typhoonContaner").hide();
            viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(103.486138, 30.465411, 21000000.0) });
            if (typhoonCurrentNum == "" || typhoonCurrentNum == undefined || typhoonCurrentNum == null) {
                
            }else{
                for(var i=0;i<typhoonCurrentNum.length;i++){
                    var year = ((typhoonCurrentNum[i].number).toString()).slice(0,4);
                    getTyphooonList(year);
                    //$('#yearList').val(year);
                    $("#typhoonYearList").find(".layui-form-select").find(".layui-input").val(year);
                    $("#typhoonYearList").find("dd[lay-value="+year+"]").addClass("layui-this").siblings().removeClass("layui-this");
                }
            }
        }
        if(index != 2){
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
        }
        if(index == 2){
            removeStationList();//清除站点
            deleteEmbankmentLine();//删除堤线
            $(".stormScene-title-item").eq(0).click();
            $("#historyStormSearch").val("");
            $(".stormScene-subTitle .layui-anim dd").eq(0).click();
            $(".stormScene-typhoonBody tr").removeClass("tableCheckClick");
            $(".stormSceneHistorySite").hide();
            $(".stormScene-site-list").html("");
            $(".stormLegend").show();
        }
        menuStatus = text;
        clearPlayContent();
        $("#forecastChartListPop").hide();
        //console.log(menuStatus);
    });
    $(".nav-list-item").eq(0).trigger("click");
    //全屏和退出全屏
    $(document).keydown(function (event) {
        if (event.keyCode == 122) {
            event.preventDefault();
            fullOrExit();
        }
    });
    //左侧菜单显示隐藏
    $(".menuOpenClose").click(function () {
        $(this).toggleClass("menuOpenCloseClick");
        if ($(this).hasClass('menuOpenCloseClick')) {
            $(".pageMenu").animate({ 'left': '-430px' }, 900);
            $(".typhoonInfo").animate({ 'left': '20px' }, 900);
            $(".stormLegend").animate({ 'left': '20px' }, 900);
            $(".waterProjectLegend").animate({ 'left': '20px' }, 900);
            $(this).animate({ 'left': '0' }, 900);
        } else {
            $(".pageMenu").animate({ 'left': '0px' }, 900);
            $(this).animate({ 'left': '430px' }, 900);
            $(".typhoonInfo").animate({ 'left': '450px' }, 900);
            $(".stormLegend").animate({ 'left': '450px' }, 900);
            $(".waterProjectLegend").animate({ 'left': '450px' }, 900);
        }
    });
    // 计算剩余时间
    $('.nav-calculate').hover(function () {
        $(this).find('img').attr('src', 'images/calculate-click.png');
        if (showCalculateBox) {
            $('.calculate-box').fadeIn();
        }
    }, function () {
        $(this).find('img').attr('src', 'images/calculate.png');
        $('.calculate-box').fadeOut();
        // clearInterval(calculateTimer)
        // calculateTimer = null;
    });

    // 切换计算任务列表
    $('.calculate-list-title-item').click(function () {
        //var index = $(this).index();
        $(this).addClass('click').siblings().removeClass('click');
        var taskType;
        if ($(this).text() == "计算任务列表") {
            taskType = 0;
            calculateList(taskType, 1, 9, true);
        } else if ($(this).text() == "计算完成情况") {
            taskType = 1;
            calculateList(taskType, 1, 9, true);
        }
    });
    // 关闭计算任务列表窗口
    $('.calculate-list-box').find('.layui-icon-close').click(function () {
        $('.calculate-list-box-mask').fadeOut();
    });
    // 开启计算任务列表窗口
    $('.nav-calculate').click(function () {
        $('.calculate-list-box-mask').fadeIn();
        $('.calculate-list-title-item').eq(0).trigger("click");
    });

});
//台风计算任务列表
function calculateList(taskType, current, size, open) {
    $ajax('/web/typhoon/calculate/task', { 'taskType': taskType, 'current': current, 'size': size }, function (res) {
        var data = res.data;
        var total = data.total;
        var dataJson = data.records;
        if (dataJson.length == 0) {

        } else {
            var listHtml = '';
            for (var i = 0; i < dataJson.length; i++) {
                var status = '';
                var indexHtml = (current - 1) * size + i;
                indexHtml++;
                if (dataJson[i].module == "0") {
                    dataJson[i].module = "概率圆";
                } else if (dataJson[i].module == "1") {
                    dataJson[i].module = "自定义台风";
                } else if (dataJson[i].module == "2") {
                    dataJson[i].module = "常规预报";
                }
                if (dataJson[i].status == "0") {
                    dataJson[i].status = "等待计算";
                } else if (dataJson[i].status == "1") {
                    dataJson[i].status = "计算中";
                } else if (dataJson[i].status == "2") {
                    dataJson[i].status = "计算完成";
                } else if (dataJson[i].status == "3") {
                    dataJson[i].status = "计算失败";
                } else if (dataJson[i].status == "4") {
                    dataJson[i].status = "计算超时";
                }
                if (dataJson[i].calculationProgress) {
                    status = dataJson[i].status + '\xa0' + dataJson[i].calculationProgress + '%'
                } else {
                    status = dataJson[i].status
                }
                var workUnit
                if(dataJson[i].workUnit){
                    workUnit=dataJson[i].workUnit
                }else{
                    workUnit=''
                }
                listHtml = listHtml + '<div class="calculate-list-item" data-id="' + dataJson[i].id + '">' +
                    '<span>' + indexHtml + '</span>' +
                    '<span>' + workUnit + '</span>' +
                    '<span>' + dataJson[i].account + '</span>' +
                    '<span>' + dataJson[i].module + '</span>' +
                    '<span>' + timeStampTurnTime(dataJson[i].createTime) + '</span>' +
                    '<span>' + status + '</span>' +
                    '<span class="calculate-top" style="display:none">' +
                    '<i class="calculate-top-icon"></i>置顶' +
                    '</span>' +
                    '</div> ';
            }
            $('.calculate-list-item-box').html(listHtml);
        }
        //列表分页
        if (open) {
            layui.use('laypage', function () {
                var laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: 'calculatePage',
                    theme: '#3850D5',
                    prev: '<i class="layui-icon layui-icon-prev"></i> ',
                    next: '<i class="layui-icon layui-icon-next"></i> ',
                    count: total, //数据总数，从服务端得到
                    limit: size,
                    curr: current,
                    jump: function (obj, first) {
                        current = obj.curr;
                        //首次不执行
                        if (!first) {
                            //do something
                            calculateList(taskType, current, size, false);
                        }
                    }
                });
            });
        }
        //列表悬浮出现置顶操作（计算完成列表无置顶功能）
        if (taskType == "1") {

        } else {
            if (localStorage.getItem('roleId') != 2) {
                $('.calculate-list-item').each(function () {
                    $(this).hover(function () {
                        $(this).find('.calculate-top').show();
                    }, function () {
                        $(this).find('.calculate-top').hide();
                    })
                });
            }
        }
        //列表置顶功能
        $(".calculate-top").click(function () {
            var taskId = $(this).parent().attr("data-id");
            var index = $(this).parent().index();
            $ajax('/web/typhoon/task/top', { 'taskId': taskId }, function (res) {
                if (res.code == "200") {
                    calculateList(taskType, current, size, true);
                } else {

                }
            });
        });
    });
}
