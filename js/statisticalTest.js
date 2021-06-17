// var siteNameList=[],siteNumberList=[],siteCityList=[];
// $(function(){
//     /*****************统计检验*******************/
//     //统计检验
//     $("#statisicTest").click(function(){
//         $(".statistic-test").show();
//     });
//     //统计检验弹窗关闭
//     $(".statistic-closeBtn").click(function(){
//         $(this).parent().parent().hide();
//     });
//     //统计检验过程曲线和统计列表导航切换
//     $(".statistic-title-txt").click(function(){
//         var index=$(this).index();
//         $(this).addClass("statistic-title-txtClick");
//         $(this).siblings(".statistic-title-txt").removeClass("statistic-title-txtClick");
//         $(this).parent().siblings(".statistic-test-body").find(".statistic-body-item").eq(index).show();
//         $(this).parent().siblings(".statistic-test-body").find(".statistic-body-item").eq(index).siblings().hide();
//     });
//     $(".statistic-title-txt").eq(0).trigger("click");
//     $(".statisic-drop-ul").find("li").click(function(){
//         $(this).toggleClass("drop-li-active");
//     });
//     //站点选择
//     $(".statistic-drop-select").click(function(e){
//         $(this).toggleClass("statistic-drop-selectActive");
//         if($(this).hasClass("statistic-drop-selectActive")){
//             var length = $(".statisic-drop-list").find(".statisic-drop-ul").find("li.drop-li-active").length;
//             if(length == 0){
//                 $(".statisic-drop-list").show();
//                 $(".statisic-drop-listSub").hide();
//             }else{
//                 $(".statisic-drop-list").show();
//                 $(".statisic-drop-listSub").show();
//             }
//         }else{
//             $(".statisic-drop-list").hide();
//             $(".statisic-drop-listSub").hide();
//         }
//         //获取站点地址列表
//         $ajax('/web/station/queryStationCitys',{},function(res){
//             var data = res.data;
//             if(data.length==0){

//             }else{
//                 var addressHtml='';
//                 for(var i=0;i<data.length;i++){
//                     addressHtml=addressHtml+'<li>'+
//                         '<span class="drop-check"></span>'+
//                         '<span class="drop-name">'+data[i].cityName+'</span>'+
//                         '<span class="layui-icon drop-ul-icon">&#xe602;</span>'+
//                     '</li>';
//                 }
//                 $(".statisic-drop-list").find(".statisic-drop-ul").html(addressHtml);
//                 getSiteByCityName();
//             }
//         });
//         e.stopPropagation();
//     });
//     //统计检验预测时间
//     var now=new Date((new Date()).getTime()).Format("yyyy-MM-dd hh:mm");
//     var threeDayPrev=new Date((new Date()).getTime()-3*24*60*60*1000).Format("yyyy-MM-dd hh:mm");
//     $(".statistic-select-time").text(threeDayPrev+' 至 '+now);
//     //统计检验站点选择
//     $(document).click(function(){
//         $(".statistic-drop-select").removeClass("statistic-drop-selectActive");
//         $(".statisic-drop-list").hide();
//         $(".statisic-drop-listSub").hide();
//     });
// });
// //根据城市获取站点信息列表
// function getSiteByCityName(){
//     $(".statisic-drop-list").find(".statisic-drop-ul").off("click").on("click","li",function(e){
//         $(".statisic-drop-listSub").show();
//         $(this).toggleClass("drop-li-active");
//         var text=$(this).find(".drop-name").text();
//         var isActive;
//         if($(this).hasClass("drop-li-active")){
//             isActive='drop-li-active';
//             siteCityList.push(text);
//         }else{
//             isActive='';
//             for(var i=0;i<siteCityList.length;i++){
//                 if(siteCityList[i].indexOf(text) == "-1"){
                    
//                 }else{
//                     siteCityList.splice(i,1);
//                 }
//             }
//         }
//         //站点列表
//         $ajax('/web/station/queryStationNameByCity', { 'cityName' : text }, function(res){
//             var data = res.data;
//             var subTxtHtml='';
//             for(var i=0;i<data.length;i++){
//                 subTxtHtml=subTxtHtml+'<li data-address="'+text+'" data-id="'+data[i].stationNumber+'" class="'+isActive+'">'+
//                     '<span class="drop-check"></span>'+
//                     '<span class="drop-name">'+data[i].stationName+'</span>'+
//                     //'<span class="drop-ul-alertIcon"></span>'+
//                 '</li>';
//             }
//             $(".statisic-drop-listSub").find(".statisic-drop-ul").html(subTxtHtml);
//             siteSelect();
//             siteDel();
//             $(".statisic-drop-listSub").find(".statisic-drop-ul").find("li").each(function(){
//                 var txt=$(this).find(".drop-name").text();
//                 var id=$(this).attr("data-id");
//                 if(text == $(this).attr("data-address")){
//                     if($(this).hasClass("drop-li-active")){
//                         siteNameList.push(txt);
//                         siteNumberList.push(id);
//                     }else{
//                         for(var i=0;i<siteNameList.length;i++){
//                             if(siteNameList[i] == txt){
//                                 siteNameList.splice(i,1);
//                             }
//                         }
//                         for(var i=0;i<siteNumberList.length;i++){
//                             if(siteNumberList[i] == id){
//                                 siteNumberList.splice(i,1);
//                             }
//                         }
//                     }
//                 }else{

//                 }
//             });
//             if(siteCityList.length == 0){
//                 $(".statistic-drop-select").find(".drop-down-txt-name").text("请选择");
//                 $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-city",'');
//                 $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-name",'');
//                 $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-number",'');
//                 $(".drop-down-txt-clear").hide();
//                 $(".drop-down-txt-num").hide();
//             }else{
//                 $(".statistic-drop-select").find(".drop-down-txt-name").text(siteCityList[0]+siteNameList[0]);
//                 $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-city",siteCityList[0]);
//                 $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-name",siteNameList[0]);
//                 $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-number",siteNumberList[0]);
//                 $(".drop-down-txt-clear").show();
//                 $(".drop-down-txt-num").show().text(siteNameList.length);
//             }
//         });
//         e.stopPropagation();
//     });
// }
// //站点选择
// function siteSelect(){
//     $(".statisic-drop-listSub").find(".statisic-drop-ul").off("click").on("click","li",function(e){
//         $(this).toggleClass("drop-li-active");
//         var text=$(this).find(".drop-name").text();
//         var id=$(this).attr("data-id");
//         var siteAddressHtml=$(this).attr("data-address");
//         //判断子菜单栏是否有选项选择，有则勾选对应的父级菜单栏，无则取消对应的勾选
//         var length = $(".statisic-drop-listSub").find(".statisic-drop-ul").find("li.drop-li-active").length;
//         if(length == 0){
//             $(".statisic-drop-list").find(".statisic-drop-ul").find("li").each(function(){
//                 if($(this).find(".drop-name").text() == siteAddressHtml){
//                     $(this).removeClass("drop-li-active");
//                 }else{

//                 }
//             });
//             for(var i=0;i<siteCityList.length;i++){
//                 if(siteCityList[i].indexOf(siteAddressHtml) == "-1"){

//                 }else{
//                     siteCityList.splice(i,1);
//                 }
//             }
//         }else{
//             $(".statisic-drop-list").find(".statisic-drop-ul").find("li").each(function(){
//                 if($(this).find(".drop-name").text() == siteAddressHtml){
//                     $(this).addClass("drop-li-active");
//                 }else{

//                 }
//             });
//             siteCityList.push(siteAddressHtml);
//             unique(siteCityList);
//         }
//         if($(this).hasClass("drop-li-active")){
//             siteNameList.push(text);
//             siteNumberList.push(id);
//         }else{
//             for(var i=0;i<siteNameList.length;i++){
//                 if(siteNameList[i] == text){
//                     siteNameList.splice(i,1);
//                 }
//             }
//             for(var i=0;i<siteNumberList.length;i++){
//                 if(siteNumberList[i] == id){
//                     siteNumberList.splice(i,1);
//                 }
//             }
//         }
//         if(siteCityList.length == 0){
//             $(".statistic-drop-select").find(".drop-down-txt-name").text("请选择");
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-city",'');
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-name",'');
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-number",'');
//             $(".drop-down-txt-clear").hide();
//             $(".drop-down-txt-num").hide();
//         }else{
//             $(".statistic-drop-select").find(".drop-down-txt-name").text(siteCityList[0]+siteNameList[0]);
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-city",siteCityList[0]);
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-name",siteNameList[0]);
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-number",siteNumberList[0]);
//             $(".drop-down-txt-clear").show();
//             $(".drop-down-txt-num").show().text(siteNameList.length);
//         }
//         e.stopPropagation();
//     });
// }
// //站点删除
// function siteDel(){
//     $(".drop-down-txt-clear").unbind("click").click(function(e){
//         var text=$(this).siblings(".drop-down-txt-name").text();
//         var city=$(this).siblings(".drop-down-txt-name").attr("data-city");
//         var name=$(this).siblings(".drop-down-txt-name").attr("data-name");
//         var number=$(this).siblings(".drop-down-txt-name").attr("data-number");
//         $(".statisic-drop-listSub").find(".statisic-drop-ul").find("li").each(function(){
//             if($(this).find(".drop-name").text() == name){
//                 $(this).removeClass("drop-li-active");
//             }
//         });
//         for(var i=0;i<siteNameList.length;i++){
//             if(siteNameList[i]==name){
//                 siteNameList.splice(i,1);
//             }
//         }
//         for(var i=0;i<siteNumberList.length;i++){
//             if(siteNumberList[i]==number){
//                 siteNumberList.splice(i,1);
//             }
//         }
//         var length = $(".statisic-drop-listSub").find(".statisic-drop-ul").find("li.drop-li-active").length;
//         var siteAddressHtml = $(".statisic-drop-listSub").find(".statisic-drop-ul").find("li").attr("data-address");
//         if(length == 0){
//             $(".statisic-drop-list").find(".statisic-drop-ul").find("li").each(function(){
//                 if($(this).find(".drop-name").text() == siteAddressHtml){
//                     $(this).removeClass("drop-li-active");
//                 }else{

//                 }
//             });
//             for(var i=0;i<siteCityList.length;i++){
//                 if(siteCityList[i].indexOf(siteAddressHtml) == "-1"){

//                 }else{
//                     siteCityList.splice(i,1);
//                 }
//             }
//         }else{
//             $(".statisic-drop-list").find(".statisic-drop-ul").find("li").each(function(){
//                 if($(this).find(".drop-name").text() == siteAddressHtml){
//                     $(this).addClass("drop-li-active");
//                 }else{

//                 }
//             });
//             siteCityList.push(siteAddressHtml);
//             unique(siteCityList);
//         }
//         if(siteCityList.length == 0){
//             $(".statistic-drop-select").find(".drop-down-txt-name").text("请选择");
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-city",'');
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-name",'');
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-number",'');
//             $(".drop-down-txt-clear").hide();
//             $(".drop-down-txt-num").hide();
//         }else{
//             $(".statistic-drop-select").find(".drop-down-txt-name").text(siteCityList[0]+siteNameList[0]);
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-city",siteCityList[0]);
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-name",siteNameList[0]);
//             $(".statistic-drop-select").find(".drop-down-txt-name").attr("data-number",siteNumberList[0]);
//             $(".drop-down-txt-clear").show();
//             $(".drop-down-txt-num").show().text(siteNameList.length);
//         }
//         e.stopPropagation();
//     });
// }
// //数组去重
// function unique (arr) {
//     for(var i=0; i<arr.length; i++){
//         for(var j=i+1; j<arr.length; j++){
//             if(arr[i].address==arr[j].address){         
//                 arr.splice(j,1);
//                 j--;
//             }
//         }
//     }
//     return arr;
// }