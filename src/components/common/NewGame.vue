<template>
  <div class="tt-new-game card">
    <p class="title">开始新的一期游戏</p>
    <bet @update="update" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Bet from './Bet'

export default {
  name: 'NewGame',
  computed: {
    ...mapState({
      gameIndex: state => state.gameIndex
    })
  },
  methods: {
    update () {
      this.$emit('update')
    }
  },
  components: {
    Bet
  }
}
</script>

<style lang="stylus" scoped>
.tt-new-game
  margin 0 16px
  min-height 200px
  width calc(100vw - 32px)
  .title
    color #fff
    line-height 42px
    height 40px
    font-weight 500
    margin-bottom 12px
</style>
