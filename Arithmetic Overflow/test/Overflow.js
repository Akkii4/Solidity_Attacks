const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Overflow", () => {
  let contract;

  beforeEach(async () => {
    const Overflow = await ethers.getContractFactory("Overflow");
    contract = await Overflow.deploy();
  });

  describe("uint8", () => {
    it("resets the value after 255", async () => {
      // Increment once
      await contract.incrementMyUint8();
      expect(await contract.myUint8()).to.equal(255);
      // Increment gain, Observe overflow back to 0
      await contract.incrementMyUint8();
      expect(await contract.myUint8()).to.equal(0);
    });
  });

  describe("uint16", () => {
    it("resets the value after 2 ^ 16", async () => {
      // Increment once
      await contract.incrementMyUint16();
      expect(await contract.myUint16()).to.equal(2 ** 16 - 1);
      // Increment again, Observe overflow back to 0
      await contract.incrementMyUint16();
      expect(await contract.myUint16()).to.equal(0);
    });
  });

  describe("uint256", () => {
    it("resets the value after 2 ^ 256", async () => {
      // Increment once
      await contract.incrementMyUint256();
      // Increment again, Observe overflow back to 0
      await contract.incrementMyUint256();
      expect(await contract.myUint256()).to.equal(0);
    });
  });

  describe("uint", () => {
    it("resets the value after 2 ^ 256", async () => {
      // Increment once
      await contract.incrementMyUint();
      // Increment again, Observe overflow back to 0
      await contract.incrementMyUint();
      expect(await contract.myUint()).to.equal(0);
    });
  });
});
