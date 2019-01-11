<template>
  <div>
    <div class="my-code">
      <p>我的邀请码</p>
      <span class="code" v-if="hasICode">{{address.substr(2, 6).toUpperCase()}}</span>
      <span v-else class="gen" :class="{
        'pending': pending
      }" @click="toCreateCode">生成邀请码</span>
    </div>
    <div class="friends">
      <p class="title">
        <span>邀请好友</span>
        <span>累计邀请{{count}}人</span>
      </p>
      <ul>
        <li v-for="(item, index) in friends" :key="index">
          <span>{{item.friend.substr(0, 10)}}...{{item.friend.substr(34, 8)}}</span>
          <span>{{item.time.toLocaleDateString() + ' ' + item.time.toTimeString().substr(0, 5)}}</span>
        </li>
      </ul>
    </div>
    <div class="friends">
      <p class="title">
        <span>邀请细则</span>
        <span></span>
      </p>
      <p>邀请好友可获得好友在游戏中消费的15%作为佣金，在每期游戏公布后由智能合约自动发放。</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

function asyncAlert (message) {
  setTimeout(() => {
    alert(message)
  }, 0)
}

export default {
  name: 'Friends',
  data () {
    return {
      hasICode: true,
      pending: false,
      count: 0,
      friends: []
    }
  },
  computed: {
    ...mapState({
      address: state => state.address
    })
  },
  watch: {
    address () {
      this.update()
    }
  },
  mounted () {
    this.update()
  },
  methods: {
    ...mapActions({
      getFriends: 'getFriends',
      genICode: 'genICode',
      checkInvitationCode: 'checkInvitationCode'
    }),
    update () {
      this.checkInvitationCode().then(res => {
        this.hasICode = res
      })
      this.getFriends().then(res => {
        this.count = res.count
        this.friends = res.records
      })
    },
    toCreateCode () {
      if (this.pending) {
        return
      }
      this.pending = true
      this.genICode().then(() => {
        asyncAlert('生成成功')
        this.update()
      }).catch((err) => {
        console.error(err)
        asyncAlert('生成失败，请确定已成功通过钱包签名交易，并检查网络链接')
      }).then(() => {
        this.pending = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-code
  text-align center
  margin 14px 16px
  p
    font-size 14px
  .code
    display block
    font-size 36px
    line-height 50px
    margin 10px 0 20px
  .gen
    display block
    line-height 36px
    margin 17px auto 27px
    background-color #0071bc
    color #fff
    width 120px
    border-radius 18px
  .pending
    background-color #999
.friends
  margin 14px 16px
  border solid 1px #bbb
  border-radius 10px
  padding 14px
  font-size 14px
  .title
    margin-bottom 6px
    span:first-child
      font-weight 500
    span:last-child
      float right
  li
    display flex
    line-height 20px
    margin-top 10px
    span:first-child
      flex 1 1 auto
      overflow hidden
      text-overflow ellipsis
    span:last-child
      flex 0 0 130px
      text-align right
</style>
