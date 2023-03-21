# Reentrancy Vulnerability Solidity

This project demonstrates a vulnerability in solidity smart contract called Reentrancy.
Re-Entrancy is the vulnerability in which if Contract A calls a function in Contract B, Contract B can then call back into Contract A while Contract A is still processing.

EthBank is a contract where you can deposit and withdraw ETH.
This contract is vulnerable to re-entrancy attack.
Let's see why.

1. Deploy EthBank
2. Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into EthBank
3. Deploy Attacker with address of EthBank
4. Call Attacker.attack sending 1 ether (using Account 3 (Eve)).
   You will get 3 Ethers back (2 Ether stolen from Alice and Bob,
   plus 1 Ether sent from this contract).

What happened?
Attacker was able to call EthBank.withdraw multiple times before
EthBank.withdraw finished executing.

Here is how the functions were called

- Attacker.attack
- EthBank.deposit
- EthBank.withdraw
- Attacker fallback (receives 1 Ether)
- EthBank.withdraw
- Attacker.fallback (receives 1 Ether)
- EthBank.withdraw
- Attacker fallback (receives 1 Ether)

```shell
npx hardhat test
```
