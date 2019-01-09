pragma solidity ^0.5.0;

interface TrueGameToken {
  function transfer(address _to, uint256 _value) external returns (bool success);
  function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
}

contract TrueTreasure {

  struct BetRecord {
    uint256 value;
    uint256 index;
    uint256 startNumber;
    uint256 endNumber;
    uint256 time;
  }
  struct IncomeRecord {
    uint256 value;
    uint256 index;
    uint256 number;
    uint256 time;
  }

  address payable founder;
  TrueGameToken public TGB;
  uint256 public interval = 1 hours;
  uint256 public gameIndexNow;
  mapping (uint256 => uint256) public endTime;

  bytes32 private _randomSeed;
  mapping (uint256 => bytes32) public finalRandomSeed;
  mapping (uint256 => address) public winner;

  mapping (address => address) public inviterOf;
  mapping (address => address[]) private _friends;
  mapping (address => uint256[]) private _friendsTime;

  mapping (address => BetRecord[]) private _betRecords;

  mapping (address => IncomeRecord[]) private _incomeRecords;

  mapping (address => uint256) public totalAward;
  mapping (address => uint256) public totalReward;

  mapping (bytes3 => address) public invitationCode;

  constructor (TrueGameToken _trueGameToken) public {
    founder = msg.sender;
    TGB = _trueGameToken;
    endTime[0] = now + interval;
    _randomSeed = keccak256(abi.encodePacked(msg.sender, _trueGameToken));
  }

  mapping (uint256 => address[]) public gameboard;
  mapping (uint256 => mapping (address => uint256)) public bettings;
  function totalBettings (uint256 _index) public view returns (uint256) {
    return gameboard[_index].length;
  }

  function setInterval (uint256 _interval) public {
    require(msg.sender == founder);
    interval = _interval;
  }

  function getGameInfo (uint256 _index) public view returns (
    uint256 gameEndTime,
    uint256 gameBettings,
    address gameWinner
  ) {
    gameEndTime = endTime[_index];
    gameBettings = totalBettings(_index);
    gameWinner = winner[_index];
  }

  function setInviter (bytes3 _icode) public {
    address inviter = invitationCode[_icode];
    require(inviter != address(0));
    require(inviterOf[msg.sender] == address(0));
    inviterOf[msg.sender] = inviter;
    _friends[inviter].push(msg.sender);
    _friendsTime[inviter].push(now);
  }

  function betRecords (address _user) public view returns (
    uint256 count,
    uint256[] memory values,
    uint256[] memory indexs,
    uint256[] memory startNumbers,
    uint256[] memory endNumbers,
    uint256[] memory times
  ) {
    count = _betRecords[_user].length;
    values = new uint256[](count);
    indexs = new uint256[](count);
    startNumbers = new uint256[](count);
    endNumbers = new uint256[](count);
    times = new uint256[](count);
    for (uint256 i = 0; i < count; i++) {
      BetRecord storage record = _betRecords[_user][count - 1 - i];
      values[i] = record.value;
      indexs[i] = record.index;
      startNumbers[i] = record.startNumber;
      endNumbers[i] = record.endNumber;
      times[i] = record.time;
    }
  }

  function incomeRecords (address _user) public view returns (
    uint256 count,
    uint256[] memory values,
    uint256[] memory indexs,
    uint256[] memory numbers,
    uint256[] memory times
  ) {
    count = _incomeRecords[_user].length;
    values = new uint256[](count);
    indexs = new uint256[](count);
    numbers = new uint256[](count);
    times = new uint256[](count);
    for (uint256 i = 0; i < count; i++) {
      IncomeRecord storage record = _incomeRecords[_user][count - 1 - i];
      values[i] = record.value;
      indexs[i] = record.index;
      numbers[i] = record.number;
      times[i] = record.time;
    }
  }

  function getFriends (address _user) public view returns (
    uint256 friendsCount,
    address[] memory friends,
    uint256[] memory times
  ) {
    friendsCount = _friends[_user].length;
    uint256 length = friendsCount < 10 ? friendsCount : 10;
    friends = new address[](length);
    times = new uint256[](length);
    for (uint256 i = 0; i < length; i++) {
      friends[i] = _friends[_user][friendsCount - 1 - i];
      times[i] = _friendsTime[_user][friendsCount - 1 - i];
    }
  }

  function bet (uint256 _count) public {
    bytes3 iCode = bytes3(bytes20(msg.sender));
    invitationCode[iCode] = msg.sender;
    _randomSeed = keccak256(abi.encodePacked(_randomSeed, msg.sender, now, gameIndexNow));
    if (now > endTime[gameIndexNow]) {
      _nextGame();
    }
    if (TGB.transferFrom(msg.sender, address(this), _count * 1 ether)) {
      uint256 start = gameboard[gameIndexNow].length;
      for (uint256 i = 0; i < _count; i++) {
        gameboard[gameIndexNow].push(msg.sender);
      }
      _betRecords[msg.sender].push(BetRecord({
        value: _count * 1 ether,
        index: gameIndexNow,
        startNumber: start + 1,
        endNumber: start + _count,
        time: now
      }));
      bettings[gameIndexNow][msg.sender] += _count;
      _reward(msg.sender, _count);
    }
  }

  function _nextGame () private {
    finalRandomSeed[gameIndexNow] = _randomSeed;
    _autoAward(gameIndexNow);
    gameIndexNow++;
    endTime[gameIndexNow] = now + interval;
  }

  function _autoAward (uint256 _index) public {
    if (winner[_index] == address(0) && finalRandomSeed[_index] != bytes32(0)) {
      uint256 total = totalBettings(_index);
      uint256 winnerID =  uint256(finalRandomSeed[_index]) % total;
      address winnerAdr = gameboard[_index][winnerID];
      winner[_index] = winnerAdr;
      uint256 value = total * 800 finney;
      totalAward[winnerAdr] += value;
      _incomeRecords[winnerAdr].push(IncomeRecord({
        value: value,
        index: gameIndexNow,
        number: winnerID,
        time: now
      }));
      TGB.transfer(winnerAdr, value);
    }
  }

  function _reward (address _user, uint256 _count) private {
    address inviter = inviterOf[_user];
    if (inviter == address(0)) {
      TGB.transfer(founder, _count * 200 finney);
    } else {
      TGB.transfer(founder, _count * 50 finney);
      uint256 value = _count * 150 finney;
      totalReward[inviter] += value;
      _incomeRecords[inviter].push(IncomeRecord({
        value: value,
        index: gameIndexNow,
        number: 0,
        time: now
      }));
      TGB.transfer(inviter, value);
    }
  }
}
