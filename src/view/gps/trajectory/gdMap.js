// import AMap from 'AMap';
// import AMapUI from 'AMapUI';
// function GDMAP () {
//     // 当前地图
//     var mapobj = null;
//     // 点覆盖物数组
//     var mapOverlay = new Map();
//     // 气泡框
//     var boxInfo = null;
//     // 线
//     var mapOverlayLine = [];
//     // 点聚合
//     var cluster = null;
//     // 路况
//     var trafficLayer = null;
//     // 设置卫星图层
//     var satellLayer = null;
//     // 浏览器定位
//     var geolocation = null;
//     // 行政编码
//     var district = null;
//     var wInfo = function (box) {
//         var lnglat = new AMap.LngLat(box.lng, box.lat);
//         if (!boxInfo) {
//             var info = new AMap.InfoWindow({
//                 content: box.content,
//                 offset: new AMap.Pixel(0, 0),
//                 position: lnglat
//             });
//             boxInfo = { key: box.key, windowInfo: info };
//         } else {
//             boxInfo.windowInfo.setContent(box.content);
//             boxInfo.windowInfo.setPosition(lnglat);
//             boxInfo.key = box.key;// { key: , windowInfo: info };
//         }
//         boxInfo.windowInfo.open(mapobj, lnglat);
//         var close = AMap.event.addListener(boxInfo.windowInfo, 'close', function (e) {
//             boxInfo = null;
//         });
//     };
//     // 打开去破口、、
//     this.openWf = function (box) {
//         wInfo(box);
//     };
//     // 气泡框的key
//     this.getCurentBoxKey = function () {
//         if (boxInfo) {
//             return boxInfo.key;
//         }
//         return null;
//     };
//
//     this.init = function (divid, opt, callback) {
//         opt = opt || {};
//         mapobj = new AMap.Map(divid, {
//             zooms: [4, 20],
//             zoom: opt.zoom,
//             resizeEnable: true,
//             center: [opt.center[0], opt.center[1]]
//         });
//         mapOverlay.clear(); // 进行初始化
//
//         if (callback) {
//             callback();
//         }
//     },
//     // 浏览器定位
//     this.getCurrentPosition = function () {
//         if (!geolocation) {
//             mapobj.plugin('AMap.Geolocation', function () {
//                 geolocation = new AMap.Geolocation({
//                     enableHighAccuracy: true, // 是否使用高精度定位，默认:true
//                     timeout: 10000, // 超过10秒后停止定位，默认：无穷大
//                     buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
//                     zoomToAccuracy: false, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
//                     buttonPosition: 'RB'
//                 });
//                 mapobj.addControl(geolocation);
//                 geolocation.getCurrentPosition();
//             });
//         } else { geolocation.getCurrentPosition(); }
//     },
//     // 设置工具条
//     this.toolBar = function (container) {
//         let myScale = new AMap.Scale({
//                 visible: true
//             }),
//             toolBar = new AMap.ToolBar({
//                 visible: true
//             }),
//             overView = new AMap.OverView({
//                 visible: true
//             });
//         overView.open(); // 展开鹰眼
//         mapobj.addControl(myScale);
//         mapobj.addControl(toolBar);
//         mapobj.addControl(overView);
//     },
//     // 简单的地图画点
//     this.simpleDrawMark = function (opt, cb) {
//         var lnglat = new AMap.LngLat(opt.lng, opt.lat);
//         var markLabe1 = new AMap.Marker({
//             position: lnglat,
//             icon: opt.icon// "/Resources/empty.png",
//         });
//         markLabe1.setMap(mapobj);
//         // 设置label标签
//         markLabe1.setLabel({// label默认蓝框白底左上角显示，样式className为：AMap-marker-label
//             offset: new AMap.Pixel(22, 20), // 修改label相对于maker的位置
//             content: opt.labeltxt
//         });
//         if (cb) {
//             cb();
//         }
//     };
//     // 添加点
//     this.drawMark = function (opt, callback, mclick) {
//         if (opt.length > 0) {
//             var existMark = [], noexistMark = [];
//             for (var j = 0; j < opt.length; j++) {
//                 var ots = opt[j];
//                 var mark = mapOverlay.has(ots.key);
//                 if (!mark) {
//                     noexistMark.push(ots);
//                 } else { existMark.push(ots); }
//             }
//             if (existMark.length > 0) {
//                 this.updateMark(existMark);
//             }
//
//             for (var i = 0; i < noexistMark.length; i++) {
//                 var ot = opt[i];
//                 var lnglat = new AMap.LngLat(ot.lng, ot.lat);
//                 if (ot.labeltxt) {
//                     var markLabe1 = new AMap.Marker({
//                         position: lnglat,
//                         icon: '/Resources/empty.png'
//                     });
//                     markLabe1.setMap(mapobj);
//                     // 设置label标签
//                     markLabe1.setLabel({// label默认蓝框白底左上角显示，样式className为：AMap-marker-label
//                         offset: new AMap.Pixel(22, 20), // 修改label相对于maker的位置
//                         content: ot.labeltxt
//                     });
//                 }
//                 var marker = this.addIcon(ot, mclick);
//                 marker.setMap(mapobj);
//                 mapOverlay.set(ot.key, { 'overlayInfo': marker, 'overlayOther': markLabe1 });
//                 // mapOverlay[ot.key] = { "overlayInfo": marker, "overlayOther": markLabe1 }; //保存状态
//             }
//         }
//         if (callback) {
//             callback();
//         }
//     },
//     // 更新点
//     this.updateMark = function (opt, callback) {
//         for (var i = 0; i < opt.length; i++) {
//             var ot = opt[i];
//             var mark = mapOverlay.get(ot.key);
//             if (mark === undefined) continue;
//             var lnglat = new AMap.LngLat(ot.lng, ot.lat);
//             var icon = mark.overlayInfo;
//             var lable = mark.overlayOther;
//             if (icon) {
//                 icon.setPosition(lnglat);
//                 icon.setExtData(ot);
//                 icon.setIcon(ot.icon);
//                 icon.setAngle(ot.angle);
//             }
//             if (lable) {
//                 lable.setPosition(lnglat);
//                 lable.setExtData(ot);
//                 lable.setLabel({// label默认蓝框白底左上角显示，样式className为：AMap-marker-label
//                     offset: new AMap.Pixel(22, 20), // 修改label相对于maker的位置
//                     content: ot.labeltxt
//                 });
//             }
//             if (ot.isbound) {
//                 var bounds = mapobj.getBounds();
//                 if (!bounds.contains(lnglat)) {
//                     this.setCenter(ot.lng, ot.lat);
//                 }
//             }
//         }
//         if (callback) {
//             callback();
//         }
//     };
//     // 添加icon
//     this.addIcon = function (option, callback) {
//         var marker = new AMap.Marker({
//             position: [option.lng, option.lat],
//             icon: option.icon,
//             extData: option,
//             angle: option.angle,
//             offset: new AMap.Pixel(-8, -6)
//         });
//         var clickHandle = AMap.event.addListener(marker, 'click', function (e) {
//             var box = marker.getExtData();
//             wInfo(box);
//             if (callback) {
//                 callback(box);
//             }
//         });
//         return marker;
//     },
//     // 画线
//     this.drawLine = function (opt) {
//         if (opt) {
//             var arry = [];
//             for (var i in opt.path) {
//                 var msd = opt.path[i];
//                 arry.push(new AMap.LngLat(msd.lng, msd.lat));
//             }
//             var polyline = new AMap.Polyline({
//                 path: arry, // 设置线覆盖物路径
//                 strokeColor: opt.strokeColor, // 线颜色
//                 strokeOpacity: opt.strokeOpacity, // 线透明度
//                 strokeWeight: opt.strokeWeight, // 线宽
//                 strokeStyle: opt.strokeStyle, // 线样式
//                 fillColor: opt.fillColor,
//                 // strokeColor: '#CC66CC',
//                 // fillColor: '#CCF3FF',
//                 fillOpacity: 0.5
//
//             });
//             polyline.setMap(mapobj);
//             mapobj.setFitView(polyline);// 地图自适应
//             mapOverlayLine[opt.key] = polyline; // 保存状态
//         }
//     },
//
//     // 移除地图覆盖物
//     this.removeOverlays = function (key, callback) {
//         var mapInfo = mapOverlay.get(key);
//         if (mapInfo !== undefined) {
//             if (mapInfo.overlayInfo) {
//                 if (cluster) {
//                     cluster.removeMarker(mapInfo.overlayInfo);
//                 }
//                 if (mapInfo.overlayInfo) {
//                     mapInfo.overlayInfo.setMap(null);
//                 }
//                 if (mapInfo.overlayOther) {
//                     mapInfo.overlayOther.setMap(null);
//                 }
//                 mapOverlay.delete(key);
//                 // delete mapOverlay[key];
//             }
//             if (boxInfo) {
//                 if (boxInfo.key === key) {
//                     boxInfo.windowInfo.close();
//                 }
//             }
//         }
//         // 移除线
//         var line = mapOverlayLine[key];
//         if (line) {
//             line.setMap(null);
//         }
//         if (callback) {
//             callback();
//         }
//     },
//     // 移除所有地图覆盖物
//     this.removeAllOverlays = function (callback) {
//         mapobj.clearMap();
//         mapOverlay.clear();
//         this.windowBox = null;
//         mapOverlayLine = [];
//         if (callback) {
//             callback();
//         }
//         this.clearCluster();
//     },
//     // 设置中心点,设置级别
//     this.setZoomAndCenter = function (zoom, x, y) {
//         mapobj.setZoomAndCenter(zoom, [x, y]);
//     };
//     // 设置中心点
//     this.setCenter = function (x, y) {
//         var lnglat = new AMap.LngLat(x, y);
//         mapobj.setCenter(lnglat);
//     };
//     // 设置交通路况
//     this.road = function (view) {
//         if (trafficLayer === null) {
//             trafficLayer = new AMap.TileLayer.Traffic({
//                 zIndex: 10
//             });
//             trafficLayer.setMap(mapobj);
//         }
//         if (view) {
//             trafficLayer.show();
//         } else {
//             trafficLayer.hide();
//         }
//     };
//     // 设置卫星图层
//     this.setSatellLayer = function (view) {
//         if (view) {
//             satellLayer = new AMap.TileLayer.Satellite({ zIndex: 10 }); // 实例化卫星图
//             satellLayer.setMap(mapobj); // 在map中添加卫星图
//         } else {
//             satellLayer.setMap(null);
//         }
//     };
//     // 批量添加点聚合点
//     this.addMarkerCluster = function (opt, callback, mclick) {
//         if (opt.length > 0) {
//             var existMark = [], noexistMark = [];
//             for (var j = 0; j < opt.length; j++) {
//                 var ots = opt[j];
//                 var mark = mapOverlay.has(ots.key);
//                 if (!mark) {
//                     noexistMark.push(ots);
//                 } else { existMark.push(ots); }
//             }
//             if (existMark.length > 0) {
//                 this.updateMarkCluster(existMark);
//             }
//             var cmarks = [];
//             for (var i = 0; i < noexistMark.length; i++) {
//                 var ot = noexistMark[i];
//                 var marker = this.addIcon(ot, mclick);
//                 if (ot.labeltxt) {
//                     marker.setLabel({// label默认蓝框白底左上角显示，样式className为：AMap-marker-label
//                         offset: new AMap.Pixel(22, 20), // 修改label相对于maker的位置
//                         content: ot.labeltxt
//                     });
//                 }
//                 cmarks.push(marker);
//                 // mapOverlay[ot.key] = { "overlayInfo": marker, "overlayOther": null }; //保存状态
//                 mapOverlay.set(ot.key, { 'overlayInfo': marker, 'overlayOther': null });
//             }
//         }
//         if (!cluster) {
//             mapobj.plugin(['AMap.MarkerClusterer'], function () {
//                 cluster = new AMap.MarkerClusterer(mapobj, cmarks, {
//                     maxZoom: 17
//                 });
//             });
//         } else {
//             cluster.addMarkers(cmarks);
//         }
//
//         if (callback) {
//             callback();
//         }
//     };
//     // 更新聚合点
//     this.updateMarkCluster = function (opt, callback) {
//         for (var i = 0; i < opt.length; i++) {
//             var ot = opt[i];
//             var mark = mapOverlay.get(ot.key);
//             if (mark === undefined) continue;
//             var lnglat = new AMap.LngLat(ot.lng, ot.lat);
//             var icon = mark.overlayInfo;
//             // var lable = mark.overlayOther;
//             if (icon) {
//                 icon.setPosition(lnglat);
//                 icon.setExtData(ot);
//                 icon.setIcon(ot.icon);
//                 icon.setAngle(ot.angle);
//                 // 2017-02-06
//                 if (ot.labeltxt) {
//                     icon.setLabel({// label默认蓝框白底左上角显示，样式className为：AMap-marker-label
//                         offset: new AMap.Pixel(22, 20), // 修改label相对于maker的位置
//                         content: ot.labeltxt
//                     });
//                 }
//             }
//             // if (lable) {
//             //    lable.setPosition(lnglat);
//             //    lable.setExtData(ot);
//             //    lable.setLabel({//label默认蓝框白底左上角显示，样式className为：AMap-marker-label
//             //        offset: new AMap.Pixel(22, 20),//修改label相对于maker的位置
//             //        content: ot.labeltxt,
//             //    });
//             // }
//             if (ot.isbound) {
//                 var bounds = mapobj.getBounds();
//                 if (!bounds.contains(lnglat)) {
//                     this.setCenter(ot.lng, ot.lat);
//                 }
//             }
//         }
//
//         // cluster.setMarkers();
//         if (callback) {
//             callback();
//         }
//     };
//     // 批量移除点聚合点标记
//     this.removeMarkers = function (mark) {
//         let omark = [];
//         if (!cluster) return;
//         let m = mapOverlay.get(mark);
//         if (m) {
//             cluster.removeMarker(m.overlayInfo);
//             if (boxInfo && mark === boxInfo.key) {
//                 boxInfo.windowInfo.close();
//             }
//         }
//     };
//     // 清除点聚合点标记
//     this.clearMarkersAll = function () {
//         if (cluster) {
//             cluster.clearMarkers();
//             mapOverlay.clear();
//             if (boxInfo) {
//                 boxInfo.windowInfo.close();
//             }
//         }
//     };
//     // 移除点聚合
//     this.clearCluster = function () {
//         if (cluster) {
//             cluster.setMap(null);
//             cluster = null;
//         }
//     };
//     // 鼠标工具
//     this.mapMouseTool = function () {
//         let mouseTool = null;
//         let clickListener = null;
//         let dfValue = {
//             radius: 0,
//             points: null,
//             toolType: null
//
//         };
//         let remove = function () {
//             if (clickListener) {
//                 AMap.event.removeListener(clickListener);// 移除事件，以绑定时返回的对象作为参数
//             }
//         };
//         this.init = function () {
//             mapobj.plugin(['AMap.MouseTool'], function () {
//                 mouseTool = new AMap.MouseTool(mapobj);
//             });
//         };
//         this.setMouseToolType = function (toolType, callback) {
//             dfValue.toolType = toolType;
//             dfValue.points = null,
//             dfValue.radius = null,
//             mapobj.clearMap();
//             remove(); // 防止重复绑定
//             clickListener = AMap.event.addListener(mouseTool, 'draw', function (e) {
//                 switch (e.obj.CLASS_NAME) {
//                     case 'AMap.Circle':
//                         dfValue.radius = e.obj.getRadius();
//                         dfValue.points = e.obj.getCenter();
//                         break;
//                     case 'AMap.Polygon':
//                         dfValue.points = e.obj.getPath();
//                         break;
//                 }
//                 mouseTool.close();
//                 if (callback) {
//                     callback(JSON.stringify(dfValue));
//                 }
//             });
//
//             switch (toolType) {
//                 case 'Circle':
//                     mouseTool.circle();
//                     break;
//                 case 'Polygon':
//                     mouseTool.polygon();
//                     break;
//                 case 'Area':
//                     mouseTool.rectangle();
//                     break;
//             }
//         };
//
//         this.init();
//     };
//     // poi查询
//     this.poiSearch = function (keyword, city = '福建省') {
//         mapobj.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
//             var autoOptions = {
//                 city: city, // 城市，默认全国
//                 input: keyword// 使用联想输入的input的id
//             };
//             var autocomplete = new AMap.Autocomplete(autoOptions);
//             var placeSearch = new AMap.PlaceSearch({
//                 city: city,
//                 map: mapobj
//             });
//             AMap.event.addListener(autocomplete, 'select', function (e) {
//                 if (boxInfo) {
//                     boxInfo.windowInfo.close();
//                 }
//                 // TODO 针对选中的poi实现自己的功能
//
//                 placeSearch.search(e.poi.name);
//             });
//         });
//     };
//     // 画圆形
//     this.drawCircle = function (opt) {
//         var center = new AMap.LngLat(opt.x, opt.y);// 圆心位置
//         var circle = new AMap.Circle({
//             center: center,
//             radius: opt.radius, // 半径
//             strokeColor: opt.strokeColor, // 线颜色
//             strokeOpacity: opt.strokeOpacity, // 线透明度
//             strokeWeight: opt.strokeWeight, // 线粗细度
//             fillColor: opt.fillColor, // 填充颜色
//             fillOpacity: opt.fillOpacity // 填充透明度
//         });
//         circle.setMap(mapobj);
//         var bounds = mapobj.getBounds();
//         if (!bounds.contains(center)) {
//             mapobj.setCenter(center);
//         }
//     };
//     // 画多边形
//     this.drawPolygon = function (opt) {
//         var polygon = new AMap.Polygon({
//             path: opt.path, // 设置多边形边界路径
//             strokeColor: opt.strokeColor, // 线颜色
//             strokeOpacity: opt.strokeOpacity, // 线透明度
//             strokeWeight: opt.strokeWeight, // 线粗细度
//             fillColor: opt.fillColor, // 填充颜色
//             fillOpacity: opt.fillOpacity // 填充透明度
//         });
//         polygon.setMap(mapobj);
//         mapOverlayLine[opt.key] = polygon; // 保存状态
//         // var center = new AMap.LngLat(opt.path[0].lng, opt.path[0].lat);// 圆心位置
//         // var bounds = mapobj.getBounds();
//         // if (!bounds.contains(center)) {
//         //    mapobj.setCenter(center);
//         // }
//     };
//     // 可视范围
//     this.setFitView = function () {
//         mapobj.setFitView();// 地图自适应
//     };
//     // 行政区划查询
//     this.districtSearch = function (adcode, level, callback) {
//         if (district === null) {
//             var opts = {
//                 subdistrict: 0, // 返回下一级行政区
//                 showbiz: false // 最后一级返回街道信息
//             };
//             district = new AMap.DistrictSearch(opts);// 注意：需要使用插件同步下发功能才能这样直接使用
//         }
//         district.setLevel(level); // 行政区级别
//         district.setExtensions('all');
//         district.search(adcode, function (status, result) {
//             // if (status == 'complete') {
//             // }
//             if (callback) { callback(result); }
//         });
//     };
// };
