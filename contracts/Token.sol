//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Token {
	// Name, Symbol, Total Supply, Balance Object
	string public name = "Joe Token";
	string public symbol = "JT";
	uint public totalSupply = 1000000;
	// Object of address with balances
	mapping(address => uint) balances; 


	// Set balance of creator to total supply
	// msg.sender, msg.value
	constructor() {
		balances[msg.sender] = totalSupply;
	}


	// Transfer an amount to an address 
	function transfer(address to, uint amount) external {
		// Sender does not have enough tokens to send
		require(balances[msg.sender] >= amount, "Not enough tokens");
		// Subtract the balance 
		balances[msg.sender] -= amount;
		// Transfer tokens to address
		balances[to] += amount;
	}


	// Returns value of the address
	function balanceOf(address account) external view returns (uint) {
		return balances[account];
	}
}


