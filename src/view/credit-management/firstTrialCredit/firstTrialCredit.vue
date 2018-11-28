<template>
  <div>
    <Row class="padding-5-percent" style="padding-bottom:10px ;">
        <i-col style="float: right;">
            <i-input v-model="searchName" placeholder="请输入申请人姓名" style="width: 200px" ></i-input>
            <i-button type="primary" style='margin-left: 10px;' @click="search()">查询</i-button>
        </i-col>
    </Row>
    <Row class="padding-5-percent" style="padding-bottom:10px;">
        <i-col>
            <i-table border :content="self" :columns="columns1" :data="data1"></i-table>
            <Modal v-model="showModal" width="600" :mask-closable="false" class-name="vertical-center-modal">
              <p slot="header" style="color:#000;text-align:center">
                <span>用户授信初审</span>
              </p>
            <div>
              <Row class="interval">
                <i-col span="8">
                  <label id="Id" style="display: none;">{{detailData.id}}</label>
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
                <Row class="interval">
                    <i-col span="24">
                      <label>申请授信额度：</label>
                      <span>{{detailData.applicationSum}}&nbsp;元</span>
                    </i-col>
                </Row>
                <Row class="interval" style='padding-bottom: 0;'>
                    <i-col span="24">
                      <label>授信额度：</label>
                      <span style="color: #ed1c24;">{{detailData.replySum}}&nbsp;元</span>
                    </i-col>
                </Row>
            </div>
            <div slot="footer">
              <Row>
                  <i-col span="3" style="text-align: left;">
                    <label>初审意见：</label>
                  </i-col>
                  <i-col span="21">
                    <i-input v-model = 'InitiaOpinion' type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="请输入您的初审意"></i-input>
                    <div v-if="InitiaOpinion===''" id="warningBlock" class="warning-msg" style="float:left;color: #f2565c;display: none;">请输入退回意见</div>
                  </i-col>
              </Row>
              <Row style="text-align: center;margin-top: 10px;">
                <Button @click="choose('cancel')">取消</Button>
                <Button @click="choose('return')">退回</Button>
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
                  <p>您确认用户{{detailData.applicant}}授信额度为</p>
                  <p><span style="color: #ed1c24;">{{detailData.replySum}}</span>&nbsp;元，初审通过？</p>
                </i-col>
              </Row>
              <div slot="footer">
                <Row style="text-align: center;margin-top: 10px;">
                  <Button @click="submit('cancel')">取消</Button>
                  <Button @click="submit('ok')" type="primary" size="large">确定</Button>
                </Row>
              </div>
            </Modal>
            <Modal v-model="modalSendback" :mask-closable="false" class-name="vertical-center-modal">
                <Row>
                  <i-col span="3" offset="3" style="text-align: center;">
                    <Icon type="ios-information-circle" style="font-size: 30px;color:#ed1c24"></Icon>
                  </i-col>
                  <i-col span="16" style="font-size: 16px;">
                    <p style="line-height: 2;">您确认将用户{{detailData.name}}的授信申请退回经办吗?</p>
                  </i-col>
                </Row>
                <div slot="footer">
                    <Row style="text-align: center;margin-top: 10px;">
                      <Button @click="submitSendback('')">取消</Button>
                      <Button @click="submitSendback('ok')" type="primary" size="large">确定</Button>
                    </Row>
                </div>
            </Modal>
        </i-col>
    </Row>
    <Row class="padding-5-percent">
          <i-col>
              <Page :total="dataCount" :page-size="pageSize" style="float: right;margin-top: 5px;" show-elevator show-sizer  show-total @on-change='changePage'/>
          </i-col>
        </Row>
  </div>
</template>

<script>
export default {
  name: 'firstTrialCredit',
  data () {
    return {
      self: this,
      showModal: false,
      modalConfirm: false,
      modalSendback: false,
      InitiaOpinion: '',
      detailData: {},
      searchName: '',
      columns1: [
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
                  }
                }
              }, '初审')/*,
              h('span', {
                style: {
                  fontSize: '14px',
                  padding: '5px 10px',
                  margin: '0 0 0 8px',
                  cursor: 'pointer',
                  color: '#fff',
                  display: 'inline-block',
                  background: '#ff5706'
                },
                on: {
                  click: () => {
                    this.detailData = params['row']
                    this.modalSendback = true
                  }
                }
              }, '退回经办') */
            ])
          }
        }
      ],
      data1: [],
      dataCount: 0, // 数据的总数量
      pageSize: 0// 每页显示几条
    }
  },
  methods: {
    submit (type) {
      switch (type) {
        case 'ok':
          let userId = document.getElementById('Id').innerHTML
          let data = {}
          data['application'] = {'id': userId}
          data['approvalResult'] = '1'
          data['approvalType'] = '1'
          data['approvalOpinion'] = this.InitiaOpinion
          this.request('post', 'http://localhost:8088/approval/add', data)
            .then((response) => {
              this.showModal = false
              this.modalConfirm = false
              this.InitiaOpinion = ''
              this.$Message.info('提交成功')
              let obj = {}
              obj['applicationStatus'] = '0'
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
          break
      }
    },
    choose (type) {
      switch (type) {
        case 'submit':
          this.modalConfirm = true
          break
        case 'return':
          this.submitSendback('ok')
          break
        case 'cancel':
          this.showModal = false
          this.InitiaOpinion = ''
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
      this.data1 = data['content']
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
      obj['applicationStatus'] = '0'
      this.sendRequest(index, obj)
    },
    search () { /* 按姓名查询 */
      if (this.searchName === '') {
        let obj = {}
        obj['applicationStatus'] = '0'
        this.sendRequest(0, obj)
      } else {
        let applicationName = ''
        let obj = {}
        applicationName = this.searchName
        obj['applicant'] = applicationName
        obj['applicationStatus'] = '0'
        this.sendRequest(0, obj)
      }
    },
    submitSendback (type) {
      this.modalSendback = false
      if (this.InitiaOpinion === '') {
        document.getElementById('warningBlock').style.display = 'inline-block'
        return
      }
      switch (type) { /* 退回经办 */
        case 'ok':
          let data = {}
          let userId = document.getElementById('Id').innerHTML
          data['application'] = {'id': userId}
          data['approvalResult'] = '0'
          data['approvalType'] = '1'
          data['approvalOpinion'] = this.InitiaOpinion
          this.request('post', 'http://localhost:8088/approval/add', data).then((response) => {
            this.showModal = false
            this.modalConfirm = false
            this.InitiaOpinion = ''
            this.$Message.info('退回成功')
            let obj = {}
            obj['applicationStatus'] = '0'
            this.sendRequest(0, obj)
          }).catch((response) => {
            this.$Modal.warning({
              title: 'response',
              content: '数据请求超时'
            })
          })
          break
      }
    }
  },
  mounted () {
    let obj = {}
    obj['applicationStatus'] = '0'
    this.sendRequest(0, obj)
  }
}
</script>

<style scoped>
.interval{
  padding-bottom: 10px;
}
</style>
