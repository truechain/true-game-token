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

const games = new Map()
class GameInfo {
  constructor (index, user) {
    this.index = index
    this.user = user
    this.end = false
  }

  async update () {
    return Promise.all([
      TTGame.methods.getGameInfo(this.index)
        .call()
        .then(res => {
          this.endTime = Number(res.gameEndTime) * 1000
          this.bettings = res.gameBettings
          this.winner = res.gameWinner
          this.end = new Date().getTime() > this.endTime && this.winner !== '0x0000000000000000000000000000000000000000'
          return this
        }),
      TTGame.methods.bettings(this.index, this.user)
        .call()
        .then(res => {
          this.userBettings = res
          return res
        })
    ]).then(res => {
      return res[0]
    })
  }
}

const state = {
  address: '---',
  TGB: '---',
  TGBBalance: '0',
  gameIndex: -1,
  endTime: Infinity
}

const actions = {
  async updateGameInfo ({ state }) {
    const index = await TTGame.methods.gameIndexNow().call()
    state.gameIndex = Number(index)
    const endTime = await TTGame.methods.endTime(index).call()
    state.endTime = endTime * 1000
  },
  async queryAccount ({ state, dispatch }) {
    if (process.env.NODE_ENV === 'development') {
      state.address = '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf'
      dispatch('updateTGBBalance')
      return '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf'
    }
    return new Promise((resolve, reject) => {
      const timestamp = new Date().getTime()
      const payload = {
        timestamp,
        method: 'get_account'
      }
      handles.set(timestamp, (res) => {
        if (res.ok) {
          state.address = res.address
          dispatch('updateTGBBalance')
          resolve(res.address)
        } else {
          reject(new Error(res.message || 'Unknow Error'))
        }
      })
      if (window.originalPostMessage) {
        window.postMessage(JSON.stringify(payload))
      } else {
        reject(new Error('Invalid running environment'))
      }
    })
  },
  async updateTGBBalance ({ state }) {
    if (!web3.utils.isAddress(state.address)) {
      state.TGB = '---'
      return '---'
    }
    return TGToken.methods.balanceOf(state.address)
      .call()
      .then(balance => {
        const count = web3.utils.fromWei(String(balance), 'ether')
        const res = count.match(/^(\d+)\.?/)
        state.TGB = count.substr(0, res[1].length + 3)
        state.TGBBalance = balance
      })
  },
  async getGameInfo ({ state }, index) {
    let game = games.get(index)
    if (game) {
      if (game.end) {
        return game
      } else {
        return game.update()
      }
    }
    game = new GameInfo(index, state.address)
    games.set(index, game)
    return game.update()
  }
}

export default new Vuex.Store({
  state,
  actions,
  strict: false
})
