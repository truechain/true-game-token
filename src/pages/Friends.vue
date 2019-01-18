<template>
  <div>
    <div class="my-code card">
      <p>我的邀请码</p>
      <span class="code">{{address.substr(2, 8).toUpperCase()}}</span>
    </div>
    <div class="inviter" v-if="inviter">
      <span>我的邀请人:</span>
      <span>{{inviter.substr(0, 10)}}...{{inviter.substr(34, 8)}}</span>
    </div>
    <div class="friends card">
      <p class="title">
        <span>邀请好友</span>
        <span>累计邀请{{count}}人</span>
      </p>
      <div v-if="friends.length">
        <ul>
          <li v-for="(item, index) in friends" :key="index">
            <span>{{item.friend.substr(0, 10)}}...{{item.friend.substr(34, 8)}}</span>
            <span>{{item.time.toLocaleDateString() + ' ' + item.time.toTimeString().substr(0, 5)}}</span>
          </li>
        </ul>
        <div>最多仅显示最近10位邀请好友</div>
      </div>
    </div>
    <div class="notice">
      <p class="title">
        <span>邀请细则</span>
      </p>
      <p>邀请好友可获得好友在游戏中消费的15%作为佣金，在每期游戏公布后由智能合约自动发放。</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Friends',
  data () {
    return {
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
    this.update()
  },
  methods: {
    ...mapActions({
      getFriends: 'getFriends',
      getInviter: 'getInviter'
    }),
    update () {
      this.getFriends().then(res => {
        this.count = res.count
        this.friends = res.records
      })
      this.getInviter().then(res => {
        this.inviter = res
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-code
  text-align center
  margin 16px 16px 14px
  padding 14px
  p
    font-size 14px
    padding 14px
  .code
    display block
    font-size 36px
    line-height 50px
    margin 10px 0
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
.friends
  margin 14px 16px
  padding 14px
  font-size 14px
  .title
    span:first-child
      font-weight 500
    span:last-child
      float right
  ul
    padding 6px 14px
    margin 10px 0
    border-radius 10px
    background-color #3e7be4
    box-shadow 0 2px 4px #3972da inset
  li
    display flex
    line-height 40px
    span:first-child
      flex 1 1 auto
      overflow hidden
      text-overflow ellipsis
    span:last-child
      flex 0 0 130px
      text-align right
.notice
  font-size 14px
  line-height 20px
  margin 40px 16px
  padding 0 15px
  .title
    font-weight 500
</style>
