import Vue from 'vue'
import Vuex from 'vuex'

import Web3 from 'web3'
import TGTokenABI from '../../sol/TrueGameToken.abi.json'
import TTreasureABI from '../../sol/TrueTreasure.abi.json'
import config from '../../config.json'

Vue.use(Vuex)

const web3 = new Web3('https://api.truescan.net/rpc')
const TGToken = new web3.eth.Contract(TGTokenABI, config.betaTGTAddress)
const TTGame = new web3.eth.Contract(TTreasureABI, config.betaGameAddress)

const handles = new Map()
document.addEventListener('message', e => {
  let res
  if (e.data) {
    try {
      res = JSON.parse(e.data)
    } catch (err) {}
  }
  if (!res) {
    return
  }
  if (res.timestamp) {
    const handle = handles.get(res.timestamp)
    if (handle) {
      handles.delete(res.timestamp)
      handle(res.data)
    }
  }
})

const state = {
  address: '',
  TGB: '0',
  TGToken,
  TTGame
}

const actions = {
  async queryAccount ({ state }) {
    return new Promise((resolve, reject) => {
      const timestamp = new Date().getTime()
      const payload = {
        timestamp,
        method: 'get_account'
      }
      handles.set(timestamp, (res) => {
        if (res.ok) {
          state.address = res.address
          resolve(res.address)
        } else {
          reject(res.message || 'Unknow Error')
        }
      })
      if (window.originalPostMessage) {
        window.postMessage(JSON.stringify(payload))
      } else {
        state.address = ''
      }
    })
  }
}

export default new Vuex.Store({
  state,
  actions,
  strict: false
})
