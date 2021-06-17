/**
 * 鼠标单击事件
 */
handler.setInputAction(function (movement) {
    var drillPick = scene.drillPick(movement.position);
    var pick = scene.pick(movement.position);
    // 弹出台风信息框
    var inTyphoonPopup = typhoonPopup(drillPick, movement);
    // 站点点击
    var inStationClick = stationClick(pick);
    // 漫堤线段点击折线图
    var inClickEmbankmentLine = clickEmbankmentLine(pick, movement.position);
    // 风暴潮水面任意点点击折线图
    if(inTyphoonPopup || inStationClick || inClickEmbankmentLine) {
        return
    }
    clickWatrStormAnyShowLine(drillPick, movement.position);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

/**
 * 鼠标悬停事件
 */
handler.setInputAction(function (movement) {
    var pick = scene.pick(movement.endPosition);
    var drillPick = scene.drillPick(movement.endPosition);
    // 站点悬停标签
    mouseMoveStation(drillPick, movement.endPosition);
    // 漫堤悬停样式
    mouseMoveEmbankmentLine(pick, movement.endPosition);
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

/**
 * 地球监听
 */
function earthAction() {
    // 根据高度判断站点显示
    showStationByHight();
    // 站点折线图位置
    stationTablePosition();
    // 风暴潮折线图位置
    stromLinePosition();
    // 漫堤线段折线图位置
    embankmentLinePosition();
    // 根据高度判断动态水显示
    showRiverByHeight();
    // 清除一些数据
    removeTyphoonLightPoint();
}
scene.postRender.addEventListener(earthAction)

/**
 * 小地球监听
 */
viewerTy.clock.onTick.addEventListener(function (clock) {
    readTimes = clock._currentTime
    var timelineDot = document.getElementsByClassName('cesium-timeline-icon16')[0]
    var clientWidth = 0
    var timeLineTime = 0
    if (timelineDot) {
        var style = timelineDot.getAttribute('style')
        clientWidth = parseFloat(style.split(';')[0].split(':')[1])
        // console.log(new Date(clock._currentTime))
        timeLineTime = moment(new Date(clock._currentTime)).format('MM-DD HH:00')
        // if (clientWidth < 0) {
        //   clientWidth = 0
        //
        $('.timeline-tig').css('left', clientWidth + 8 + 'px')
        if (clientWidth < 0) {
            clientWidth = 0
        }
        $('.timeline-bar').css('width', clientWidth + 'px')
        $('.timeline-tig').html(timeLineTime)
    }
    var currentTime = new Date(clock._currentTime)
    var newLinetime = currentTime.getHours()
    if (viewerTy.clockViewModel.shouldAnimate) {
        $('.control_btn .stop').removeClass('play')
    } else if (viewerTy.clockViewModel.canAnimate) {
        $('.control_btn .stop').addClass('play');
    }
    // 历史增水
    if (newLinetime !== lastLineTime) {
        var queryTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours()).getTime()
        //    removeSimilarTyStationList()
        //   waterSiteInfoAllDelete()
        //   loadsimilarTyStationList(currentTyNumber, queryTime)

        // 预报内容
        // } else if (pageIndex === 2) {
        // if (reportContext === '风暴潮预报') {
        // var queryTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours()).getTime() / 1000
        if (queryTime) {
            // updateStormForecastKMZ('', queryTime)
            updateStormForecastPNG('', queryTime)
        }
        lastLineTime = newLinetime
        viewerTy.clockViewModel.multiplier = 2500

        // 风暴潮场景库时间轴播放时，台风高亮点
        if(menuStatus == '风暴潮场景库') {
            var timeLineTime = new Date(readTimes).getTime();
            setTyphoonLightPointByTime(timeLineTime);
        }else if(menuStatus == '水情专题大屏'){
            var timeLineTime = new Date(readTimes).getTime();
            setTyphoonLightPointByTime(timeLineTime);
        }
    }
    // }
});
viewerTy.clock.onStop.addEventListener(function (clock) {
    $('.control_btn .stop').addClass('play')
    isPlay = false
})

var timelineHtml = document.getElementsByClassName('cesium-timeline-bar');
/**
 * 时间轴鼠标单击
 */
timelineHtml[0].onclick = function() {
    var timeLineTime = new Date(viewerTy.clock.currentTime).getTime();
    setTyphoonLightPointByTime(timeLineTime)
}