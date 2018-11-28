<!--对账记录-->
<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <h4>
                        <i-input v-model="searchQuery.searchCode"  placeholder="请输入对账批次号" @on-enter="handleSearch" style="width: 200px"></i-input>&nbsp;&nbsp;
                        <i-button type="primary" icon="ios-search" @click="handleSearch" >搜索</i-button>
                        <div style="float: right; padding-right: 20px"><label style="color: #4682B4">系统自动对账时间：每日凌晨1时</label></div>
                    </h4>
                </Card>
                <Card>
                  <Table ref="table2" :data="pageParams.pageData" :columns="columns" border ></Table>
                </Card>
                <Page :total="pageParams.pageTotal" :page-size="pageParams.pageSize" show-elevator show-total show-sizer placement="bottom" @on-change="changePageShow" @on-page-size-change="changePageSize"></Page>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: 'reconciliation',
        data () {
            return {
                searchQuery: {
                    searchCode: ''
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
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '对账批次号',
                        key: 'constrastive_streamNo',
                        width: 180,
                        align: 'center'
                    },
                    {
                        title: '消费单数量总计',
                        key: 'number_total',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '总金额',
                        key: 'payment_total',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '支付渠道',
                        key: 'finance_channel',
                        width: 150,
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
                        title: '状态',
                        align: 'center',
                        // minWidth: 97,
                        width: 97,
                        key: 'handle',
                        render: (h) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-checkmark-circle-outline',
                                        color: '#008000',
                                        size: 20
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                })
                            ])
                        }
                    }
                ],
                thisTableData: []
            }
        },
        methods: {
            getData () {
                this.request('http://localhost:38080/manage/pay/getConstrastiveRecode', this.queryDataParams)
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
            changePageShow (curPage) {
                this.queryDataParams.page = curPage
                this.getData()
            },
            changePageSize (pageSize) {
                this.queryDataParams.size = pageSize
                this.getData()
            },
            handleSearch () {
                this.pageParams.pageData = this.thisTableData
                this.pageParams.pageData = this.search(this.pageParams.pageData, {constrastive_streamNo: this.searchQuery.searchCode})
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

<style scoped>

</style>
