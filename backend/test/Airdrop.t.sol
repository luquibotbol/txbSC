// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Airdrop.sol";

contract AirdropTest is Test {
    Airdrop airdrop;
    address[] recipients;
    
    // Set up the contract before tests
    function setUp() public {
        airdrop = new Airdrop();
        recipients.push(address(0x1234));
        recipients.push(address(0x5678));
        recipients.push(address(0x9abc));
    }

    // Test the airdrop functionality
    function testAirdrop() public {
        uint256 amount = 1 ether;  // Amount to send to each address

        // Perform the airdrop with a sufficient amount of ETH
        airdrop.airdrop{value: 3 ether}(recipients, amount);

        // Check the balance of each recipient
        assertEq(address(0x1234).balance, amount);
        assertEq(address(0x5678).balance, amount);
        assertEq(address(0x9abc).balance, amount);
    }
    
    // Test that only the owner can call the airdrop
    function testOnlyOwner() public {
        address nonOwner = address(0xdead);
        vm.prank(nonOwner);
        
        // Attempt airdrop call by non-owner, expect it to revert
        vm.expectRevert();
        airdrop.airdrop{value: 1 ether}(recipients, 1 ether);
    }


    // Test that the contract throws an error if insufficient Ether is sent
    function testInsufficientFunds() public {
        uint256 amount = 1 ether;

        // Attempt airdrop with insufficient funds
        vm.expectRevert("Insufficient Ether provided.");
        airdrop.airdrop{value: 2 ether}(recipients, amount);
    }
}
