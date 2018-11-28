<!--银行流水-->
<template>
    <Row>
        <Col>
            <Card>
                <h4 slot="title">
                    <Col>
                        <label id="label1">开始查询时间：</label>&nbsp;
                        <DatePicker v-model="selectTimeRange.startDate"  type="date"  @on-change="changeStartDate" style="width: 15%"></DatePicker>&nbsp;&nbsp;
                        <label id="label2">截至查询时间：</label>&nbsp;
                        <DatePicker v-model="selectTimeRange.endDate" type="date"  @on-change="changeEndDate" style="width: 15%"></DatePicker>&nbsp;&nbsp;
                        <label id="label3">流水类型：</label>&nbsp;
                        <Select v-model="queryDataParams.tranState"  style="width:10%">
                            <Option v-for="item in payStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>&nbsp;
                        <i-button type="primary" icon="ios-search" @click="searchPayOrder">查询</i-button>&nbsp;
                        <label id="label4">消费单查询：</label>&nbsp;
                        <i-input v-model="searchQuery.searchOrderName" icon="ios-search" placeholder="输入消费单号" @on-keyup=" handleSearch" style="width: 13%"></i-input>
                    </Col>
                </h4>
            </Card>
            <Table class="Table" ref="table1" :data="pageParams.pageData" :columns="columns"></Table>
            <Page :total="pageParams.pageTotal" :page-size="pageParams.pageSize" show-elevator show-total show-sizer placement="bottom" @on-change="changePageShow" @on-page-size-change="changePageSize"></Page>
        </Col>
    </Row>
</template>

<script>
export default {
  name: 'banks-flow',
  data () {
    return {
      searchQuery: {
        searchOrderName: ''
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
      pageParams: {
        pageTotal: 0,
        pageSize: 10,
        pageData: []
      },
      selectTimeRange: {
        startDate: '',
        endDate: ''
      },
      queryDataParams: {
        bDate: '',
        eDate: '',
        tranState: 'T',
        merchantID: '10000008',
        page: 1,
        size: 10
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 90,
          align: 'center'
        },
        {
          title: '消费单号',
          key: 'ordNum',
          width: 160,
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
          width: 100,
          align: 'center'
        },
        {
          title: '交易状态',
          key: 'tranState',
          width: 90,
          align: 'center'
        },
        {
          title: '交易描述',
          key: 'tranMsg',
          width: 180,
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
          width: 160,
          align: 'center'
        },
        {
          title: '交易日期',
          width: 120,
          key: 'tranDateTime',
          align: 'center'
        }
      ],
      payOrderTable: []
    }
  },
  methods: {
    changePageSize (pageSize) {
      this.queryDataParams.size = pageSize
      this.request('http://localhost:38080/manage/pay/queryBankAccount', this.queryDataParams).then((data) => {
        if (data.status === 200) {
          this.pageParams.pageData = data.obj.rows
          this.payOrderTable = this.pageParams.pageData
        }
      })
    },
    changePageShow (curPage) {
      this.queryDataParams.page = curPage
      this.request('http://localhost:38080/manage/pay/queryBankAccount', this.queryDataParams).then((data) => {
        if (data.status === 200) {
          this.pageParams.pageData = data.obj.rows
          this.payOrderTable = this.pageParams.pageData
        }
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
        this.request('http://localhost:38080/manage/pay/queryBankAccount', this.queryDataParams).then((data) => {
          if (data.status === 200) {
            this.pageParams.pageData = data.obj.rows
            this.payOrderTable = this.pageParams.pageData
            this.pageParams.pageTotal = data.obj.total
            this.$Message.success('成功查询' + (this.pageParams.pageTotal) + '条流水记录')
          }
        })
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
