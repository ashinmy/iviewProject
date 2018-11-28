<template>
  <div>
    <Row class="padding-5-percent" style="padding-bottom:10px ;">
      <i-col style="float: right;">
        <i-input v-model="searchName" placeholder="请输入申请人姓名" style="width: 200px"></i-input>
        <i-button type="primary" style='margin-left: 10px;' @click="search()">查询</i-button>
      </i-col>
    </Row>
    <Row class="padding-5-percent" style="padding-bottom:10px;">
      <i-col>
        <i-table border :content="self" :columns="columns1" :data="data1"></i-table>
        <Modal v-model="showModal" width="600" :mask-closable="false" class-name="vertical-center-modal">
          <p slot="header" style="color:#000;text-align:center">
            <span>用户用信初审</span>
          </p>
          <div>
            <Row class="interval">
              <i-col span="8">
                <label id="userFirstApplicationId" style="display: none;">{{detailData.id}}</label>
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
                <label>授信额度：</label>
                <span>{{detailData.applicationCredit}}</span>
              </i-col>
              <i-col span="8">
                <label>申请用信日期：</label>
                <span>{{detailData.createTime}}</span>
              </i-col>
            </Row>
            <Row>
              <i-col span="16">
                <label>绑定ETC卡号：</label>
                <span>{{detailData.debt}}</span>
              </i-col>
              <i-col span="8">
                <label>剩余额度：</label>
                <span>{{detailData.creditAvailable}}</span>
              </i-col>
            </Row>
          </div>
          <div slot="footer">
            <Row>
              <i-col span="8" style="text-align: left">
                <label>申请额度：</label>
                <span>{{detailData.applicationSumUser}}</span>
              </i-col>
              <i-col span="8" style="text-align: left">
                <label>批复额度：</label>
                <span>{{detailData.replaySum}}</span>
              </i-col>
            </Row>
            <Row style="margin-top: 10px">
              <i-col span="24" style="text-align: left">
                <label>经办建议：</label>
                <span>{{detailData.agencyOpinion}}</span>
              </i-col>
            </Row>
            <Row style="margin-top: 10px">
              <i-col span="2" style="text-align: left">
                <label>建议：</label>
              </i-col>
              <i-col span="15">
                <i-input v-model = 'InitialOpinion' type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="请输入您的建议"></i-input>
                <label v-if="InitialOpinion===''" id="InitialOpinion-alert" style="float: left;color: #f2565c;display: none;">请输入您拒绝的原因！</label>
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
        <!--<Modal v-model="modalSendBack" :mask-closable="false" class-name="vertical-center-modal">
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
              <Button @click="submitSendBack('')">取消</Button>
              <Button @click="submitSendBack('ok')" type="primary" size="large">确定</Button>
            </Row>
          </div>
        </Modal>-->
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
  name: 'useFirstTrialCredit',
  data () {
    return {
      self: this,
      showModal: false,
      modalConfirm: false,
      InitialOpinion: '',
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
                    let dataId = this.detailData.id
                    this.request('get', 'http://localhost:8088/credit/get/' + dataId)
                      .then((data) => {
                        this.detailData['agencyOpinion'] = data.agencyOpinion
                        this.detailData['creditAvailable'] = data.creditAvailable
                        this.detailData['replaySum'] = data.credit.replySum
                        this.detailData['applicationCredit'] = data.credit.application.applicationSum
                        this.detailData['applicationSumUser'] = data.credit.applicationSum
                        this.showModal = true
                      }).catch((response) => {
                        this.$Modal.warning({
                          title: 'response',
                          content: '数据请求超时'
                        })
                      })
                  }
                }
              }, '用信初审')
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
          let userFirstApplicationId = document.getElementById('userFirstApplicationId').innerHTML
          let data = {}
          data['credit'] = {'id': userFirstApplicationId}
          data['approvalResult'] = '1'
          data['approvalType'] = '1'
          if (this.InitialOpinion !== '') {
            data['approvalOpinion'] = this.InitialOpinion
          }
          this.request('post', 'http://localhost:8088/creditApproval/add', data)
            .then((response) => {
              this.showModal = false
              this.modalConfirm = false
              this.InitialOpinion = ''
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
        case 'refuse':
          if (this.InitialOpinion === '') {
            document.getElementById('InitialOpinion-alert').style.display = 'inline-block'
            return
          }
          let creditId = document.getElementById('userFirstApplicationId').innerHTML
          let data = {}
          data['credit'] = {'id': creditId}
          data['approvalResult'] = '0'
          data['approvalType'] = '1'
          data['approvalOpinion'] = this.InitialOpinion
          this.request('post', 'http://localhost:8088/creditApproval/add', data)
            .then((response) => {
              this.showModal = false
              this.InitialOpinion = ''
              this.$Message.info('拒绝成功！')
              let obj = {}
              obj['applicationStatus'] = '5'
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
          this.InitialOpinion = ''
          break
      }
    },
    dealData (data) { /* 统一处理数据 */
      this.dataCount = data.totalElements
      this.pageSize = data['content'].length
      for (let i = 0; i < data['content'].length; i++) {
        if (data['content'][i]['application'].gender === 'M') {
          data['content'][i].gender = '男'
        } else {
          data['content'][i].gender = '女'
        }
        data['content'][i].applicant = data['content'][i]['application'].applicant
        data['content'][i].contactInfo = data['content'][i]['application'].contactInfo
        data['content'][i].address = data['content'][i]['application'].address
        data['content'][i].code = data['content'][i]['application'].code
        data['content'][i].createTime = data['content'][i].createTime.split(' ')[0]
        data['content'][i].applationReplaysum = data['content'][i]['application'].replySum
      }
      this.data1 = data['content']
    },
    sendRequest (index, obj) { /* 发送请求 */
      this.request('post', 'http://localhost:8088/credit/search?page=' + index + '&size=15&sort=id', obj)
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
        let obj = {}
        obj['application'] = {'applicant': this.searchName}
        obj['applicationStatus'] = '0'
        this.sendRequest(0, obj)
      }
    }
    /* submitSendBack (type) {
      this.modalSendBack = false
      switch (type) {
        case 'ok':
          let userId = document.getElementById('Id').innerHTML
          let data = {}
          data['application'] = {'id': userId}
          data['approvalResult'] = '0'
          data['approvalType'] = '4'
          this.request('post', 'http://localhost:8088/approval/add', data).then((response) => {
            this.showModal = false
            this.modalConfirm = false
            this.InitialOpinion = ''
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
    } */
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
