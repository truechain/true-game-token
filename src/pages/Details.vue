<template>
  <div class="tt-details">
    <div class="details-nav">
      <div :class="{ 'focus': focusMenu === 0 }" @click="toggleMenu(0)">兑入</div>
      <div :class="{ 'focus': focusMenu === 1 }" @click="toggleMenu(1)">兑出</div>
    </div>
    <ul v-if="focusMenu === 0" class="details-list">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">兑入<span>+{{item.value}} TGB</span></p>
        <p>{{item.time.toLocaleString()}}</p>
        <p class="hash">ETH对应交易Hash: {{item.txHash}}</p>
      </li>
    </ul>
    <ul v-if="focusMenu === 1" class="details-list">
      <li v-for="(item, index) in records" :key="index">
        <p class="title">兑出<span>-{{item.value}} TGB</span></p>
        <p>{{item.time.toLocaleString()}}</p>
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
.tt-details
  margin-bottom 100px
.details-nav
  margin 14px 16px 0
  border-radius 15px 15px 0 0
  display grid
  line-height 40px
  grid-template-columns 1fr 1fr
  text-align center
  overflow hidden
  >div
    background-color #cfe1ff
    color #3e7be4
    transition background-color .4s, color .4s
  .focus
    color #fff
    background-color #3e7be4 !important
.details-list
  margin 0 16px
  padding 7px
  display flex
  flex-direction column
  background-color #fff
  border-radius 0 0 15px 15px
  li
    margin 7px
    padding 10px 14px
    border solid 1px #cfe1ff
    color #666
    border-radius 10px
    font-size 14px
  .title
    font-weight 500
    line-height 28px
    font-size 16px
    span
      float right
      font-size 20px
  p
    line-height 24px
  .hash
    font-size 12px
    color #888
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    line-height 20px
</style>
