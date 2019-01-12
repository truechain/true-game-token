<template>
  <div class="tt-new-game">
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
  padding 0 14px 14px
  border solid 1px #BBB
  border-radius 10px
  width calc(100vw - 32px)
  box-sizing border-box
  .title
    color #101010
    line-height 42px
    height 40px
    font-weight 500
    border-bottom solid 1px #bbb
    margin-bottom 12px
</style>
