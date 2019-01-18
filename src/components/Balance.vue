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
  border-radius 10px
  justify-content center
  text-align center
  background-color #3e7be4
  box-shadow 0 2px 4px #3972da inset
  p
    font-size 12px
    line-height 20px
  color #cfe1ff
  span
    font-size 24px
    line-height 34px
    font-weight 500
    color #fff
  .number
    letter-spacing: .06em
</style>
