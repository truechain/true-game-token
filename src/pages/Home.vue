<template>
  <div>
    <div id="banner" class="card">
      <div class="home-title">
        <img src="../assets/title@3x.png" alt="title">
      </div>
      <p class="">{{address}}</p>
      <nav>
        <router-link class="personal" :class="{
          'disable': pending
        }" :to="pending ? '/' : '/personal'">个人中心</router-link>
        <router-link class="exchange" :class="{
          'disable': pending
        }" :to="pending ? '/' : '/exchange'">兑换TGB</router-link>
        <router-link class="friends" :class="{
          'disable': pending
        }" :to="pending ? '/' : '/friends'">邀请好友</router-link>
        <router-link class="intro" to="/intro">游戏介绍</router-link>
      </nav>
      <balance />
    </div>
    <div v-if="!ready" class="notice">
      免费申请Beta TRUE（手续费）中...
    </div>
    <games-board v-if="address !== '---'" />
    <winner v-if="address !== '---'" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Balance from '@/components/Balance'
import GamesBoard from '@/components/GamesBoard'
import Winner from '@/components/Winner'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      address: state => state.address,
      ready: state => state.ready
    }),
    pending () {
      return this.address === '---'
    }
  },
  mounted () {
    this.updateGameInfo()
  },
  methods: {
    ...mapActions({
      updateGameInfo: 'updateGameInfo'
    })
  },
  components: {
    Balance,
    GamesBoard,
    Winner
  }
}
</script>

<style lang="stylus" scoped>
#banner
  margin 100px 16px 16px
  p
    font-size 12px
    line-height 20px
    background-color #2962C4
    margin auto
    border-radius 10px
    margin 10px auto
    padding 0 1em
    display table
.home-title
  width 300px
  height 100px
  margin -60px auto 0
  background-color #3b78e2
  border-radius 50px
  box-sizing border-box
  border solid 2px #7cacff
  box-shadow 0 0 40px 8px #0856c0 inset
  position relative
  img
    width 90%
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0)
nav
  display flex
  justify-content center
  a
    background #508bf1
    border solid 5px #1f58b9
    font-size 12px
    line-height 14px
    width 60px
    height 60px
    border-radius 50%
    display flex
    flex-direction column
    align-items center
    justify-content center
    margin 14px 8px
    box-shadow 0 1px 0 #5b94ea inset
    &:before
      content ''
      width 18px
      height 18px
      background-size 100%
      margin-top -3px
      margin-bottom 5px
.disable
  background-color #ddd
.personal:before
  background-image url(../assets/indexs/personal@3x.png)
.friends:before
  background-image url(../assets/indexs/friends@3x.png)
.intro:before
  background-image url(../assets/indexs/intro@3x.png)
.exchange:before
  background-image url(../assets/indexs/exchange@3x.png)

.notice
  font-size 14px
  text-align center
  line-height 40px
  background-color #3e7be4
  box-shadow 0 2px 4px #3972da inset
</style>
