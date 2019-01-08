<template>
  <div id="app">
    <div id="banner">
      <div class="home-title">
        <h1>{{$t('title')}}</h1>
      </div>
      <p class="">{{address}}</p>
    </div>
    <balance />
    <games-board />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import Balance from '@/components/Balance'
import GamesBoard from '@/components/GamesBoard'

export default {
  name: 'App',
  data () {
    return {
      pause: true
    }
  },
  computed: {
    ...mapState({
      address: state => state.address
    })
  },
  mounted () {
    this.updateGameInfo()
    this.queryAccount().then(address => {
      console.log(`--- loaded account: ${address}`)
      this.pause = false
    }).catch(err => {
      alert(err.message)
    })
  },
  methods: {
    ...mapActions({
      queryAccount: 'queryAccount',
      updateGameInfo: 'updateGameInfo'
    })
  },
  components: {
    Balance,
    GamesBoard
  }
}
</script>

<style lang="stylus" scoped>
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif, 'PingFang SC', 'Microsoft YaHei'
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #333
  margin-bottom 200px
#banner
  height 180px
  background-color #0071BC
  color #fff
  padding 20px 16px
  box-sizing border-box
  p
    font-size 12px
    line-height 18px
.home-title
  h1
    font-size 20px
    line-height 28px
</style>
