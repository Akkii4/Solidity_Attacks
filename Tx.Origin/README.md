# tx.origin vulerability

VulnerableWallet is a simple contract where only the owner should be able to transfer
Ether to another address. VulnerableWallet.transfer() uses tx.origin to check that the
caller is the owner. Let's see how we can hack this contract

1. InnocentUser deploys VulnerableWallet with 10 Ether
2. Attacker deploys AttackWallet with the address of InnocentUser's VulnerableWallet contract.
3. Attacker tricks InnocentUser to transfer any small amount to the AttackWallet contract.
4. Attacker successfully stole Ether from InnocentUser's VulnerableWallet

What happened?
InnocentUser was tricked into sending random amount into AttackWallet. Inside AttackWallet, ether recieve function it
requested a transfer of all funds in VulnerableWallet contract to Attacker's address.
Since tx.origin in VulnerableWallet.transferTo() is equal to InnocentUser's address,
it initiated the transaction by sending eth. The AttackWallet transferred all Ether to Attacker.

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
```
