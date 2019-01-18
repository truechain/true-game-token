<template>
  <div class="tt-game card">
    <p class="title">{{$tc('Game.number', gameIndex + 1)}}</p>
    <div class="info">
      <div>
        <p>本期已累计</p>
        <span>
          <span v-for="(char, index) in bettings.toString()" :key="index"
            class="char-bg" :style="{
              'font-size': bettings >= 10000 ? '16px' : bettings >= 100 ? '20px' : '28px'
            }">{{char}}</span>
          <span class="unit">TGB</span>
        </span>
      </div>
      <div>
        <p>已经购买</p>
        <span :style="{
          'font-size': userBettings >= 10000 ? '16px' : userBettings >= 100 ? '20px' : '28px'
        }">{{userBettings}} <span class="unit">TGB</span></span>
      </div>
    </div>
    <div v-if="endTime">
      <div v-if="timeout" class="end">
        <p>最终赢家</p>
        <span v-if="winner !== '0x0000000000000000000000000000000000000000'">{{winner.substr(0, 10)}}...{{winner.substr(34, 8)}}</span>
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
          if (!this.end && game.end) {
            this.$emit('update')
          }
          this.bettings = Number(game.bettings)
          this.end = game.end
          this.timeout = new Date().getTime() > game.endTime
          this.endTime = game.endTime
          this.index = game.index
          this.userBettings = Number(game.userBettings)
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
  min-height 200px
  width calc(100vw - 32px)
  .title
    color #fff
    line-height 42px
    height 40px
    font-weight 500
    margin-bottom 12px
  .info
    display grid
    grid-template-columns 3fr 2fr
    grid-gap 12px
    margin-bottom 12px
    div
      border-radius 10px
      padding 6px 12px
      text-align center
      background-color #3e7be4
      box-shadow 0 1px 0 #5b94ea inset
      border-bottom solid 1px #3b75d8
    p
      font-size 12px
      line-height 24px
    span
      display inline-block
      font-size 28px
      margin 2px 0
      line-height 36px
      font-weight 500
      white-space nowrap
      color #ffe34a
    .char-bg
      display inline-block
      background-color #2962c4
      margin 0 .1em
      width .9em
      border-radius 3px
    .unit
      font-size 12px
      line-height 14px
      color #cfe1ff
      margin 2px
  .end
    border-radius 6px
    text-align center
    padding 10px
    background-color #3e7be4
    box-shadow 0 2px 4px #3972da inset
    p
      font-size 14px
      font-weight 500
    span
      font-size 12px
</style>
