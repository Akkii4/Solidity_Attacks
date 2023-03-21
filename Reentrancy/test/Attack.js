const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", function () {
  it("Should empty the balance of the ethBank contract", async function () {
    // Deploy the ethBank contract
    const ethBankFactory = await ethers.getContractFactory("EthBank");
    const ethBank = await ethBankFactory.deploy();
    await ethBank.deployed();

    //Deploy the attacker contract
    const attackerFactory = await ethers.getContractFactory("Attacker");
    const attacker = await attackerFactory.deploy(ethBank.address);
    await attacker.deployed();

    // Get two addresses, treat one as innocent user and one as attacker
    const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

    // Innocent User deposits 10 ETH into EthBank
    let tx = await ethBank.connect(innocentAddress).deposit({
      value: parseEther("10"),
    });
    await tx.wait();

    // Check that at this point the EthBank's balance is 10 ETH
    let balanceETH = await ethers.provider.getBalance(ethBank.address);
    expect(balanceETH).to.equal(parseEther("10"));

    // Attacker calls the `attack` function on Attacker Contract
    // and sends 1 ETH
    tx = await attacker.connect(attackerAddress).attack({
      value: parseEther("1"),
    });
    await tx.wait();

    // Balance of the EthBank's address is now zero
    balanceETH = await ethers.provider.getBalance(ethBank.address);
    expect(balanceETH).to.equal(BigNumber.from("0"));

    // Balance of Attacker Contract is now 11 ETH (10 ETH stolen + 1 ETH from attacker)
    balanceETH = await ethers.provider.getBalance(attacker.address);
    expect(balanceETH).to.equal(parseEther("11"));
  });
});
