<template>
  <div>
    <Row class="padding-5-percent" style="padding-bottom:10px ;">
      <i-col style="float: right;">
        <i-input v-model="searchName" placeholder="请输入申请人的姓名" style="width: 200px"></i-input>
        <i-button type="primary" style='margin-left: 10px;' @click="search()">查询</i-button>
      </i-col>
    </Row>
    <Row class="padding-5-percent" style="padding-bottom:10px;">
      <i-col>
        <i-table border :content="self" :columns="columns0" :data="data0"></i-table>
        <Modal v-model="showModal" width="600" :mask-closable="false" class-name="vertical-center-modal">
          <p slot="header" style="color:#000;text-align:center">
            <span>用户申请流程查看</span>
          </p>
          <Row>
            <i-col offset="3">
              <Steps :current="currentStatus">
                <Step :title="status1" content="经办"></Step>
                <Step :title="status2" content="初审"></Step>
                <Step :title="status3" content="终审"></Step>
              </Steps>
            </i-col>
          </Row>
          <div slot="footer">
            <Row style="text-align: center;margin-top: 10px;">
              <Button @click="choose('submit')" type="primary" size="large">确认</Button>
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
  name: 'useProcessView',
  data () {
    return {
      self: this,
      showModal: false,
      detailData: {},
      currentStatus: 1,
      status1: '',
      status2: '',
      status3: '',
      searchName: '',
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
                    this.request('get', 'http://localhost:8088/credit/get/' + dataId)
                      .then((data) => {
                        let currentStatus = data.credit.applicationStatus
                        switch (currentStatus) {
                          case 'AGENCY':
                            this.showModal = true
                            this.currentStatus = 1
                            this.status1 = '已完成'
                            this.status2 = '进行中'
                            this.status3 = '待进行'
                            break
                          case 'FIRST_CHECK':
                            this.showModal = true
                            this.currentStatus = 2
                            this.status1 = '已完成'
                            this.status2 = '已完成'
                            this.status3 = '进行中'
                            break
                          case 'FINAL_CHECK':
                            this.$Modal.warning({
                              title: '该用户的审核流程已完成！'
                            })
                            break
                          case 'REJECT':
                            this.$Modal.warning({
                              title: '改用户申请已被拒绝！'
                            })
                            break
                          case 'COMMIT':
                            this.showModal = true
                            this.currentStatus = 0
                            this.status1 = '进行中'
                            this.status2 = '待进行'
                            this.status3 = '待进行'
                            break
                          case 'OVERDUE':
                            this.$Modal.warning({
                              title: '该用户申请已过期！'
                            })
                            break
                        }
                      }).catch((response) => {
                        this.$Modal.warning({
                          title: 'response',
                          content: '数据请求超时'
                        })
                      })
                  }
                }
              }, '流程查看')
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
    dealData (data) { /* 统一处理数据 */
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
    choose (type) {
      switch (type) {
        case 'submit':
          this.showModal = false
          break
      }
    },
    changePage (index) {
      --index
      this.sendRequest(index, null)
    },
    search () { /* 按姓名查询 */
      if (this.searchName === '') {
        this.sendRequest(0, null)
      } else {
        let obj = {}
        obj['application'] = {'applicant': this.searchName}
        this.sendRequest(0, obj)
      }
    }
  },
  mounted () {
    this.sendRequest(0, null)
  }

}
</script>

<style scoped>

</style>
