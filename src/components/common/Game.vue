<template>
  <div class="tt-game">
    <p class="title">{{$tc('Game.number', gameIndex + 1)}}</p>
    <div class="info">
      <div>
        <p>本期已累计</p>
        <span>{{bettings}} TGB</span>
      </div>
      <div>
        <p>已经购买</p>
        <span>{{userBettings}} TGB</span>
      </div>
    </div>
    <div v-if="endTime">
      <div v-if="timeout" class="end">
        <p>最终赢家</p>
        <span v-if="winner !== '0x0000000000000000000000000000000000000000'">{{winner}}</span>
        <span v-else>等待开局...</span>
      </div>
      <div v-else>
        <count-down :endTime="endTime" />
        <bet @update="updateGameInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import CountDown from './CountDown'
import Bet from './Bet'

export default {
  name: 'Game',
  props: ['gameIndex'],
  data () {
    return {
      bettings: '...',
      end: false,
      endTime: 0,
      index: 1,
      userBettings: '...',
      winner: '...',
      timeout: false,
      updateLock: false
    }
  },
  created () {
    this.updateGameInfo()
    this.updateRepeatedly()
  },
  methods: {
    ...mapActions({
      getGameInfo: 'getGameInfo'
    }),
    updateGameInfo () {
      if (this.updateLock) {
        return
      }
      this.updateLock = true
      this.getGameInfo(this.gameIndex)
        .then(game => {
          this.bettings = game.bettings
          this.end = game.end
          this.timeout = new Date().getTime() > game.endTime
          this.endTime = game.endTime
          this.index = game.index
          this.userBettings = game.userBettings
          this.winner = game.winner
        }).catch(console.error).then(() => {
          this.updateLock = false
        })
    },
    updateRepeatedly () {
      if (!this.end) {
        this.updateGameInfo()
        setTimeout(this.updateRepeatedly, 4000)
      }
    }
  },
  components: {
    CountDown,
    Bet
  }
}
</script>

<style lang="stylus" scoped>
.tt-game
  margin 0 16px
  padding 0 14px 14px
  border solid 1px #bbb
  border-radius 10px
  min-height 200px
  .title
    color #101010
    line-height 42px
    height 40px
    font-weight 500
    border-bottom solid 1px #bbb
    margin-bottom 12px
  .info
    display grid
    grid-template-columns repeat(2, 1fr)
    grid-gap 12px
    margin-bottom 12px
    div
      border solid 1px #bbb
      border-radius 6px
      padding 12px 12px 6px
    p
      font-size 14px
      color #888888
      line-height 20px
    span
      font-size 28px
      line-height 40px
      font-weight 500
      white-space nowrap
  .end
    border solid 1px #bbb
    border-radius 6px
    text-align center
    padding 10px
    p
      font-size 14px
      color #101010
      font-weight 500
    span
      font-size 12px
</style>
