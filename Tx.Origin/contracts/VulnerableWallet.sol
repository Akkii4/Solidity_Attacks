// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract VulnerableWallet {
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    function transferTo(address payable dest, uint amount) public {
        // FIX : always use msg.sender got authorization
        require(tx.origin == owner, "You aren't the owner");
        dest.transfer(amount);
    }
}
