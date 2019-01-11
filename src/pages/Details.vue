<template>
  <div>
    <div class="details-nav">
      <div :class="{ 'focus': focusMenu === 0 }" @click="toggleMenu(0)">兑入</div>
      <div :class="{ 'focus': focusMenu === 1 }" @click="toggleMenu(1)">兑出</div>
    </div>
    <ul v-if="focusMenu === 0" class="details">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">兑入<span>+{{item.value}} TGB</span></p>
        <p>时间: {{item.time.toLocaleString()}}</p>
        <p class="hash">ETH对应交易Hash: {{item.txHash}}</p>
      </li>
    </ul>
    <ul v-if="focusMenu === 1" class="details">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">兑出<span>-{{item.value}} TGB</span></p>
        <p>时间: {{item.time.toLocaleString()}}</p>
        <p class="hash">ETH对应交易Hash: {{item.txHash}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Details',
  data () {
    return {
      focusMenu: 0,
      records: []
    }
  },
  computed: {
    ...mapState({
      address: state => state.address
    })
  },
  watch: {
    address () {
      this.updateRecords()
    }
  },
  mounted () {
    this.updateRecords()
  },
  methods: {
    ...mapActions({
      getExchangeRecords: 'getExchangeRecords'
    }),
    toggleMenu (index) {
      this.focusMenu = index
      this.updateRecords()
    },
    updateRecords () {
      this.records = []
      this.getExchangeRecords({
        toGetInRecord: this.focusMenu === 0,
        page: 0
      }).then(res => {
        this.records = res
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.details-nav
  margin 14px 16px
  border solid 1px #bbb
  border-radius 10px
  display grid
  line-height 40px
  grid-template-columns 1fr 1fr
  grid-gap 1px
  text-align center
  background-color #bbb
  overflow hidden
  >div
    background-color #fff
    transition background-color .4s
  .focus
    background-color #eee !important
.details li
  margin 14px
  padding 10px 14px
  border solid 1px #bbb
  border-radius 10px
  font-size 14px
  .title
    font-weight 500
    line-height 28px
    font-size 16px
    span
      float right
      font-size 20px
  .hash
    font-size 12px
    color #888
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    line-height 20px
</style>
