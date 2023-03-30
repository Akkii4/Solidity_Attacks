const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("delegatecall Attack", function () {
  it("Should change the owner of the HackMe contract", async function () {
    // Deploy the lib contract
    const Lib = await ethers.getContractFactory("Lib");
    const libContract = await Lib.deploy();
    await libContract.deployed();

    // Deploy the hackMe contract
    const HackMe = await ethers.getContractFactory("HackMe");
    const hackMeContract = await HackMe.deploy(libContract.address);
    await hackMeContract.deployed();
    console.log("HackMe Contract's Address:", hackMeContract.address);

    // Deploy the Attack contract
    const Attack = await ethers.getContractFactory("Attack");
    const attackContract = await Attack.deploy(hackMeContract.address);
    await attackContract.deployed();
    console.log("Attack Contract's Address:", attackContract.address);

    // Now let's attack the lib contract

    // Start the attack
    let tx = await attackContract.attack();
    await tx.wait();

    expect(await hackMeContract.owner()).to.equal(attackContract.address);
  });
});
