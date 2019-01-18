<template>
  <div class="tt-games-board">
    <div class="board">
      <new-game v-if="canCreateNewGame" @update="updateGamesBoard" />
      <game v-for="index in gamesList" :key="index" :gameIndex="index" @update="updateGamesBoard" />
      <!-- <div v-if="oldest" class="more">上拉加载更多</div>
      <div v-else class="more">已加载全部</div> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import NewGame from './common/NewGame'
import Game from './common/Game'

export default {
  name: 'GameBoard',
  data () {
    return {
      gamesList: [],
      canCreateNewGame: false,
      oldest: 0
    }
  },
  computed: {
    ...mapState({
      gameIndex: state => state.gameIndex,
      endTime: state => state.endTime
    })
  },
  watch: {
    gameIndex (latestIndex) {
      this.update(latestIndex)
    },
    endTime (time) {
      this.canCreateNewGame = new Date().getTime() > time
    }
  },
  created () {
    // window.addEventListener('touchend', this.refresh)
    if (this.gameIndex >= 0) {
      this.update(this.gameIndex)
    }
  },
  methods: {
    ...mapActions({
      updateGameInfo: 'updateGameInfo'
    }),
    update (latestIndex) {
      this.gamesList = [latestIndex]
      this.canCreateNewGame = new Date().getTime() > this.endTime
      // let start
      // if (this.gamesList.length) {
      //   start = this.gamesList[0] + 1
      //   this.oldest = this.gamesList[this.gamesList.length - 1]
      // } else {
      //   start = Math.max(0, latestIndex - 2)
      //   this.oldest = start
      // }
      // for (let i = start; i <= latestIndex; i++) {
      //   this.gamesList.unshift(i)
      // }
    },
    updateGamesBoard () {
      console.log('--- update games board')
      this.updateGameInfo().then(() => {
        this.canCreateNewGame = new Date().getTime() > this.endTime
      })
    },
    refresh () {
      const docEl = document.documentElement
      let scrollTop
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      const height = Math.min(document.body.clientHeight, docEl.clientHeight)
      if (scrollTop + height >= docEl.scrollHeight) {
        const start = Math.max(0, this.oldest - 3)
        for (let i = this.oldest - 1; i >= start; i--) {
          this.gamesList.push(i)
        }
        this.oldest = start
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('touchend', this.refresh)
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
.more
  text-align center
  font-size 12px
</style>
