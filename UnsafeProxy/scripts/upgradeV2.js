const { ethers, upgrades } = require("hardhat");

const PROXY = "0xF9650a1ae00f77005102a1af0A3f0f1E996c8da6";

async function main() {
  const UnsafeV2 = await ethers.getContractFactory("UnsafeV2");
  console.log("Upgrading Unsafe V2...");
  await upgrades.upgradeProxy(PROXY, UnsafeV2, {
    constructorArgs: [111],
  });
  console.log("Unsafe V2 upgraded");
}

main();
