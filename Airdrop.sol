// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
event AirdropSent(address indexed recipient, uint256 amount);


contract Airdrop {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function airdrop(address[] memory recipients, uint256 amount) external payable onlyOwner {
        uint256 totalRequired = recipients.length * amount;
        require(msg.value >= totalRequired, "Insufficient Ether provided.");

        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = recipients[i].call{value: amount}("");
            require(success, "Transfer failed");
            emit AirdropSent(recipients[i], amount);  // emit on successful transfer
        }

        uint256 remainingBalance = address(this).balance;
        if (remainingBalance > 0) {
            payable(owner).transfer(remainingBalance);
        }
    }

    // is this needed??
    receive() external payable {}
}
