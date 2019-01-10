<template>
  <div>
    <div id="banner">
      <div class="home-title">
        <h1>{{$t('title')}}</h1>
      </div>
      <p class="">{{address}}</p>
      <router-link to="/personal">个人中心</router-link>
    </div>
    <balance />
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
      address: state => state.address
    })
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
