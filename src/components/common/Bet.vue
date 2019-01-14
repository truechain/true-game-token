<template>
  <div>
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
      // getBetRecords: 'getBetRecords',
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
      // this.getBetRecords().then(res => {
      //   if (res.length === 0) {
      //     return swal('提示', '第一次游玩前需要先使用TGB授权', 'warning').then(() => {
      //       return this.approve()
      //     })
      //   }
      // }).catch((err) => {
      //   console.error(err)
      //   swal('授权失败', '请确定已成功通过钱包签名交易，并检查网络链接', 'error')
      //   return { error: true }
      // }).then(result => {
      //   if (result && result.error) {
      //     return
      //   }
      //   return this.betOnChain(this.count)
      //     .then(() => {
      //       console.log('--- bet successful')
      //       this.updateTGBBalance()
      //       this.$emit('update')
      //       swal('购买成功', `已购买${this.count}份号码`, 'success')
      //     }).catch(err => {
      //       console.error(err)
      //       swal('购买失败', '请确定已成功通过钱包签名交易，并检查网络链接', 'error')
      //     })
      // }).then(() => {
      //   this.pending = false
      // })
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
.form
  display flex
  margin-bottom 10px
  line-height 28px
  text-align center
  font-size 14px
  .price
    flex 1 0 80px
    border solid 1px #bbb
    padding 4px
    line-height 20px
  .x
    flex 0 0 auto
    line-height 30px
    font-weight 500
    margin 0 10px
  input
    flex 4 1 auto
    width 60px
    border solid 1px #bbb
    padding 0 .8em
    text-align start
  .unit
    flex 0 0 30px
    line-height 30px
.buy
  background-color #0071bc
  color #fff
  line-height 36px
  text-align center
  border-radius 18px
.pending
  background-color #999
</style>
