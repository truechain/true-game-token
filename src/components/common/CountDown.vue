<template>
  <div class="tt-count-down">
    <p>开奖倒计时</p>
    <div class="time">
      <span>{{h1}}</span>
      <span>{{h2}}</span>
      <div>:</div>
      <span>{{m1}}</span>
      <span>{{m2}}</span>
      <div>:</div>
      <span>{{s1}}</span>
      <span>{{s2}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountDown',
  props: ['endTime'],
  data () {
    return {
      stiv: 0,
      h1: 0,
      h2: 0,
      m1: 0,
      m2: 0,
      s1: 0,
      s2: 0
    }
  },
  watch: {
    endTime () {
      this.updateEndTime()
    }
  },
  created () {
    if (this.endTime) {
      this.updateEndTime()
    }
    this.stiv = setInterval(() => {
      this.updateDisplay()
    }, 1000)
  },
  methods: {
    updateEndTime () {
      const delta = this.endTime - new Date().getTime()
      const deltaS = Math.round(delta / 1000)
      const h = Math.floor(deltaS / 3600)
      const m = Math.floor(deltaS % 3600 / 60)
      const s = deltaS % 60
      this.h1 = Math.floor(h / 10)
      this.h2 = h % 10
      this.m1 = Math.floor(m / 10)
      this.m2 = m % 10
      this.s1 = Math.floor(s / 10)
      this.s2 = s % 10
    },
    updateDisplay () {
      if (--this.s2 >= 0) return
      this.s2 += 10
      if (--this.s1 >= 0) return
      this.s1 += 6
      if (--this.m2 >= 0) return
      this.m2 += 10
      if (--this.m1 >= 0) return
      this.m1 += 6
      if (--this.h2 >= 0) return
      this.h2 += 10
      if (--this.h1 >= 0) return
      this.endCountDown()
    },
    endCountDown () {
      clearInterval(this.stiv)
      this.h1 = 0
      this.h2 = 0
      this.m1 = 0
      this.m2 = 0
      this.s1 = 0
      this.s2 = 0
    }
  },
  beforeDestroy () {
    clearInterval(this.stiv)
  }
}
</script>

<style lang="stylus" scoped>
.tt-count-down
  border-radius 10px
  text-align center
  padding 8px
  margin-bottom 14px
  background-color #3e7be4
  box-shadow 0 2px 4px #3972da inset
  p
    font-size 14px
    font-weight 500
  .time
    display flex
    justify-content center
    font-size 24px
    font-weight 500
    color #fff
    margin 8px 0 2px
    span
      width 20px
      line-height 30px
    div
      font-size 28px
      line-height 24px
      width 20px
</style>
