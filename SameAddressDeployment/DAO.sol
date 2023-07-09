// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DAO {
    struct ProposalsList {
        address contractAddress;
        bool isApproved;
        bool isExecuted;
    }

    address public owner;
    ProposalsList[] public proposals;

    constructor() {
        owner = msg.sender;
    }

    function approve(address contractAddress) external {
        require(msg.sender == owner, "not authorized");

        proposals.push(
            ProposalsList({
                contractAddress: contractAddress,
                isApproved: true,
                isExecuted: false
            })
        );
    }

    function executeOperation(uint256 proposalId) external payable {
        ProposalsList storage proposal = proposals[proposalId];
        require(proposal.isApproved, "Proposal not yet approved");
        require(!proposal.isExecuted, "Already executed");

        proposal.isExecuted = true;

        (bool success, ) = proposal.contractAddress.delegatecall(
            abi.encodeWithSignature("operation()")
        );
        require(success, "Failed");
    }
}
