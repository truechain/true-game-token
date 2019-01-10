import Vue from 'vue'
import Vuex from 'vuex'

import Web3 from 'web3'
import TGTokenABI from '../../sol/TrueGameToken.abi.json'
import TTreasureABI from '../../sol/TrueTreasure.abi.json'
import trueTokenABI from '../../sol/TrueToken.abi.json'
import config from '../../config.json'

Vue.use(Vuex)

const web3 = new Web3('https://api.truescan.net/rpc')
const TGToken = new web3.eth.Contract(TGTokenABI, config.betaTGTAddress)
const TTGame = new web3.eth.Contract(TTreasureABI, config.betaGameAddress)

// const eWeb3 = new Web3('https://mainnet.infura.io', 'eth')
const eWeb3 = new Web3('https://ropsten.infura.io', 'eth') // test eth net
const trueToken = new eWeb3.eth.Contract(trueTokenABI, config.ethTrueAddress)

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
  TT: '---',
  TTBalance: '0',
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
      dispatch('updateTTBalance')
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
          dispatch('updateTTBalance')
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
  async updateTTBalance ({ state }) {
    if (!web3.utils.isAddress(state.address)) {
      state.TT = '---'
      return '---'
    }
    return trueToken.methods.balanceOf(state.address)
      .call()
      .then(balance => {
        const count = web3.utils.fromWei(String(balance), 'ether')
        const res = count.match(/^(\d+)\.?/)
        state.TT = count.substr(0, res[1].length + 3)
        state.TTBalance = balance
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
  },
  async bet ({ state }, count) {
    count = Math.round(Math.max(1, Math.min(100, Number(count))))
    const chainId = await web3.eth.net.getId()
    const nonce = await web3.eth.getTransactionCount(state.address)
    const input = TTGame.methods.bet(count).encodeABI()
    const tx = {
      to: TTGame.options.address,
      input,
      nonce,
      gas: 4000000,
      gasPrice: 1,
      chainId
    }
    if (process.env.NODE_ENV === 'development') {
      const accout = web3.eth.accounts.privateKeyToAccount('0x01')
      const { rawTransaction } = await accout.signTransaction(tx)
      return web3.eth.sendSignedTransaction(rawTransaction)
    }
    return new Promise((resolve, reject) => {
      const timestamp = new Date().getTime()
      const payload = {
        timestamp,
        method: 'get_signedTx',
        data: {
          from: state.address,
          tx
        },
        message: `来自初链夺宝游戏的交易申请：购买${count}份奖券`
      }
      handles.set(timestamp, (res) => {
        if (res.ok) {
          web3.eth.sendSignedTransaction(res.rawTx).then(resolve)
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
  }
}

export default new Vuex.Store({
  state,
  actions,
  strict: false
})
