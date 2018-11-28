<template>
    <Row>
        <Col>
            <Card>
                <label>司机ID查询：</label>
                <i-input v-model="queryParams.driverId" placeholder="输入司机ID"
                         style="width: 160px" @on-keyup="handleQuery"></i-input>

                <label>司机姓名查询：</label>
                <i-input v-model="queryParams.driverName" placeholder="输入司机姓名"
                         style="width: 160px" @on-keyup="handleQuery"></i-input>
                <label>签到车辆查询：</label>
                <i-input v-model="queryParams.vehicleNo" placeholder="输入签到车辆"
                         style="width: 160px" @on-keyup="handleQuery"></i-input>
                <label>签到时间段：</label>
                <DatePicker v-model="queryParams.signinBeginTime" type="date" placeholder="签到开始时间"
                            style="width: 160px"></DatePicker>
                <DatePicker v-model="queryParams.signinEndTime" type="date" placeholder="签到截止时间"
                            style="width: 160px"></DatePicker>
                <i-button type="primary" @click="handleQuery">查询</i-button>
            </Card>
            <div id="table">
                <can-edit-table highlight-row border :columns-list="tableColumns" :data="tableData" :editIncell=true
                                v-model="tableData" :height="tableHeight"
                                ref="table"></can-edit-table>
                <Page :current="pageParams.pageCurrent" :total="pageParams.pageTotal" :page-size="pageParams.pageSize"
                      show-elevator show-total show-sizer placement="bottom" @on-change="changePageShow"
                      @on-page-size-change="changePageSize"></Page>
            </div>
            <Modal class-name="vertical-center-modal"
                   v-model="trajectoryModal"
                   fullscreen=true>
                <div slot="header" style="color:#f60;text-align:center">
                    <span>签到定位</span>
                </div>
            </Modal>
        </Col>
    </Row>
</template>

<script>
    import CanEditTable from '../../tables/components/canEditTable';

    export default {
        name: 'trans-flow',
        components: {CanEditTable},
        data: function () {
            return {
                tableColumns: [
                    {
                        title: 'ID',
                        key: 'id',
                        sortable: true,
                        align: 'center',
                        editable: false
                    },
                    {
                        title: '司机ID',
                        key: 'driverId',
                        sortable: true,
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '司机姓名',
                        key: 'driverName',
                        sortable: true,
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '司机签到地经度',
                        key: 'driverLongitude',
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '司机签到地纬度',
                        key: 'driverLatitude',
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '签到时间',
                        key: 'signinTime',
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '签到车辆',
                        key: 'vehicleNo',
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '签到时车辆经度',
                        key: 'vehicleLongitude',
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '签到时车辆纬度',
                        key: 'vehicleLatitude',
                        align: 'center',
                        editable: this.tableEditable
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
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
                                            this.updateItem(params.index);
                                        }
                                    }
                                }, '编辑'),
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
                                            this.showMap(params.index);
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeItem(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableEditable: false,
                tableData: [],
                tableHeight: 450,
                queryParams: {
                    driverId: '',
                    driverName: '',
                    vehicleNo: '',
                    signinBeginTime: '',
                    signinEndTime: ''
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
                trajectoryModal: false
            };
        },
        methods: {
            /**
             * 载入表格数据
             */
            loadTableData: function () {
                this.changePageShow(1);
            },
            changePageSize: function (pageSize) {
                this.pageHelperParams.pageSize = pageSize;
                this.request('http://localhost:18083/gps/queryDiverSigninTable', this.pageHelperParams).then((data) => {
                    if (data.status === 200) {
                        this.pageParams.pageData = data.obj.rows;
                        this.pageParams.pageTotal = data.obj.total;
                        this.tableData = this.pageParams.pageData;
                    }
                });
            },
            changePageShow: function (curpage) {
                this.pageHelperParams.pageNo = curpage;
                this.request('http://localhost:18083/gps/queryDiverSigninTable', this.pageHelperParams).then((data) => {
                    if (data.status === 200) {
                        this.pageParams.pageData = data.obj.rows;
                        this.pageParams.pageTotal = data.obj.total;
                        this.tableData = this.pageParams.pageData;
                    }
                });
            },
            handleQuery: function () {
                let _this = this;
                if (_this.queryParams.driverId.trim().length === 0 && _this.queryParams.driverName.trim().length === 0 &&
                    _this.queryParams.vehicleNo.trim().length === 0 && _this.queryParams.signinBeginTime === '' &&
                    _this.queryParams.signinEndTime === '') {
                    _this.loadTableData();
                }
                let signinBeginTime = _this.convertDate(_this.queryParams.signinBeginTime);
                let signinEndTime = this.convertDate(_this.queryParams.signinEndTime);
                if (signinBeginTime > signinEndTime) {
                    this.$Modal.warning({
                        title: '警告',
                        content: '查询时间范围错误'
                    });
                    return;
                } else if ((isNaN(signinBeginTime) === true) && (isNaN(signinEndTime) === false)) {
                    this.$Modal.warning({
                        title: '警告',
                        content: '查询时间范围错误'
                    });
                    return;
                } else if ((isNaN(signinBeginTime) === false) && (isNaN(signinEndTime) === true)) {
                    this.$Modal.warning({
                        title: '警告',
                        content: '查询时间范围错误'
                    });
                    return;
                }
                let queryParams = {
                    driverId: _this.queryParams.driverId.trim().length > 0 ? _this.queryParams.driverId : '',
                    driverName: _this.queryParams.driverName.trim().length > 0 ? _this.queryParams.driverName : '',
                    vehicleNo: _this.queryParams.vehicleNo.trim().length > 0 ? _this.queryParams.vehicleNo : '',
                    signinBeginTime: _this.queryParams.signinBeginTime !== '' ? _this.queryParams.signinBeginTime : '',
                    signinEndTime: _this.queryParams.signinEndTime !== '' ? _this.queryParams.signinEndTime : '',
                    pageNo: _this.pageHelperParams.pageNo,
                    pageSize: _this.pageHelperParams.pageSize
                };
                if (queryParams) {
                    this.request('http://localhost:18083/gps/multiQueryDriverSignin', queryParams).then((data) => {
                        if (data.status === 200) {
                            this.pageParams.pageData = data.obj.rows;
                            this.pageParams.pageTotal = data.obj.total;
                            this.tableData = this.pageParams.pageData;
                        }
                    });
                }
            },
            updateItem: function (index) {
                this.tableData[index].edittingCell[1] = true;
            },
            showMap: function (index) {
                let d = this.tableData[index].waybillNo;
                this.trajectoryModal = true;
            },
            removeItem: function (index) {
                let _this = this;
                let axiosRequestConfig = {
                    url: 'http://localhost:18083/gps/deleteDirverSignIn',
                    method: 'post',
                    headers: {'token': ' 111'},
                    responseType: 'application/json; charset=utf-8',
                    contentType: 'application/json;charset=utf-8',
                    data: {
                        'id': this.tableData[index].id
                    }
                };
                _this.request(axiosRequestConfig).then((data) => {
                    console.log(data);
                    let id = data.obj;
                    let status = data.status;
                    if (id === _this.tableData[index].id && status === 200) {
                        _this.tableData.splice(index, 1);
                        _this.$Message.success('删除成功');
                    }
                }).catch((error) => {
                    _this.$Message.success('删除失败');
                    console.log(error);
                }
                ).finally(
                    console.log('请求发送完成')
                );
            },
            convertDate (time) {
                var t = new Date(time);
                var tf = function (i) {
                    return (i < 10 ? '0' : '') + i;
                };
                return tf(t.getFullYear()) + tf(t.getMonth() + 1) + tf(t.getDate());
            }
        },
        mounted () {
            // 设置表格高度
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 160;
            this.loadTableData();
        }
    };
</script>

<style lang="less" scoped>
    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
            top: 0;
        }
    }

    /deep/ .ivu-input-icon {
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 24px;
        text-align: center;
        color: #2d8cf0;
        position: absolute;
        right: 0;
        z-index: 3;
    }
</style>
