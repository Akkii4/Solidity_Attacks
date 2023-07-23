# Insecure Randomness

Using on chain properties for randomness, e.g.: `block.timestamp`, `blockhash`, and `block.difficulty` are only good for producing pseudo-randomness. 
The problem however, is that Ethereum is entirely deterministic and all available on-chain data is public. Chain attributes can either be predicted or manipulated, and should thus never be used for random number generation.

## Possible Solutions

### 1. Commit-Reveal Scheme 

This uses future blockhashes which are unpredictable.

1. User commits to using the hash of a future block (e.g. block 12345). 

2. When block 12345 is mined, its hash is now known.

3. User reveals the commit and the blockhash is used as the random number.

But miners could manipulate the block hash in terms of their favour.

To prevent manipulation, the user commits to a hash of a secret number instead of the block number. 

Later they reveal their secret number. The secret + blockhash are combined to generate the final random number.

Now that Ethereum has moved to proof of stake, this attack is harder to pull off, because the malicious producer must be the block producer at the exact block of the reveal.

### Vulnerabilities

Commit-reveal has some weaknesses:

- Miners could censor reveal transactions if the random number is unfavorable to them.

- Miners could still manipulate the scheme by choosing their own secret number.

- Randomness could be biased if user repeats until they get a favorable outcome.
  
- Miners could DOS the network such that the exact exact block of the reveal can be manipulated to the one in which they becomes the block producer
  
### 2. Chainlink VRF

This uses Chainlink as a source of verified randomness.

1. Contract requests random number from Chainlink.

2. Chainlink will callback later with a cryptographically proven random number. 

3. User doesn't have to manage the process.

Downsides are needing to pay LINK fees and waiting for the callback. 

But the randomness is tamper-proof.

### 3. Offchain Signature Scheme

An offchain oracle signs a random number + block number. 

The contract verifies the signature is valid.

The random number is combined with a future blockhash to derive a final random number.

Provides fast unbiased randomness. But relies on a trusted oracle.
