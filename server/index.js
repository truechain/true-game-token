const Web3 = require('web3true')
const express = require('express')
const bodyParser = require('body-parser')

const trueTokenABI = require('../sol/TrueToken.abi.json')
const TGTokenABI = require('../sol/TrueGameToken.abi.json')
const TTreasureABI = require('../sol/TrueTreasure.abi.json')

const config = require('./config.json')
const pubConfig = require('../config.json')

const tWeb3 = new Web3(config.wsProvider)
const eWeb3 = new Web3(pubConfig.ethnet, 'eth')
const ethTrueAddress = pubConfig.ethTrueAddress.toLowerCase()
const betaTGTAddress = pubConfig.betaTGTAddress
const betaGameAddress = pubConfig.betaGameAddress
const privKey = config.privKey
const topic = tWeb3.eth.abi.encodeEventSignature('SendOut(uint256,address,uint256)')

const trueToken = new eWeb3.eth.Contract(trueTokenABI, ethTrueAddress)
const TGToken = new tWeb3.eth.Contract(TGTokenABI, betaTGTAddress)
const TTGame = new tWeb3.eth.Contract(TTreasureABI, betaGameAddress)
const admin = eWeb3.eth.accounts.privateKeyToAccount(privKey)
eWeb3.eth.accounts.wallet.add(admin)
tWeb3.eth.accounts.wallet.add(admin)

trueToken.methods.name().call().then(name => {
  console.log(`---- Successful link to ${name} contract on ETH`)
})

let sub

let eNonce = 0
function init () {
  console.log('...link to ws service')
  tWeb3.setProvider('wss://api.truescan.net/ws')
  const ws = tWeb3.currentProvider.connection
  ws.onopen = () => {
    if (sub) {
      sub.unsubscribe()
    }
    sub = tWeb3.eth.subscribe('logs', {
      address: betaTGTAddress,
      topics: [topic]
    }, (err, log) => {
      if (err) {
        console.log(err.message || err)
      } else {
        const logID = tWeb3.utils.hexToNumberString(log.topics[1])
        const address = '0x' + log.topics[2].substr(26, 40)
        const value = tWeb3.utils.hexToNumberString(log.data)
        console.log('--------------------------------')
        console.log('id:      ' + logID)
        console.log('address: ' + address)
        console.log('value:   ' + value)
        console.log('--------------------------------')
        sendTrueToken(logID, address, value)
      }
    })
  }
  ws.onclose = () => {
    setTimeout(init, 2000)
  }
}

eWeb3.eth.getTransactionCount(admin.address).then(latest => {
  eNonce = Math.max(latest, eNonce)
  init()
})

setInterval(() => {
  tWeb3.eth.net.getId().catch(() => {
    console.log('---- ping error')
  })
}, 20000)

function sendTrueToken (logID, address, value) {
  trueToken.methods.transfer(address, value).send({
    from: admin.address,
    gas: '200000',
    gasPrice: '10000000000',
    nonce: eNonce++
  }).on('transactionHash', hash => {
    TGToken.methods.updateOutLog(logID, hash).send({
      from: admin.address,
      gas: '4000000',
      gasPrice: '1',
      nonce: nonce++
    })
    console.log('> set hash: ' + hash + ' to log: ' + logID)
  }).on('error', error => {
    console.log(error.message || error)
  })
}

const app = express()
app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  next()
})

app.get('/', (_, res) => {
  res.send('hello world')
})

const pendingTxList = new Set()
let nonce = 0

app.post('/', async (req, res) => {
  const data = req.body
  const hash = data.hash.toLowerCase()
  if (!/^0x[0-9a-f]{64}$/.test(hash)) {
    return res.send(400, 'hash is a necessary parameter')
  }
  pendingTxList.add(hash)
  res.send('ok')
})

app.post('/inviter', async (req, res) => {
  const data = req.body
  const address = data.address
  const code = data.code
  let promise
  if (code) {
    promise = TTGame.methods.setInviter(address, code).send({
      from: admin.address,
      gas: '4000000',
      gasPrice: '1',
      nonce: nonce++
    })
  } else {
    promise = TTGame.methods.genCode(address).send({
      from: admin.address,
      gas: '4000000',
      gasPrice: '1',
      nonce: nonce++
    })
  }
  promise.then(() => {
    res.send('ok')
  }).catch(err => {
    console.log(err.message || err)
    res.send('error')
  })
})

app.post('/query', async (req, res) => {
  const data = req.body
  const address = data.address
  if (!tWeb3.utils.isAddress(address)) {
    return res.send(400, 'address is a necessary parameter')
  }
  const latest = await tWeb3.eth.getTransactionCount(admin.address)
  nonce = Math.max(latest, nonce)
  const balance = await tWeb3.eth.getBalance(address)
  if (Number(balance) < 200000000) {
    console.log(`[Distribution] to ${address}`)
    tWeb3.eth.sendTransaction({
      from: admin.address,
      to: address,
      value: tWeb3.utils.toWei('0.001', 'ether'),
      gas: '21000',
      gasPrice: '1',
      nonce: nonce++
    }).then(() => {
      res.send('ok')
    })
  } else {
    res.send('ok')
  }
})

const ethTopic = eWeb3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)')
const addressTo = '0x000000000000000000000000' + admin.address.substr(2, 40).toLowerCase()
async function checkTxHash (hash, removeList, confirmedBlock) {
  const receipt = await eWeb3.eth.getTransactionReceipt(hash)
  if (!receipt || receipt.blockNumber > confirmedBlock) {
    return
  }
  removeList.push(hash)
  if (receipt.to.toLowerCase() !== ethTrueAddress || !receipt.status || !receipt.logs[0]) {
    return
  }
  const topics = receipt.logs[0].topics
  if (topics[0] !== ethTopic || topics[2] !== addressTo || topics[1] === addressTo) {
    return
  }
  const { owner } = await TGToken.methods.inlogByTxHash(hash).call()
  if (owner !== '0x0000000000000000000000000000000000000000') {
    return
  }
  const from = '0x' + topics[1].substr(26, 40)
  const value = tWeb3.utils.hexToNumberString(receipt.logs[0].data)
  console.log(`[sendIn] to ${from} - ${value}`)
  TGToken.methods.sendIn(from, value, hash).send({
    from: admin.address,
    gas: '4000000',
    gasPrice: '1',
    nonce: nonce++
  })
  const balance = await tWeb3.eth.getBalance(from)
  if (Number(balance) < 200000000) {
    console.log(`[Distribution] to ${from}`)
    tWeb3.eth.sendTransaction({
      from: admin.address,
      to: from,
      value: tWeb3.utils.toWei('0.001', 'ether'),
      gas: '21000',
      gasPrice: '1',
      nonce: nonce++
    })
  }
}
async function checkTxList () {
  const before = pendingTxList.size
  const removeList = []
  const promiseList = []
  const blockNumber = await eWeb3.eth.getBlockNumber()
  const latest = await tWeb3.eth.getTransactionCount(admin.address)
  nonce = Math.max(latest, nonce)
  pendingTxList.forEach(hash => {
    promiseList.push(checkTxHash(hash, removeList, blockNumber - 12))
  })
  Promise.all(promiseList).catch(err => {
    console.log(err.message || err)
  }).then(() => {
    removeList.forEach(hash => pendingTxList.delete(hash))
    if (before && before !== pendingTxList.size) {
      console.log(`>> pending tx: ${before} -> ${pendingTxList.size}`)
    }
    setTimeout(checkTxList, 10000)
  })
}
checkTxList()

tWeb3.eth.getTransactionCount(admin.address).then(latest => {
  nonce = Math.max(latest, nonce)
  app.listen(config.port)
  console.log('---- Service start')
})
