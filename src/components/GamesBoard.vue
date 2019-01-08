<template>
  <div class="tt-games-board">
    <h2>{{$t('C.gamesBoard')}}</h2>
    <div class="board">
      <new-game v-if="canCreateNewGame" />
      <game v-for="index in gamesList" :key="index" :gameIndex="index" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import NewGame from './common/NewGame'
import Game from './common/Game'

export default {
  name: 'GameBoard',
  data () {
    return {
      gamesList: []
    }
  },
  computed: {
    ...mapState({
      gameIndex: state => state.gameIndex,
      endTime: state => state.endTime
    }),
    canCreateNewGame () {
      return new Date().getTime() > this.endTime
    }
  },
  watch: {
    gameIndex (latestIndex) {
      for (let i = this.gamesList[0] || 0; i <= latestIndex; i++) {
        this.gamesList.unshift(i)
      }
    }
  },
  components: {
    NewGame,
    Game
  }
}
</script>

<style lang="stylus" scoped>
h2
  text-align center
  font-size 20px
  line-height 60px
.board
  display grid
  grid-gap 16px
</style>
