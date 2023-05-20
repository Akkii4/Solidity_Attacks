## Insecure Randomness

Using on chain properties for randomness, e.g.: `block.timestamp`, `blockhash`, and `block.difficulty` are only good for producing pseudo-randomness. 
The problem however, is that Ethereum is entirely deterministic and all available on-chain data is public. Chain attributes can either be predicted or manipulated, and should thus never be used for random number generation.

A common solution is to use an oracle solution such as [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction/).

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
