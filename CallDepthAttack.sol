// SPDX-License-Identifier: MIT

/**
In EVM, there is a stack depth limit of 1024 i.e. During the execution of a transaction, one can only have 1024 nested calls. 
Reaching the limit, the last call will fail, but it won't throw an error, instead it will just return false.

Attacker exploit process:

1. The attacker creates a contract that calls the `bid()` function on the Auction contract recursively, increasing the stack depth each time.

2. The attacker ensures that the stack depth reaches 1023 (just one short of the limit) before calling the `bid()` function for the final time.

3. As a result, when the `send()` function is called inside the `bid()` function, it increases the stack depth to 1024, which is the limit.

4. Because of the stack depth limit, the `send()` function fails, but it doesn't throw an error. Instead, it just returns false.

5. The Auction contract doesn't check the return value of the `send()` function, so it doesn't realize that the call has failed. As a result, 
it continues to execute the rest of the `bid()` function: it updates the `highestBidder` and `highestBid` variables to reflect the new bid.

In this way, the attacker becomes the highest bidder without the previous highest bidder being refunded. the previous bidder loses their funds.

The EIP-150 upgrade addressed this vulnerability by changing the gas rules of the Ethereum Virtual Machine (EVM). 
After this upgrade, it became much more difficult (but not impossible) to reach the stack depth limit, making the Call Depth Attack largely unfeasible. 
However, the best practice is still to always check the return value of `send()` and similar functions to ensure they have executed successfully.
*/

pragma solidity ^0.8.19;

contract VulnerableAuction {
    address public highestBidder;
    uint256 public highestBid;

    function bid() external payable {
        require(msg.value > highestBid, "Insufficient Bid");

        if (highestBidder != address(0)) payable(highestBidder).send(highestBid); // refund previous bidder it's bid
        
        highestBidder = msg.sender;
        highestBid = msg.value;
    }
}

