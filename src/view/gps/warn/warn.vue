<template>
    <Row>
        <Col>
            <Card>
                <label>司机ID查询：</label>
                <i-input v-model="queryParams.driverId" placeholder="输入司机ID"
                         style="width: 160px"></i-input>
                <label>司机姓名查询：</label>
                <i-input v-model="queryParams.driverName" placeholder="输入司机姓名"
                         style="width: 160px"></i-input>
                <label>报警类型：</label>
                <i-input v-model="queryParams.alarmType" placeholder="选择报警类型"
                         style="width: 160px"></i-input>
                <label>报警地址：</label>
                <i-input v-model="queryParams.alarmAddress" placeholder="输入报警地址"
                         style="width: 160px"></i-input>
                <label>报警时间：</label>
                <DatePicker v-model="queryParams.alarmTime" type="date" placeholder="end"
                            style="width: 200px"></DatePicker>
                <i-button type="primary" @click="handleQuery">查询</i-button>
            </Card>
            <div id="table">
                <Table highlight-row border :columns="tableColumns" :data="tableData" :height="tableHeight"
                       ref="table"></Table>
                <Page :current="pageParams.pageCurrent" :total="pageParams.pageTotal" :page-size="pageParams.pageSize"
                      show-elevator show-total show-sizer placement="bottom" @on-change="changePageShow"
                      @on-page-size-change="changePageSize"></Page>
            </div>
        </Col>
    </Row>
</template>

<script>
    export default {
        data: function () {
            return {
                tableColumns: [
                    {
                        title: 'ID',
                        key: 'id',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '司机ID',
                        key: 'driverId',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '司机姓名',
                        key: 'driverName',
                        align: 'center'
                    },
                    {
                        title: '报警时间',
                        key: 'alarmTime',
                        align: 'center'
                    },
                    {
                        title: '报警类型',
                        key: 'alarmType',
                        align: 'center'
                    },
                    {
                        title: '报警地文本地址',
                        key: 'alarmAddress',
                        align: 'center'
                    },
                    {
                        title: '报警地经度',
                        key: 'alarmLongitude',
                        align: 'center'
                    },
                    {
                        title: '报警地纬度',
                        key: 'alarmLatitude',
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
                                            this.edit(params.index);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [],
                tableHeight: 450,
                queryParams: {
                    driverId: '',
                    driverName: '',
                    alarmType: '',
                    alarmAddress: '',
                    alarmTime: ''
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
                }
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
                this.request('http://localhost:18083/gps/queryAlarmTable', this.pageHelperParams).then((data) => {
                    if (data.status === 200 && data.obj !== null) {
                        this.pageParams.pageData = data.obj.rows;
                        this.pageParams.pageTotal = data.obj.total;
                        this.tableData = this.pageParams.pageData;
                    }
                });
            },
            changePageShow: function (curpage) {
                this.pageHelperParams.pageNo = curpage;
                this.request('http://localhost:18083/gps/queryAlarmTable', this.pageHelperParams).then((data) => {
                    if (data.status === 200 && data.obj !== null) {
                        this.pageParams.pageData = data.obj.rows;
                        this.pageParams.pageTotal = data.obj.total;
                        this.tableData = this.pageParams.pageData;
                    }
                });
            },
            handleQuery: function () {
                let _this = this;
                if (_this.queryParams.driverId.trim().length === 0 && _this.queryParams.driverName.trim().length === 0 &&
                    _this.queryParams.vehicleNo.trim().length === 0 && _this.queryParams.signinTime === '') {
                    _this.loadTableData();
                    return;
                }
                let queryParams = {};
                queryParams = {
                    driverId: _this.queryParams.driverId.trim().length > 0 ? _this.queryParams.driverId : '',
                    driverName: _this.queryParams.driverName.trim().length > 0 ? _this.queryParams.driverName : '',
                    vehicleNo: _this.queryParams.vehicleNo.trim().length > 0 ? _this.queryParams.vehicleNo : '',
                    signinTime: _this.queryParams.signinTime !== '' ? _this.queryParams.signinTime : '',
                    pageNo: _this.pageHelperParams.pageNo,
                    pageSize: _this.pageHelperParams.pageSize
                };
                if (queryParams !== undefined) {
                    this.request('http://localhost:18083/gps/multiQueryDriverSignin', queryParams).then((data) => {
                        if (data.status === 200) {
                            this.pageParams.pageData = data.obj.rows;
                            this.pageParams.pageTotal = data.obj.total;
                            this.tableData = this.pageParams.pageData;
                        }
                    });
                }
            },
            show: function (index) {
                // this.$Modal.info({
                //     title: '司机签到信息',
                //     content: `签到单ID：${this.signInList[index].id}<br>司机姓名：${this.signInList[index].driverName}<br>车牌号码：${this.signInList[index].vehicleNo}`
                // });
            },
            edit: function () {

            },
            remove: function (index) {
                let _this = this;
                let axiosRequestConfig = {
                    url: 'http://localhost:18083/gps/deleteAlarmTable',
                    method: 'post',
                    headers: {'token': ' 111'},
                    responseType: 'application/json; charset=utf-8',
                    contentType: 'application/json;charset=utf-8',
                    data: {
                        'id': this.tableData[index].id
                    }
                };
                _this.request(axiosRequestConfig).then((data) => {
                    if (data.status === 200 && data.obj !== null) {
                        if (data.obj === _this.signInList[index].id) {
                            _this.tableData.splice(index, 1);
                            _this.$Message.success('删除成功');
                        }
                    }
                }).catch((error) => {
                    _this.$Message.success('删除失败');
                    console.log(error);
                }
                ).finally(
                    console.log('请求发送完成')
                );
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
