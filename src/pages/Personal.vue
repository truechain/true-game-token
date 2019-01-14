<template>
  <div class="tt-personal">
    <div class="balance">
      <span>{{address.substr(0, 10)}}...{{address.substr(34, 8)}}</span>
      <span>{{trueBalance}} TRUE</span>
    </div>
    <div class="tg-balance">
      <p class="title">游戏币</p>
      <span>{{TGBBalance}} TGB</span>
      <div class="details">
        <div>
          <p class="title">累计中奖奖励</p>
          <span>{{TGBAward}} TGB</span>
        </div>
        <div>
          <p class="title">好友邀请收益</p>
          <span>{{TGBReward}} TGB</span>
        </div>
      </div>
    </div>
    <div class="details-nav">
      <div :class="{ 'focus': focusMenu === 0 }" @click="toggleMenu(0)">支出明细</div>
      <div :class="{ 'focus': focusMenu === 1 }" @click="toggleMenu(1)">收入明细</div>
    </div>
    <ul v-if="focusMenu === 0" class="details">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">买入[{{$tc('Game.number', item.index + 1)}}] <span>-{{item.value}} TGB</span></p>
        <p>时间: {{item.time.toLocaleString()}}</p>
        <p>号码: [{{item.startNumber}} - {{item.endNumber}}]</p>
      </li>
    </ul>
    <ul v-if="focusMenu === 1" class="details">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">
          {{ item.number ? '中奖' : '邀请奖励' }}
          [{{$tc('Game.number', item.index + 1)}}]
          <span>+{{item.value}} TGB</span>
        </p>
        <p>时间: {{item.time.toLocaleString()}}</p>
        <p v-if="item.number">中奖号码: {{item.number}}</p>
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
      this.records = []
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
.balance
  margin 14px 16px
  font-size 12px
  display flex
  justify-content space-between
  span
    white-space nowrap
  span:first-child
    text-overflow ellipsis
    overflow hidden
.tg-balance
  margin 0 16px
  padding 14px 14px 10px
  border solid 1px #bbb
  border-radius 10px
  p
    font-size 14px
    color #888
    line-height 20px
  span
    font-size 30px
    line-height 30px
  .details
    display grid
    margin-top 14px
    grid-template-columns 1fr 1fr
    grid-gap 28px
    >div
      flex 1 1 50%
    span
      font-size 24px
      line-height 24px
.details-nav
  margin 14px 16px
  border solid 1px #bbb
  border-radius 10px
  display grid
  line-height 40px
  grid-template-columns 1fr 1fr
  grid-gap 1px
  text-align center
  background-color #bbb
  overflow hidden
  >div
    background-color #fff
    transition background-color .4s
  .focus
    background-color #eee !important
.details li
  margin 14px
  padding 10px 14px
  border solid 1px #bbb
  border-radius 10px
  font-size 14px
  .title
    font-weight 500
    line-height 28px
    font-size 16px
    span
      float right
      font-size 20px
</style>
