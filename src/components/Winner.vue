<template>
  <div>
    <p class="title">中奖纪录</p>
    <table>
      <thead>
        <tr>
          <th>开奖期数</th>
          <th>开奖号码</th>
          <th>中奖用户</th>
          <th>中奖数量</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in records" :key="index">
          <td>{{$tc('Game.number', top + 1 - index)}}</td>
          <td>{{item.number}}</td>
          <td>{{item.winner.substr(0, 10)}}...</td>
          <td>{{item.value}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr></tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Winner',
  data () {
    return {
      page: 0,
      records: []
    }
  },
  computed: {
    ...mapState({
      gameIndex: state => state.gameIndex
    })
  },
  watch: {
    gameIndex () {
      this.update()
    }
  },
  created () {
    this.update()
  },
  methods: {
    ...mapActions({
      getWinnerPaged: 'getWinnerPaged',
      getWinnerUnder: 'getWinnerUnder'
    }),
    update () {
      this.getWinnerUnder(this.gameIndex - 1).then(res => {
        this.top = res.top
        this.records = res.records
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.title
  font-size 16px
  font-weight 500
  text-align center
  line-height 20px
  margin 30px 0
  color #fff
table
  width calc(100% - 32px)
  margin 0 16px
  text-align center
  background-color #fff
  border-radius 15px
  font-size 14px
  color #333
  border-spacing 0
  border-collapse separate
thead
  line-height 46px
  color #666
tbody
  line-height 50px
  overflow hidden
  tr:nth-child(odd)
    background-color #eef1fc
  tr:last-child
    td:last-child
      border-bottom-right-radius 15px
    td:first-child
      border-bottom-left-radius 15px
</style>
