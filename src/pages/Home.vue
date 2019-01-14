<template>
  <div>
    <div id="banner">
      <div class="home-title">
        <h1>{{$t('title')}}</h1>
      </div>
      <p class="">{{address}}</p>
      <nav>
        <router-link class="personal" :class="{
          'disable': pending
        }" :to="pending ? '/' : '/personal'">个人中心</router-link>
        <router-link class="friends" :class="{
          'disable': pending
        }" :to="pending ? '/' : '/friends'">邀请好友</router-link>
        <router-link class="intro" to="/intro">游戏介绍</router-link>
        <router-link class="exchange" :class="{
          'disable': pending
        }" :to="pending ? '/' : '/exchange'">兑换TGB</router-link>
      </nav>
    </div>
    <balance />
    <div v-if="!ready" class="notice">
      免费申请Beta TRUE（手续费）中...
    </div>
    <games-board v-if="address !== '---'" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Balance from '@/components/Balance'
import GamesBoard from '@/components/GamesBoard'

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
    GamesBoard
  }
}
</script>

<style lang="stylus" scoped>
#banner
  height 180px
  background-color #0071BC
  position relative
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

nav a
  position absolute
  background #fff
  color #333
  font-size 14px
  line-height 30px
.disable
  background-color #ddd
.personal
  left 0
  top 80px
  border-radius 0 6px 6px 0
  padding 0 10px 0 6px
.friends
  left 0
  top 130px
  border-radius 0 6px 6px 0
  padding 0 10px 0 6px
.intro
  right 0
  top 80px
  border-radius 6px 0 0 6px
  padding 0 6px 0 10px
.exchange
  right 0
  top 130px
  border-radius 6px 0 0 6px
  padding 0 6px 0 10px

.notice
  font-size 14px
  text-align center
  color #888
  line-height 40px
  background-color #e7eeff
</style>
