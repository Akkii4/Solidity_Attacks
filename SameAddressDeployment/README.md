## Deploying Different Smart Contracts to the Same Address

Similarly Tornado Cash was also attacked.

### Steps to re-produce attack

Steps :

1. Suppose DAO contract is deployed by a protocol.
2. Whereas an Attacker deploys MainFactory.
3. MainFactory contract can further deploys ProposalFactory contract.
4. and through ProposalFactory, Proposal contract can be deployed.
5. Now the protocol owner can approve this Proposal to be listed on DAO.

6. When attacker selfdestruct this Proposal contract along with ProposalFactory.
7. Redeploys ProposalFactory and now deploys MaliciousProposal at the same address to that of previous Proposal.
8. Now attacker runs executeOperation in DAO , which in turn executes runOperation function of MaliciousProposal and making attacker DAO's owner.

### Attack vector explained

- To be deployed contract address is calculated by taking last 20 bytes of sha3(rlp_encode(deployerAddress, nonce)) where nonce is the transactions counter of deployer.

- Thus different contract address can be deployed over same address if deployer contract's nonce remains same/resets.

- Self destructing the contract lets them reset the nonce to 0 resulting in generation of same address.

- create2 in MainFactory helps deploy deterministic address (needs sender address, salt and bytecode of deploying contract) for deploying new ProposalFactory to same address.
