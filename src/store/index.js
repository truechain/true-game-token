import Vue from 'vue'
import Vuex from 'vuex'

import Web3 from 'web3'
import TGTokenABI from '../sol/TrueGameToken.abi.json'
import TTreasureABI from '../sol/TrueTreasure.abi.json'

Vue.use(Vuex)

const web3 = new Web3('https://api.truescan.net/rpc')
const TGToken = new web3.eth.Contract(TGTokenABI, '0x912dEb842f3CE780c7A8e0B8e74e42E87C575D97')
const TTGame = new web3.eth.Contract(TTreasureABI, '0x2AFF0C184bD588A8A3851d13a6EEeE9DdFEdF015')

const state = {
  address: '',
  TGB: '0'
}

const actions = {
}

export default new Vuex.Store({
  state,
  actions,
  strict: false
})
