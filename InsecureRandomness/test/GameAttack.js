const { ethers, waffle } = require("hardhat");
const { expect } = require("chai");
const { BigNumber, utils } = require("ethers");

describe("Attack", function () {
  it("Should be able to guess the exact number", async function () {
    // Deploy the GuessingGame contract
    const GuessingGame = await ethers.getContractFactory("GuessingGame");
    const game = await GuessingGame.deploy({ value: utils.parseEther("0.1") });
    await game.deployed();

    // Deploy the attack contract
    const Attack = await ethers.getContractFactory("Attack");
    const attack = await Attack.deploy(game.address);

    // Attack the GuessingGame contract
    const tx = await attack.attack();
    await tx.wait();

    const balanceGame = await game.getBalance();
    // Balance of the GuessingGame contract should be 0
    expect(balanceGame).to.equal(BigNumber.from("0"));
  });
});
