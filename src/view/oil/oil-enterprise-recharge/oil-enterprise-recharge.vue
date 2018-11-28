<template>
  <div>
    <Row>
      <Col>
        <Card>
          <h4 slot="title">
            <i-input v-model="searchQuery.searchCode"  placeholder="请输入企业ID" @on-enter="handleSearch" style="width: 200px"></i-input>
            <i-button type="primary" icon="ios-search" @click="handleSearch" >搜索</i-button>
          </h4>
        </Card>
        <Card>
          <div class="edittable-table-height-con">
            <Table :data="tableData" :columns="columns" :loading="isLoading"  border @on-expand="GetPartnerCompanyCardList"></Table>
          </div>
        </Card>
        <modal v-model="showModal" :title='textMap[dialogStatus]' >
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="充值金额" prop="rechargeAmount" style="margin-top: 25px">
              <i-input v-model="formValidate.rechargeAmount" placeholder="请输入充值金额"></i-input>
            </FormItem>
            <!--<FormItem label="密码" prop="password">-->
              <!--<i-input v-model="formValidate.password" placeholder="请输入密码"></i-input>-->
            <!--</FormItem>-->
          </Form>
          <div slot="footer">
            <Button type="primary" @click="oilRecharge">确认</Button>
            <Button type="ghost" size="large" @click="handleReset">取消</Button>
          </div>
        </modal>
      </Col>
    </Row>
  </div>
</template>

<script>
import expandRow from './table-expand.vue'
export default {
  name: 'oil-enterprise-recharge',
  components: { expandRow },
  data () {
    return {
      showModal: false,
      isLoading: true,
      rechargeAmount: 0,
      password: '',
      paras: '',
      searchQuery: {
        searchCode: ''
      },
      dialogStatus: '',
      textMap: {
        recharge: '充值'
      },
      formValidate: {
        rechargeAmount: '',
        password: ''
      },
      ruleValidate: {
        rechargeAmount: [
          {required: true, message: '充值金额不能为空', trigger: 'blur'}
        ]
      },
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            this.paras = params.row.CompanyID
            console.log(this.paras.status)
            return h(expandRow, {
              props: {
                row: this.thisTableData,
                rechargeCompanyID: params.row.CompanyID
              }
            })
          }
        },
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '企业ID',
          key: 'CompanyID',
          align: 'center'
        },
        {
          title: '企业编码',
          key: 'CompanyCode',
          align: 'center'
        },
        {
          title: '企业名称',
          key: 'CompanyName',
          align: 'center'
        },
        {
          title: '账户余额',
          key: 'canUseCash',
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
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.handleRecharge(params.row)
                  }
                }
              }, '充值')
            ])
          }
        }
      ],
      tableData: [],
      thisTableData: [],
      rechargeCompanyID: ''
    }
  },
  methods: {
    getData () {
      let paras = {
        companyID: '07D511F8-0EB0-4F9F-A4CF-A6141C790EA4'
      }
      this.request('http://localhost:18082/oil/GetPartnerCompany', paras)
        .then((data) => {
          console.log(data.obj)
          if (data.status === 200) {
            let reStr = data.obj
            let len = reStr.indexOf(']')
            let resultStr = reStr.substring(0, len + 1)
            this.tableData = JSON.parse(resultStr)
            this.isLoading = false
          } else {
            this.$Message.success(data.msg)
          }
        }).catch((response) => {
          this.$Modal.warning({
            title: '警告',
            content: '数据请求超时'
          })
        })
    },
    GetPartnerCompanyCardList (row, status) {
      console.log(row.CompanyID)
      console.log(status)
      // this.thisTableData = []
      this.request('http://localhost:18082/oil/GetPartnerCompanyCardList', row.CompanyID)
        .then((data) => {
          if (data.status === 200) {
            let reStr = data.obj
            let len = reStr.indexOf(']')
            let resultStr = reStr.substring(0, len + 1)
            this.thisTableData = JSON.parse(resultStr)
            console.log(this.thisTableData)
          } else {
            this.$Message.success(data.msg)
          }
        })
    },
    search () {},
    handleSearch () {},
    handleUpdate () {},
    handleReset () {
      this.$refs['formValidate'].resetFields()
      this.showModal = false
    },
    handleRecharge (row) {
      this.dialogStatus = 'recharge'
      this.rechargeCompanyID = row.CompanyID
      this.showModal = true
    },
    oilRecharge (row) {
      // this.$set(this.tableData, 'password', '123456')
      this.$refs['formValidate'].validate((valid) => {
        console.log(this.formValidate.rechargeAmount)
        if (valid) {
          let paras = {
            companyID: this.rechargeCompanyID,
            rechargeAmount: this.formValidate.rechargeAmount,
            payOrderId: 'D1000000820180917155140'
          }
          this.request('http://localhost:18082/oil/CompanyCardRecharge', paras)
            .then((data) => {
              if (data.status === 200) {
                console.log(data)
              } else {
              }
            }).catch((response) => {
              this.$Modal.warning({
                title: '警告',
                content: '操作请求超时'
              })
            })
          this.showModal = false
        }
      })
    },
    showOilCard () {
      this.showModal = true
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less">
  @import '../../../styles/common.less';
</style>
