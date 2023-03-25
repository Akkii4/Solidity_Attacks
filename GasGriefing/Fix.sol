// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/**
In the first part of the solution, the developer needs to estimate the amount of gas that will be required by the call to correctly work. 
In addition, he needs to maximize that value to avoid at best the rise in gas in the future. 
*/
contract Relayer {
    uint public estimatedGasValue = 1000000; //amount of gas required by the call() function to correctly execute the Target smart contract function
    uint public gasNeededBetweenCalls = 5000; // estimated gas cost between each call to Target contract

    function relay(Target target) public returns (bool) {
        uint256 gasAvailable = gasleft() - gasNeededBetweenCalls;
        //only 63/64th of the gas can be forwarded in a message call, and remaining remains to the callee smart contract
        // to allow the caller smart contract to finish its execution after that call finishes.
        require(
            (gasAvailable * 63) / 64 >= estimatedGasValue,
            "not enough gas provided"
        );
        (bool success, ) = address(target).call(
            abi.encodeWithSignature("execute()", estimatedGasValue)
        );
        // here you need to check if the object or the value you are trying to change or create was succesfuly made.
        assert(success);
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

/**
To enhance this solution, you can add functions to set the value of estimatedGasValue and gasNeededBetweenCalls as those values may change over time.
This solution is not perfect, as if the gas cost gets higher with time, the solution may fail. 
The best way to deal with this problem is by giving the EVM the ability to calculate the required gas for each call and revert the transaction if it is not sufficient. 
*/
