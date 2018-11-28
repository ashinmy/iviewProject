<!--差错管理-->
<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <h4>
                        <i-input v-model="searchQuery.searchCode"  placeholder="请输入对账批次号" @on-enter="handleSearch" style="width: 200px"></i-input>&nbsp;&nbsp;
                        <i-button type="primary" icon="ios-search" @click="handleSearch" >搜索</i-button>
                    </h4>
                </Card>
                <Card>
                  <Table ref="table1" :data="pageParams.pageData" :columns="columns" ></Table>
                </Card>
                <modal class="vertical-center-modal" v-model="showModal" width="1100" title="差错详情" :scrollable="isScrollable" :draggable="isDraggable">
                    <div slot="footer" >
                        <Button type="success" @click="exportTableData">导出数据</Button>
                        <Button type="primary" @click="closeModal">关闭</Button>
                    </div>
                    <Table :data="errTableData" :columns="errColumns" height="400" :row-class-name="rowClassName" ref="table" :loading="isLoading" :disabled-hover="true" ></Table>
                </modal>
                <Page :total="pageParams.pageTotal" :page-size="pageParams.pageSize" show-elevator show-total show-sizer placement="bottom" @on-change="changePageShow" @on-page-size-change="changePageSize"></Page>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'errflow-manager',
        data () {
            return {
                isLoading: true,
                isDraggable: true,
                isScrollable: true,
                showModal: false,
                rowStreamNo: '',
                searchQuery: {
                    searchCode: ''
                },
                formValidate: {
                    errStreamno: '',
                    errOrderno: '',
                    errTranstate: '',
                    errPayment: '',
                    errType: '',
                    errMsg: '',
                    errOrddate: ''
                },
                pageParams: {
                    pageTotal: 0,
                    pageSize: 10,
                    pageData: []
                },
                queryDataParams: {
                    page: 1,
                    size: 10
                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 65,
                        align: 'center'
                    },
                    {
                        title: '对账批次号',
                        key: 'constrastive_streamNo',
                        width: 145,
                        align: 'center'
                    },
                    {
                        title: '正确流水数',
                        key: 'number_total',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '正确总金额',
                        key: 'payment_total',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '差错流水数',
                        key: 'error_total',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '差错总金额',
                        key: 'payment_error',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '支付渠道',
                        key: 'finance_channel',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '对账时间(起始)',
                        key: 'sDate',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '对账时间(截止)',
                        key: 'eDate',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '明细',
                        align: 'center',
                        width: 110,
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.openErrorDetail(params.row)
                                        }
                                    }
                                }, '差错明细')
                            ])
                        }
                    }
                ],
                errColumns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '流水号',
                        key: 'errStreamno',
                        align: 'center'
                    },
                    {
                        title: '订单号',
                        key: 'errOrderno',
                        align: 'center'
                    },
                    {
                        title: '交易状态',
                        key: 'errTranstate',
                        align: 'center'
                    },
                    {
                        title: '交易金额',
                        key: 'errPayment',
                        align: 'center'
                    },
                    {
                        title: '差错类别',
                        key: 'errType',
                        align: 'center'
                    },
                    {
                        title: '差错描述',
                        key: 'errMsg',
                        align: 'center'
                    },
                    {
                        title: '下单时间',
                        key: 'errOrddate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 180,
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        icon: 'ios-construct'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleCheck(params.row)
                                        }
                                    }
                                }, '调账')
                            ])
                        }
                    }
                ],
                thisTableData: [],
                errTableData: []
            }
        },
        methods: {
            getData () {
                this.request('http://localhost:38080/manage/pay/getConstrastiveErrorRecode', this.queryDataParams)
                    .then((data) => {
                        if (data.status === 200) {
                            this.pageParams.pageData = data.obj.rows
                            this.thisTableData = this.pageParams.pageData
                            this.pageParams.pageTotal = data.obj.total
                        }
                    }).catch((response) => {
                        this.$Modal.warning({
                            title: '警告',
                            content: '数据请求超时'
                        })
                    })
            },
            openErrorDetail (currentRow) {
                this.showModal = true
                this.rowStreamNo = currentRow.constrastive_streamNo
                this.request('http://localhost:38080/manage/pay/openErrorList', {streamNo: this.rowStreamNo})
                    .then((data) => {
                        if (data.status === 200) {
                            this.errTableData = data.obj
                            this.isLoading = false
                        }
                    }).catch((response) => {
                        this.isLoading = false
                        this.$Modal.warning({
                            title: '警告',
                            content: '数据请求超时'
                        })
                    })
            },
            search (data, argumentObj) {
                let res = data
                let dataClone = data
                for (let argu in argumentObj) {
                    if (argumentObj[argu].length > 0) {
                        res = dataClone.filter(d => {
                            return d[argu].indexOf(argumentObj[argu]) > -1
                        })
                        dataClone = res
                    }
                }
                return res
            },
            changePageShow: function (curPage) {
                this.queryDataParams.page = curPage
                this.getData()
            },
            changePageSize: function (pageSize) {
                this.queryDataParams.size = pageSize
                this.getData()
            },
            rowClassName (row) {
                if (row.errType === 1) {
                    return 'table-error-row-1'
                } else if (row.errType === 2) {
                    return 'table-error-row-2'
                } else if (row.errType === 0) {
                    return 'table-error-row-0'
                }
            },
            exportTableData () {
                this.$refs.table.exportCsv({
                    filename: this.rowStreamNo + '_errorFlow'
                })
            },
            closeModal () {
                this.getData()
                this.showModal = false
            },
            handleSearch () {
                this.pageParams.pageData = this.thisTableData
                this.pageParams.pageData = this.search(this.pageParams.pageData, {constrastive_streamNo: this.searchQuery.searchCode})
            },
            handleCheck (currentRow) {
                this.request('http://localhost:38080/manage/pay/checkErrorRecode', Object.assign({}, currentRow))
                    .then((data) => {
                        if (data.status === 200) {
                            this.errTableData.splice(currentRow._index, 1)
                            this.$Message.success(data.msg)
                        }
                    }).catch((response) => {
                        this.$Modal.warning({
                            title: '警告',
                            content: '数据请求超时'
                        })
                    })
            },
            timer: function () {
                this.getData()
            }
        },
        mounted () {
            this.getData()
            // 每半小时更新数据
            setInterval(this.timer, 1800000)
        }
    }
</script>

<style lang="less">
    @import '../../../styles/common.less';
</style>
