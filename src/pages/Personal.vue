<template>
  <div>
    <div class="balance">{{address}} {{trueBalance}} TRUE</div>
    <div class="tg-balance">
      <p class="title">游戏币</p>
      <span>{{TGBBalance}} TGB</span>
      <div class="details">
        <div>
          <p class="title">累计中奖奖励</p>
          <span>{{TGBBalance}} TGB</span>
        </div>
        <div>
          <p class="title">好友邀请收益</p>
          <span>{{TGBBalance}} TGB</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Personal',
  computed: {
    ...mapState({
      address: state => state.address,
      trueBalance: state => state.TT,
      TGBBalance: state => state.TGB
    })
  }
}
</script>

<style lang="stylus" scoped>
.balance
  font-size 12px
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
</style>
