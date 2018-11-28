<!--suppress ALL -->
<template>
    <div id="page">
        <Tabs>
            <TabPane label="地图" icon="logo-apple">
                <div>
                    <Layout>
                        <Sider collapsible :collapsed-width="15" v-model="isCollapsed" class="mySider"
                               :on-collapse="toggleTree()">
                            <div>
                                <Tree :data="treeData" :load-data="loadTreeData" show-checkbox multiple
                                      :class="treeClass"
                                      ref="vehicleTree"
                                      @on-check-change="getCheckedVehicles()"
                                ></Tree>
                            </div>
                        </Sider>
                        <Layout>
                            <Content style="{padding: '0 1px 1px'}">
                                <div id="baseMap" ref="map"></div>
                            </Content>
                        </Layout>
                    </Layout>
                </div>
                <div class="legendDiv">
                    <div class="legendTitle"><span style="color:black;font-weight:bold;">图案实例</span></div>
                    <ul class="legend">
                        <li>
                            <img src="../../../assets/images/car/绿.png">
                            <span>在线车辆</span>
                        </li>
                        <li>
                            <img src="../../../assets/images/car/红.png">
                            <span>报警车辆</span>
                        </li>
                        <li>
                            <img src="../../../assets/images/car/黄.png">
                            <span>不在线车辆</span>
                        </li>
                        <li>
                            <img src="../../../assets/images/car/灰.png">
                            <span>未定位车辆</span>
                        </li>
                    </ul>
                </div>
            </TabPane>
            <TabPane label="运单" icon="logo-windows">
                <Card>
                    <label>运单号查询：</label>
                    <i-input v-model="queryParams.waybillNo" placeholder="输入运单ID"
                             style="width: 200px" @on-keyup="handleQuery"></i-input>

                    <label>发货人查询：</label>
                    <i-input v-model="queryParams.consignor" placeholder="输入发货人姓名"
                             style="width: 160px" @on-keyup="handleQuery"></i-input>
                    <label>收货人查询：</label>
                    <i-input v-model="queryParams.receiver" placeholder="输入收货人姓名"
                             style="width: 160px" @on-keyup="handleQuery"></i-input>
                    <label>承运商查询：</label>
                    <i-input v-model="queryParams.carrierName" placeholder="输入承运商名称"
                             style="width: 160px" @on-keyup="handleQuery"></i-input>
                    <label>承运司机查询：</label>
                    <i-input v-model="queryParams.driverName" placeholder="输入承运司机姓名"
                             style="width: 160px" @on-keyup="handleQuery"></i-input>
                    <i-button type="primary" @click="handleQuery">查询</i-button>
                </Card>
                <Card>
                    <Table border :columns="tableHeader" :data="tableData"></Table>
                    <Page :current="pageParams.pageCurrent" :total="pageParams.pageTotal"
                          :page-size="pageParams.pageSize"
                          show-elevator show-total show-sizer placement="bottom" @on-change="changePageShow"
                          @on-page-size-change="changePageSize"></Page>
                </Card>
            </TabPane>
        </Tabs>
        <Modal id="trajectoryModal"
               title="车辆轨迹回放"
               v-model="trajectoryModal"
               :styles="{height:'100%',width:'98%',top:'1.5%'}">
            <div :style="{width:'100%'}" ref="modal">
                <Row>
                    <Col span="5">
                        <div>
                            <Card style="width:98%;margin-right: 2%;">
                                <div class="panel-body" style="font-size: 15px;font-weight: bold;">
                                    <ul class="list-unstyled">
                                        <li style="margin-bottom: 6px">
                                            <Select v-model="selectedDay" style="width:100%" @on-change="onDateChange"
                                                    placeholder="今天">
                                                <Option v-for="item in dayList" :value="item.value" :key="item.value">{{
                                                    item.label }}
                                                </Option>
                                            </Select>
                                        </li>
                                        <li style="margin-bottom: 6px">
                                            <DatePicker type="datetime" :value="timeSearchParams.beginTime"
                                                        placeholder="请选择开始时间" style="width: 100%"></DatePicker>
                                        </li>
                                        <li style="margin-bottom: 6px">
                                            <DatePicker type="datetime" :value="timeSearchParams.endTime"
                                                        placeholder="请选择结束时间" style="width: 100%"></DatePicker>
                                        </li>
                                    </ul>
                                    <div style="margin-top: 8px;margin-bottom: 5px;">
                                        <Button type="success" @click="getVehicleTrail">查询</Button>
                                        <Button type="success" @click="continueOrPauseVehicleTrail" ref="playButton">
                                            播放
                                        </Button>
                                        <Button type="success" @click="stopVehicleTrail">停止</Button>
                                        <Button type="success" @click="destroyVehicleTrail">销毁</Button>
                                        <Button type="primary" @click="" size="small" icon="ios-skipbackward"></Button>
                                        <Button type="primary" @click="" size="small" icon="ios-skipforward"></Button>
                                    </div>
                                    <div style="margin-top: 8px;margin-bottom: 5px;">
                                        <Progress :percent="25" hide-info status="active"></Progress>
                                    </div>
                                    <div style="margin-top: 8px;margin-bottom: 5px;">
                                        <Select v-model="playSpeed" style="width:100%" placeholder="请选择播放速度"
                                                @on-change="changePlaySpeed">
                                            <Option v-for="item in playSpeedList" :value="item.value" :key="item.value">
                                                {{ item.label }}
                                            </Option>
                                        </Select>
                                    </div>

                                </div>
                                <div style="height: 20px;"></div>
                                <Card>
                                    <div class="panel-body" style="font-size: 15px;font-weight: bold;">
                                        <ul class="list-unstyled">
                                            <li>车牌号码
                                                <div v-model="vehicleInfo.vehicleNo" class="text-success pull-right">
                                                    闽E33330黄
                                                </div>
                                            </li>
                                            <li>接收时间
                                                <div v-model="vehicleInfo.receiveTime"
                                                     class="text-success pull-right">fggfhgf
                                                </div>
                                            </li>
                                            <li>定位时间
                                                <div v-model="vehicleInfo.locateTime"
                                                     class="text-success pull-right"></div>
                                            </li>
                                            <li>报警次数
                                                <div v-model="vehicleInfo.alarmNum"
                                                     class="text-success pull-right"></div>
                                            </li>
                                            <li>文本位置
                                                <div v-model="vehicleInfo.textLocation"
                                                     class="text-success pull-right"></div>
                                            </li>
                                            <li>经 纬 度
                                                <div v-model="vehicleInfo.lnglat" class="text-success pull-right"></div>
                                            </li>
                                            <li>车辆时速
                                                <div v-model="vehicleInfo.speed" class="text-success pull-right"></div>
                                            </li>
                                            <li>行驶方向
                                                <div v-model="vehicleInfo.direction"
                                                     class="text-success pull-right"></div>
                                            </li>
                                            <li>累计里程
                                                <div v-model="vehicleInfo.mileage"
                                                     class="text-success pull-right"></div>
                                            </li>
                                            <li>报警类型
                                                <div v-model="vehicleInfo.alarmName"
                                                     class="text-success pull-right"></div>
                                            </li>
                                        </ul>
                                    </div>
                                </Card>
                            </Card>
                        </div>
                    </Col>
                    <Col span="19">
                        <div id="modalMap" ref="modalMap"></div>
                    </Col>
                </Row>
            </div>
            <!--class-name="vertical-center-modal"-->
        </Modal>
    </div>
</template>

<script>
    import AMap from 'AMap';
    import AMapUI from 'AMapUI';

    export default {
        data: function () {
            return {
                baseMap: {},
                modalMap: {},
                currentVehicleNo: '',
                vehicleInfo: {
                    vehicleNo: '',
                    receiveTime: '',
                    locateTime: '',
                    alarmNum: '',
                    textLocation: '',
                    lnglat: '',
                    speed: '',
                    direction: '',
                    mileage: '',
                    alarmName: ''
                },
                tableHeader: [
                    {
                        title: 'ID',
                        key: 'id',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '运单号',
                        key: 'waybillNo',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '发货人',
                        key: 'consignor',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '发货人电话',
                        key: 'consignorPhone',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '发货时间',
                        key: 'deliveryTime',
                        align: 'center'
                    },
                    {
                        title: '发货地址',
                        key: 'deliveryAddress',
                        align: 'center'
                    },
                    {
                        title: '收货人',
                        key: 'receiver',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '收货人电话',
                        key: 'receiverPhone',
                        align: 'center'
                    },
                    {
                        title: '收货地址',
                        key: 'shippingAddress',
                        align: 'center'
                    },
                    {
                        title: '承运商',
                        key: 'carrierName',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '承运司机',
                        key: 'driverName',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '承运车辆',
                        key: 'vehicleNo',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '运单状态',
                        key: 'shippingAddress',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.showTrajectoryModal(params.index);
                                        }
                                    }
                                }, '查看轨迹')
                            ]);
                        }
                    }
                ],
                tableData: [],
                timeSearchParams: {
                    beginTime: '',
                    endTime: ''
                },
                queryParams: {
                    waybillNo: '',
                    consignor: '',
                    receiver: '',
                    carrierName: '',
                    driverName: ''
                },
                pageParams: {
                    pageTotal: 0,
                    pageSize: 10,
                    pageCurrent: 1,
                    pageData: []
                },
                pageHelperParams: {
                    pageNo: 1,
                    pageSize: 10
                },
                playSpeed: 1000,
                playSpeedList: [{
                    value: 1000,
                    label: '慢'
                }, {
                    value: 5000,
                    label: '中'
                }, {
                    value: 100000,
                    label: '快'
                }],
                selectedDay: '',
                dayList: [{
                    value: 'beforeYesterday',
                    label: '前天'
                }, {
                    value: 'yesterday',
                    label: '昨天'
                }, {
                    value: 'today',
                    label: '今天'
                }],
                vehicleTrajectory: {},
                pathSimplifierIns: {}, // 轨迹巡航器

                // 点覆盖物数组
                mapOverlays: new Map(),
                existMarker: [],
                notExistMarker: [],
                isCollapsed: false,
                alertModal: false,
                trajectoryModal: false,
                treeClass: 'treeExpened',
                treeData: [
                    {
                        title: '福建省',
                        expand: true,
                        loading: false,
                        selected: true,
                        children: []
                    }
                ]
            };
        },
        methods: {
            /**
             * 载入页面的基础地图
             */
            loadBaseMap() {
                let _this = this;
                _this.baseMap = new AMap.Map('baseMap', {
                    zoom: 9
                });
                // 添加地图插件  工具条、比例尺、鹰眼、地图类型、定位
                AMap.plugin(['AMap.OverView', 'AMap.MapType', 'AMap.Geolocation'], function () {
                    // 创建并添加工具控件,上下左右移动，以及缩放
                    // baseMap.addControl(new AMap.ToolBar());
                    // baseMap.addControl(new AMap.Scale({isOpen: false}));
                    _this.baseMap.addControl(new AMap.OverView({isOpen: true}));
                    // map.addControl(new AMap.MapType({isOpen: false}));
                    _this.baseMap.addControl(new AMap.Geolocation());
                });
            },
            /**
             * 载入页面模态框中的地图
             */
            loadModalMap() {
                let _this = this;
                _this.modalMap = new AMap.Map('modalMap', {
                    zoom: 4,
                    center: [112, 40]
                });
                // 添加地图插件  工具条、比例尺、鹰眼、地图类型、定位
                AMap.plugin(['AMap.OverView', 'AMap.MapType', 'AMap.Geolocation'], function () {
                    _this.modalMap.addControl(new AMap.Geolocation());
                });
            },

            /**
             * 载入运单表格数据，默认第一页，10条数据
             */
            loadTableData: function () {
                this.changePageShow(1);
            },
            changePageSize: function (pageSize) {
                this.pageHelperParams.pageSize = pageSize;
                this.request('http://localhost:18083/gps/queryWayBillTable', this.pageHelperParams).then((data) => {
                    if (data.status === 200) {
                        this.pageParams.pageData = data.obj.rows;
                        this.pageParams.pageTotal = data.obj.total;
                        this.tableData = this.pageParams.pageData;
                    }
                });
            },
            changePageShow: function (curpage) {
                this.pageHelperParams.pageNo = curpage;
                this.request('http://localhost:18083/gps/queryWayBillTable', this.pageHelperParams).then((data) => {
                    if (data.status === 200) {
                        this.pageParams.pageData = data.obj.rows;
                        this.pageParams.pageTotal = data.obj.total;
                        this.tableData = this.pageParams.pageData;
                    }
                });
            },
            handleQuery: function () {
                let _this = this;
                if (_this.queryParams.waybillNo.trim().length === 0 && _this.queryParams.consignor.trim().length === 0 &&
                    _this.queryParams.receiver.trim().length === 0 && _this.queryParams.carrierName.trim().length === 0 &&
                    _this.queryParams.driverName.trim().length === 0) {
                    _this.loadTableData();
                    return;
                }
                let queryParams = {};
                queryParams = {
                    waybillNo: _this.queryParams.waybillNo.trim().length > 0 ? _this.queryParams.waybillNo.trim() : '',
                    consignor: _this.queryParams.consignor.trim().length > 0 ? _this.queryParams.consignor.trim() : '',
                    receiver: _this.queryParams.receiver.trim().length > 0 ? _this.queryParams.receiver.trim() : '',
                    carrierName: _this.queryParams.carrierName.trim().length > 0 ? _this.queryParams.carrierName.trim() : '',
                    driverName: _this.queryParams.driverName.trim().length > 0 ? _this.queryParams.driverName.trim() : '',
                    pageNo: _this.pageHelperParams.pageNo,
                    pageSize: _this.pageHelperParams.pageSize
                };
                if (queryParams !== undefined) {
                    this.request('http://localhost:18083/gps/queryWayBillTable', queryParams).then((data) => {
                        if (data.status === 200) {
                            this.pageParams.pageData = data.obj.rows;
                            this.pageParams.pageTotal = data.obj.total;
                            this.tableData = this.pageParams.pageData;
                        }
                    });
                }
            },

            /**
             * 查询车辆基础信息
             * */
            queryVehicleInfo: function (vehicleNo) {
                if (vehicleNo) {
                    let axiosRequestConfig = {
                        url: 'http://127.0.0.1:18083/gps/getVehicleInfo',
                        method: 'post',
                        headers: {'token': ' 111'},
                        responseType: 'application/json; charset=utf-8',
                        contentType: 'application/json;charset=utf-8',
                        data: {
                            vehicleNo: vehicleNo.toString().trim()
                        }
                    };
                    this.request(axiosRequestConfig).then((data) => {
                        this.vehicleInfo = JSON.parse(data.obj).Result;
                    }).catch((error) => {
                            console.log(error);
                        }
                    ).finally(
                        console.log('请求已发送')
                    );
                }
            },

            /**
             * 显示包含轨迹地图的模态框
             * @param index
             */
            showTrajectoryModal(index) {
                // 根据运单id获取承运该运单的车辆的车牌号
                this.currentVehicleNo = this.tableData[index].vehicleNo;
                if (this.currentVehicleNo && this.currentVehicleNo.length > 0) {
                    this.trajectoryModal = true;
                    this.$refs.modalMap.style.height = (window.innerHeight) * 0.9 + 'px';// 设置地图高度
                    this.pathSimplifierIns = {};
                    this.vehicleTrajectory = {};
                    this.loadModalMap();
                    this.queryVehicleInfo(this.currentVehicleNo);
                }
            },

            /**
             * 切换tree显示状态
             */
            toggleTree() {
                let _this = this;
                if (_this.isCollapsed) {
                    _this.treeClass = 'treeCollapsed';
                } else {
                    _this.treeClass = 'treeExpened';
                }
            },
            /**
             * 异步加载tree数据
             **/
            loadTreeData: function (item, callback) {
                setTimeout(() => {
                    let data = [
                        {
                            title: '福州市',
                            expand: true,
                            // disabled: true,
                            level: 'city',
                            children: [
                                {
                                    title: '福州兆丰物流有限公司',
                                    expand: true,
                                    level: 'company',
                                    children: [
                                        {
                                            title: '闽AB6936黄',
                                            level: 'vehicle',
                                            expend: true
                                        }
                                    ]
                                },
                                {
                                    title: '福州胜狮货柜有限公司',
                                    expand: true,
                                    level: 'company',
                                    children: [
                                        {
                                            title: '闽AB2918黄',
                                            level: 'vehicle',
                                            expend: true
                                        },
                                        {
                                            title: '闽AB2805黄',
                                            level: 'vehicle',
                                            expend: true
                                        },
                                        {
                                            title: '闽AB2917黄',
                                            level: 'vehicle',
                                            expend: true
                                        },
                                        {
                                            title: '闽AB2893黄',
                                            level: 'vehicle',
                                            expend: true
                                        },
                                        {
                                            title: '闽AB2908黄',
                                            level: 'vehicle',
                                            expend: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: '厦门市',
                            expand: true,
                            level: 'city',
                            // disabled: true,
                            children: [
                                {
                                    title: '厦门佳安物流有限公司',
                                    expand: true,
                                    level: 'company',
                                    children: [
                                        {
                                            title: '闽DC6193黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DC6836黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DC6895黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DC7208黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DA0582黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽D86310黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DA0599黄',
                                            level: 'vehicle',
                                            expand: true
                                        }
                                    ]
                                },
                                {
                                    title: '厦门胜海物流有限公司',
                                    expand: true,
                                    level: 'company',
                                    children: [
                                        {
                                            title: '闽D69762黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DB8786黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DD1739黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DD1306黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DC6029黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DC5621黄',
                                            level: 'vehicle',
                                            expand: true
                                        },
                                        {
                                            title: '闽DD2526黄',
                                            level: 'vehicle',
                                            expand: true
                                        }
                                    ]
                                }
                            ]
                        }
                    ];
                    callback(data);
                }, 1000);
            },
            /**
             *获取树节点中选中的车辆
             * @param array
             */
            getCheckedVehicles: function () {
                let _this = this;
                let vehicles = _this.$refs.vehicleTree.getCheckedNodes();
                console.log(vehicles);
                let deletedMapOverlays = _this.mapOverlays;
                vehicles.forEach((vehicle) => {
                    if (vehicle.level === 'vehicle') {
                        if (!_this.mapOverlays.has(vehicle.title)) {
                            _this.notExistMarker.push(vehicle);
                            _this.markVehicle(vehicle.title);
                        } else {
                            deletedMapOverlays.delete(vehicle.title);
                        }
                    }
                    // if (_this.existMarker.length > 0) {
                    //     // _this.updateMarkerCluster(_this.existMarker);
                    // }
                });
                deletedMapOverlays.forEach((layer) => {
                    layer.setMap(null);
                    _this.mapOverlays.delete(layer);
                });
                // _this.notExistMarker.forEach((vehicle) => {
                //     if (vehicle.title && vehicle.level === 'vehicle') {
                //         _this.markVehicle(vehicle.title);
                //     }
                // });
            },

            /**
             * 向后台请求车辆位置,并标记车辆位置
             * @param vehicleNo 车牌号
             */
            markVehicle: function (vehicleNo) {
                let _this = this;
                if (vehicleNo) {
                    console.log('准备获取 ' + vehicleNo.toString() + ' 位置信息....');
                    let axiosRequestConfig = {
                        url: 'http://127.0.0.1:18083/gps/getLast',
                        method: 'post',
                        headers: {'token': ' 111'},
                        responseType: 'application/json; charset=utf-8',
                        contentType: 'application/json;charset=utf-8',
                        data: {
                            num: vehicleNo.toString()
                        }
                    };
                    _this.request(axiosRequestConfig).then((data) => {
                        console.log(data);
                        let vehicleGpsInfo = JSON.parse(data.obj).Result;
                        if (vehicleGpsInfo) {
                            _this.drawVehicleMarker(vehicleNo, vehicleGpsInfo);
                        }
                    }).catch((error) => {
                            console.log(error);
                        }
                    ).finally(
                        console.log('请求已发送')
                    );
                }
            },

            /**
             *绘制车辆标注
             * @param vehicleNo
             * @param vehicleGpsInfo
             */
            drawVehicleMarker: function (vehicleNo, vehicleGpsInfo) {
                let _this = this;
                let lngLat = String(vehicleGpsInfo.Lon + vehicleGpsInfo.OffsetLon).substring(0, 7) + ',' + String(vehicleGpsInfo.Lat + vehicleGpsInfo.OffsetLat).substring(0, 6);
                let vehicleInfoTitle = '<div style=\'text-align: center;background-color: #eee;\'><strong>车辆监控信息</strong></div>';
                let vehicleIcon = _this.setVehicleIcon(0).toString();
                let vehicleInfoBody =
                    '<div id="opration"><b>车牌号：</b>' + vehicleNo + '<br>' +
                    '<b>定位时间：</b>' + vehicleGpsInfo.LocateTime + '<br>' +
                    '<b>接收时间：</b>' + vehicleGpsInfo.ReceivedTime + '<br>' +
                    '<b>车辆位置：</b><span id=' + vehicleGpsInfo.TerminalKey + '>' + vehicleGpsInfo.TextLocation + '</span>' + '<br>' +
                    '<b>经 纬 度：</b>' + lngLat + '<br>' +
                    '<b>车辆时速：</b>' + vehicleGpsInfo.Speed + '公里/时<br>' +
                    '<b>行驶方向：</b>' + vehicleGpsInfo.Direction + '<br>' +
                    '<b>累计里程：</b>' + vehicleGpsInfo.Mileage + '公里<br>' +
                    '<b>报警：</b>' + vehicleGpsInfo.AlarmNames + '</div>' +
                    '<br><b>操作：</b><a href="#" onclick="_this.">轨迹回放</a>' +
                    '| <a href="#" onclick="console.log(\'fdfdf\')">车辆信息</a><br></div>';
                AMapUI.loadUI(['overlay/SimpleInfoWindow'], function (SimpleInfoWindow) {
                    // 车辆图标
                    let vehicleMarker = new AMap.Marker({
                        map: _this.baseMap,
                        zIndex: 9999999,
                        icon: vehicleIcon,
                        position: [vehicleGpsInfo.Lon + vehicleGpsInfo.OffsetLon, vehicleGpsInfo.Lat + vehicleGpsInfo.OffsetLat],
                        label: {
                            offset: new AMap.Pixel(15, 15),
                            content: vehicleNo + '(' + vehicleGpsInfo.Speed + 'km/h)'
                        }
                    });

                    // 车辆具体信息窗体
                    let vehicleInfoWindow = new SimpleInfoWindow({
                        infoTitle: vehicleInfoTitle,
                        infoBody: vehicleInfoBody,
                        // 基点指向marker的头部位置
                        offset: new AMap.Pixel(0, -35)
                    });
                    // 默认打开车辆信息窗体
                    vehicleInfoWindow.open(_this.baseMap, vehicleMarker.getPosition());
                    // 点击车辆图标，显示车辆信息窗体
                    AMap.event.addListener(vehicleMarker, 'click', function () {
                        vehicleInfoWindow.open(_this.baseMap, vehicleMarker.getPosition());
                    });
                    _this.mapOverlays.set(vehicleNo, vehicleMarker);
                    _this.mapOverlays.set('vehicleInfoWindow', vehicleInfoWindow);
                    _this.baseMap.setZoomAndCenter(14, [vehicleGpsInfo.Lon + vehicleGpsInfo.OffsetLon, vehicleGpsInfo.Lat + vehicleGpsInfo.OffsetLat]);
                });
            },

            /**
             * 根据车辆状态设置车辆图标颜色
             * @param vehicleState
             */
            setVehicleIcon: function (vehicleState) {
                let vehicleIcon = '';
                let onLineIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAACj0lEQVQ4y6WUX0hTYRjGn/fs23BTZst1TppuOC8SNPVCCdIg3I1l0JUg3VRGQhaRUNaCgiEYQUSB4V0XRQVdaGAgu/AiJ+hFF0UlthSz/DOnU5prc207bxc7s1lig56L74OX9/zOeZ73Ox/hD528rwyOVdGxsAkSdpBpA+rB9zxSNsfO23cCarouMpvOd8udzw7TcfsibxR8R3InYEJA5zlER1o97AZwc9umo4+UqZpBJYosVdevhJxPlPnM2hZbEw4qrfjMr7IFVk7zi8lSKnR1yXmblju65csJHaxhE1UPGyAVrcCdLdC6im4w2maK6WV7jzyuSyIoBhqle5EcEADkRsFxgTIAH7IBJgUcOhU8VE9OgJzGGJguuOVznnqpb9kCHQBYQlBL5zkgMdSdYEyQvhSSHNyVis0SgtrsVS8JYwyvIzm/s1wzQ1oz095sbacVMUIyxvBGiutRFdUs/49ieiBmQIWICxSpGq5yilcrprnvayG1jlVRWYmfY9U+eACwZhQ+Ozl9dsqr+8jfHHP8+JOd2t+W0x4AiAvsE3GBkvRbaif44gN34PnVG/LD8QO0UBzA/NPOpROZX9LSq3h9djTUTHLT3Z7AROctefTdfhpiAn4K2ERSwuYZWiqgs64ueThghosJmCkiW0uv4s0E+myoBYAVC664rsnXZ3dTB2sOE4JyRWZ4Q/XktIRocc2cGpLfCuG3UsN2mQ00SmcsIZxK92qJbP2XRRIwRTmRH4ZKWm6spUebS+pBJlBCBylsIkM8TSFAqBL0aWD+OtTmUbaJJILpMfw1f9Zqqd3U34ig30oCAFQJepH3A155Fac3DJAcc7wgkljOvI7+oVBTuTIbyYFDn4Cav84jvwD5Juk2jIzIAQAAAABJRU5ErkJggg==";
                let offLineIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAABqElEQVQ4y61RPU8bQRSct7s+bMcEGyOjUwqaSGlSpEoDym/gF4QiZRr+BaKjTJEqVZTG+QlAmSaRkuaI0d01FGmcIMVr79ejgEN3JxBnial2Z2fnzXuPUIM7X72QTsdogCDbf32r+yra+pMXnCgLbLo+bmoGAMLP+xTc0b0Cd756Ec6i0NQw/G5bP+nOKkWKg8lHW9LpOKjuj8aGsv1TeNMx+Win4JRN18cAD8jPnwFAEOpTc8PWobT4LJz+YtPBGUBTpczlbllE4M2mhmCOAeBm7jEAkM2GH9Xi37tq5UgDYvFAvhXhTaeyg+jpV8WgX3XpjbCDJcEkTsSynx6CIvDLUgX2rSenwi9eF+34Vu87E10WGmn/vyEOFGSkg1z5Jp3epuAUABD7Xdh0cMyJYk4U22x4AAAm29jnRLGf9Kb1BH7Sm3Ki2GQb+wBgs+HB7f90cKzKYvJmz+SjD8Kbt9eznPfrphTMGgCIYN6bfDQmp/cqLZcv0ulYOp1VFzTv3zUraWfPpZ1ldf7xl1In6IWjZQw4UVxNSGJy+0iClzEDABbKleJMrwA+WMHg1euibwAAAABJRU5ErkJggg==";
                let alarmIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAACEElEQVQ4y42Uu2sUYRTFf2edrIZoNMnHgmFl1ialFoJBsFCsTEIaBRtfnVhY+fgDTC8i2Eg6sXAr0VotFLEQxKAEBWHDTpNlBYmvSMRjsfPNPhr3VnPnm+/Muefce8VAZGm4hrhqe0IIBDYIMKD4ABuGuxI3q422430NgB1HPAPeA7+KA1MAFxfFdpsDEovVRvtJfJ/00RMXgJVqo32QISJLwyubi0ABWOr7wszZXh4GLCdwT+JEloZywbCZTh2TNA7MAGNC9WHxbB4BtyVuZGlYMXxLJD22vQuExAYQgPWhCIopYAtYyvPvaqbhiKBuqKojfEvw2viPpOho175uvg04bHtv3g0t4LSyNATEZ8x4YahiSUbSoLt9ORghDJsSM4nxtNDOvDN6wMjBOqADpXbZ5onMDmA6AU3YLuU1PQXu2JySOG+zClq2Y6FG0hnMLKKOeGBzSWIu7/zJRCLYihNwvdpov81q4TnmnOBNda19a6D3Jg2z2Ff2rX1pZbXwETiJEVBJbEajLhLzzTR8AuY7KUezNCz1VmezmDNdyGrhoc2ComViVFkazhrfV3cKW4hK1LFXs768I3oLU+mZ98tJnPpcpi3QV8y6xN/IPC6HfjMo2ZQFe4ByPEuApLtV3JY4BPx0TmfQ4cL1jiYjtleF9uc/GUkwH4AmZgz0EvjRu47+E7+zNLyw2S3YBN79A3tN4aosultMAAAAAElFTkSuQmCC";
                let noneIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAABEklEQVQ4y62T4W2DMBCFPyIGoBM0I7BB2CDpBIcnaJgk6QTXmyDpBGEEOkEzAp2g/RFTuZciAeqT+OHT88c725fhZKYnYMc0tcCTSOiHwsrB9jNgABVQp4XcGTZALxIeptDM9AMQ4HiX0EyLmO51RsIzUJrp+idhbLMAHmPtbQbQgD1wMNN3oM+BgzMVM4CDdxc/MjOtAXXGDugnwEpXa3Lg+oe5ZJm61cKNo8qBdbLugRdgm6Q8Ap+J5zm223G7QEkYlQcGkXA20xa4AK1IaNIEZrrh9qAbkdCaaQec0oSpJMK2wx/N9DJyvhJh4ltOteN+9KqR46pxYwdulv9DPiEiIZsDMNMvn/CarPsFoX7t/wamlE+zzhmEvAAAAABJRU5ErkJggg==";
                switch (vehicleState) {
                    case (0): //在线
                        vehicleIcon = onLineIcon;
                        break;
                    case (1):// 不在线
                        vehicleIcon = offLineIcon;
                        break;
                    case (2): // 报警
                        vehicleIcon = alarmIcon;
                        break;
                    case (3)://未定位
                        vehicleIcon = noneIcon;
                        break;
                    default:
                        vehicleIcon = onLineIcon;
                        break;
                }
                return vehicleIcon;
            },
            /**
             * 根据车辆号，获取车辆轨迹
             * @param vehicleNo
             */
            getVehicleTrail: function () {
                let _this = this;
                if (_this.currentVehicleNo) {
                    let axiosRequestConfig = {
                        url: 'http://127.0.0.1:18083/gps/getTrack',
                        method: 'post',
                        headers: {'token': ' 11111111'},
                        responseType: 'application/json; charset=utf-8',
                        contentType: 'application/json;charset=utf-8',
                        data: {
                            num: _this.currentVehicleNo.toString(),
                            beginTime: _this.timeSearchParams.beginTime,
                            endTime: _this.timeSearchParams.endTime
                        }
                    };
                    _this.request(axiosRequestConfig).then((data) => {
                        console.log(data);
                        let vehiclePositionArray = JSON.parse(data.obj).Result;
                        if (vehiclePositionArray && vehiclePositionArray.length > 0) {
                            _this.drawVehicleTrajectory(vehiclePositionArray);
                            _this.$refs.playButton.$el.innerText = "暂停";
                        }
                    }).catch((error) => {
                            console.log(error);
                        }
                    ).finally(
                        console.log('请求已发送')
                    );
                }
            },
            /**
             * 绘制车辆轨迹
             * @param vehicleNo
             */
            drawVehicleTrajectory: function (vehiclePositions) {
                let _this = this;
                if (_this.vehicleTrajectory && _this.vehicleTrajectory !== undefined) {
                    _this.vehicleTrajectory.distroy();
                }
                // 添加路径显示
                AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
                    // AMapUI.load(['ui/misc/PathSimplifier'], function (PathSimplifier) {
                    if (!PathSimplifier.supportCanvas) {
                        alert('当前环境不支持 Canvas！');
                        return;
                    }

                    _this.pathSimplifierIns = new PathSimplifier({//新建高德地图轨迹对象，用canvas绘制
                        zIndex: 100,//
                        autoSetFitView: true,
                        map: _this.modalMap, // 所属的地图实例
                        renderOptions: { //设置轨迹渲染参数（线宽、颜色等）
                            pathLineStyle: {
                                dirArrowStyle: false //是否显示线路的方向箭头
                            },
                            renderAllPointsIfNumberBelow: 100, // 绘制路线节点，如不需要可设置为-1
                            getPathStyle: function (pathItem, zoom) {
                                var color = "#0f19ff",
                                    lineWidth = 3;
                                return {
                                    pathLineStyle: {
                                        strokeStyle: color,
                                        lineWidth: lineWidth
                                    },
                                    pathLineSelectedStyle: {
                                        lineWidth: lineWidth + 2
                                    },
                                    pathNavigatorStyle: {
                                        fillStyle: color
                                    }
                                };
                            },
                        },
                        getPath: function (pathData, pathIndex) {
                            return pathData.path;
                        },
                        getHoverTitle: function (pathData, pathIndex, pointIndex) {
                            if (pointIndex >= 0) {
                                // point
                                return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                            }
                            return pathData.name + '，点数量' + pathData.path.length;
                        },
                    });

                    let pathArray = new Array();
                    for (let i = 0; i < vehiclePositions.length; i++) {
                        pathArray[i] = new Array();
                        // 消除偏移量
                        pathArray[i][0] = vehiclePositions[i].Lon + vehiclePositions[i].OffsetLon;
                        pathArray[i][1] = vehiclePositions[i].Lat + vehiclePositions[i].OffsetLat;
                    }
                    ;

                    // 设置线路数据为车载设备获取的坐标数据,pathArray是一个二维数组
                    _this.pathSimplifierIns.setData([{
                        name: '货车线路轨迹',
                        path: pathArray,
                    }]);
                    // 对轨迹线路创建一个巡航器
                    _this.vehicleTrajectory = _this.pathSimplifierIns.createPathNavigator(0, {
                        loop: true, // 循环播放
                        speed: _this.playSpeed, // 巡航速度
                        pathNavigatorStyle: {// 设置巡航器风格
                            width: 24,
                            height: 24,
                            // 使用图片
                            content: PathSimplifier.Render.Canvas.getImageContent('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAACj0lEQVQ4y6WUX0hTYRjGn/fs23BTZst1TppuOC8SNPVCCdIg3I1l0JUg3VRGQhaRUNaCgiEYQUSB4V0XRQVdaGAgu/AiJ+hFF0UlthSz/DOnU5prc207bxc7s1lig56L74OX9/zOeZ73Ox/hD528rwyOVdGxsAkSdpBpA+rB9zxSNsfO23cCarouMpvOd8udzw7TcfsibxR8R3InYEJA5zlER1o97AZwc9umo4+UqZpBJYosVdevhJxPlPnM2hZbEw4qrfjMr7IFVk7zi8lSKnR1yXmblju65csJHaxhE1UPGyAVrcCdLdC6im4w2maK6WV7jzyuSyIoBhqle5EcEADkRsFxgTIAH7IBJgUcOhU8VE9OgJzGGJguuOVznnqpb9kCHQBYQlBL5zkgMdSdYEyQvhSSHNyVis0SgtrsVS8JYwyvIzm/s1wzQ1oz095sbacVMUIyxvBGiutRFdUs/49ieiBmQIWICxSpGq5yilcrprnvayG1jlVRWYmfY9U+eACwZhQ+Ozl9dsqr+8jfHHP8+JOd2t+W0x4AiAvsE3GBkvRbaif44gN34PnVG/LD8QO0UBzA/NPOpROZX9LSq3h9djTUTHLT3Z7AROctefTdfhpiAn4K2ERSwuYZWiqgs64ueThghosJmCkiW0uv4s0E+myoBYAVC664rsnXZ3dTB2sOE4JyRWZ4Q/XktIRocc2cGpLfCuG3UsN2mQ00SmcsIZxK92qJbP2XRRIwRTmRH4ZKWm6spUebS+pBJlBCBylsIkM8TSFAqBL0aWD+OtTmUbaJJILpMfw1f9Zqqd3U34ig30oCAFQJepH3A155Fac3DJAcc7wgkljOvI7+oVBTuTIbyYFDn4Cav84jvwD5Juk2jIzIAQAAAABJRU5ErkJggg==', onload, onerror),
                            strokeStyle: '#ff0c15',
                            fillStyle: null,
                            // 经过路径的样式
                            pathLinePassedStyle: {
                                lineWidth: 6,
                                strokeStyle: '#3366cc',
                            }
                        }
                    });
                    _this.vehicleTrajectory.start();
                });
            },
            /**
             * 车辆轨迹巡航器开关
             */
            continueOrPauseVehicleTrail: function () {
                if (this.vehicleTrajectory && (this.vehicleTrajectory._naviStatus === "moving" || this.vehicleTrajectory._naviStatus === "pause")) {
                    this.vehicleTrajectory._naviStatus === "moving" ? this.vehicleTrajectory.pause() : this.vehicleTrajectory.resume();
                    this.vehicleTrajectory._naviStatus === "moving" ? this.$refs.playButton.$el.innerText = "暂停" : this.$refs.playButton.$el.innerText = "播放";
                }
            },
            /**
             * 停止车辆轨迹巡航器
             */
            stopVehicleTrail: function () {
                if (this.vehicleTrajectory && this.vehicleTrajectory._naviStatus === "moving") {
                    this.vehicleTrajectory.stop();
                    this.$refs.playButton.$el.innerText = "播放";
                }
            },
            /**
             * 销毁车辆轨迹巡航器
             */
            destroyVehicleTrail: function () {
                if (this.vehicleTrajectory) {
                    this.vehicleTrajectory.destroy();
                    this.$refs.playButton.$el.innerText = "播放";
                }
            },
            changePlaySpeed: function (item) {
                if (this.vehicleTrajectory) {
                    this.vehicleTrajectory.setSpeed(item);
                }
            },
            /**
             * 获取选定的日期
             * @param value
             */
            onDateChange: function (value) {
                let now = new Date();
                let beginTime, endTime;
                switch (value) {
                    case ('beforeYesterday'):
                        beginTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 0, 0, 0);
                        endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 23, 59, 59);
                        this.timeSearchParams.beginTime = beginTime;
                        this.timeSearchParams.endTime = endTime;
                        break;
                    case ('yesterday'):
                        beginTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
                        endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
                        this.timeSearchParams.beginTime = beginTime;
                        this.timeSearchParams.endTime = endTime;
                        break;
                    case ('today'):
                        beginTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                        this.timeSearchParams.beginTime = beginTime;
                        this.timeSearchParams.endTime = now;
                        break;
                    default:
                        braek;
                }
            },
            /**
             * 清理地图上所有覆盖物
             */
            clearMap: function (map) {
                if (map) {
                    map.clearMap();
                }
            }
        },
        mounted() {
            this.loadBaseMap(); // 加载基础地图和相关组件
            this.loadTableData(); // 载入运单表
            this.onDateChange('today'); // 车辆轨迹查询，默认为当天
            this.$refs.map.style.height = window.innerHeight - 180 + 'px';// 设置地图高度
        }
    };
</script>

<style scoped>
    #page {
        height: 100%;
        background-color: #f0f0f0;
    }

    .legendDiv {
        background-color: #ffffff;
        position: fixed;
        right: 30px;
        top: 30px;
        border-radius: 5px;
    }

    .legendTitle {
        background-color: #eee;
        padding: 8px;
        text-align: center;
        color: black;
        font-weight: bold;
    }

    .legend {
        font-size: 14px;
        margin: 0px;
        padding: 0px 15px;
        list-style: none;
        font-family: Times;
    }

    .mySider {
        width: 300px;
        min-width: 300px important;
        max-width: 300px;
        flex: 0 0 300px;
        margin-right: 100px;
        background: #f5f7f9;
    }

    /deep/ .ivu-layout-sider-trigger {
        /*background: #f0f0f0;*/
        background: #f5f7f9;
    }

    /deep/ .ivu-icon {
        color: #495060;
    }

    .treeExpened {
        visibility: visible;
    }

    .treeCollapsed {
        visibility: hidden;
    }

    #baseMap /deep/ .amap-ui-infowindow-title {
        background-color: #eeeeee;
    }

    #trajectoryModal /deep/ .ivu-modal-footer {
        display: none;
    }

    .panel-body {
        padding: 5px;
        font-size: 15px;
        font-weight: bold;
    }

    .list-unstyled {
        margin: 0;
        padding-left: 0;
        list-style: none;
    }

    .text-success {
        color: #22BAA0;
    }

    .pull-right {
        float: right !important;
    }

    /deep/ .amap-ui-smp-ifwn-def-tr-close {
        float: right;
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        margin: 7px 3px 0;
        border-radius: 2px;
        color: #666;
        cursor: pointer;
    }
</style>
