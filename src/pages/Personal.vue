<template>
  <div class="tt-personal">
    <div class="tg-intro card">
      <div class="tg-info">
        <span>{{address.substr(0, 10)}}...{{address.substr(34, 8)}}</span>
        <span><span class="balance">{{trueBalance}}</span> TRUE</span>
      </div>
      <div class="tg-balance">
        <p class="title">我的游戏币</p>
        <span>{{TGBBalance}} TGB</span>
        <div class="details">
          <div>
            <p class="title">累计中奖奖励</p>
            <span>{{TGBAward}} TGB</span>
          </div>
          <span class="border"></span>
          <div>
            <p class="title">好友邀请收益</p>
            <span>{{TGBReward}} TGB</span>
          </div>
        </div>
      </div>
    </div>
    <div class="details-nav">
      <div :class="{ 'focus': focusMenu === 0 }" @click="toggleMenu(0)">支出明细</div>
      <div :class="{ 'focus': focusMenu === 1 }" @click="toggleMenu(1)">收入明细</div>
    </div>
    <ul v-if="focusMenu === 0" class="details-list">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">买入[{{$tc('Game.number', item.index + 1)}}] <span>-{{item.value}} TGB</span></p>
        <p>号码: [{{item.startNumber}} - {{item.endNumber}}]</p>
        <p>{{item.time.toLocaleString()}}</p>
      </li>
    </ul>
    <ul v-if="focusMenu === 1" class="details-list">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">
          {{ item.number ? '中奖' : '邀请奖励' }}
          [{{$tc('Game.number', item.index + 1)}}]
          <span>+{{item.value}} TGB</span>
        </p>
        <p v-if="item.number">中奖号码: {{item.number}}</p>
        <p>{{item.time.toLocaleString()}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Personal',
  data () {
    return {
      focusMenu: 0,
      records: []
    }
  },
  computed: {
    ...mapState({
      address: state => state.address,
      trueBalance: state => state.TT,
      TGBBalance: state => state.TGB,
      TGBAward: state => state.TGBAward,
      TGBReward: state => state.TGBReward
    })
  },
  watch: {
    address () {
      this.updateRecords()
    }
  },
  mounted () {
    this.updateRecords()
  },
  methods: {
    ...mapActions({
      getBetRecords: 'getBetRecords',
      getIncomeRecords: 'getIncomeRecords'
    }),
    toggleMenu (index) {
      this.focusMenu = index
      this.updateRecords()
    },
    updateRecords () {
      if (this.focusMenu === 0) {
        this.getBetRecords().then(records => {
          this.records = records
        })
      } else {
        this.getIncomeRecords().then(records => {
          this.records = records
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.tt-personal
  margin-bottom 100px
.tg-intro
  margin 16px
  padding 14px
.tg-info
  margin-bottom 20px
  font-size 12px
  display flex
  justify-content space-between
  span
    display flex
    white-space nowrap
    line-height 20px
  .balance
    margin-right .4em
    font-size 14px
    font-weight 500
  >span:first-child
    text-overflow ellipsis
    overflow hidden
    background-color #2962C4
    border-radius 10px
    padding 0 1em
.tg-balance
  padding 14px
  border-radius 10px
  background-color #3e7be4
  box-shadow 0 2px 4px #3972da inset
  text-align center
  .border
    background-color #fff
  p
    font-size 14px
    line-height 20px
  span
    padding-top 4px
    display block
    font-size 24px
    line-height 30px
    font-weight 500
    color #fff
  .details
    display grid
    margin-top 28px
    grid-template-columns 1fr 1px 1fr
    grid-gap 14px
    >div
      flex 1 1 50%
    span
      font-size 20px
      line-height 24px
.details-nav
  margin 14px 16px 0
  border-radius 15px 15px 0 0
  display grid
  line-height 40px
  grid-template-columns 1fr 1fr
  text-align center
  overflow hidden
  >div
    background-color #cfe1ff
    color #3e7be4
    transition background-color .4s, color .4s
  .focus
    color #fff
    background-color #3e7be4 !important
.details-list
  margin 0 16px
  padding 7px
  display flex
  flex-direction column
  background-color #fff
  border-radius 0 0 15px 15px
  li
    margin 7px
    padding 10px 14px
    border solid 1px #cfe1ff
    color #666
    border-radius 10px
    font-size 14px
  .title
    font-weight 500
    line-height 28px
    font-size 16px
    span
      float right
      font-size 20px
  p
    line-height 24px
</style>
