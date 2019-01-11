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
      <div class="ex-confirm">
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
import { mapState } from 'vuex'

import iconExchange from '@/assets/exchange.svg.vue'

export default {
  name: 'Exchange',
  data () {
    return {
      exchangeIn: true,
      inputValue: ''
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
.notice
  font-size 14px
  line-height 20px
  margin 40px 16px
  padding 0 20px
</style>
