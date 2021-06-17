var list = [];//台风选中列表
var similarityList = [];//相似台风选中列表
var similaritySearchList = [];
var typhoonObj = {};//台风绘制
var similarityListTyphoonObj = {};//相似台风绘制
var typhoonNumber = '';
var stationNumberListHistorySurge = [];//站点列表编号
var stationNameListHistorySurge = [];//站点列表名称
var selectDataHistorySurge = [];//站点列表选择
var stationChartData = [];//站点统计图数据
var stationTyphoon = '';//站点所需台风编号
var stationTyphoonObj = {};//站点模块小窗口台风绘制
var similarityListSelect = [];//历史增水
var typhoonPathMenu;  // 判断台风路径模块的菜单选择
var typhoonPointStatus;  //判断台风点的操作状态
var forecastPathStatus = { 
    maindland: true,
    usa: true,
    japan: true,
    taiwan: true 
};
// 计算剩余时间
var calculateTimer = null;
var showCalculateBox;
function calculateTime() {
    $ajax('/web/typhoon/user/task/status', {}, function (res) {
        if (!res.data.hasTyphoonTask) {
            return
        } else {
            if (res.data.hasProcessTask) {
                showCalculateBox = true
                $('.calculationProgress').html(res.data.calculationProgress + '%');
                $('.calculate-time').html(res.data.laveMinute);
                layui.use('element', function () {
                    var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
                    $('.layui-progress-bar').attr('lay-percent', res.data.calculationProgress + '%');
                    element.init();
                    element.progress('calculationProgressPercent', res.data.calculationProgress + '%');
                });
                clearInterval(calculateTimer)
                calculateTimer = null;
                calculateTimer = setInterval(function () {
                    calculateTime();
                }, 60000)
            } else {
                if (res.data.taskId && res.data.taskId == res.data.lastSuccessTaskId) {
                    layui.use('element', function () {
                        var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
                        $('.layui-progress-bar').attr('lay-percent', '100%');
                        element.init();
                        element.progress('calculationProgressPercent', '100%');
                    });
                    $('.calculationProgress').html('100%');
                    $('.calculate-time').html('0');
                    clearInterval(calculateTimer)
                    calculateTimer = null;
                }
            }
        }
    });
}
/**
 * 绘制台风
 * @param number
 * @param fn
 */
function getTyphoonDataByNumber(number,fn){
    var timeOut = setTimeout(function () {
        $('.loading').show();
    }, 500)
    var token = localStorage.getItem('token');
    $.ajax({
        url: hqxurl + "/web/typhoon/path/" + number,
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
// function getTyphoonDataByNumber(number, fn) {
//     var listData = {
//         number: number
//     }
//     var timeNow = viewer.clockViewModel.currentTime
//     timeNow = UtcTimeGBTime(timeNow)
//     listData.currentTime = timeNow
//     listData.interval = 1000
//     $ajax('/web/typhoon/path/by/number', listData, function (res) {
//         if (fn) { fn(res) }
//     })
// }
function getTyphoonDataByMultiplier(multiplier, fn){
    var params = {
        "multiplier": multiplier
    }
    $ajax('/web/typhoon/path', params, function (res) {
        if (fn) { fn(res) }
    });
}

//获取台风对应的预报时间轴开始结束时间
function getTyphoonDataTimeByNumber(number,fn){
    var timeOut = setTimeout(function () {
        $('.loading').show();
    }, 500)
    var token = localStorage.getItem('token');
    $.ajax({
        url: hqxurl + "/web/typhoon/forecast/timeline/" + number,
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

/**
 * 获取台风点位信息
 * @param number
 * @param pointId
 * @param fn
 */
function getTyphoonPointData(number, pointId, fn) {
    var listData = {
        number: number,
        pointId: pointId
    }
    $ajax('/web/typhoon/point/info', listData, function (res) {
        if (fn) { fn(res) }
        if (res.data.hasHistoryForecast) {
            $('.historyBroadcast_btn').show();
        } else {
            $('.historyBroadcast_btn').hide();
        }
        if (res.data.hasSurgeWater) {
            $('.historySurge_btn').show();
        } else {
            $('.historySurge_btn').hide();
        }
        if ($(".nav-list-item").eq(3).hasClass("nav-list-itemClick") || $(".nav-list-item").eq(2).hasClass("nav-list-itemClick")) {
            $('.typhone_btn').hide();
        } else {

        }
    })
}

// 获取台风年份
function getTyphoonYearList() {
    var yeah = new Date().getFullYear();
    var section = yeah - 1945
    var yearList = [];
    yearList = [];
    for (var i = 0; i <= section; i++) {
        yearList.push(yeah--);
    }
    for (var j = 0; j < yearList.length; j++) {
        $('#yearList').append('<option value=' + yearList[j] + '>' + yearList[j] + '</option>')
    }
    layui.use(['form'], function () {
        var form = layui.form;
        form.on('select(year)', function (data) {
            // 选中日期操作
            getTyphooonList(data.value - 0);
        });
    });
}
// /获取台风点位数据
function getTyphoonData(number, body) {
    $ajax('/web/typhoon/point/list', { 'number': number }, function (res) {
        var data = res.data;
        $('.' + body + '-info-list').html('');
        for (var i = 0; i < data.length; i++) {
            $('.' + body + '-info-list').append(
                '<tr>' +
                '<td>' + timeStampTurnTime(data[i].time) + '</td>' +
                '<td>' + data[i].power + '</td>' +
                '<td>' + data[i].speed + '</td>' +
                '</tr>'
            )
        }
    })
}

// 隐藏台风面板内容
function hideTyphoonContent() {
    if (list.length === 0) {
        $('.pageMenu-subTxt').hide();
        $('.pageMenu-info').hide();
        $('.pageMenu-operate').hide();
        $('.pageMenu-select-box').empty()
        $('.typhoon-calculate-control').hide();
    }
    if (similarityList.length === 0) {
        $('.similarity-subTxt').hide();
        $('.similarity-info').hide();
    }
    $('#speed').val('');
    $('#pressure').val('');
    $('#timeList').empty();
    $('.typhoon-power-select-box').find('.typhoon-power-select-item').eq(0).click();
}




// 获取台风列表
function getTyphooonList($yearList, $search) {
    var params = {};
    if ($yearList) {
        params['year'] = $yearList
    }
    if ($search) {
        params['keyword'] = $search
    }
    $ajax('/web/typhoon/search/list', params, function (res) {
        var tbody = $('.typhoon-tbody');
        tbody.html('');
        if (res.data) {
            var data = res.data;
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    tbody.append(
                        '<tr>' +
                        '<td data-isActive=' + data[i].isActive + '>' +
                        '<span class="tableCheckIcon" ></span>' +
                        '</td>' +
                        '<td class="typhoonNumber">' + data[i].number + '</td>' +
                        '<td class="typhoonName">' + data[i].name + '</td>' +
                        '<td>' + data[i].enName + '</td>' +
                        '</tr>'
                    )
                }
                //台风选择
                $(".pageMenu-table").find("tbody tr").each(function () {
                    var td = $(this).find("td").eq(0);
                    if (list.indexOf($(this).find('.typhoonNumber').text()) != -1) {
                        td.addClass('tableCheckClickIcon');
                    }
                    td.click(function () {
                        var num = $(this).siblings('.typhoonNumber').text();
                        var name = $(this).siblings('.typhoonName').text();
                        var isActive = $(this).attr('data-isActive');
                        $(this).toggleClass("tableCheckClickIcon");
                        if ($(this).hasClass('tableCheckClickIcon')) {
                            if (list.length > 4) {
                                $(this).removeClass('tableCheckClickIcon');
                                toastr.warning('最多只能选择5条台风');
                                return
                            }
                            $('.pageMenu-subTxt').show();
                            $('.pageMenu-info').show();
                            $('.pageMenu-operate').show();
                            list.push(num);
                            var src;
                            if (isActive == 'true') {
                                src = '../images/timeIcon.png';
                                $('.pageMenu-subTxt-btn').show();
                            } else {
                                src = '../images/colseIcon.png';
                                $('.pageMenu-subTxt-btn').hide()
                            }
                            $('.pageMenu-select-box').append(
                                '<div class="pageMenu-select-item" id=' + num + '>' +
                                '<p class="pageMenu-select-word pageMenu-select-word-num">' + num + '</p>' +
                                '<p class="pageMenu-select-word pageMenu-select-word-name">' + name + '</p>' +
                                '<div class="pageMenu-select-del">' +
                                '<img src=' + src + '>' +
                                '</div>' +
                                '</div>'
                            )
                            getTyphoonDataByNumber(num, function (res) {
                                typhoonObj[num] = new typhoon(viewer, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewer"});
                                typhoonObj[num].ByIntervalDrawTyphoon();
                                var forecastLineIsShow={maindland: true, usa: true,japan: true, taiwan: true};
                                $('.forecast-checkBox').each(function () {
                                    if (!$(this).prop('checked')) {
                                        if($(this).val() == "中国"){
                                            forecastLineIsShow.maindland = false;
                                        }
                                        if($(this).val() == "中国台湾"){
                                            forecastLineIsShow.taiwan = false;
                                        }
                                        if($(this).val() == "日本"){
                                            forecastLineIsShow.japan = false;
                                        }
                                        if($(this).val() == "美国"){
                                            forecastLineIsShow.usa = false;
                                        }
                                        typhoonObj[num].isShowForecastline(forecastLineIsShow);
                                    }
                                });
                            });
                            $(".pageMenu-select-item").unbind('click');
                            $(".pageMenu-select-item").click(function () {//点击列表
                                if (!$(this).hasClass('click')) {
                                    deleteSimilarityListTyphoon();
                                    getTyphoonData($(this).attr('id'), 'pageMenu');
                                }
                                $(this).addClass("click").siblings().removeClass("click");
                                $('.pageMenu-subTxt-word').html($(this).find(".pageMenu-select-word-num").text() + '-' + $(this).find('.pageMenu-select-word-name').text());

                                if (!$('.similarityBox').is(':hidden')) {
                                    getSimilarityTyphoon($(this).attr('id'));
                                    if ($(".similarityOpenClose").hasClass('similarityOpenCloseClick')) {
                                        $(".similarityOpenClose").click();
                                    }
                                }
                                typhoonNumber = $(this).attr('id');
                                similarityListSelect = [];
                            });
                            $("#" + num + '').click(); // 添加到列表中,变换样式
                            //已选台风删除操作
                            $(".pageMenu-select-del").unbind('click');
                            $(".pageMenu-select-del").click(function (e) {
                                e.stopPropagation()
                                if ($(this).parent().hasClass('click')) {
                                    deleteSimilarityListTyphoon();
                                }
                                var delNum = $(this).siblings('.pageMenu-select-word-num').text();
                                $(this).parent().remove();
                                list = list.filter(function (item) {
                                    return item != delNum
                                });
                                if (probabilityCir && circleNum == delNum) {
                                    probabilityCir.deleteProbabilityCircle();
                                    probabilityCir = null;
                                    calculateData = null;
                                    $('.typhone_info').hide()
                                }
                                var infoNum = $('.typhone_info').find('.info_title h3').html().substring(0, 6);
                                if (infoNum == delNum) {
                                    $('.typhone_info').hide()
                                }
                                typhoonObj[delNum].removeTyphoon();
                                $('.typhoon-tbody tr').each(function () {
                                    if ($(this).find('.typhoonNumber').text() == delNum) {
                                        $(this).find("td").eq(0).removeClass('tableCheckClickIcon')
                                    }
                                });
                                // 删除后剩余的最后一个选中
                                $('.pageMenu-select-item').eq(-1).click();
                                hideTyphoonContent();
                            });
                        } else {
                            list = list.filter(function (item) {
                                return item != num
                            });
                            $(".pageMenu-select-item").each(function () {
                                if ($(this).find('.pageMenu-select-word-num').text() == num) {
                                    $(this).remove();
                                }
                            });
                            // 删除后剩余的最后一个选中
                            $('.pageMenu-select-item').eq(-1).click();
                            if (probabilityCir && circleNum == num) {
                                probabilityCir.deleteProbabilityCircle();
                                probabilityCir = null;
                                calculateData = null;
                                $('.typhone_info').hide()
                            }
                            var infoNum = $('.typhone_info').find('.info_title h3').html().substring(0, 6);
                            if (infoNum == num) {
                                $('.typhone_info').hide()
                            }
                            typhoonObj[num].removeTyphoon();
                            delete typhoonObj[num]
                            hideTyphoonContent();

                        }
                        similarityListSelect = [];
                    });
                });

                //当前台风判断
                if (typhoonCurrentNum == "" || typhoonCurrentNum == undefined || typhoonCurrentNum == null) {

                } else {
                    for (var i = 0; i < typhoonCurrentNum.length; i++) {
                        $(".pageMenu-table tbody").find("tr").each(function () {
                            if ($(this).find("td").eq(1).text() == typhoonCurrentNum[i].number) {
                                if (!$(this).find("td").eq(0).hasClass('tableCheckClickIcon')) {
                                    $(this).find("td").eq(0).click().addClass('pageMenu-select-hasTyphoon').css('cursor', 'default')


                                }
                                $('.pageMenu-select-box').find('.pageMenu-select-item').eq(0).find('.pageMenu-select-del').addClass('pageMenu-select-hasTyphoon').css('cursor', 'default');
                            }
                        });
                    }
                }
            } else {//没有台风数据
                tbody.append('<p>没有台风数据</p>')
            }
        } else {//没有台风数据
            tbody.append('<p>没有台风数据</p>')
        }
    });
}

//获取相似台风
function getSimilarityTyphoon(number) {
    $ajax('/web/typhoon/similar/list', { 'number': number }, function (res) {
        var tbody = $('.typhoonSimilarity-tbody');
        tbody.html('');
        if (res.data) {
            var data = res.data;
            similaritySearchList = data;
            if (data.length > 0) {
                typhoonControl(data);
            } else {//没有台风数据
                tbody.append('<p>没有台风数据</p>')
            }
        } else {//没有台风数据
            tbody.append('<p>没有台风数据</p>')
        }
    });
}

// 相似台风操作
function typhoonControl(data) {
    var tbody = $('.typhoonSimilarity-tbody');
    tbody.html('');
    var similarity;
    if ($(".similarity-checkIcon").hasClass("similarity-checkClick")) {
        data.sort(sortBy('speedSimilarity', false));  //强度相似度排序
    } else {

    }
    for (var i = 0; i < data.length; i++) {
        if ($(".similarity-checkIcon").hasClass("similarity-checkClick")) {
            similarity = data[i].speedSimilarity;
        } else {
            similarity = data[i].pathSimilarity;
        }
        tbody.append(
            '<tr>' +
            '<td data-isActive=' + data[i].isActive + ' data-hasSurgeWater=' + data[i].hasSurgeWater + '>' +
            '<span class="tableCheckIcon" ></span>' +
            '</td>' +
            '<td class="typhoonNumber">' + data[i].number + '</td>' +
            '<td class="typhoonName">' + data[i].name + '</td>' +
            '<td style="display:none;">' + data[i].enName + '</td>' +
            '<td>' + similarity + '</td>' +
            '</tr>'
        )
    }
    //台风选择
    $(".similarity-table").find("tbody tr").each(function () {
        var td = $(this).find("td").eq(0);
        if (similarityList.indexOf($(this).find('.typhoonNumber').text()) != -1) {
            td.addClass('tableCheckClickIcon');
        }
        td.click(function () {
            var num = $(this).siblings('.typhoonNumber').text();
            var name = $(this).siblings('.typhoonName').text();
            var isActive = $(this).attr('data-isActive');
            var hasSurgeWater = $(this).attr('data-hasSurgeWater');
            $(this).toggleClass("tableCheckClickIcon");
            if ($(this).hasClass('tableCheckClickIcon')) {
                if (similarityList.length > 3) {
                    $(this).removeClass('tableCheckClickIcon');
                    toastr.warning('最多只能选择4条台风');
                    return
                }

                $('.similarity-subTxt').show();
                $('.similarity-info').show();
                similarityList.push(num);
                similarityListSelect.push(num + '-' + name);
                var src;
                !isActive ? (src = '../images/timeIcon.png', $('.pageMenu-subTxt-btn').show()) : (src = '../images/colseIcon.png', $('.pageMenu-subTxt-btn').hide())
                $('.similarity-select-box').append(
                    '<div class="similarity-select-item" data-hasSurgeWater=' + hasSurgeWater + ' id=' + 'similarity' + num + '>' +
                    '<p class="similarity-select-word similarity-select-word-num">' + num + '</p>' +
                    '<p class="similarity-select-word similarity-select-word-name">' + name + '</p>' +
                    '<div class="similarity-select-del">' +
                    '<img src=' + src + '>' +
                    '</div>' +
                    '</div>'
                )
                getTyphoonDataByNumber(num, function (res) {
                    similarityListTyphoonObj[num] = new typhoon(viewer, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewer"});
                    similarityListTyphoonObj[num].ByIntervalDrawTyphoon();
                    var forecastLineIsShow={maindland: true, usa: true,japan: true, taiwan: true};
                    $('.forecast-checkBox').each(function () {
                        if (!$(this).prop('checked')) {
                            if($(this).val() == "中国"){
                                forecastLineIsShow.maindland = false;
                            }
                            if($(this).val() == "中国台湾"){
                                forecastLineIsShow.taiwan = false;
                            }
                            if($(this).val() == "日本"){
                                forecastLineIsShow.japan = false;
                            }
                            if($(this).val() == "美国"){
                                forecastLineIsShow.usa = false;
                            }
                            similarityListTyphoonObj[num].isShowForecastline(forecastLineIsShow);
                        }
                    })
                });
                $(".similarity-select-item").unbind('click');
                $(".similarity-select-item").click(function () {//点击列表
                    if ($(this).attr('data-hasSurgeWater') == 'true') {
                        $('.similarity-subTxt-btn').show();
                    } else {
                        $('.similarity-subTxt-btn').hide();
                    }
                    if (!$(this).hasClass('click')) {
                        getTyphoonData($(this).find('.similarity-select-word-num').text(), 'similarity');
                    }
                    $(this).addClass("click").siblings().removeClass("click");
                    $('.similarity-subTxt-word').html($(this).find('.similarity-select-word-num').text() + '-' + $(this).find('.similarity-select-word-name').text());

                });
                $("#" + 'similarity' + num + '').click(); // 添加到列表中,变换样式
                //已选台风删除操作
                $(".similarity-select-del").unbind('click');
                $(".similarity-select-del").click(function (e) {
                    e.stopPropagation()
                    var similarityListDelNum = $(this).siblings('.similarity-select-word-num').text();
                    var delName = $(this).siblings('.similarity-select-word-name').text();
                    $(this).parent().remove();
                    similarityList = similarityList.filter(function (item) {
                        return item != similarityListDelNum
                    });
                    similarityListSelect = similarityListSelect.filter(function (item) {
                        return item != (similarityListDelNum + '-' + delName)
                    });
                    similarityListTyphoonObj[similarityListDelNum].removeTyphoon();
                    delete similarityListTyphoonObj[similarityListDelNum]
                    $('.typhoonSimilarity-tbody tr').each(function () {
                        if ($(this).find('.typhoonNumber').text() == similarityListDelNum) {
                            $(this).find("td").eq(0).removeClass('tableCheckClickIcon')
                        }
                    });
                    // 删除后剩余的最后一个选中
                    $('.similarity-select-item').eq(- 1).click();
                    hideTyphoonContent();
                });
            } else {
                similarityList = similarityList.filter(function (item) {
                    return item != num
                });
                similarityListSelect = similarityListSelect.filter(function (item) {
                    return item != (num + '-' + name)
                });
                $(".similarity-select-item").each(function () {
                    if ($(this).find('.similarity-select-word-num').text() == num) {
                        $(this).remove();
                    }
                });
                if (probabilityCir && circleNum == num) {
                    probabilityCir.deleteProbabilityCircle();
                    probabilityCir = null;
                    calculateData = null;
                    $('.typhone_info').hide()
                }
                var infoNum = $('.typhone_info').find('.info_title h3').html().substring(0, 6);
                if (infoNum == num) {
                    $('.typhone_info').hide()
                }
                similarityListTyphoonObj[num].removeTyphoon();
                delete similarityListTyphoonObj[num]
                // 删除后剩余的最后一个选中
                $('.similarity-select-item').eq(- 1).click();
                hideTyphoonContent();

            }
        });
    });
}
//根据数组某个元素进行排序
function sortBy(attr, rev) {
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }

    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

// 搜索相似台风
function searchSimilarityTyphoon(val) {
    var tempSimilarList = [];
    similaritySearchList.forEach((item, index) => {
        if (item.name.search(val) !== -1) {
            tempSimilarList.push(item)
        } else if (String(item.number).search(val) !== -1) {
            tempSimilarList.push(item)
        } else if (item.fullName.toLowerCase().search(val.toLowerCase()) !== -1) {
            tempSimilarList.push(item)
        } else if (item.shortName.toLowerCase().search(val.toLowerCase()) !== -1) {
            tempSimilarList.push(item)
        }
    });
    typhoonControl(tempSimilarList);
}

//历史增水选择
function historySurgeSelect(typhoonName, typhoonId, btnType) {
    stationTyphoon = typhoonId;
    for(var i=0;i<list.length;i++){
        var num = list[i];
        getTyphoonDataByNumber(num, function (res) {
            stationTyphoonObj[num] = new typhoon(viewerTy, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewerTy"});
            stationTyphoonObj[num].ByIntervalDrawTyphoon();
        });
    }
    var typhoonNameAndNum = $(".pageMenu-subTxt-word").text();
    $(".historySurge-title").html(typhoonNameAndNum);
    if (btnType == 1) {
        if (similarityListSelect.length == 0) {
            $("#historySurgeList").html('<option value=' + typhoonName + '>' + typhoonName + '</option>');
        }else{
            var optionHtml = '';
            var typhoonList = similarityListSelect.reverse();
            if(typhoonList.indexOf(typhoonName) == "-1"){
                $("#historySurgeList").html('<option value=' + typhoonName + '>' + typhoonName + '</option>');
            }else{
                for (var i = 0; i < typhoonList.length; i++) {
                    optionHtml = optionHtml + '<option value=' + typhoonList[i] + '>' + typhoonList[i] + '</option>';
                }
                $("#historySurgeList").html(optionHtml);
            }
        }
    } else {
        if (similarityListSelect.length == 0) {
            $("#historySurgeList").html('<option value=' + typhoonName + '>' + typhoonName + '</option>');
        } else {
            var optionHtml = '';
            var typhoonList = similarityListSelect.reverse();
            for (var i = 0; i < typhoonList.length; i++) {
                optionHtml = optionHtml + '<option value=' + typhoonList[i] + '>' + typhoonList[i] + '</option>';
            }
            $("#historySurgeList").html(optionHtml);
        }
    }
    layui.use(['form'], function () {
        var form = layui.form;
        form.on('select(historySurge)', function (data) {
            stationTyphoon = parseInt((data.value).split("-")[0]);
            getStationChartByTyphoonAndStation(parseInt(stationTyphoon), stationNumberListHistorySurge);
            getStationListByTyphoonAndStation(stationTyphoon, stationNumberListHistorySurge);
        });
        layui.form.render("select");
    });
    rainTimeListRoute(stationTyphoon);//降水时间列表
    //getStationChartByTyphoonAndStation(parseInt(stationTyphoon), stationNumberListHistorySurge);
    //getStationListByTyphoonAndStation(stationTyphoon, stationNumberListHistorySurge);
}

//站点选择
function historySurgeStation() {
    $ajax('/web/station/queryStationByCity', {}, function (res) {
        stationNumberListHistorySurge = [], stationNameListHistorySurge = [], selectDataHistorySurge = [];
        for (var i = 0; i < res.data.length; i++) {
            var children = [];
            for (var j = 0; j < res.data[i].stationList.length; j++) {
                children.push({
                    name: res.data[i].stationList[j].stationName,
                    isWarn: res.data[i].stationList[j].isWarn,
                    value: res.data[i].stationList[j].stationNumber
                });
            }
            if (localStorage.getItem('cityName') == '广东省') {
                selectDataHistorySurge.push({
                    name: res.data[i].cityName,
                    value: res.data[i].areaId,
                    children: children,
                    selected: true
                });
                for (var m = 0; m < children.length; m++) {
                    stationNumberListHistorySurge.push(children[m].value);
                    stationNameListHistorySurge.push(children[m].name);
                }
            } else {
                if (res.data[i].areaId == area) {
                    selectDataHistorySurge.push({
                        name: res.data[i].cityName,
                        value: res.data[i].areaId,
                        children: children,
                        selected: true
                    });
                    for (var n = 0; n < children.length; n++) {
                        stationNumberListHistorySurge.push(children[n].value);
                        stationNameListHistorySurge.push(children[n].name);
                    }
                } else {
                    selectDataHistorySurge.push({
                        name: res.data[i].cityName,
                        value: res.data[i].areaId,
                        children: children,
                    });
                }
            }
        }
        getStationChartByTyphoonAndStation(parseInt(stationTyphoon), stationNumberListHistorySurge);
        getStationListByTyphoonAndStation(stationTyphoon, stationNumberListHistorySurge);
        var stationList = xmSelect.render({
            el: '#historySurgeStation',
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
                return selectDataHistorySurge
            },
            on: function (data) {
                //arr:  当前多选已选中的数据
                var arr = data.arr;
                stationNumberListHistorySurge = [], stationNameListHistorySurge = [];
                for (var i = 0; i < arr.length; i++) {
                    stationNumberListHistorySurge.push(arr[i].value);
                    stationNameListHistorySurge.push(arr[i].name);
                }
                //change, 此次选择变化的数据,数组
                var change = data.change;
                //isAdd, 此次操作是新增还是删除
                var isAdd = data.isAdd;
                //可以return一个数组, 代表想选中的数据
                //return []
                if (stationTyphoon == "" || stationTyphoon == undefined || stationTyphoon == null) {

                } else {
                    getStationChartByTyphoonAndStation(parseInt(stationTyphoon), stationNumberListHistorySurge);
                    getStationListByTyphoonAndStation(stationTyphoon, stationNumberListHistorySurge);
                }
            },
        });
    });
}

//站点列表
function getStationListByTyphoonAndStation(typhoonNumber, stationList) {
    if (stationList.length == 0) {
        $(".historySurge-list").html("");
    } else {
        $.ajax({
            url: hqxurl + '/web/station/list/history',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                "typhoonNumber": typhoonNumber,
                "stationList": stationList
            }),
            beforeSend: function (XMLHttpRequest) {
                var token = localStorage.getItem('token');
                if (token) {
                    XMLHttpRequest.setRequestHeader("token", token);
                }
            },
            success: function (res) {
                if (res.code === 200) {
                    var data = res.data;
                    if (data.length == 0 || data == undefined || data == null || data == "") {
                        removeStationList();//清除站点
                        $(".historySurge-list").html("");
                    } else {
                        loadStaionListHistory(typhoonNumber);//地图站点列表
                        $('.historySurge').show();
                        $(".stationChart").show();
                        //clearPlayContent();//清空播放内容
                        $("#typhoonContaner").show();
                        viewerTy.timeline.container.style.visibility = 'hidden'
                        viewerTy.timeline.container.style.display = 'none'
                        $('.pageMenu-body').hide();
                        $('.pageMenu-title').hide();
                        $(".similarityBox").hide();
                        var stationList = '';
                        var alertValue;
                        var alertClass;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].warnLevel == "" || data[i].warnLevel == undefined || data[i].warnLevel == null) {
                                data[i].warnLevel = "-";


                            } else {
                                data[i].warnLevel = data[i].warnLevel;
                            }
                            if (data[i].highestLevel == "" || data[i].highestLevel == undefined || data[i].highestLevel == null) {
                                data[i].highestLevel = "-";
                            } else {
                                data[i].highestLevel = data[i].highestLevel;
                            }
                            if (data[i].warnLevel == "-" || data[i].highestLevel == "-") {
                                alertValue = '-';
                                alertClass = 'historySurge-textColorDefault';
                            } else {
                                alertValue = (Number(data[i].highestLevel) - Number(data[i].warnLevel)).toFixed(2);
                                if (alertValue < 0) {
                                    alertClass = 'historySurge-textColorGreen';
                                } else {
                                    alertClass = 'historySurge-textColor';
                                    alertValue = '+' + alertValue;
                                }
                            }

                            stationList = stationList + `<div class="historySurge-list-item">
                                <div class="historySurge-item-box">
                                    <div class="historySurge-left">
                                        <p class="historySurge-textColorDefault historySurge-fontNormal">`+ data[i].stationName + `</p>
                                        <p class="historySurge-text">`+ data[i].stationNumber + `</p>
                                    </div>
                                    <div class="historySurge-right">
                                        <span class="historySurge-text">警戒值(m)</span>
                                        <span class="historySurge-textColorDefault historySurge-fontSmall">`+ data[i].warnLevel + `</span>
                                    </div>
                                </div>
                                <div class="historySurge-item-box">
                                    <div class="historySurge-left">
                                        <span class="historySurge-text">最高水位(m)</span>
                                        <span class="historySurge-textColor historySurge-fontlarge">`+ data[i].highestLevel + `</span>
                                    </div>
                                    <div class="historySurge-right">
                                        <span class="historySurge-text">对比警戒值</span>
                                        <span class="`+ alertClass + ` historySurge-fontMin">` + alertValue + `</span>
                                    </div>
                                </div>
                                <div class="historySurge-item-box">
                                    <div class="historySurge-left">
                                        <span class="historySurge-text">最高水位时</span>
                                        <span class="historySurge-textColorDefault historySurge-fontBig">`+ timeStampTurnTime(data[i].time) + `</span>
                                    </div>
                                </div>
                            </div>`;
                        }
                        $(".historySurge-list").html(stationList);
                        $(".historySurge-list-item").click(function () {
                            var name = $(this).find(".historySurge-fontNormal").text();
                            $(this).toggleClass("historySurge-list-itemClick");
                            if ($(this).hasClass("historySurge-list-itemClick")) {
                                $(this).siblings().removeClass("historySurge-list-itemClick");
                                $(".stationChartOpenClose").removeClass("stationChartOpenCloseClick");
                                $(".stationChart").animate({ 'right': '20px' }, 900);
                                for (var i = 0; i < stationChartData.length; i++) {
                                    if (stationChartData[i].stationName == name) {
                                        $(".stationChart-body").animate({ scrollTop: i * 200 }, 100);
                                    }
                                }
                            } else {
                                $(".stationChart-body").animate({ scrollTop: 0 }, 100);
                                if ($(this).hasClass(".stationChartOpenClose")) {
                                    $(".stationChartOpenClose").addClass("stationChartOpenCloseClick");
                                    $(".stationChart").animate({ 'right': '-430px' }, 900);
                                } else {

                                }
                            }
                        });
                    }
                } else if (res.code == 100003) {//token 过期
                    window.location.href = '../login.html'
                    localStorage.clear();
                } else {//错误信息
                    toastr.error(res.msg);
                    removeStationList();//清除站点
                    $(".historySurge-list").html("");
                }
            }
        });
    }
}

//站点曲线图
function getStationChartByTyphoonAndStation(typhoonNumber, stationList) {
    if (stationList.length == 0) {
        $(".stationChart-body").html("");
    } else {
        $.ajax({
            url: hqxurl + '/web/station/chart/history',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                "typhoonNumber": typhoonNumber,
                "stationList": stationList
            }),
            beforeSend: function (XMLHttpRequest) {
                var token = localStorage.getItem('token');
                if (token) {
                    XMLHttpRequest.setRequestHeader("token", token);
                }
            },
            success: function (res) {
                if (res.code === 200) {
                    $(".stationChart").show();
                    var data = res.data;
                    stationChartData = data;
                    $(".stationChart-body").html("");
                    if (data.length == 0) {
                        $(".stationChart-body").html("暂无数据").css({ 'textAlign': "center", 'marginTop': "20px" });
                    } else {
                        loadStaionListHistory(typhoonNumber);//地图站点列表
                        for (var i = 0; i < data.length; i++) {
                            var chartListBox = document.createElement('div');
                            chartListBox.setAttribute('id', 'stationChart' + i);
                            chartListBox.setAttribute('class', 'stationChartItem');
                            chartListBox.setAttribute('style', 'width: 370px;height: 200px;');
                            $(".stationChart-body").append(chartListBox);
                            stationChart('stationChart' + i, data[i]);
                        }
                    }
                } else if (res.code == 100003) {//token 过期
                    window.location.href = '../login.html'
                    localStorage.clear();
                } else {//错误信息
                    toastr.error(res.msg);
                    removeStationList();//清除站点
                    $(".stationChart-body").html("");
                }
            }
        });
    }
}
//站点过程图和报表
function stationProduceAndTableShow(stationList, left, top, lon, lat) {
    var typhoonNumber = parseInt(($("#historySurgeList").find("option:selected").val()).split("-")[0]);
    if (typhoonNumber == "" || typhoonNumber == null || typhoonNumber == undefined) {

    } else {
        $ajax('/web/station/chart/history', { 'typhoonNumber': typhoonNumber, 'stationList': stationList }, function (res) {
            var data = res.data;
            $("#typhoonProducePop").show();
            $(".typhoon-title-txt").eq(0).trigger("click");
            $("#typhoonProducePop").css({
                "left": left,
                "top": top
            });
            $("#typhoonLonLatTxt").text(lon.toFixed(2) + '；' + lat.toFixed(2));
            if (data.length == 0) {
                $(".typhoonProducePopBody").html("");
                $("#procedureChartTyphoon").html("");
            } else {
                stationChartOne(data[0]);
                if (data[0].address == "" || data[0].address == undefined || data[0].address == null) {
                    $("#typhoonAddressTxt").text("-");
                } else {
                    $("#typhoonAddressTxt").text(data[0].address);
                }
                var tableHtml = '';
                var dataJson = data[0].list;
                for (var i = 0; i < dataJson.length; i++) {
                    if (dataJson[i].realLevel == "" || dataJson[i].realLevel == undefined || dataJson[i].realLevel == null) {
                        dataJson[i].realLevel = "-";
                    } else {
                        dataJson[i].realLevel = dataJson[i].realLevel;
                    }
                    if (dataJson[i].tideLevel == "" || dataJson[i].tideLevel == undefined || dataJson[i].tideLevel == null) {
                        dataJson[i].tideLevel = "-";
                    } else {
                        dataJson[i].tideLevel = dataJson[i].tideLevel;
                    }
                    if (dataJson[i].waterLevel == "" || dataJson[i].waterLevel == undefined || dataJson[i].waterLevel == null) {
                        dataJson[i].waterLevel = "-";
                    } else {
                        dataJson[i].waterLevel = dataJson[i].waterLevel;
                    }
                    tableHtml = tableHtml + `<tr>
                    <td>`+ timeStampTurnTime(dataJson[i].time) + `</td>
                    <td>`+ dataJson[i].realLevel + `</td>
                    <td>`+ dataJson[i].tideLevel + `</td>
                    <td>`+ dataJson[i].waterLevel + `</td>
                </tr>`;
                }
                $(".typhoonProducePopBody").html(tableHtml);
            }
        });
    }
}
//站点过程图和报表关闭
function stationProduceAndTableHide() {
    $("#typhoonProducePop").hide();
}
//站点过程图和报表位置
function stationProduceAndTablePosition(left, top) {
    $(".typhoon-chart").css({
        "left": left,
        "top": top
    });
}
//stationProduceAndTableShow(202002,[81204050],500,200,132.27,32.35,'广州市石楼镇');
//stationProduceAndTableShow([81204050],500,200,132.27,32.35);

//历史增水弹窗信息显示隐藏
function historySurgePopInfoShowLevelOne(left, top, name, time, waterLevel) {
    if (waterLevel == "" || waterLevel == undefined || waterLevel == null) {
        waterLevel = '-';
    } else {
        waterLevel = waterLevel;
    }
    var popHtml = `<div class="sea_info_dialog sea_info_dialogLevelOne" data-id="` + name + `">
        <h5>` + name + `</h5>
        <div class="sea_info_dialog_txt">`+ timeStampTurnTime(time) + `</div>
        <ul>
            <li>
                <p>实测水位(m)</p>
                <span>`+ waterLevel + `</span>
            </li>
        </ul>
    </div>`;
    $('body').append(popHtml);
    $(".sea_info_dialog").css({
        "left": left,
        "top": top
    });
}
function historySurgePopInfoHideLevelOne() {
    $(".sea_info_dialogLevelOne").hide();
}
function historySurgePopInfoShowLevelTwo(left, top, name, time, waterLevel) {
    if (waterLevel == "" || waterLevel == undefined || waterLevel == null) {
        waterLevel = '-';
    } else {
        waterLevel = waterLevel;
    }
    var popHtml = `<div class="sea_info_dialog sea_info_dialogLevelTwo" data-id="` + name + `">
        <h5>` + name + `</h5>
        <div class="sea_info_dialog_txt">`+ timeStampTurnTime(time) + `</div>
        <ul>
            <li>
                <p>实测水位(m)</p>
                <span>`+ waterLevel + `</span>
            </li>
        </ul>
    </div>`;
    $('body').append(popHtml);
    $(".sea_info_dialog").css({
        "left": left,
        "top": top
    });
}
function historySurgePopInfoHideLevelTwo() {
    $(".sea_info_dialogLevelTwo").hide();
}
function historySurgePopInfoShowLevelThree(left, top, name, time, waterLevel) {
    if (waterLevel == "" || waterLevel == undefined || waterLevel == null) {
        waterLevel = '-';
    } else {
        waterLevel = waterLevel;
    }
    var popHtml = `<div class="sea_info_dialog sea_info_dialogLevelThree" data-id="` + name + `">
        <h5>` + name + `</h5>
        <div class="sea_info_dialog_txt">`+ timeStampTurnTime(time) + `</div>
        <ul>
            <li>
                <p>实测水位(m)</p>
                <span>`+ waterLevel + `</span>
            </li>
        </ul>
    </div>`;
    $('body').append(popHtml);
    $(".sea_info_dialog").css({
        "left": left,
        "top": top
    });
}
function historySurgePopInfoHideLevelThree() {
    $(".sea_info_dialogLevelThree").hide();
}
function historySurgePopInfoShowLevelFour(left, top, name, time, waterLevel) {
    if (waterLevel == "" || waterLevel == undefined || waterLevel == null) {
        waterLevel = '-';
    } else {
        waterLevel = waterLevel;
    }
    var popHtml = `<div class="sea_info_dialog sea_info_dialogLevelFour" data-id="` + name + `">
        <h5>` + name + `</h5>
        <div class="sea_info_dialog_txt">`+ timeStampTurnTime(time) + `</div>
        <ul>
            <li>
                <p>实测水位(m)</p>
                <span>`+ waterLevel + `</span>
            </li>
        </ul>
    </div>`;
    $('body').append(popHtml);
    $(".sea_info_dialog").css({
        "left": left,
        "top": top
    });
}
function historySurgePopInfoHideLevelFour() {
    $(".sea_info_dialogLevelFour").hide();
}
//历史增水弹窗信息位置
function historySurgePopPostion(left, top, index) {
    $('.sea_info_dialog').eq(index).css({
        left: left + 'px',
        top: top + 'px'
    });
}

//降水时间列表
function rainTimeListRoute(number){
    $ajax('/web/station/rain/time',{ "number" : parseInt(number) },function(res){
        //console.log(res);
        var dataJson = res.data;
        if(dataJson.length == 0 || dataJson == "" || dataJson == null || dataJson ==undefined){
            var rainHtml = '<div class="rainTimeItemRoute">'+
                '<i class="rainTimeRadioNoRoute"></i>'+
                '<i class="rainTimeRadioYesRoute"></i>'+
                '<span data-id="">累计降水</span>'+
            '</div>';
            $(".rainTimeListRoute").html(rainHtml);
        }else{
            var rainHtml = '<div class="rainTimeItemRoute">'+
                '<i class="rainTimeRadioNoRoute"></i>'+
                '<i class="rainTimeRadioYesRoute"></i>'+
                '<span data-id="">累计降水</span>'+
            '</div>';
            for(var i=0;i<dataJson.length;i++){
                rainHtml = rainHtml + '<div class="rainTimeItemRoute">'+
                    '<i class="rainTimeRadioNoRoute"></i>'+
                    '<i class="rainTimeRadioYesRoute"></i>'+
                    '<span data-id="'+dataJson[i]+'">'+new Date(dataJson[i]).Format("yyyy年MM月dd日")+'</span>'+
                '</div>';
            }
            $(".rainTimeListRoute").html(rainHtml);
        }
        //降水时间选择
        $(".rainTimeItemRoute").click(function(){
            var time = $(this).find("span").attr("data-id");
            $(this).addClass("rainRadioClick");
            $(this).siblings().removeClass("rainRadioClick");
            removeRainfallLayer();//清除雨情
            if(time == "" || time == null ||  time == undefined){
                rainfallListRoute(number);
            }else{
                rainfallListRouteTime(number,time);
            }
        });
        $(".rainTimeItemRoute").eq(0).trigger("click");
    });
}

//雨量列表
function rainfallListRouteTime(number,time){
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
function rainfallListRoute(number){
    var params = {
        "number":number
    }
    $ajax('/web/station/rain/info',params,function(res){
        //console.log(res);
        var dataJson = res.data;
        loadRainfall(dataJson);
    });
}

var probabilityCir = null;
var circleNum, calculateData;
//获取当前台风信息
function getTyphoonCurrent() {
    $ajax('/web/typhoon/active/info', {}, function (res) {
        var data = res.data;  
        if (data == "" || data == undefined || data == null) {
            //$(".nav-list-item").eq(3).addClass("bannedClick");
            //toastr.warning('无实时台风，无法查看！');
        } else {
            //$(".nav-list-item").eq(3).removeClass("bannedClick");
            typhoonCurrentNum = data;
            hasTyphoon = true;
            for(var i=0;i<typhoonCurrentNum.length;i++){
                var year = ((typhoonCurrentNum[i].number).toString()).slice(0,4);
                getTyphooonList(year);
                $('#yearList').val(year);
            }
        }
    });
}
// 清除相似台风
function deleteSimilarityListTyphoon() {
    for (var item in similarityListTyphoonObj) {
        similarityListTyphoonObj[item].removeTyphoon();
    }
    similarityListTyphoonObj = {};
    similarityList = [];
    $(".similarity-table").find("tbody tr td").removeClass('tableCheckClickIcon');
    $(".typhoonSimilarity-tbody").empty();
    $('.similarity-select-box').empty();
    $('.similarity-subTxt').hide();
    $('.similarity-info').hide();
    $(".similarity-checkIcon").removeClass('similarity-checkClick');
}
$(function () {
    //获取当前台风信息
    getTyphoonCurrent();
    // 获取台风年份
    getTyphoonYearList();
    // 获取台风列表
    // getTyphooonList(new Date().getFullYear());
    // 搜索台风列表
    $('.pageMenu-search .search-icon').click(function () {
        if ($('.search-input').val() != '') {
            getTyphooonList('', $('.search-input').val());
        } else {
            if ($('#yearList').val() != '2020') {
                $('.pageMenu-year-select .layui-anim dd').eq(0).click()
            }
        }
    });
    $('.pageMenu-search .search-input').keydown(function (event) {
        if (event.keyCode == 13) {
            getTyphooonList('', $(this).val());
        }
    });
    $('.pageMenu-search .search-input').change(function () {
        if (!$(this).val()) {
            getTyphooonList(new Date().getFullYear());
        }
    });
    // 搜索相似台风
    $('.similarity-search .search-icon').click(function () {
        searchSimilarityTyphoon($('#similarityInput').val())
    });
    $('#similarityInput').keydown(function (event) {
        if (event.keyCode == 13) {
            searchSimilarityTyphoon($(this).val())
        }
    });
    //台风路径菜单切换
    $(".pageMenu-title-item").click(function () {
        var index = $(this).index();
        var text = $(this).text();
        $(this).addClass("pageMenu-title-itemClick");
        $(this).siblings().removeClass("pageMenu-title-itemClick");
        // 清空
        for (var item in typhoonObj) {
            typhoonObj[item].removeTyphoon();
        }
        typhoonObj = {};
        list = [];
        hideTyphoonContent()
        $('.pageMenu-clearBtn').click();
        if (index === 0) {
            $('.typhoonInfo').show();
            $('.typhoon-calculate-input').hide();
            $('.typhoon-calculate-btn').hide();
            $('.typhoon-calculate-control').hide();
            $('.typhoon-calculate-forecast').hide();
            typhoonPointStatus = '';
            getTyphooonList(new Date().getFullYear());
        } else {
            $('.typhoonInfo').hide();
            $('.typhoon-calculate-btn').show();
            // $('.typhoon-calculate-forecast').show();
            $('.typhoon-calculate-exit').hide();
            $('.typhoon-calculate-edit').show();
            $(".typhone_info").hide();
            $(".typhoon-tbody").find("tr").find('td').removeClass('pageMenu-select-hasTyphoon').removeClass('tableCheckClickIcon')

        }
        typhoonPathMenu = text;
    });
    // $(".pageMenu-title-item").eq(0).trigger("click");

    // 相似台风
    $('.pageMenu-similarity').click(function () {
        $('.similarityBox').fadeIn();
        getSimilarityTyphoon(typhoonNumber);
        if ($(".similarityOpenClose").hasClass('similarityOpenCloseClick')) {
            $(".similarityOpenClose").click();
        }
    });

    //相似台风检索因子强度选择
    $(".similarity-checkIcon").click(function () {
        $(this).toggleClass("similarity-checkClick");
        getSimilarityTyphoon(typhoonNumber);
    });

    //添加相似台风
    //添加相似台风显示
    $(".similarity-addIcon").click(function () {
        $(".similarity-addPop").show();
    });
    //关闭
    $(".similarity-addClose").click(function () {
        $(this).parent().parent().hide();
    });
    // 台风选择
    $(".similarity-addTable").find("tbody tr").each(function () {
        var td = $(this).find("td").eq(0);
        td.click(function () {
            $(this).toggleClass("simialrityAddCheck");
        });
    });

    // 一键清除
    $('.pageMenu-clearBtn').click(function () {
        $('.similarityBox').fadeOut();
        deleteSimilarityListTyphoon();
        similarityListSelect = [];
    });
    // 预报机构
    $('.forecast-box').click(function () {
        $('.forecast').toggle();
        $('.typhoonInfo-legend').hide();
        $(this).find('.layui-icon').toggleClass('rotate');
        $('.typhoonInfo-legend-box').find('.layui-icon').addClass('rotate');
    });

    // 台风图例
    $('.typhoonInfo-legend-box').click(function () {
        $('.forecast').hide();
        $('.typhoonInfo-legend').toggle();
        $(this).find('.layui-icon').toggleClass('rotate');
        $('.forecast-box').find('.layui-icon').addClass('rotate');
    });

    //水情图例
    $(".water-legend-box").click(function () {
        $(".water-legend").toggle();
        $(this).find('.layui-icon').toggleClass('rotate');
    });
    
    //降水图例
    $(".rainLegendTitleRoute").click(function () {
        $(".rainLegendBodyRoute").toggle();
        $(this).find('.layui-icon').toggleClass('rotate');
    });

    //降水时间选择
    $(".rainTimeItemRoute").click(function(){
        $(this).addClass("rainRadioClick");
        $(this).siblings().removeClass("rainRadioClick");
    });
    $(".rainTimeItemRoute").eq(0).trigger("click");

    // 预报机构选择
    layui.use(['form', 'element'], function () {
        var form = layui.form;
        //监听复选框-单个
        var forecastLineIsShow={maindland: true, usa: true,japan: true, taiwan: true};
        form.on('checkbox(typhoonForecast)', function (data) {
            if(data.value == "中国"){
                forecastLineIsShow.maindland = data.elem.checked;
            }
            if(data.value == "中国台湾"){
                forecastLineIsShow.taiwan = data.elem.checked;
            }
            if(data.value == "美国"){
                forecastLineIsShow.japan = data.elem.checked;
            }
            if(data.value == "日本"){
                forecastLineIsShow.usa = data.elem.checked;
            }
            $.each(typhoonObj, function (key, value) {
                value.isShowForecastline(forecastLineIsShow);
            })
            $.each(similarityListTyphoonObj, function (key, value) {
                value.isShowForecastline(forecastLineIsShow);
            })
        });
    });
    //相似台风显示隐藏
    $(".similarityOpenClose").click(function () {
        $(this).toggleClass("similarityOpenCloseClick");
        if ($(this).hasClass('similarityOpenCloseClick')) {
            $(".similarityBox").animate({ 'right': '-430px' }, 900);
        } else {
            $(".similarityBox").animate({ 'right': '20px' }, 900);
        }
    });

    //台风强度选择
    $('.typhoon-power-select-item').click(function () {
        $(this).addClass('click').siblings().removeClass('click');
    });
    // 台风自定义按钮注释
    $('.typhoon-calculate-control-item').each(function () {
        $(this).hover(function () {
            $(this).siblings('.typhoon-calculate-control-item-tips').show();
        }, function () {
            $(this).siblings('.typhoon-calculate-control-item-tips').hide();
        })
    });
    // 修改台风路径
    $('.typhoon-calculate-edit').click(function () {
        if (list.length === 0) {
            toastr.error('请选择台风')
            return
        }
        $('.typhoon-calculate-forecast').show();
        $('.typhoon-calculate-control').show();
    });
    // 查看历史增水按钮
    $('.historySurge_btn').click(function () {
        $(".typhoonInfo").hide();
        $(".waterLegendInfo").show();
        $('.historySurge').show();
        $(".rainTimeSelectRoute").show();
        if($(".stationChartOpenClose").hasClass("stationChartOpenCloseClick")){
            $(".rainTimeSelectRoute").css("right","40px");
        }else{
            $(".rainTimeSelectRoute").css("right","471px");
        }
        //$(".stationChart").show();
        //clearPlayContent();//清空播放内容
        $("#typhoonContaner").show();
        viewerTy.timeline.container.style.visibility = 'hidden'
        viewerTy.timeline.container.style.display = 'none'
        $('.pageMenu-body').hide();
        $('.pageMenu-title').hide();
        $(".similarityBox").hide();
        var text = $('.typhoon-name').text();
        var num = text.split("-")[0];
        historySurgeSelect(text, num, 1);
        historySurgeStation();
        viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(113.517628, 23.353899, 1000000.0) });
        for (var item in typhoonObj) {
            typhoonObj[item].removeTyphoon();
        }
        typhoonObj = {};
        list = [];
        for (var item in similarityListTyphoonObj) {
            similarityListTyphoonObj[item].removeTyphoon();
        }
        similarityListTyphoonObj = {};
        similarityList = [];
    });
    $(".similarity-subTxt-btn").click(function () {
        $(".typhoonInfo").hide();
        $(".waterLegendInfo").show();
        $('.historySurge').show();
        $(".rainTimeSelectRoute").show();
        if($(".stationChart").css("display") == "none"){
            $(".rainTimeSelectRoute").css("right","40px");
        }else{
            $(".rainTimeSelectRoute").css("right","471px");
        }
        //$(".stationChart").show();
        //clearPlayContent();//清空播放内容
        $("#typhoonContaner").show();
        viewerTy.timeline.container.style.visibility = 'hidden'
        viewerTy.timeline.container.style.display = 'none'
        $('.pageMenu-body').hide();
        $('.pageMenu-title').hide();
        $(".similarityBox").hide();
        var text = $(".pageMenu-subTxt-word").text();
        var num = text.split("-")[0];
        historySurgeSelect(text, num, 2);
        historySurgeStation();
        viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(113.517628, 23.353899, 1000000.0) });
        for (var item in typhoonObj) {
            typhoonObj[item].removeTyphoon();
        }
        typhoonObj = {};
        list = [];
        for (var item in similarityListTyphoonObj) {
            similarityListTyphoonObj[item].removeTyphoon();
        }
        similarityListTyphoonObj = {};
        similarityList = [];
    });
    //历史增水模块站点选择
    $(".historySurge-drop-select").unbind("click").on("click", function () {
        historySurgeStation();
    });
    //$(".historySurge-drop-select").trigger("click");
    // 返回台风路径
    $('#historySurgeBack').click(function () {
        $(".typhoonInfo").show();
        $(".waterLegendInfo").hide();
        $('.pageMenu-body').show();
        $('.pageMenu-title').show();
        $(".similarityBox").hide();
        $('.historySurge').hide();
        $(".stationChart").hide();
        $(".typhoonContaner").hide();
        $(".rainTimeSelectRoute").hide();
        $(".rainTimeItemRoute").eq(0).addClass("rainRadioClick").siblings().removeClass("rainRadioClick");
        $(".pageMenu-title-item").eq(0).addClass("pageMenu-title-itemClick");
        $(".pageMenu-title-item").eq(1).removeClass("pageMenu-title-itemClick");
        removeStationList();//清除站点
        removeRainfallLayer();//清除雨情
        stationProduceAndTableHide();
        $(".sea_info_dialog").remove();
        stationNumberListHistorySurge = [];
        stationNameListHistorySurge = [];
        //similarityListSelect = [];
        viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(103.486138, 30.465411, 21000000.0) });
        $(".pageMenu-select-item").each(function () {
            var num = $(this).attr("id");
            list.push(num);
            getTyphoonDataByNumber(num, function (res) {
                typhoonObj[num] = new typhoon(viewer, Cesium, res.data, forecastPathStatus, {isCurrent:true,typhoonViewer:"viewer"});
                typhoonObj[num].ByIntervalDrawTyphoon();
            });
        });
        $(".similarity-select-item").each(function () {
            var num = $(this).find("p.similarity-select-word-num").text();
            similarityList.push(num);
            getTyphoonDataByNumber(num, function (res) {
                similarityListTyphoonObj[num] = new typhoon(viewer, Cesium, res.data,forecastPathStatus, {isCurrent:true,typhoonViewer:"viewer"});
                similarityListTyphoonObj[num].ByIntervalDrawTyphoon();
            });
        });
    });
    $('.historySurge-list-item').click(function () {
        $(this).toggleClass('historySurge-list-itemClick');
    });
    //过程图和报表导航切换
    $(".typhoon-title-txt").click(function () {
        var index = $(this).index();
        $(this).addClass("typhoon-title-txtClick");
        $(this).siblings(".typhoon-title-txt").removeClass("typhoon-title-txtClick");
        $(this).parent().siblings(".typhoon-case-body").find(".typhoon-body-item").eq(index).show();
        $(this).parent().siblings(".typhoon-case-body").find(".typhoon-body-item").eq(index).siblings().hide();
    });
    $(".typhoon-title-txt").eq(0).trigger("click");
    //站点曲线图显示隐藏
    $(".stationChartOpenClose").click(function () {
        $(this).toggleClass("stationChartOpenCloseClick");
        if ($(this).hasClass('stationChartOpenCloseClick')) {
            $(".stationChart").animate({ 'right': '-430px' }, 900);
            $(".rainTimeSelectRoute").animate({ 'right': '40px' }, 900);
        } else {
            $(".stationChart").animate({ 'right': '20px' }, 900);
            $(".rainTimeSelectRoute").animate({ 'right': '471px' }, 900);
        }
    });

    // 概率圆
    $('.compound_water_btn').click(function () {
        if (probabilityCir) {
            probabilityCir.deleteProbabilityCircle();
            probabilityCir = null;
            calculateData = null;
        }
        var agency = $(this).siblings('.info_list').find('.info_organ p').html();
        var number = $(this).siblings('.info_title').find('h3').html().substring(0, 6);
        probabilityCir = new probabilityCircle(typhoonObj[number].circlesPrediction(agency))
        circleNum = number;
        calculateData = probabilityCir.getCalculate();
        $('.typhoonInfo').hide();
        $('.pageContent').hide();
        $('.typhone_info').hide();
        $('.typhoon-calculate-btn').show();
        $('.typhoon-calculate-edit').hide();
        $('.typhoonInfo-forecast').show();
        $('.typhoon-calculate-start').show();
        $('.typhoon-calculate-exit').show();
    });
    // 台风计算退出按钮
    $('.typhoon-calculate-exit').click(function () {
        $('.typhoon-calculate-btn').hide();
        $('.typhoonInfo').show();
        $('.pageContent').show();
        $('.typhoonInfo-forecast').hide();
        probabilityCir.deleteProbabilityCircle();
        probabilityCir = null;
        calculateData = null;
        if ($('.pageMenu-title-item').eq(1).hasClass('pageMenu-title-itemClick')) {
            $('.typhoon-calculate-btn').show();
            $('.typhoon-calculate-edit').show();
            $('.typhoon-calculate-start').show();
            $('.typhoon-calculate-start').removeClass('btnDisabled');
            $('.typhoon-calculate-exit').hide();
        }

    });
    // 开始计算按钮
    $('.typhoon-calculate-start').click(function () {
        var calculateList = [];
        $(".forecast-type").find(".layui-input-box-item").each(function () {
            var index = $(this).index();
            var checked = $(this).find(".forecast-checkBox").prop('checked');
            if (checked == true) {
                calculateList.push(index);
            } else {

            }
        });
        $ajax('/web/typhoon/probability/circle/calculate', {
            'number': parseFloat(circleNum),
            'agencyType': 1,
            //'calculateList': [0, 1, 2],
            'calculateList': calculateList,
            'baseList': calculateData.baseList,
            'leftForecast': calculateData.leftForecast,
            'rightForecast': calculateData.rightForecast,
            'fastForecast': calculateData.fastForecast,
            'slowForecast': calculateData.slowForecast,
        }, function () {
            toastr.info('台风任务计算中...');
            $('.typhoon-calculate-start').addClass('btnDisabled');
            clearInterval(calculateTimer)
            calculateTimer = null;
            calculateTimer = setInterval(function () {
                calculateTime();
            }, 60000)
            var count = 10;
            var countDown = setInterval(function () {
                count--;
                $('.typhoon-calculate-start').html(count+'s');
                if (count === 0) {
                    $('.typhoon-calculate-start').html('开始计算');
                    $('.typhoon-calculate-start').removeClass('btnDisabled');
                    clearInterval(countDown);
                }
            }, 1000)


        })
    });

    // 台风点..增加,删除,移动操作
    $('.typhoon-calculate-control-item-box').each(function () {
        $(this).find('.typhoon-calculate-control-item').click(function () {
            $(this).toggleClass('click');
            $('.typhoon-calculate-input').hide()
            if ($(this).hasClass('click')) {
                typhoonPointStatus = $(this).attr('data-control');
                $(this).parent().siblings().find('.typhoon-calculate-control-item').removeClass('click');
                if (typhoonPointStatus == 0) {
                    $('.typhoon-calculate-input').show()
                    $('#speed').val('');
                    $('#pressure').val('');
                    $('#timeList').empty();
                    $('.typhoon-power-select-box').find('.typhoon-power-select-item').eq(0).click();
                }
            } else {
                typhoonPointStatus = '';
            }
        });
    });

    layui.use('laydate', function () {
        var laydate = layui.laydate;

        //执行一个laydate实例
        laydate.render({
            elem: '#StartingTime',
            showBottom: false,
            theme: '#3850D5',
            max: Date.now()
        });
    });
});