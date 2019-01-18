<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <transition name="fly-up">
      <div v-if="$route.path !== '/'" class="return">
        <router-link to="/">返回首页</router-link>
      </div>
    </transition>
    <div v-if="pause" class="waiting">
      等待从钱包获取账户信息...
    </div>
    <div v-if="!hasICode" class="icode">
      <div>
        <input type="text" v-model="inputCode" placeholder="邀请码（不填默认为平台00000000）">
        <span @click="toSetInviter" :class="{ 'pending': pending }">确认</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import swal from 'sweetalert'

export default {
  name: 'App',
  data () {
    return {
      sitv: 0,
      hasICode: true,
      inputCode: '',
      pending: false,
      pause: true
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.init({ data: 'onload' })
    } else {
      document.addEventListener('message', this.init)
    }
    this.sitv = setInterval(() => {
      this.updateTGBBalance()
      this.updateTTBalance()
    }, 4000)
  },
  methods: {
    ...mapActions({
      queryAccount: 'queryAccount',
      updateTGBBalance: 'updateTGBBalance',
      updateTTBalance: 'updateTTBalance',
      checkInvitationCode: 'checkInvitationCode',
      setInviter: 'setInviter'
    }),
    init (e) {
      if (e.data === 'onload') {
        this.queryAccount().then(address => {
          console.log(`--- loaded account: ${address}`)
          return this.checkInvitationCode()
        }).then(hasICode => {
          this.hasICode = hasICode
          this.pause = false
        }).catch(() => {
          swal('提示', '未能获取账户信息，请先在钱包中导入账户后打开', 'warning')
        })
        document.removeEventListener('message', this.init)
      }
    },
    toSetInviter () {
      if (this.inputCode && !/^[\da-fA-F]{8}$/.test(this.inputCode)) {
        swal('错误', '邀请码格式错误', 'warning')
        return
      }
      if (this.pending) {
        return
      }
      this.pending = true
      this.setInviter(this.inputCode).then(res => {
        this.pending = false
        if (res.error) {
          switch (res.code) {
            case 1:
              return swal('邀请码设置失败', '邀请码不存在', 'warning')
            case 2:
              return swal('邀请码设置失败', '可能是网络原因导致的，请稍后重试', 'error')
            case 3:
              return swal('邀请码设置失败', '可能是网络原因导致的，请稍后重试或联系管理员', 'error')
            default:
              return swal('邀请码设置失败', '未知错误', 'error')
          }
        } else {
          swal('邀请码设置成功', '', 'success')
          this.hasICode = true
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.sitv)
  }
}
</script>

<style lang="stylus" scoped>
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif, 'PingFang SC', 'Microsoft YaHei'
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  margin-bottom 20px
  background-color #6194ed
  display flex
  flex-direction column
.return
  position fixed
  bottom 0
  left 0
  width 100%
  border-top solid 6px #6194ed
  a
    display block
    width 100%
    height 50px
    line-height 50px
    text-align center
    background-color #2861c4
    color #fff
.waiting
  text-align center
  padding 28px 14px
  font-size 14px
  color #888

.icode
  position fixed
  top 0
  left 0
  z-index 10
  width 100%
  height 100%
  background-color #0005
  display flex
  >div
    justify-content center
    margin auto
    background-color #fff
    padding 30px 16px
    border-radius 10px
    display flex
    flex-direction column
  input
    font-size 14px
    width 220px
    border solid 1px #bbb
    padding 0 .8em
    line-height 30px
    line-height 36px
    border-radius 6px
  span
    background-color #0071bc
    color #fff
    margin 14px auto 0
    line-height 36px
    border-radius 6px
    width 120px
    text-align center
  .pending
    background-color #999

.fly-up-leave-active, .fly-up-enter-active
  transition transform .4s
.fly-up-leave-to, .fly-up-enter
  transform translateY(100%)
</style>
