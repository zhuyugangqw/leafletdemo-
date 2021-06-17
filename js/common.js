var hqxurl = 'http://183.6.36.226:8200'
// var hqxurl = 'http://192.168.5.27:8200'
//http://192.168.5.123:8200   
// http://192.168.2.13:8200
//http://183.6.36.226:8200
//http://10.44.31.203:8200

var hasTyphoon;
var typhoonCurrentNum;//当前台风编号
var height = $(window).height();


// 加载动画
function showLoading() {
  $('.loading').show();
}
function hideLoading() {
  $('.loading').hide();
}

//公共ajax封装
function $ajax(url, params, successfn) {
  var timeOut = setTimeout(function () {
    showLoading();
  }, 500)
  $.ajax({
    url: hqxurl + url,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(params),
    // timeout: 3000,
    beforeSend: function (XMLHttpRequest) {
      var token = localStorage.getItem('token');
      if (token) {
        XMLHttpRequest.setRequestHeader("token", token);
      }
    },
    success: function (res) {
      console.log(res)
      if (res.code === 200) {
        successfn(res);
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
      hideLoading();
      clearTimeout(timeOut)
    }
  });
}

function timeStampTurnTime(timeStamp, all) {
  if (timeStamp > 0) {
    var date = new Date(timeStamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (all) {
      return y + '-' + m + '-' + d + '\xa0' + h + ':' + minute + ':' + second;
    } else {
      return y + '-' + m + '-' + d + '\xa0' + h + ':' + minute;

    }
  } else {
    return "";
  }
};

//日期格式化
Date.prototype.Format = function (formatStr) {
  var str = formatStr;
  var Week = ['日', '一', '二', '三', '四', '五', '六'];
  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
  str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
  str = str.replace(/M/g, this.getMonth());
  str = str.replace(/w|W/g, Week[this.getDay()]);
  str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
  str = str.replace(/d|D/g, this.getDate());
  str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
  str = str.replace(/h|H/g, this.getHours());
  str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
  str = str.replace(/m/g, this.getMinutes());
  str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
  str = str.replace(/s|S/g, this.getSeconds());
  return str;
}


//全屏
function fullScreen() {
  var el = document.documentElement;
  var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  if (typeof rfs != "undefined" && rfs) {
    rfs.call(el);
  };
  return;
}

function allShow() {
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  $("#waterProject").show();
  $(".iframe-class").hide();
  $(".form_wrap").hide();
  $(".nav").hide();
  $(".container-fluid").css({ "width": screenWidth, "height": screenHeight });
  $(".container").css({ "width": screenWidth, "height": screenHeight, "top": 0 });
  //$("#cesiumContainer").css("height", screenHeight);
  $("#waterProject").css({ "width": screenWidth, "height": screenHeight });
  removeRainfallLayer();//清除雨情
}

//退出全屏
function exitScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  if (typeof cfs != "undefined" && cfs) {
    cfs.call(el);
  }
}


function allHide() {
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  var width = $(window).width();
  var height = $(window).height();
  $("#waterProject").hide();
  $(".iframe-class").show();
  $(".form_wrap").show();
  $(".nav").show();
  $(".container-fluid").css({ "width": width, "height": height });
  $(".container").css({ "width": width, "height": height, "top": 70 });
  //$("#cesiumContainer").css("height", height);
  //$("#waterProject").css({ "width": screenWidth, "height": screenHeight });
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
  for (var item in waterProjectCurrentObject) {
    if(item == "" || item == null || item == undefined){

    }else{
      waterProjectCurrentObject[item].removeTyphoon();
    }
  }
  waterProjectCurrentObject={};
  $("#typhoonContaner").hide();
  clearPlayContent();//清空播放内容
  removeStationList();//清除站点
  removeRainfallLayer();//清除雨情
  deleteEmbankmentLine();//删除堤岸线
  $(".waterProjectProducePop").hide();
  $(".waterProjectTidePop").remove();
}

function fullOrExit() {
  var el = document.documentElement;
  var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
  //执行全屏
  if (typeof rfs != "undefined" && rfs) {
    rfs.call(el);
  } else if (typeof window.ActiveXObject != "undefined") {
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript != null) {
      wscript.SendKeys("{F11}");
    }
  }
  //监听不同浏览器的全屏事件，并件执行相应的代码
  document.addEventListener("webkitfullscreenchange", function () {//
    if (document.webkitIsFullScreen) {
      //全屏后要执行的代码
      allShow();
      $("#waterProjectCase").show();
      $("#forecastPlayCase").hide();
      $("#stationPredictdataCase").hide();
      $(".waterProjectBodyItem").hide();
      //$(".rainTimeItem").eq(0).trigger("click");
      $(".rainLegendBody").hide();
      $(".rainLegendTitle").removeClass("rainRotate");
      $(".waterProjectNavItem").eq(0).trigger("click");
    } else {
      //退出全屏后执行的代码
      allHide();
    }
  }, false);
  document.addEventListener("fullscreenchange", function () {
    if (document.fullscreen) {
      //全屏后执行的代码
      allShow();
      $("#waterProjectCase").show();
      $("#forecastPlayCase").hide();
      $("#stationPredictdataCase").hide();
      $(".waterProjectBodyItem").hide();
      //$(".rainTimeItem").eq(0).trigger("click");
      $(".rainLegendBody").hide();
      $(".rainLegendTitle").removeClass("rainRotate");
      $(".waterProjectNavItem").eq(0).trigger("click");
    } else {
      //退出全屏后要执行的代码
      allHide();
    }
  }, false);
  document.addEventListener("mozfullscreenchange", function () {
    if (document.mozFullScreen) {
      //全屏后要执行的代码
      allShow();
      $("#waterProjectCase").show();
      $("#forecastPlayCase").hide();
      $("#stationPredictdataCase").hide();
      $(".waterProjectBodyItem").hide();
      //$(".rainTimeItem").eq(0).trigger("click");
      $(".rainLegendBody").hide();
      $(".rainLegendTitle").removeClass("rainRotate");
      $(".waterProjectNavItem").eq(0).trigger("click");
    } else {
      //退出全屏后要执行的代码
      allHide();
    }
  }, false);
  document.addEventListener("msfullscreenchange", function () {
    if (document.msFullscreenElement) {
      //全屏后要执行的代码
      allShow();
      $("#waterProjectCase").show();
      $("#forecastPlayCase").hide();
      $("#stationPredictdataCase").hide();
      $(".waterProjectBodyItem").hide();
      //$(".rainTimeItem").eq(0).trigger("click");
      $(".rainLegendBody").hide();
      $(".rainLegendTitle").removeClass("rainRotate");
      $(".waterProjectNavItem").eq(0).trigger("click");
    } else {
      //退出全屏后要执行的代码
      allHide();
    }
  }, false);
}


// 角色权限
var role = {
  '0': '超级管理员',
  '1': '高级预报员',
  '2': '预报员'
}

