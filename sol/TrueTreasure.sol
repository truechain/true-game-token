pragma solidity ^0.5.0;

interface TrueGameToken {
  function transfer(address _to, uint256 _value) external returns (bool success);
  function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
}

contract TrueTreasure {

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

  function award (uint256 _index) public {
    require(msg.sender == founder);
    require(winner[_index] == address(0) && finalRandomSeed[_index] != bytes32(0));
    uint256 total = totalBettings(_index);
    uint256 winnerID =  uint256(finalRandomSeed[_index]) % total;
    winner[_index] = gameboard[_index][winnerID];
    uint256 value = total * 800 finney;
    TGB.transfer(winner[_index], value);
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

  function setInviter (address _inviter) public {
    require(inviterOf[msg.sender] == address(0));
    inviterOf[msg.sender] = _inviter;
    _friends[_inviter].push(msg.sender);
    _friendsTime[_inviter].push(now);
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
    _randomSeed = keccak256(abi.encodePacked(_randomSeed, msg.sender, now, gameIndexNow));
    if (now > endTime[gameIndexNow]) {
      _nextGame();
    }
    if (TGB.transferFrom(msg.sender, address(this), _count * 1 ether)) {
      for (uint256 i = 0; i < _count; i++) {
        gameboard[gameIndexNow].push(msg.sender);
      }
      bettings[gameIndexNow][msg.sender] += _count;
      _reward(msg.sender, _count);
    }
  }

  function _nextGame () private {
    finalRandomSeed[gameIndexNow] = _randomSeed;
    gameIndexNow++;
    endTime[gameIndexNow] = now + interval;
  }

  function _reward (address _user, uint256 _count) private {
    address inviter = inviterOf[_user];
    if (inviter == address(0)) {
      TGB.transfer(founder, _count * 200 finney);
    } else {
      TGB.transfer(founder, _count * 50 finney);
      TGB.transfer(inviter, _count * 150 finney);
    }
  }
}
