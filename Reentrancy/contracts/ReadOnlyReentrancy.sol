// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ReadOnlyVulnerable {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        uint bal = balances[msg.sender];
        require(_isEnoughToWithdraw(msg.sender, _amount), "Not enough");  // vulnerable here

        (bool sent, ) = payable(msg.sender).call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] -= _amount;
    }

   function _isEnoughToWithdraw(address user, uint256 amount) internal view returns (bool){
        return balances[user] >= amount;
   }
}
