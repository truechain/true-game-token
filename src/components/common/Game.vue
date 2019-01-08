<template>
  <div class="tt-game">
    <p class="title">{{$tc('Game.number', gameIndex + 1)}}</p>
    <div class="info">
      <div>
        <p>本期已购买</p>
        <span>{{bettings}} TGB</span>
      </div>
      <div>
        <p>已经购买</p>
        <span>{{userBettings}} TGB</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Game',
  props: ['gameIndex'],
  data () {
    return {
      bettings: "...",
      end: false,
      endTime: 0,
      index: 1,
      userBettings: "...",
      winner: "..."
    }
  },
  created () {
    this.getGameInfo(this.gameIndex)
      .then(res => {
        const game = res[0]
        this.bettings = game.bettings,
        this.end = game.end,
        this.endTime = game.endTime,
        this.index = game.index,
        this.userBettings = game.userBettings,
        this.winner = game.winner
      })
  },
  methods: {
    ...mapActions({
      getGameInfo: 'getGameInfo'
    })
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
</style>
