<template>
  <div>
    <Row class="padding-5-percent" style="padding-bottom:10px ;">
      <i-col style="float: right;">
        <i-input v-model='searchName' placeholder="请输入申请人姓名" style="width: 200px"></i-input>
        <i-button type="primary" style='margin-left: 10px;' @click="search()">查询</i-button>
      </i-col>
    </Row>
    <Row class="padding-5-percent" style="padding-bottom:10px;">
      <i-col>
        <i-table border :content="self" :columns="columns0" :data="data0"></i-table>
        <Modal v-model="showModal" width="600" :mask-closable="false" class-name="vertical-center-modal">
          <p slot="header" style="color:#000;text-align:center">
            <span>用户申请用信</span>
          </p>
          <div>
            <Row class="interval">
              <i-col span="8">
                <label id="creditId" style="display: none;">{{detailData.id}}</label>
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
                <span>{{detailData.applationReplaysum}}&nbsp;元</span>
              </i-col>
              <i-col span="8">
                <label>申请日期：</label>
                <span>{{detailData.createTime}}</span>
              </i-col>
            </Row>
            <Row class="interval">
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
              <i-col span="8" style="text-align: left;line-height: 2.5">
                <label>申请额度：</label>
                <span>{{detailData.applicationSum}}&nbsp;元</span>
              </i-col>
              <i-col span="16" style="text-align: left">
                <label>批复额度：<i-input class="credit-line" :value.sync="msg" style="width: 150px;margin-right: 5px;" v-model="msg"></i-input>元</label>
                <label v-if="msg===''" id="msg-alert" style="margin-left: 5px;color: #f2565c;display: none;">请填写您批复的额度！</label>
                <!--<label v-if="Opinion<=detailData.creditAvailable" id="differ-alert" style="float: left;color: #f2565c;display: none;">批复额度超过剩余额度，请重新填写！</label>-->
              </i-col>
            </Row>
            <Row style="margin-top: 10px">
              <i-col span="2" style="text-align: left">
                <label>建议：</label>
              </i-col>
              <i-col span="15">
                <i-input v-model = 'Opinion' type="textarea" :autosize="{minRows: 2,maxRows: 5}"  placeholder="请输入您的建议"></i-input>
                <label v-if="Opinion===''" id="opinion-alert" style="float: left;color: #f2565c;display: none;">{{suggestion}}</label>
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
              <p>您给{{detailData.applicant}}的用信金额为:<span style="color: #ed1c24;">{{msg}}</span>元，</p>
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
  name: 'useCreditManagement',
  data () {
    return {
      self: this,
      showModal: false,
      modalConfirm: false,
      detailData: {},
      msg: '',
      searchName: '',
      Opinion: '',
      suggestion: '',
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
                    let dataId = this.detailData.id
                    this.msg = ''
                    this.Opinion = ''
                    this.request('get', 'http://localhost:8088/credit/get/' + dataId)
                      .then((data) => {
                        // this.Opinion = data.agencyOpinion
                        this.detailData['creditAvailable'] = data.creditAvailable
                        this.showModal = true
                      }).catch((response) => {
                        this.$Modal.warning({
                          title: 'response',
                          content: '数据请求超时'
                        })
                      })
                  }
                }
              }, '用信经办')
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
          let creditId = document.getElementById('creditId').innerHTML
          let data = {}
          data['credit'] = {'id': creditId}
          data['approvalResult'] = '1'
          data['approvalType'] = '0'
          data['approvalAmount'] = this.msg
          if (this.Opinion !== '') {
            data['approvalOpinion'] = this.Opinion
          }
          this.request('post', 'http://localhost:8088/creditApproval/add', data).then((response) => {
            this.$Message.info('用信经办完成')
            this.showModal = false
            this.modalConfirm = false
            this.msg = ''
            this.Opinion = ''
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
          this.modalConfirm = false
          document.getElementById('msg-alert').style.display = 'none'
          document.getElementById('opinion-alert').style.display = 'none'
          break
      }
    },
    choose (type) {
      switch (type) {
        case 'submit':
          if (this.msg === '') {
            document.getElementById('msg-alert').style.display = 'inline-block'
            return
          }
          /* if(this.msg>this.detailData.creditAvailable){
            document.getElementById('differ-alert').style.display = 'inline-block'
            return
          } */
          if ((this.msg !== '') && (this.msg !== this.detailData.applicationSum) && (this.Opinion === '')) {
            this.suggestion = '您的批复额度与申请额度不一致，请填写您的意见。'
            document.getElementById('opinion-alert').style.display = 'inline-block'
            return
          }
          this.modalConfirm = true
          break
        case 'refuse':
          if (this.Opinion === '') {
            this.suggestion = '请填入您的拒绝的原因。'
            document.getElementById('opinion-alert').style.display = 'inline-block'
            return
          }
          let creditId = document.getElementById('creditId').innerHTML
          let data = {}
          data['credit'] = {'id': creditId}
          data['approvalResult'] = '0'
          data['approvalType'] = '5'
          data['approvalOpinion'] = this.Opinion
          this.request('post', 'http://localhost:8088/creditApproval/add', data)
            .then((response) => {
              this.showModal = false
              this.msg = ''
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
          this.msg = ''
          this.Opinion = ''
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
      this.data0 = data['content']
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
      obj['applicationStatus'] = '5'
      this.sendRequest(index, obj)
    },
    search () { /* 按姓名查询 */
      if (this.searchName === '') {
        let obj = {}
        obj['applicationStatus'] = '5'
        this.sendRequest(0, obj)
      } else {
        let obj = {}
        obj['application'] = {'applicant': this.searchName}
        obj['applicationStatus'] = '5'
        this.sendRequest(0, obj)
      }
    }
  },
  mounted () {
    let obj = {}
    obj['applicationStatus'] = '5'
    this.sendRequest(0, obj)
  }
}
</script>

<style scoped>
.interval{
  padding-bottom: 10px;
}
</style>
