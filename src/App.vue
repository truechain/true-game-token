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
      updateTTBalance: 'updateTTBalance'
    }),
    init (e) {
      if (e.data === 'onload') {
        this.queryAccount().then(address => {
          console.log(`--- loaded account: ${address}`)
          this.pause = false
        }).catch(() => {
          swal('提示', '未能获取账户信息，请先在钱包中导入账户后打开', 'warning')
        })
        document.removeEventListener('message', this.init)
      }
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
  color #333
  margin-bottom 20px
.return
  position fixed
  bottom 0
  left 0
  width 100%
  border-top solid 4px #fff
  a
    display block
    width 100%
    height 40px
    line-height 40px
    text-align center
    background-color #0071bc
    color #fff
.waiting
  text-align center
  padding 28px 14px
  font-size 14px
  color #888

.fly-up-leave-active, .fly-up-enter-active
  transition transform .4s
.fly-up-leave-to, .fly-up-enter
  transform translateY(100%)
</style>
