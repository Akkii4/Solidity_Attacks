// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Overflow {
    uint8 public myUint8 = 254;
    uint16 public myUint16 = (2 ** 16) - 2;
    uint256 public myUint256 = (2 ** 256) - 2;
    uint public myUint = (2 ** 256) - 2;

    function incrementMyUint8() public returns (bool success) {
        unchecked {
            myUint8++;
        }
        return true;
    }

    function incrementMyUint16() public returns (bool success) {
        unchecked {
            myUint16++;
        }
        return true;
    }

    function incrementMyUint256() public returns (bool success) {
        unchecked {
            myUint256++;
        }
        return true;
    }

    function incrementMyUint() public returns (bool success) {
        unchecked {
            myUint++;
        }
        return true;
    }
}
