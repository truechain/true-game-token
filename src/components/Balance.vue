<template>
  <div class="tt-balance">
    <p>{{$t('C.currentBalance')}}</p>
    <span>
      <span class="number">{{balance}}</span> TGB
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Balance',
  computed: {
    ...mapState({
      balance: state => state.TGB
    })
  }
}
</script>

<style lang="stylus" scoped>
.tt-balance
  height 70px
  display flex
  flex-direction column
  background-color #0063a5
  justify-content center
  text-align center
  color #fff
  p
    font-size 12px
    line-height 20px
  span
    font-size 28px
    line-height 36px
    font-weight 500
  .number
    letter-spacing: .06em
</style>
