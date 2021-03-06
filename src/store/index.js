import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import Web3 from 'web3true'
import TGTokenABI from '../../sol/TrueGameToken.abi.json'
import TTreasureABI from '../../sol/TrueTreasure.abi.json'
import trueTokenABI from '../../sol/TrueToken.abi.json'
import config from '../../config.json'

Vue.use(Vuex)

const web3 = new Web3('https://api.truescan.net/rpc')
const TGToken = new web3.eth.Contract(TGTokenABI, config.betaTGTAddress)
const TTGame = new web3.eth.Contract(TTreasureABI, config.betaGameAddress)

const eWeb3 = new Web3(config.ethnet, 'eth')
const trueToken = new eWeb3.eth.Contract(trueTokenABI, config.ethTrueAddress)

const admin = config.adminAddress
const largeNumber = '100000000000000000000000000'
const zeroAddress = '0x0000000000000000000000000000000000000000'

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
          this.end = new Date().getTime() > this.endTime && this.winner !== zeroAddress
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
  TGBAward: '---',
  TGBReward: '---',
  TGBBalance: '0',
  TT: '---',
  TTBalance: '0',
  ready: true,
  gameIndex: -1,
  endTime: Infinity
}

async function signThenSend (tx, from, message) {
  if (process.env.NODE_ENV === 'development') {
    const accout = web3.eth.accounts.privateKeyToAccount('0xf12cd44cfbcbfe40e0c0b5c80d5e19ed45fe180edd4d2b919e874944c2845bb5')
    const { rawTransaction } = await accout.signTransaction(tx)
    return web3.eth.sendSignedTransaction(rawTransaction)
  }
  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime()
    const payload = {
      timestamp,
      method: 'get_signedTx',
      data: {
        from,
        tx
      },
      message
    }
    handles.set(timestamp, (res) => {
      if (res.ok) {
        web3.eth.sendSignedTransaction(res.rawTx).then(resolve).catch(reject)
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

const actions = {
  async updateGameInfo ({ state }) {
    const index = await TTGame.methods.gameIndexNow().call()
    state.gameIndex = Number(index)
    const endTime = await TTGame.methods.endTime(index).call()
    state.endTime = endTime * 1000
  },
  async queryAccount ({ state, dispatch }) {
    if (process.env.NODE_ENV === 'development') {
      state.address = '0x0dfa5958ca09e57d775bb0005de4023338becaeb'
      dispatch('updateTGBBalance')
      dispatch('updateTTBalance')
      return '0x0dfa5958ca09e57d775bb0005de4023338becaeb'
    }
    return new Promise((resolve, reject) => {
      const timestamp = new Date().getTime()
      const payload = {
        timestamp,
        method: 'get_account'
      }
      handles.set(timestamp, (res) => {
        if (res.ok) {
          const address = res.address
          state.address = address
          dispatch('updateTGBBalance')
          dispatch('updateTTBalance')
          web3.eth.getBalance(address).then(balance => {
            if (Number(balance) < 200000000) {
              state.ready = false
              axios.post(config.backend + '/query', {
                address
              }).then(res => {
                if (res.data === 'ok') {
                  state.ready = true
                }
              })
            } else {
              state.ready = true
            }
          })
          resolve(address)
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
      state.TGBAward = '---'
      state.TGBReward = '---'
      return '---'
    }
    return Promise.all([
      TGToken.methods.balanceOf(state.address)
        .call()
        .then(balance => {
          const count = web3.utils.fromWei(String(balance), 'ether')
          const res = count.match(/^(\d+)\.?/)
          state.TGB = count.substr(0, res[1].length + 3)
          state.TGBBalance = balance
        }),
      TTGame.methods.totalAward(state.address)
        .call()
        .then(balance => {
          const count = web3.utils.fromWei(String(balance), 'ether')
          const res = count.match(/^(\d+)\.?/)
          state.TGBAward = count.substr(0, res[1].length + 3)
        }),
      TTGame.methods.totalReward(state.address)
        .call()
        .then(balance => {
          const count = web3.utils.fromWei(String(balance), 'ether')
          const res = count.match(/^(\d+)\.?/)
          state.TGBReward = count.substr(0, res[1].length + 3)
        })
    ])
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
  async checkInvitationCode ({ state }) {
    if (!web3.utils.isAddress(state.address)) {
      return false
    }
    return TTGame.methods.invitationCode(state.address.substr(0, 10))
      .call()
      .then(address => {
        return address !== zeroAddress
      })
  },
  async getInviter ({ state }) {
    if (!web3.utils.isAddress(state.address)) {
      return ''
    }
    return TTGame.methods.inviterOf(state.address)
      .call()
      .then(address => {
        return address === zeroAddress ? '' : address
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
  async getWinnerPaged (_, page) {
    return TTGame.methods.getWinnerPaged(page)
      .call()
      .then(res => {
        const records = []
        for (let i = 0; i < res.winners.length; i++) {
          if (res.winners[i] === zeroAddress) {
            break
          }
          records.push({
            winner: res.winners[i],
            number: Number(res.numbers[i]) + 1,
            value: web3.utils.fromWei(res.values[i], 'ether')
          })
        }
        return { top: Number(res.top), records }
      })
  },
  async getWinnerUnder (_, top) {
    const promiseList = []
    for (let i = 0; i < 10; i++) {
      if (i > top) {
        break
      }
      promiseList.push(TTGame.methods.winner(top - i).call())
    }
    return Promise.all(promiseList).then(ress => {
      return {
        top: top,
        records: ress.map(record => {
          return {
            winner: record.winner,
            number: Number(record.number) + 1,
            value: web3.utils.fromWei(record.value, 'ether')
          }
        })
      }
    })
  },
  async getBetRecords ({ state }) {
    if (state.address === '---') {
      return []
    }
    return TTGame.methods.betRecords(state.address)
      .call()
      .then(res => {
        const records = []
        for (let i = 0; i < res.count; i++) {
          records.push({
            value: web3.utils.fromWei(String(res.values[i]), 'ether'),
            index: Number(res.indexs[i]),
            startNumber: Number(res.startNumbers[i]),
            endNumber: Number(res.endNumbers[i]),
            time: new Date(Number(res.times[i]) * 1000)
          })
        }
        return records
      })
  },
  async getIncomeRecords ({ state }) {
    if (state.address === '---') {
      return []
    }
    return TTGame.methods.incomeRecords(state.address)
      .call()
      .then(res => {
        const records = []
        for (let i = 0; i < res.count; i++) {
          records.push({
            value: web3.utils.fromWei(String(res.values[i]), 'ether'),
            index: Number(res.indexs[i]),
            number: Number(res.numbers[i]),
            time: new Date(Number(res.times[i]) * 1000)
          })
        }
        return records
      })
  },
  async getExchangeRecords ({ state }, {
    toGetInRecord,
    page
  }) {
    if (state.address === '---') {
      return []
    }
    const method = toGetInRecord ? TGToken.methods.inLogPaged : TGToken.methods.outLogPaged
    page = Math.max(0, Number(page))
    return method(state.address, page, 10).call().then(res => {
      const records = []
      for (let i = 0; i < res.count; i++) {
        records.unshift({
          value: web3.utils.fromWei(String(res.value[i]), 'ether'),
          txHash: res.txHash[i],
          time: new Date(Number(res.time[i]) * 1000)
        })
      }
      return records
    })
  },
  async getFriends ({ state }) {
    if (state.address === '---') {
      return []
    }
    return TTGame.methods.getFriends(state.address).call().then(res => {
      const records = []
      for (let i = 0; i < res.friends.length; i++) {
        records.push({
          friend: res.friends[i],
          time: new Date(Number(res.times[i]) * 1000)
        })
      }
      return {
        count: res.friendsCount,
        records
      }
    })
  },
  async setInviter ({ state }, code) {
    if (state.address === '---') {
      return { error: true }
    }
    let promise
    if (/^[\da-fA-F]{8}$/.test(code)) {
      const address = await TTGame.methods.invitationCode('0x' + code).call()
      if (address === zeroAddress) {
        return { error: true, code: 1 }
      }
      promise = axios.post(config.backend + '/inviter', {
        address: state.address,
        code: '0x' + code
      })
    } else {
      promise = axios.post(config.backend + '/inviter', {
        address: state.address
      })
    }
    return promise.then(res => {
      if (res.data === 'ok') {
        return { error: false }
      } else {
        return { error: true, code: 2 }
      }
    }).catch(() => {
      return { error: true, code: 3 }
    })
  },
  async approve ({ state }) {
    const chainId = await web3.eth.net.getId()
    const nonce = await web3.eth.getTransactionCount(state.address)
    const input = TGToken.methods.approve(config.betaGameAddress, largeNumber).encodeABI()
    const tx = {
      to: TGToken.options.address,
      input,
      nonce,
      gas: 4000000,
      gasPrice: 1,
      chainId
    }
    return signThenSend(tx, state.address, '来自初链夺宝游戏的交易申请：授权游戏使用TGB (需极低beta TRUE手续费)')
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
    return signThenSend(tx, state.address, `来自初链夺宝游戏的交易申请：购买${count}份奖券 (需极低beta TRUE手续费)`)
  },
  async exchangeOut ({ state }, value) {
    const res = await axios.get(config.backend + '/').catch(err => { return err })
    if (res.name === 'Error') {
      const err = new Error('No backend service')
      err.code = 1
      throw err
    }
    const chainId = await web3.eth.net.getId()
    const nonce = await web3.eth.getTransactionCount(state.address)
    const valueWei = web3.utils.toWei(value, 'ether')
    const input = TGToken.methods.sendOut(valueWei).encodeABI()
    const tx = {
      to: TGToken.options.address,
      input,
      nonce,
      gas: 500000,
      gasPrice: 1,
      chainId
    }
    return signThenSend(tx, state.address, `来自初链夺宝游戏的交易申请：等比兑回${value}TGB至TRUE (需极低beta TRUE手续费)`)
  },
  async exchangeIn ({ state }, value) {
    const res = await axios.get(config.backend + '/').catch(err => { return err })
    if (res.name === 'Error') {
      return {
        error: true,
        code: 1
      }
    }
    const chainId = await eWeb3.eth.net.getId()
    const nonce = await eWeb3.eth.getTransactionCount(state.address)
    const valueWei = web3.utils.toWei(value, 'ether')
    const input = trueToken.methods.transfer(admin, valueWei).encodeABI()
    const tx = {
      to: trueToken.options.address,
      input,
      nonce,
      gas: 100000,
      gasPrice: '10000000000',
      chainId
    }
    if (process.env.NODE_ENV === 'development') {
      const accout = eWeb3.eth.accounts.privateKeyToAccount('0xf12cd44cfbcbfe40e0c0b5c80d5e19ed45fe180edd4d2b919e874944c2845bb5')
      const { rawTransaction } = await accout.signTransaction(tx)
      return new Promise((resolve, reject) => {
        eWeb3.eth.sendSignedTransaction(rawTransaction).on('transactionHash', hash => {
          axios.post(config.backend + '/', {
            hash
          }).then(res => {
            if (res.data === 'ok') {
              resolve({ error: false })
            } else {
              resolve({ error: true, code: 5 })
            }
          }).catch(() => {
            resolve({ error: true, code: 6 })
          })
        }).on('error', () => {
          resolve({ error: true, code: 4 })
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        const timestamp = new Date().getTime()
        const payload = {
          timestamp,
          method: 'get_signedTx',
          data: {
            from: state.address,
            tx
          },
          message: `来自初链夺宝游戏的交易申请：等比兑换${value}TRUE至TGB (需少量ETH手续费)`
        }
        handles.set(timestamp, (res) => {
          if (res.ok) {
            eWeb3.eth.sendSignedTransaction(res.rawTx).on('transactionHash', hash => {
              axios.post(config.backend + '/', {
                hash
              }).then(res => {
                if (res.data === 'ok') {
                  resolve({ error: false })
                } else {
                  resolve({ error: true, code: 5 })
                }
              }).catch(() => {
                resolve({ error: true, code: 6 })
              })
            }).on('error', () => {
              resolve({ error: true, code: 4 })
            })
          } else {
            resolve(2)
          }
        })
        if (window.originalPostMessage) {
          window.postMessage(JSON.stringify(payload))
        } else {
          resolve(3)
        }
      }).catch(() => {
        return 4
      })
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  strict: false
})
