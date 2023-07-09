// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Proposal.sol";
import "./MaliciousProposal.sol";

contract ProposalFactory {
    event NewProposalDeployed(address contractAddress);

    function deployProposal() external {
        address contractAddress = address(new Proposal());
        emit NewProposalDeployed(contractAddress);
    }

    function deployMaliciousProposal() external {
        address contractAddress = address(new MaliciousProposal());
        emit NewProposalDeployed(contractAddress);
    }

    function attackerMagicSpell() external {
        selfdestruct(payable(msg.sender));
    }
}
