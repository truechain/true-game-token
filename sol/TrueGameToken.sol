pragma solidity ^0.5.0;

library SafeMath {
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
  }
}

contract TrueGameToken {
  using SafeMath for uint256;

  struct Log {
    address user;
    uint256 value;
    bytes32 txHash;
    uint256 time;
  }

  string public constant name = "True Game Token";
  string public constant symbol = "TGT";
  uint256 public constant decimals = 18;
  uint256 private _totalSupply;
  address payable public founder;
  uint256 public charge;

  mapping (address => uint256) private _balances;
  mapping (address => mapping (address => uint256)) _allowed;

  mapping (bytes32 => Log) private _inLog;
  mapping (address => bytes32[]) private _usersInLog;
  Log[] private _outLog;
  mapping (address => uint256[]) private _usersOutLog;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
  event SendOut(uint256 indexed _logID, address indexed _owner, uint256 _value);

  constructor() public { 
    founder = msg.sender;
  }

  function setCharge (uint256 _charge) public {
    require(msg.sender == founder);
    charge = _charge;
  }

  function sendIn(address _to, uint256 _amount, bytes32 _txHash) public {
    require(msg.sender == founder);
    require(_inLog[_txHash].user == address(0));

    _totalSupply = _totalSupply.add(_amount);
    _balances[_to] = _balances[_to].add(_amount);

    _inLog[_txHash] = Log({
      user: _to,
      value: _amount,
      txHash: _txHash,
      time: now
    });
    _usersInLog[_to].push(_txHash);
  }

  function sendOut(uint256 _value) public {
    require(_value > charge);
    require(_balances[msg.sender] >= _value);
    _value -= charge;
    _balances[msg.sender] -= _value;
    _totalSupply -= _value;

    uint256 index = _outLog.length;
    _outLog.push(Log({
      user: msg.sender,
      value: _value,
      txHash: bytes32(0),
      time: now
    }));
    _usersOutLog[msg.sender].push(index);

    emit SendOut(index, msg.sender, _value);
  }

  function updateOutLog (uint256 _logID, bytes32 _hash) public {
    require(msg.sender == founder);
    _outLog[_logID].txHash = _hash;
    _outLog[_logID].time = now;
  }

  function inlogByTxHash(bytes32 _hash) public view returns (address owner, uint256 value) {
    Log storage log = _inLog[_hash];
    return (log.user, log.value);
  }

  function inLogCount (address _user) public view returns (uint256 count) {
    return _usersInLog[_user].length;
  }
  function inLogPaged (address _user, uint256 _page, uint256 _size) public view returns (
    uint256 count,
    uint256[] memory value,
    bytes32[] memory txHash
  ) {
    require(_size <= 50);
    count = _usersInLog[_user].length;
    value = new uint256[](_size);
    txHash = new bytes32[](_size);
    bytes32[] storage usersLog = _usersInLog[_user];
    uint256 start = _page * _size;
    for (uint256 i = start; i < usersLog.length; i++) {
      Log storage log = _inLog[usersLog[i]];
      value[i - start] = log.value;
      txHash[i - start] = log.txHash;
    }
  }
  
  function outLogCount (address _user) public view returns (uint256 count) {
    return _usersOutLog[_user].length;
  }
  function outLogPaged (address _user, uint256 _page, uint256 _size) public view returns (
    uint256 count,
    uint256[] memory value,
    bytes32[] memory txHash
  ) {
    require(_size <= 50);
    count = _usersOutLog[_user].length;
    value = new uint256[](_size);
    txHash = new bytes32[](_size);
    uint256[] storage usersLog = _usersOutLog[_user];
    uint256 start = _page * _size;
    for (uint256 i = start; i < usersLog.length; i++) {
      Log storage log = _outLog[usersLog[i]];
      value[i - start] = log.value;
      txHash[i - start] = log.txHash;
    }
  }

  function totalSupply() public view returns (uint256 supply) {
    return _totalSupply;
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    return _balances[_owner];
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require((_balances[msg.sender] >= _value));
    _balances[msg.sender] -= _value;
    _balances[_to] = _balances[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(_balances[_from] >= _value && _allowed[_from][msg.sender] >= _value);
    _balances[_from] -= _value;
    _allowed[_from][msg.sender] -= _value;
    _balances[_to] = _balances[_to].add(_value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    _allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
    return _allowed[_owner][_spender];
  }

  function changeFounder(address payable newFounder) public {
    require(msg.sender == founder);

    founder = newFounder;
  }

  function kill() public {
    require(msg.sender == founder);

    selfdestruct(founder);
  }
}