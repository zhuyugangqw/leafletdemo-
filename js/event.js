//清除测距
function clearMeasureDistanceBtn(){
    $('.distance-btn').removeClass('active')
}
$(function() {
    // 下拉别表动画
    function dropDwonAnimation (ele, checkVal) {
        ele.parent().prev('.dropdown_select').children('span').text(checkVal)
        ele.parent().toggle()
        ele.addClass('active').siblings().removeClass('active')
    }
    // 下拉列表事件
    $('.dropdown_select').click(function () {
        $(this).parent().find('.dropdown_list').toggle()
    })
    $('.dropdown_one .dropdown_item').click(function () {
        var checkVal = $(this).children('span').text();
        dropDwonAnimation($(this), checkVal);
        // 图层切换
        setImageryViewModels(checkVal);
    })
    $('.dropdown_two .dropdown_item').click(function () {
        var checkVal = $(this).children('span').text()
        dropDwonAnimation($(this), checkVal)
        // 海温海流切换
    })
    // 定位
    $('.location-btn').click(function () {
        //viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(113.517628, 23.353899, 200000)})
        var areaCity = $(".nav-other-selectSmall").text();
        setCameraByArea(areaCity);
    })
    // 测距
    $('.distance-btn').click(function() {
        // TODO：测距函数
        $(this).addClass('active')
        new measureDistance(viewer)
    })

    // 缩放
    $('.zoom-btn .zoom-btn-substract').click(function() {
        zoomOut();
    })
    $('.zoom-btn .zoom-btn-add').click(function () {
        zoomIn();
    })
    $('.zoom-btnSmall .zoom-btn-substract').click(function() {
        zoomOutTy();
    })
    $('.zoom-btnSmall .zoom-btn-add').click(function () {
        zoomInTy();
    })
})