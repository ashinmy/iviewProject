<template>
  <div>
    <Row class="padding-5-percent" style="padding-bottom:10px ;">
      <i-col style="float: right;">
        <i-input v-model='searchName' placeholder="请输入申请人姓名" style="width: 200px"></i-input> <!-- @input="search()"-->
        <i-button type="primary" style='margin-left: 10px;' @click="search()">查询</i-button>
      </i-col>
    </Row>
    <Row class="padding-5-percent" style="padding-bottom:10px;">
      <i-col>
        <i-table border :content="self" :columns="columns0" :data="data0"></i-table>
        <Modal v-model="showModal" width="600" :mask-closable="false" class-name="vertical-center-modal">
          <p slot="header" style="color:#000;text-align:center">
            <span>用户申请授信</span>
          </p>
          <div>
            <Row class="interval">
              <i-col span="8">
                <label id="userId" style="display: none;">{{detailData.id}}</label>
                <label>申请人：</label>
                <span>{{detailData.applicant}}</span>
              </i-col>
              <i-col span="8">
                <label>性别：</label>
                <span>{{detailData.gender}}</span>
              </i-col>
              <i-col span="8">
                <label>联系方式：</label>
                <span>{{detailData.contactInfo}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="8">
                <label>身份证号：</label>
                <span>{{detailData.code}}</span>
              </i-col>
              <i-col span="8">
                <label>开户银行：</label>
                <span>{{detailData.bankInfo}}</span>
              </i-col>
              <i-col span="8">
                <label>银行账号：</label>
                <span>{{detailData.bankAccount}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="8">
                <label>家庭住址：</label>
                <span>{{detailData.address}}</span>
              </i-col>
              <i-col span="8">
                <label>年收入：</label>
                <span>{{detailData.income}}</span>
              </i-col>
              <i-col span="8">
                <label>负债：</label>
                <span>{{detailData.debt}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="24">
                <label>征信情况：</label>
                <span>{{detailData.credit}}</span>
              </i-col>
            </Row>
          </div>
          <div style="border-top: 1px solid #e8eaec;padding-top: 10px;">
            <Row class="interval">
              <i-col span="8">
                <label>捆绑车牌号：</label>
                <span>{{detailData.sex}}</span>
              </i-col>
              <i-col span="8">
                <label>司机姓名：</label>
                <span>{{detailData.sex}}</span>
              </i-col>
              <i-col span="8">
                <label>司机联系方式：</label>
                <span>{{detailData.contactInfo}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="8">
                <label>从业资格证：</label>
                <span>{{detailData.port}}</span>
              </i-col>
              <i-col span="8">
                <label>绑定ETC卡号：</label>
                <span>{{detailData.sex}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="8">
                <label>车辆运营证号：</label>
                <span>{{detailData.name}}</span>
              </i-col>
              <i-col span="8">
                <label>车辆挂靠公司：</label>
                <span>{{detailData.sex}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="16">
                <label>挂靠公司统一社会信用代码：</label>
                <span>{{detailData.name}}</span>
              </i-col>
              <i-col span="8">
                <label>车辆类型：</label>
                <span>{{detailData.sex}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="8">
                <label>担保方审核情况：</label>
                <span>{{detailData.sponsorCheck}}</span>
              </i-col>
              <i-col span="8">
                <label>资金方审核情况：</label>
                <span>{{detailData.investorCheck}}</span>
              </i-col>
            </Row>
            <Row class="interval">
              <i-col span="8">
                <label>银行审核情况：</label>
                <span>{{detailData.name}}</span>
              </i-col>
              <i-col span="8">
                <label>提交审核日期：</label>
                <span>{{detailData.sex}}</span>
              </i-col>
            </Row>
            <Row>
              <i-col span="8">
                <label>申请授信额度：</label>
                <span>{{detailData.applicationSum}}</span>
              </i-col>
              <i-col span="8" v-if="detailData.replyOpinion!==''">
                <!--  <label>申请授信额度：</label>-->
                <span>{{detailData.replyOpinion}}</span>
              </i-col>
            </Row>
          </div>
          <div slot="footer">
            <Row>
              <i-col span="24" style="text-align: left;">
                <label>授信额度：<i-input class="credit-line" :value.sync="msg" placeholder="请输入授信额度" style="width: 150px;margin-right: 5px;" v-model="msg"></i-input>元</label>
                <label v-if="msg==''" class="warning-msg" style="margin-left: 5px;color: #f2565c;display: none;">请输入授信额度！</label>
              </i-col>
            </Row>
            <Row style="text-align: center;margin-top: 10px;">
              <Button @click="choose('cancel')">取消</Button>
              <Button @click="choose('refuse')">拒绝</Button>
              <Button @click="choose('submit')" type="primary" size="large">提交</Button>
            </Row>
          </div>
        </Modal>
        <Modal v-model="modalConfirm" :mask-closable="false" class-name="vertical-center-modal">
          <Row>
            <i-col span="3" offset="5" style="text-align: center;">
              <Icon type="ios-information-circle" style="line-height: 1.3;font-size: 30px;color:#ed1c24"></Icon>
            </i-col>
            <i-col span="16" style="font-size: 16px;">
              <p>您给{{detailData.applicant}}的授信额度为:<span style="color: #ed1c24;">{{msg}}</span>元，</p>
              <p>是否继续？</p>
            </i-col>
          </Row>
          <div slot="footer">
            <Row style="text-align: center;margin-top: 10px;">
              <Button @click="submit('cancel')">取消</Button>
              <Button @click="submit('ok')" type="primary" size="large">确定</Button>
            </Row>
          </div>
        </Modal>
      </i-col>
    </Row>
    <Row class="padding-5-percent">
      <i-col>
        <Page :total="dataCount" :page-size="pageSize" style="float: right;margin-top: 5px;" show-elevator show-total @on-change='changePage'/>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'creditManagement',
  data () {
    return {
      self: this,
      showModal: false,
      modalConfirm: false,
      detailData: {},
      msg: '',
      searchName: '',
      Opinion: '',
      columns0: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'applicant',
          align: 'center'
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center'
        },
        {
          title: '联系方式',
          key: 'contactInfo',
          align: 'center'
        },
        {
          title: '地址',
          key: 'address',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  fontSize: '14px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  color: '#fff',
                  display: 'inline-block',
                  background: '#81d3f7'
                },
                on: {
                  click: () => {
                    this.detailData = params['row']
                    this.showModal = true
                    this.detailData['replyOpinion'] = this.detailData['replyOpinion'].replace(':','：')
                  }
                }
              }, '授信'),
              h('span', {
                style: {
                  fontSize: '12px',
                  color: '#ed1c24',
                  paddingLeft: '5px',
                  display:(params['row']['replyOpinion']==='')?'none':'inline-block'
                }
              }, (params['row']['replyOpinion'].slice(0,2)==='初审')?'初审退回':'终审退回')
            ])
          }
        }
      ],
      data0: [],
      dataCount: 0, // 数据的总数量
      pageSize: 0// 每页显示几条
    }
  },
  methods: {
    submit (type) {
      switch (type) {
        case 'ok':
          let userId = document.getElementById('userId').innerHTML
          let data = {}
          data['application'] = {'id': userId}
          data['approvalResult'] = '1'
          data['approvalType'] = '0'
          data['approvalAmount'] = this.msg
          this.request('post', 'http://localhost:8088/approval/add', data).then((response) => {
            this.$Message.info('授信成功')
            this.showModal = false
            this.modalConfirm = false
            this.msg = ''
            let obj = {}
            obj['applicationStatus'] = '4'
            this.sendRequest(0, obj)
          }).catch((response) => {
            this.$Modal.warning({
              title: 'response',
              content: '数据请求超时'
            })
          })
          break
        case 'cancel':
          this.modalConfirm = false
          this.msg = ''
          break
      }
    },
    choose (type) {
      switch (type) {
        case 'submit':
          if (this.msg !== '') {
            this.modalConfirm = true
          } else {
            document.getElementsByClassName('warning-msg')[0].style.display = 'inline-block'
          }
          break
        case 'refuse':
          let userId = document.getElementById('userId').innerHTML
          let data = {}
          data['application'] = {'id': userId}
          data['approvalResult'] = '0'
          data['approvalType'] = '0'
          this.request('post', 'http://localhost:8088/approval/add', data)
            .then((response) => {
              this.showModal = false
              this.msg = ''
              this.$Message.info('拒绝成功')
              let obj = {}
              obj['applicationStatus'] = '4'
              this.sendRequest(0, obj)
            }).catch((response) => {
              this.$Modal.warning({
                title: 'response',
                content: '数据请求超时'
              })
            })
          break
        case 'cancel':
          this.showModal = false
          this.msg = ''
          document.getElementsByClassName('warning-msg')[0].style.display = 'none'
          break
      }
    },
    dealData (data) { /* 统一处理数据 */
      this.dataCount = data.totalElements
      this.pageSize = data['content'].length
      for (let i = 0; i < data['content'].length; i++) {
        if (data['content'][i].gender === 'M') {
          data['content'][i].gender = '男'
        } else {
          data['content'][i].gender = '女'
        }
      }
      this.data0 = data['content']
    },
    sendRequest (index, obj) { /* 发送请求 */
      this.request('post', 'http://localhost:8088/application/get/customPage?page=' + index + '&size=15&sort=applicant', obj)
        .then((data) => {
          this.dealData(data)
        }).catch((response) => {
          this.$Modal.warning({
            title: 'response',
            content: '数据请求超时'
          })
        })
    },
    changePage (index) {
      --index
      let obj = {}
      obj['applicationStatus'] = '4'
      this.sendRequest(index, obj)
    },
    search () { /* 按姓名查询 */
      if (this.searchName === '') {
        let obj = {}
        obj['applicationStatus'] = '4'
        this.sendRequest(0, obj)
      } else {
        let applicationName = ''
        let obj = {}
        applicationName = this.searchName
        obj['applicant'] = applicationName
        obj['applicationStatus'] = '4'
        this.sendRequest(0, obj)
      }
    }
  },
  mounted () {
    let obj = {}
    obj['applicationStatus'] = '4'
    this.sendRequest(0, obj)
  }
}
</script>

<style scoped>
.interval{
  padding-bottom: 10px;
}
</style>
