# Denial Of Service Attack

Basically making a smart contract to halt and unusable.


## How DOS attack plays out here 
HighestBidder contract let anyone to become the highest bidder of the contract, if any user sends more Ether than previous highest bidder and thereby transfer backs the previous bidder his Eth bid.

Attack Scenario :
1. Multiple users bid by sending Ether value greater than previous bidder.
2. Malicious user now deploys Attacker contract and bids more than the Highest bidder.
3. After this no further user can place higher bids as HighestBidder contract will unable to transfer Malicious user ether back to Attacker contract as it doesn't have fallback function to receive ether.


 ## Prevention 
 Allow any bidder to withdras there bid Ether instead of sending it automatically.
