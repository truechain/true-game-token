<template>
  <div class="intro card">
    <h2>游戏介绍</h2>
    <p>初链夺宝是一个完全公正、透明的去中心化DApp游戏，用户通过买入游戏号码，就有可能夺得最终游戏大奖。所有游戏交易均上链，可以通过区块浏览器查看所有详细记录。</p>
    <h3>规则说明</h3>
    <p>1.每购买1个号码只需要1个TGB，号码按购买顺序分配。</p>
    <p>2.每轮的游戏号码总数为N，则号码为1，2，....，N-1。</p>
    <p>3.游戏中存在一个不可直接查询的随机数种S，每次用户操作都会更新从而使其具有高度的不确定性。每一轮结束时根据总的游戏号码数M，计算X = mod(S, M)即为中奖号码，号码为 X 的购买者即为中奖者。</p>
    <p>4.奖池的80%分配给中奖者；奖池的15%作为推广费用按比例分配给本期购买人的邀请人；5%分配为运营费用。</p>
    <p>5.邀请好友参与游戏，可获得邀请人下注金额15%的佣金奖励。</p>
    <p>6.整个过程由智能合约计算并自动完成派奖。</p>
    <p>本游戏解释权归游戏产品团队！</p>
    <h3>帮助介绍</h3>
    <p>1.TGB是什么？</p>
    <p>TGB用于在玩游中使用道具，价值等同于代币TREU，1TGB=1TRUE。</p>
    <p>2.为什么需要TGB？</p>
    <p>因使用ETH网络的代币进行游戏，将会产生高额的矿工费用和很慢的交易处理速度，严重影响用户的游戏体验；为了用户有很好的游戏体验，我们提供的TGB是运行在第三代区块链技术的初链网络中，既解决游戏中的交易处理速度问题，又可以让游戏公平、公正。用户在游戏里买入份额不会产生任何费用。</p>
    <p>3.如何兑换TGB？</p>
    <p>用户可用TRUE兑入为TGB，也可以反过来将TGB兑出为TRUE，兑换过程会产生ETH网络的矿工费，游戏平台不收取任何费用。</p>
    <p>4.游戏中每次操作是否都要花费手续费？</p>
    <p>在区块链上的任何更改操作都需要花费手续费，但是在初链网络中手续费的成本远低于ETH网络。同时在用户进行TGB兑换时，我们会自动检测初链网络上的账户余额，并且赠送足以承担数万次操作的数字资产。</p>
    <p>5.如何邀请好友？</p>
    <p>玩家至少要在游戏中进行一次操作或者手动登记自己的邀请码后，才能生成可以分享的邀请码。同时填写了他人的邀请码后，相应的邀请人可以获得被邀请人15%的投注收益。</p>
  </div>
</template>

<script>
export default {
  name: 'Intro'
}
</script>

<style lang="stylus" scoped>
.intro
  font-size 14px
  margin 16px 16px 100px
  color #fff
h2
  text-align center
  font-size 18px
  line-height 50px
  font-weight 500
  margin 20px auto
  background-color #3e7be4
  box-shadow 0 2px 4px #3972da inset
  display table
  padding 0 3em
  border-radius 25px
h3
  margin-top 28px
  font-size 16px
  font-weight 500
p
  margin 8px 0
</style>
