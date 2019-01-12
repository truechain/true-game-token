<template>
  <div>
    <div class="my-code">
      <p>我的邀请码</p>
      <span class="code" v-if="hasICode">{{address.substr(2, 8).toUpperCase()}}</span>
      <span v-else class="gen" :class="{
        'pending': pending
      }" @click="toCreateCode">生成邀请码</span>
    </div>
    <div class="inviter" v-if="inviter">
      <span>我的邀请人:</span>
      <span>{{inviter.substr(0, 10)}}...{{inviter.substr(34, 8)}}</span>
    </div>
    <div class="inviter-set" v-else>
      <span>输入邀请码</span>
      <input type="text" v-model="inputCode">
      <div :class="{
        'pending': pending
      }" @click="toSetInviter">确认</div>
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
import swal from 'sweetalert'

export default {
  name: 'Friends',
  data () {
    return {
      hasICode: true,
      pending: false,
      inviter: '',
      inputCode: '',
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
    swal('购买成功', '已购买份号码', 'success')
    this.update()
  },
  methods: {
    ...mapActions({
      getFriends: 'getFriends',
      genICode: 'genICode',
      getInviter: 'getInviter',
      setInviter: 'setInviter',
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
      this.getInviter().then(res => {
        this.inviter = res
      })
    },
    toSetInviter () {
      if (!/^[\da-fA-F]{8}$/.test(this.inputCode)) {
        swal('错误', '邀请码格式错误', 'errpr')
        return
      }
      if (this.pending) {
        return
      }
      this.pending = true
      this.setInviter(this.inputCode).then(() => {
        swal('邀请码设置成功', '', 'success')
        this.update()
      }).catch((err) => {
        console.error(err)
        swal('邀请码设置失败', '请确定邀请码是自己以外的其他可用邀请码，请确定已成功通过钱包签名交易，并检查网络链接', 'error')
      }).then(() => {
        this.pending = false
      })
    },
    toCreateCode () {
      if (this.pending) {
        return
      }
      this.pending = true
      this.genICode().then(() => {
        swal('邀请码生成成功', '', 'success')
        this.update()
      }).catch((err) => {
        console.error(err)
        swal('邀请码生成失败', '请确定已成功通过钱包签名交易，并检查网络链接', 'error')
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
    padding 14px
  .code
    display block
    font-size 36px
    line-height 50px
    margin 10px 0 30px
  .gen
    display block
    line-height 36px
    margin 17px auto 37px
    background-color #0071bc
    color #fff
    width 120px
    border-radius 18px
  .pending
    background-color #999
.inviter
  font-size 14px
  margin 14px 16px
  padding 0 15px
  line-height 30px
  display flex
  justify-content space-between
.inviter-set
  font-size 14px
  margin 14px 16px
  padding 0 15px
  line-height 30px
  display flex
  span
    flex 0 0 80px
  input
    flex 1 1 60px
    border solid 1px #bbb
    line-height 28px
    padding 0 .8em
    min-width 60px
  div
    flex 0 0 60px
    text-align center
    background-color #0071bc
    color #fff
    margin-left 14px
    border-radius 15px
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
