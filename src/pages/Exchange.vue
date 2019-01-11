<template>
  <div>
    <div class="intro">
      <p>
        <span>钱包地址:</span>
        <span>{{address}}</span>
      </p>
      <p>
        <span>代币余额:</span>
        <span>{{trueBalance}} TRUE</span>
      </p>
      <p>
        <span>游戏币:</span>
        <span>{{TGBBalance}} TGB</span>
      </p>
    </div>
    <div class="details">
      <router-link to="/details">充提明细</router-link>
    </div>
    <div class="exchange">
      <div class="ex-dire">
        <div class="ex-type" :class="{
          'ex-in': exchangeIn,
          'ex-out': !exchangeIn
        }">
          <p>资产代币</p>
          <span>TRUE</span>
        </div>
        <div class="ex-button" @click="toggle">
            <span>兑换比例 1:1</span>
            <icon-exchange />
        </div>
        <div class="ex-type" :class="{
          'ex-in': !exchangeIn,
          'ex-out': exchangeIn
        }">
          <p>游戏币</p>
          <span>TGB</span>
        </div>
      </div>
      <input class="ex-input" type="number" v-model="inputValue" @change="checkInput" placeholder="请输入兑换数量">
      <div class="ex-notice">
        矿工费用: <span v-if="exchangeIn">&lt;0.001 ETH</span><span v-else>极低</span>
      </div>
      <div class="ex-confirm" :class="{
        'pending': (exInLock && exchangeIn) || (exOutLock && !exchangeIn)
      }" @click="exchange">
        <span v-if="exchangeIn">TRUE 兑入 TGB</span>
        <span v-else>TGB 兑出 TRUE</span>
      </div>
    </div>
    <div class="notice">
      <p>可用通过TRUE兑入为TGB，也可以反过来将TGB兑出为TRUE，兑换过程会产生ETH网络的矿工费，游戏平台不收取任何费用。</p>
      <p>其中ETH网络中的到账都可能需要较长等待以确认，充提时请耐心等候。</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import iconExchange from '@/assets/exchange.svg.vue'

function asyncAlert (message) {
  setTimeout(() => {
    alert(message)
  }, 0)
}

export default {
  name: 'Exchange',
  data () {
    return {
      exchangeIn: true,
      inputValue: '',
      exInLock: false,
      exOutLock: false
    }
  },
  computed: {
    ...mapState({
      address: state => state.address,
      trueBalance: state => state.TT,
      TGBBalance: state => state.TGB
    })
  },
  methods: {
    ...mapActions({
      queryExchangeIn: 'exchangeIn',
      queryExchangeOut: 'exchangeOut'
    }),
    toggle () {
      this.exchangeIn = !this.exchangeIn
      this.inputValue = ''
    },
    checkInput () {
      let input = this.inputValue
      if (!input || /[^\d.]/.test(input)) {
        input = '0'
      } else {
        const match = input.match(/(^[\d]+)(\.[\d]*)?$/)
        input = match[1] + (match[2] ? match[2].substr(0, 19) : '')
      }
      this.inputValue = input
    },
    exchange () {
      if (this.exchangeIn) {
        this.doExchangeIn()
      } else {
        this.doExchangeOut()
      }
    },
    doExchangeIn () {
      if (this.exInLock) {
        return
      }
      this.exInLock = true
      this.queryExchangeIn(this.inputValue).then(res => {
        this.exInLock = false
        if (res.error) {
          switch (res.code) {
            case 1:
              return asyncAlert('兑换失败，兑换服务未开启')
            case 2:
              return asyncAlert('兑换失败，未能成功签名交易')
            case 3:
              return asyncAlert('兑换失败，未能连接到钱包应用')
            case 4:
              return asyncAlert('兑换失败，ETH网络转账交易不成功')
            case 5:
              return asyncAlert('兑换失败，兑换服务拒绝了本次请求。如有疑问请联系管理员。')
            case 6:
              return asyncAlert('兑换失败，无法连接到兑换服务。您的TRUE转账可能已经成功，如果约20分钟后没有在记录中看到对应的TGB充值记录，请及时联系管理员。')
            default:
              return asyncAlert('兑换失败，未知错误')
          }
        } else {
          asyncAlert('兑换成功，等待TRUE确认到账后会自动为您发放TGB。如果约20分钟后没有在记录中看到对应的TGB充值记录，请及时联系管理员。')
        }
      })
    },
    doExchangeOut () {
      if (this.exOutLock) {
        return
      }
      this.exOutLock = true
      this.queryExchangeOut(this.inputValue).then(res => {
        asyncAlert('兑换成功，等量的TRUE将会自动返还到你的钱包中')
      }).catch(() => {
        asyncAlert('兑换成功，请确定已成功通过钱包签名交易，并检查网络链接')
      }).then(() => {
        this.exOutLock = false
      })
    }
  },
  components: {
    iconExchange
  }
}
</script>

<style lang="stylus" scoped>
.intro
  font-size 14px
  margin 14px 16px
  padding 10px 14px
  border solid 1px #bbb
  border-radius 10px
  p
    white-space nowrap
    display flex
    line-height 20px
    margin-bottom 6px
    &:last-child
      margin-bottom 0
    span
      text-overflow ellipsis
      overflow hidden
    span:first-child
      flex 0 0 70px
.details
  margin 14px 16px
  font-size 14px
  text-align right
.exchange
  margin 14px 16px
  padding 14px
  border solid 1px #bbb
  border-radius 10px
  font-size 14px
  line-height 18px
.ex-dire
  height 70px
  padding 10px 0
  position relative
  box-sizing border-box
  .ex-type
    text-align center
    position absolute
    width 60px
    top 14px
    transition left .6s
    span
      font-size 24px
      line-height 30px
  .ex-in
    left 20px
  .ex-out
    left calc(100% - 80px)
  .ex-button
    height 48px
    width 100px
    border-radius 6px
    border solid 1px #bbb
    margin auto
    font-size 12px
    line-height 20px
    display flex
    flex-direction column
    justify-content center
    text-align center
    background-color #fff
    position relative
    z-index 9
    svg
      margin 0 auto
.ex-input
  margin 14px 0
  display block
  border solid 1px #bbb
  width 100%
  line-height 34px
  border-radius 6px
  padding 0 .8em
  box-sizing border-box
.ex-notice
  line-height 30px
.ex-confirm
  margin-top 14px
  background-color #0071bc
  color #fff
  line-height 36px
  text-align center
  border-radius 18px
.pending
  background-color #999
.notice
  font-size 14px
  line-height 20px
  margin 40px 16px
  padding 0 20px
</style>
