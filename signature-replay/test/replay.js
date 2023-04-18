const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { arrayify, parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("SignatureReplay", function () {
  let mockTokenContract;
  let userAddress;
  let attackerAddress;
  let recipientAddress;
  let userTokenContractInstance;
  let transferAmountOfTokens;
  beforeEach(async () => {
    // Deploy the contracts
    const MockTokenFactory = await ethers.getContractFactory("MockToken");
    mockTokenContract = await MockTokenFactory.deploy();
    await mockTokenContract.deployed();

    // Get three addresses, treat one as the user address
    // one as the relayer address, and one as a recipient address
    [_, userAddress, attackerAddress, recipientAddress] =
      await ethers.getSigners();

    // Mint 10,000 tokens to user address (for testing)
    const tokenAmount = parseEther("10000");
    userTokenContractInstance = mockTokenContract.connect(userAddress);
    const mintTxn = await userTokenContractInstance.mint(tokenAmount);
    await mintTxn.wait();

    // Have user sign message to transfer 10 tokens to recipient
    transferAmountOfTokens = parseEther("10");
  });
  it("Attacker does signature replay attack in Vulnerable Contract", async function () {
    const MetaTokenSenderFactory = await ethers.getContractFactory(
      "TokenSenderVulnerable"
    );
    const tokenSenderContract = await MetaTokenSenderFactory.deploy();
    await tokenSenderContract.deployed();

    // Have user infinite approve the token sender contract for transferring 'MockToken'
    const approveTxn = await userTokenContractInstance.approve(
      tokenSenderContract.address,
      BigNumber.from(
        // This is uint256's max value (2^256 - 1) in hex
        // Fun Fact: There are 64 f's in here.
        // In hexadecimal, each digit can represent 4 bits
        // f is the largest digit in hexadecimal (1111 in binary)
        // 4 + 4 = 8 i.e. two hex digits = 1 byte
        // 64 digits = 32 bytes
        // 32 bytes = 256 bits = uint256
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
    );
    await approveTxn.wait();

    const messageHash = await tokenSenderContract.getHash(
      userAddress.address,
      transferAmountOfTokens,
      recipientAddress.address,
      mockTokenContract.address
    );
    const signature = await userAddress.signMessage(arrayify(messageHash));

    // Have the relayer execute the transaction on behalf of the user
    const relayerSenderContractInstance =
      tokenSenderContract.connect(attackerAddress);

    let metaTxn = await relayerSenderContractInstance.transfer(
      userAddress.address,
      transferAmountOfTokens,
      recipientAddress.address,
      mockTokenContract.address,
      signature
    );
    await metaTxn.wait();

    // siganture replay attack
    metaTxn = await relayerSenderContractInstance.transfer(
      userAddress.address,
      transferAmountOfTokens,
      recipientAddress.address,
      mockTokenContract.address,
      signature
    );
    await metaTxn.wait();

    // Check the user's balance decreased, and recipient got 10 tokens
    const userBalance = await mockTokenContract.balanceOf(userAddress.address);
    const recipientBalance = await mockTokenContract.balanceOf(
      recipientAddress.address
    );

    expect(userBalance).to.equal(parseEther("9980"));
    expect(recipientBalance).to.equal(parseEther("20"));
  });
  it("Should not let signature replay happen in Secured Contract", async function () {
    const MetaTokenSenderFactory = await ethers.getContractFactory(
      "TokenSenderSecured"
    );
    const tokenSenderContract = await MetaTokenSenderFactory.deploy();
    await tokenSenderContract.deployed();

    // Have user infinite approve the token sender contract for transferring 'RandomToken'
    const approveTxn = await userTokenContractInstance.approve(
      tokenSenderContract.address,
      BigNumber.from(
        // This is uint256's max value (2^256 - 1) in hex
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
    );
    await approveTxn.wait();

    // Have user sign message to transfer 10 tokens to recipient
    let nonce = 1;

    const transferAmountOfTokens = parseEther("10");
    const messageHash = await tokenSenderContract.getHash(
      userAddress.address,
      transferAmountOfTokens,
      recipientAddress.address,
      mockTokenContract.address,
      nonce
    );
    const signature = await userAddress.signMessage(arrayify(messageHash));

    // Have the relayer execute the transaction on behalf of the user
    const relayerSenderContractInstance =
      tokenSenderContract.connect(attackerAddress);
    const metaTxn = await relayerSenderContractInstance.transfer(
      userAddress.address,
      transferAmountOfTokens,
      recipientAddress.address,
      mockTokenContract.address,
      nonce,
      signature
    );
    await metaTxn.wait();

    // Have the relayer attempt to execute the same transaction again with the same signature
    // This time, we expect the transaction to be reverted because the signature has already been used.
    expect(
      relayerSenderContractInstance.transfer(
        userAddress.address,
        transferAmountOfTokens,
        recipientAddress.address,
        mockTokenContract.address,
        nonce,
        signature
      )
    ).to.be.revertedWith("Already executed!");
  });
});
