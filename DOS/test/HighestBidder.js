const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Denial of Service", function () {
  it("After being declared the winner, Attack.sol should not allow anyone else to become the winner", async function () {
    // Deploy the highestBidder contract
    const HighestBidder = await ethers.getContractFactory("HighestBidder");
    const highestBidderContract = await HighestBidder.deploy();
    await highestBidderContract.deployed();

    // Deploy the Attack contract
    const Attack = await ethers.getContractFactory("Attack");
    const attackContract = await Attack.deploy(highestBidderContract.address);
    await attackContract.deployed();

    // Now let's attack the highestBidder contract
    // Get two addresses
    const [_, addr1, addr2] = await ethers.getSigners();

    // Initially let addr1 become the current winner of the auction
    let tx = await highestBidderContract.connect(addr1).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("1"),
    });
    await tx.wait();

    // Start the attack and make Attack.sol the current winner of the auction
    tx = await attackContract.attack({
      value: ethers.utils.parseEther("3"),
    });
    await tx.wait();

    // Now let's trying making addr2 the current winner of the auction
    tx = await highestBidderContract.connect(addr2).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("4"),
    });
    await tx.wait();

    // Now let's check if the current winner is still attack contract
    expect(await highestBidderContract.currentWinner()).to.equal(
      attackContract.address
    );
  });
});
