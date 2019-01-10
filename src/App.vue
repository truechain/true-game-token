<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      pause: true
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.init({ data: 'onload' })
    } else {
      document.addEventListener('message', this.init)
    }
  },
  methods: {
    ...mapActions({
      queryAccount: 'queryAccount'
    }),
    init (e) {
      if (e.data === 'onload') {
        this.queryAccount().then(address => {
          console.log(`--- loaded account: ${address}`)
          this.pause = false
        }).catch(console.error)
        document.removeEventListener('message', this.init)
      }
    }
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
</style>
