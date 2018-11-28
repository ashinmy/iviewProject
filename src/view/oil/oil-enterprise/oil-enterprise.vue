<template>
    <!--<div>-->
        <!--<form id="payForm" @submit.prevent="submit" :action=targetUrl method="post" target='_blank' ref="payOrderSubmitForm" :model="payOrderArr" :rule="payOrderArr" >-->
            <!--<input type="text" name="appVer" v-model="payOrderArr.appVer">-->
            <!--<input type="text" name="devType" v-model="payOrderArr.devType">-->
            <!--<input type="text" name="access_token" v-model="payOrderArr.access_token">-->
            <!--<input type="text" name="merchantID" v-model="payOrderArr.merchantID">-->
            <!--<input type="text" name="collecAccNum" v-model="payOrderArr.collecAccNum">-->
            <!--<input type="text" name="ordNum" v-model="payOrderArr.ordNum">-->
            <!--<input type="text" name="ordName" v-model="payOrderArr.ordName">-->
            <!--<input type="text" name="payMent" v-model="payOrderArr.payMent">-->
            <!--<input type="text" name="ordDate" v-model="payOrderArr.ordDate">-->
            <!--<input type="text" name="ordTime" v-model="payOrderArr.ordTime">-->
            <!--<input type="text" name="sign" v-model="payOrderArr.sign">-->
            <!--<input type="submit" value="提交">-->
            <!--<i-button size="large" @click="getPayParams">支付</i-button>-->
        <!--</form>-->
    <!--</div>-->

    <div>
        <p v-html="payOrderArr" v-model="payOrderArr"></p>
    </div>
</template>

<script>
export default {
  name: 'oil-enterprise',
  data () {
    return {
      targetUrl: 'http://58.22.61.222:8686/EpayBts/bts/icpay/icpayorder/payOrder.do',
      payOrderParams: {
        'appVer': 'V01',
        'devType': 'MB',
        'access_token': '423642453343433739360B988869256A20A4693908907E457FD8',
        'merchantID': '10000008',
        'collecAccNum': '100086',
        'ordNum': 'D1000000820180816125311',
        'ordName': '5oiR55qE5raI6LS55Y2V',
        'payMent': '95',
        'ordDate': '20180816',
        'ordTime': '125311',
        'sign': 'T2xOLzJxM2Q3Q09ZOGpnQ3ovNjNzdk5WMnFtOHNvLzBrQzNmbXV2TXNtTWorZmZYcFc5b05meDhYeitjM3IwaGZvNzZkUHRmVzdkTmpWWVZLTnVkVUd6b3JsUHlEQjJFcTRPTE5lZTgzb05CdWxaQWY2QksveDNBdk1lTnZ2a0VPeTBLVlNoRy8vejRtUEo4aThnL3RSYWgxeFhLVGhJRmdRb0VIbDhFWGFrPQ=='
      },
      payOrderArr: '',
      payOrderList: {
        'merchantID': '10000008',
        'rechargeOrderNumber': 'RechargeF66720180813025122499775863',
        'payMent': '95',
        'rechargeTemplateID': '12643040-39b3-4d81-9991-7041fd42c876',
        'orderType': '0'
      },
      payTest: {
        'merchantID': '10000008',
        'payMent': '95'
      }
    }
  },
  methods: {
    getPayParams () {
      this.request('http://localhost:38084/pay/payOrderPage', this.payTest).then((data) => {
        if (data.status === 200) {
          this.payOrderArr = data.obj
          console.log(this.payOrderArr)
        }
      })
    },
    submit () {
      var that = this
      // formDate.append('appVer', that.payOrderArr.appVer[0]);
      // console.log(formDate);
      // fileDate.append('devType', this.payOrderArr.devType);
      // fileDate.append('access_token', this.payOrderArr.access_token);
      // fileDate.append('merchantID', this.payOrderArr.merchantID);
      // fileDate.append('collecAccNum', this.payOrderArr.collecAccNum);
      // fileDate.append('ordNum', this.payOrderArr.ordNum);
      // fileDate.append('payMent', this.payOrderArr.payMent);
      // fileDate.append('ordDate', this.payOrderArr.ordDate);
      // fileDate.append('ordTime', this.payOrderArr.ordTime);
      // fileDate.append('sign', this.payOrderArr.sign);
      that.axios.post(that.targetUrl, that.$qs.stringify(that.payOrderParams), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
        }
      }).then(function (response) {
        if (response.status === 200) {
          this.payOrderArr = response.data
          console.log(response.data)
        }
      })
    }
  },
  created () {
    this.getPayParams()
  }
}
</script>

<style scoped>

</style>
