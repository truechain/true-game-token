<template>
  <div>
    <div class="form">
      <span class="price">1TGB / 份</span>
      <span class="x">x</span>
      <input type="number" v-model="count" @change="checkCount">
      <span class="unit">份</span>
    </div>
    <div class="buy" @click="bet">
      购 买
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bet',
  data () {
    return {
      count: 1
    }
  },
  methods: {
    checkCount () {
      const nCount = Number(this.count)
      this.count = Math.round(Math.max(1, Math.min(100, nCount)))
    },
    bet () {
      // TODO
    }
  }
}
</script>

<style lang="stylus" scoped>
.form
  display flex
  margin-bottom 10px
  line-height 28px
  text-align center
  font-size 14px
  .price
    flex 1 1 auto
    border solid 1px #bbb
    padding 4px
    line-height 20px
  .x
    flex 0 0 auto
    line-height 30px
    font-weight 500
    margin 0 10px
  input
    flex 2 1 auto
    border solid 1px #bbb
    padding 0 .5em
    font-family inherit
    text-align start
  .unit
    flex 0 0 30px
    line-height 30px
.buy
  background-color #0071bc
  color #fff
  line-height 30px
  text-align center
  border-radius 15px
</style>
