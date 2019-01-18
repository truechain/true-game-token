<template>
  <div class="tt-bet">
    <div class="form">
      <span class="price">1TGB / 份</span>
      <span class="x">x</span>
      <input type="number" v-model="count" @change="checkCount">
      <span class="unit">份</span>
    </div>
    <div class="buy" @click="bet" :class="{
      'pending': pending
    }">
      <span v-if="pending">请求处理中...</span>
      <span v-else>购 买</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import swal from 'sweetalert'

export default {
  name: 'Bet',
  data () {
    return {
      count: 1,
      pending: false
    }
  },
  methods: {
    ...mapActions({
      approve: 'approve',
      betOnChain: 'bet',
      updateTGBBalance: 'updateTGBBalance'
    }),
    checkCount () {
      const nCount = Number(this.count)
      this.count = Math.round(Math.max(1, Math.min(100, nCount)))
    },
    bet () {
      if (this.pending) {
        return
      }
      this.pending = true
      this.betOnChain(this.count)
        .then(() => {
          console.log('--- bet successful')
          this.updateTGBBalance()
          this.$emit('update')
          swal('购买成功', `已购买${this.count}份号码`, 'success')
        }).catch(err => {
          console.error(err)
          swal('购买失败', '请确定已成功通过钱包签名交易，并检查网络链接', 'error')
        }).then(() => {
          this.pending = false
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.tt-bet
  border-radius 10px
  background-color #fff
  padding 14px
.form
  display flex
  margin-bottom 14px
  line-height 28px
  text-align center
  font-size 14px
  color #5c8feb
  position relative
  .price
    flex 1 0 80px
    background-color #cfe1ff
    border-radius 5px
    line-height 32px
    padding 2px
  .x
    flex 0 0 auto
    line-height 36px
    font-weight 500
    margin 0 10px
    font-size 18px
  input
    flex 4 1 auto
    width 60px
    border none
    padding 0 2em 0 .8em
    text-align start
    background-color #cfe1ff
    border-radius 5px
    line-height 36px
    color #3e7be4
    font-size 18px
  input:focus
    outline-color #6194ed
  .unit
    position absolute
    line-height 36px
    top 0
    right .8em
.buy
  background-color #2861c4
  line-height 36px
  text-align center
  border-radius 18px
  span
    display block
    background-color #508BF1
    color #fff
    line-height 36px
    text-align center
    border-radius 18px
    transform translateY(-3px)
    transition transform .4s, background-color .4s
.pending span
  background-color #cfe1ff
  transform translateY(0)
</style>
