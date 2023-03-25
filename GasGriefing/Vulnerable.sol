// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/** The relayer contract is the vulnerable contract, the smart contract tries to call the execute() function of the Target smart contract. 
As there is no check of the remaining gas nor the result of the call, the function continues its execution without any problem. 
This behavior can cause a serious impact on the application logic.
**/
contract Relayer {
    function relay(Target target) public returns (bool) {
        (bool success, ) = address(target).call(
            abi.encodeWithSignature("execute()")
        );
        return success;
    }
}

contract Target {
    bool public result = false;

    function execute() public {
        uint j = 0;
        for (uint i; i < 100; i++) {
            j++;
        }
        result = true;
    }

    function setresult(bool v) public {
        result = v;
    }
}
