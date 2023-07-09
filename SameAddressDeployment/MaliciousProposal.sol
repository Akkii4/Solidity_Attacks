// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MaliciousProposal {
    event Attacked(string res);

    address public owner;

    function runOperation() external {
        emit Attacked("DAO is compromised");
        // can execute any malicious code like...
        owner = msg.sender;
    }
}
