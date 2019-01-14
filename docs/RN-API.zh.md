# RN框架内Web端游戏-移动端应用通讯接口说明

> 所有接口通过`postMessage`方法单向传递。参数中均包含`timestamp`字段指明请求发起时的时间戳，和请求的其他参数一起通过格式化的JSON字符串传递。

## 请求接口

### 获取当前使用的账户地址
#### 发起
```js
{
  timestamp: new Date().getTime(),
  method: 'get_account'
}
```

#### 返回
```js
{
  timestamp: timestamp,
  method: 'get_account',
  data: {
    // ok字段为false时不需要其他参数,可选附带message
    ok: true,
    address: '0x1234...'
  }
}
```

### 签名指定交易
#### 发起
```js
{
  timestamp: new Date().getTime(),
  method: 'get_signedTx',
  data: {
    from: '0x123...',
    tx: {
      to: '0x123...',
      value: 0,
      input: '0x123...',
      nonce: 0,
      gas: 21000,
      gasPrice: 1,
      chainId: 123
    },
    message: '交易的内容说明，会展示给用户'
  }
}
```

#### 返回
```js
{
  timestamp: timestamp,
  method: 'get_signedTx',
  data: {
    // ok字段为false时不需要其他参数,可选附带message
    ok: true,
    rawTx: '0x123456...'
  }
}
```

## 例子

### 初始化

在钱包环境中必须等待加载完成才可以使用`postMessage`方法通信，在加载完成时会收到`onload`信息，应当在接收到消息后初始化所有通信事件。

```js
document.addEventListener('message', (e) {
  if (e.data === 'onload') {
    init()
  }
})
```

### 获取当前使用账户

```js
// 发送请求
const payload = {
  timestamp: new Date().getTime(),
  method: 'get_account'
}
window.postMessage(JSON.stringify(payload))

// 监听返回信息
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
  if (res.timestamp === payload.timestamp) {
    console.log(res.data.address)
  }
})
```