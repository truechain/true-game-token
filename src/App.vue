<template>
  <div id="app">
    <div id="banner">
      <h1>{{$t('title')}}</h1>
      <p>{{address}}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      address: state => state.address
    })
  },
  mounted () {
    this.queryAccount()
  },
  methods: {
    ...mapActions({
      queryAccount: 'queryAccount'
    })
  }
}
</script>

<style lang="stylus" scoped>
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
#banner
  height 180px
  background-color #0071BC
  color #fff
</style>
