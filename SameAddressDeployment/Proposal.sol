// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Proposal {
    event ProposalSucceed(string res);

    address public owner;

    function runOperation() external {
        emit ProposalSucceed("Fair proposal executed");
        // rest of the fair code
    }

    function thatsHowItsAttacked() external {
        selfdestruct(payable(msg.sender));
    }
}
