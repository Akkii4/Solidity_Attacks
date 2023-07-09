// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ProposalFactory.sol";

contract MainFactory {
    event ProposalFactoryDeployed(address contractAddress);

    function deployProposalFactory() external {
        bytes32 salt = keccak256(abi.encode("random"));
        address _contractAddr = address(new ProposalFactory{salt: salt}());
        emit ProposalFactoryDeployed(_contractAddr);
    }
}
