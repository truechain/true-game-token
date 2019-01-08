import Vue from 'vue'
import Vuex from 'vuex'

import Web3 from 'web3'
import TGTokenABI from '../sol/TrueGameToken.abi.json'
import TTreasureABI from '../sol/TrueTreasure.abi.json'
import config from '../../config.json'

Vue.use(Vuex)

const web3 = new Web3('https://api.truescan.net/rpc')
const TGToken = new web3.eth.Contract(TGTokenABI, config.betaTGTAddress)
const TTGame = new web3.eth.Contract(TTreasureABI, config.betaGameAddress)

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
