<!--交易流水-->
<template>
    <Row>
        <Col>
            <Card>
                <h4 slot="title">
                    <Col>
                        <label id="label1">开始查询时间：</label>&nbsp;
                        <DatePicker v-model="selectTimeRange.startDate" type="date"  @on-change="changeStartDate" style="width: 15%"></DatePicker>&nbsp;&nbsp;
                        <label id="label2">截止查询时间：</label>&nbsp;
                        <DatePicker v-model="selectTimeRange.endDate" type="date"  @on-change="changeEndDate" style="width: 15%"></DatePicker>&nbsp;&nbsp;
                        <label id="label3">流水类型：</label>&nbsp;
                        <Select v-model="queryDataParams.tranState"  style="width: 10%">
                            <Option v-for="item in payStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>&nbsp;
                        <i-button type="primary" icon="ios-search" @click="searchPayOrder">查询</i-button>&nbsp;
                        <label id="label4">消费单查询：</label>&nbsp;
                        <i-input v-model="searchQuery.searchOrderName" icon="ios-search" placeholder="输入消费单号" @on-keyup=" handleSearch" style="width: 13%"></i-input>
                    </Col>
                </h4>
            </Card>
            <div class="edittable-table-height-con">
                <Table ref="table1" :data="pageParams.pageData" :columns="columns"></Table>
            </div>
            <Page :current="pageParams.pageCurrent" :total="pageParams.pageTotal" :page-size="pageParams.pageSize" show-elevator show-total show-sizer placement="bottom" @on-change="changePageShow" @on-page-size-change="changePageSize"></Page>
        </Col>
    </Row>
</template>

<script>
    export default {
        name: 'trans-flow',
        data () {
            return {
                searchQuery: {
                    searchOrderName: ''
                },
                pageParams: {
                    pageTotal: 0,
                    pageSize: 10,
                    pageCurrent: 1,
                    pageData: []
                },
                selectTimeRange: {
                    startDate: '',
                    endDate: ''
                },
                payStateList: [
                    {
                        value: 'T',
                        label: '成功'
                    },
                    {
                        value: 'F',
                        label: '失败'
                    },
                    {
                        value: 'A',
                        label: '全部'
                    },
                    {
                        value: 'W',
                        label: '等待支付'
                    }
                ],
                queryDataParams: {
                    bDate: '',
                    eDate: '',
                    tranState: 'T',
                    page: 1,
                    size: 10
                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '消费单号',
                        key: 'ordNum',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '消费金额',
                        key: 'payMent',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '商户号',
                        key: 'merchantID',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '交易状态',
                        key: 'tranState',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '交易描述',
                        key: 'tranMsg',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '下单日期',
                        key: 'ordDate',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '交易流水号',
                        key: 'tranNo',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '交易日期',
                        key: 'tranDateTime',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '业务类型',
                        key: 'payCategory',
                        width: 90,
                        align: 'center'
                    }
                ],
                // payOrderArr: [],
                payOrderTable: []
            }
        },
        methods: {
            changePageSize (pageSize) {
                this.queryDataParams.size = pageSize
                this.request('http://localhost:38080/manage/pay/queryPlatformAccount', this.queryDataParams)
                    .then((data) => {
                        if (data.status === 200) {
                            this.pageParams.pageData = data.obj.rows
                            this.payOrderTable = this.pageParams.pageData
                        }
                    }).catch((response) => {
                        this.$Modal.warning({
                            title: '警告',
                            content: '操作请求超时'
                        })
                    })
            },
            changePageShow (curPage) {
                this.queryDataParams.page = curPage
                this.request('http://localhost:38080/manage/pay/queryPlatformAccount', this.queryDataParams)
                    .then((data) => {
                        if (data.status === 200) {
                            this.pageParams.pageData = data.obj.rows
                            this.payOrderTable = this.pageParams.pageData
                        }
                    }).catch((response) => {
                        this.$Modal.warning({
                            title: '警告',
                            content: '操作请求超时'
                        })
                    })
                // 假分页
                // this.pageParams.pageData.splice(0, this.pageParams.pageData.length)
                // for (var i = 10 * (curpage - 1) + 1
                //     i <= ((this.pageParams.pageTotal > 10 * curpage) ? (10 * curpage) : (this.pageParams.pageTotal)) i++) {
                //     this.pageParams.pageData.push(this.payOrderArr[i - 1])
                //     this.payOrderTable = this.pageParams.pageData
                // }
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
            handleSearch () {
                this.pageParams.pageData = this.payOrderTable
                this.pageParams.pageData = this.search(this.pageParams.pageData, {ordNum: this.searchQuery.searchOrderName})
            },
            changeStartDate (date) {
                this.selectTimeRange.startDate = date
            },
            changeEndDate (date) {
                this.selectTimeRange.endDate = date
            },
            searchPayOrder () {
                var startData = this.convertDate(this.selectTimeRange.startDate)
                var endData = this.convertDate(this.selectTimeRange.endDate)
                if (startData > endData) {
                    this.$Modal.warning({
                        title: '警告',
                        content: '查询时间范围错误'
                    })
                } else if (isNaN(startData) || isNaN(endData)) {
                    this.$Modal.warning({
                        title: '警告',
                        content: '查询时间不能为空'
                    })
                } else {
                    this.queryDataParams.bDate = startData
                    this.queryDataParams.eDate = endData
                    this.request('http://localhost:38080/manage/pay/queryPlatformAccount', this.queryDataParams)
                        .then((data) => {
                            if (data.status === 200) {
                                this.pageParams.pageData = data.obj.rows
                                this.payOrderTable = this.pageParams.pageData
                                this.pageParams.pageTotal = data.obj.total
                                this.$Message.success('成功查询' + (this.pageParams.pageTotal) + '条流水记录')
                            }
                        }).catch((response) => {
                            this.$Modal.warning({
                                title: '警告',
                                content: '操作请求超时'
                            })
                        })
                    // 假分页
                    // if (data.status === 200) {
                    //     console.log(data)
                    //     this.payOrderArr = data.obj
                    //     this.pageParams.pageTotal = this.payOrderArr.length
                    //     this.pageParams.pageData.splice(0, this.pageParams.pageData.length)
                    //     for (var i = 0 i < this.pageParams.pageTotal i++) {
                    //         var object = this.payOrderArr[i]
                    //         if (i < this.pageParams.pageSize) {
                    //             this.pageParams.pageData.push(object)
                    //         }
                    //     }
                    //     this.payOrderTable = this.pageParams.pageData
                    //     this.$Message.success('成功查询' + (this.payOrderArr.length) + '条流水记录')
                    // }
                }
            },
            convertDate (time) {
                var t = new Date(time)
                var tf = function (i) {
                    return (i < 10 ? '0' : '') + i
                }
                return tf(t.getFullYear()) + tf(t.getMonth() + 1) + tf(t.getDate())
            }
        }
    }
</script>

<style lang="less">
    @import '../../../styles/common.less';
</style>

