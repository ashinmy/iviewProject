<template>
  <!--<Table :data="data9" :columns="columns" @on-expand="GetPartnerCompanyCardList"></Table>-->
  <div></div>
</template>
<script>
// import expandRow from './table-expand.vue'
export default {
  name: 'person-flow',
  components: { expandRow },
  data () {
    return {
      columns: [
        // {
        //   type: 'expand',
        //   width: 50,
        //   render: (h, index) => {
        //     return h(expandRow, {
        //       props: {
        //         row: this.thisTableData
        //       }
        //     })
        //   }
        // },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data9: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          job: 'Data engineer',
          interest: 'badminton',
          birthday: '1991-05-14',
          book: 'Steve Jobs',
          movie: 'The Prestige',
          music: 'I Cry'
        },
        {
          name: 'Jim Green',
          age: 25,
          address: 'London No. 1 Lake Park',
          job: 'Data Scientist',
          interest: 'volleyball',
          birthday: '1989-03-18',
          book: 'My Struggle',
          movie: 'Roman Holiday',
          music: 'My Heart Will Go On'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          job: 'Data Product Manager',
          interest: 'tennis',
          birthday: '1992-01-31',
          book: 'Win',
          movie: 'Jobs',
          music: 'Don’t Cry'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          job: 'Data Analyst',
          interest: 'snooker',
          birthday: '1988-7-25',
          book: 'A Dream in Red Mansions',
          movie: 'A Chinese Ghost Story',
          music: 'actor'
        }
      ],
      thisTableData: []
    }
  },
  methods: {
    GetPartnerCompanyCardList () {
      this.request('http://localhost:18082/oil/GetPartnerCompanyCardList', '07D511F8-0EB0-4F9F-A4CF-A6141C790EA4')
        .then((data) => {
          if (data.status === 200) {
            let reStr = data.obj
            let len = reStr.indexOf(']')
            let resultStr = reStr.substring(0, len + 1)
            this.thisTableData = JSON.parse(resultStr)
            console.log(this.thisTableData[1])
          } else {
            this.$Message.success(data.msg)
          }
        })
    }
  }
}
</script>
