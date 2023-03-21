// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/*
The Reentrancy Attack vulnerablity in EthBank Contract can be prevented via :

1. ReentrancyGuard
2. Applying Checks-Effects-Interactions method
*/

contract FixedEthBank is ReentrancyGuard {
    mapping(address => uint) public userBalances;

    function deposit() public payable {
        userBalances[msg.sender] += msg.value;
    }

    // FIX: Apply ReentrancyGuard
    function withdraw() public nonReentrant {
        uint bal = userBalances[msg.sender];
        require(bal > 0, "Insufficient balance"); // Check

        // FIX: Apply checks-effects-interactions pattern
        userBalances[msg.sender] = 0; // Effect

        (bool sent, ) = msg.sender.call{value: bal}(""); // Interactions
        require(sent, "Failed to send Ether");
    }

    // Helper function to check the balance of this contract
    function bankBalanceSheet() public view returns (uint) {
        return address(this).balance;
    }
}
