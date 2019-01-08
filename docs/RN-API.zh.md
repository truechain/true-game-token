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
    }
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