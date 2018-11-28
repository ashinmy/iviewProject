<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col>
        <Card>
          <Table :data="row" :columns="columns" class="expand-key"></Table>
        </Card>
        <modal v-model="showModal" :title="textMap[dialogStatus]" >
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <FormItem label="分配金额" prop="rechargeAmount" style="margin-top: 25px">
              <i-input v-model="formValidate.rechargeAmount" placeholder="请输入分配金额"></i-input>
            </FormItem>
            <FormItem label="密码" prop="password">
            <i-input v-model="formValidate.password" placeholder="请输入密码"></i-input>
            </FormItem>
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
export default {
  props: {
    row: Array,
    rechargeCompanyID: String
  },
  data () {
    return {
      showModal: false,
      rechargeAmount: 0,
      password: '',
      cardCode: '',
      textMap: {
        allocation: '分配金额'
      },
      dialogStatus: '',
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 150,
          align: 'center'
        },
        {
          title: '油卡卡号',
          key: 'CardCode',
          align: 'center'
        },
        {
          title: '状态',
          key: 'StatusName',
          align: 'center'
        },
        {
          title: '余额',
          align: 'center',
          key: 'BFJ'
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
              }, '分配金额')
            ])
          }
        }
      ],
      formValidate: {
        rechargeAmount: '',
        password: ''
      },
      ruleValidate: {
        rechargeAmount: [
          {required: true, message: '分配金额不能为空', trigger: 'blur'}
        ]
      },
      cardList: []
    }
  },
  methods: {
    handleReset () {
      this.$refs['formValidate'].resetFields()
      this.showModal = false
    },
    handleRecharge (row) {
      this.dialogStatus = 'allocation'
      this.cardCode = row.CardCode
      this.showModal = true
    },
    oilRecharge (row) {
      // this.$set(this.tableData, 'password', '123456')
      let that = this
      this.$refs['formValidate'].validate((valid) => {
        that.showModal = false
        console.log(this.formValidate.rechargeAmount)
        if (valid) {
          let paras = {
            companyID: this.rechargeCompanyID,
            rechargeAmount: this.formValidate.rechargeAmount,
            cardCode: this.cardCode,
            password: this.formValidate.password
          }
          console.log(paras)
          this.request('http://localhost:18082/oil/CompanyFundAllocation', paras)
            .then((data) => {
              if (data.status === 200) {
                console.log(data)
              } else {}
            }).catch((response) => {
              this.$Modal.warning({
                title: '警告',
                content: '操作请求超时'
              })
            })
        }
      })
    }
  },
  mounted () {
  }
}
</script>
