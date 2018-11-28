<template>
  <div>
    <Row class="padding-5-percent">
      <Col>
        <Card>
          <div class="edittable-table-height-con">
            <can-edit-table refs="table1" v-model="tableData" :columns-list="columns" ></can-edit-table>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import CanEditTable from '../../tables/components/canEditTable'

export default {
  name: 'oil-enterprise-allocation',
  components: {CanEditTable},
  data () {
    return {
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '用户名称',
          key: 'CustomerName',
          width: 100,
          align: 'center'
        },
        {
          title: '分配时间',
          align: 'center',
          key: 'HappenDate'
        },
        {
          title: '油卡卡号',
          align: 'center',
          key: 'CardCode'
        },
        {
          title: '分配金额',
          align: 'center',
          key: 'Amount'
        }
        // {
        //   title: '操作',
        //   align: 'center',
        //   width: 180,
        //   key: 'handle',
        //   render: (h, params) => {
        //     return h('div', [
        //       h('Button', {
        //         props: {
        //           type: 'primary'
        //         },
        //         style: {
        //           marginRight: '5px'
        //         },
        //         on: {
        //           click: () => {
        //             this.handleUpdate(params.row)
        //           }
        //         }
        //       }, '编辑'),
        //       h('Poptip', {
        //         props: {
        //           confirm: true,
        //           title: '您确定要删除这条数据吗?',
        //           transfer: true
        //         },
        //         on: {
        //           'on-ok': () => {
        //             this.handleDelete(params.row)
        //           }
        //         }
        //       }, [
        //         h('Button', {
        //           style: {
        //             margin: '0 5px'
        //           },
        //           props: {
        //             type: 'error',
        //             placement: 'top'
        //           }
        //         }, '删除')
        //       ])
        //     ])
        //   }
        // }
      ],
      tableData: [],
      thisTableData: []
    }
  },
  methods: {
    getData () {
      this.request('http://localhost:18082/oil/GetPartnerCompanySplit')
        .then((data) => {
          if (data.status === 200) {
            let reStr = data.obj
            let len = reStr.indexOf(']')
            let resultStr = reStr.substring(0, len + 2)
            this.tableData = JSON.parse(resultStr).Data
          } else {
            this.$Message.success(data.msg)
          }
        }).catch((response) => {
          this.$Modal.warning({
            title: 'response',
            content: '数据请求超时'
          })
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
