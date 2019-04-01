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
        <div>第一次使用请填写邀请码</div>
        <input type="text" v-model="inputCode" placeholder="邀请码（不填默认为平台邀请）">
        <div class="confirm" :class="{ 'pending': pending }">
          <span @click="toSetInviter">确认</span>
        </div>
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
      if (/onload/.test(e.data)) {
        swal('提示', '因主网上线调整目前游戏功能在迁移中，请耐心等待', 'warning')
        this.queryAccount()
        // this.queryAccount().then(address => {
        //   console.log(`--- loaded account: ${address}`)
        //   return this.checkInvitationCode()
        // }).then(hasICode => {
        //   this.hasICode = hasICode
        //   this.pause = false
        // }).catch(() => {
        //   swal('提示', '未能获取账户信息，请先在钱包中导入账户后打开', 'warning')
        // })
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
    padding 14px
    border-radius 15px
    display flex
    flex-direction column
    color #5c8feb
  input
    margin 14px 0
    font-size 14px
    width 220px
    border none
    padding 0 .8em
    text-align start
    background-color #cfe1ff
    border-radius 5px
    line-height 36px
    color #3e7be4
  input:focus
    outline-color #6194ed
  .confirm
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

.fly-up-leave-active, .fly-up-enter-active
  transition transform .4s
.fly-up-leave-to, .fly-up-enter
  transform translateY(100%)
</style>
