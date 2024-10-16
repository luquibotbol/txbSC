'use client';

import AirdropABI from '../../Airdrop.json';

import React, { useState } from "react";
import { ConnectButton, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { toWei } from "thirdweb/utils";
import { client } from "./client";
import house from '../public/TXB.png';

export default function Home() {
  const [addresses, setAddresses] = useState("");
  const [amt, setAmt] = useState("");
  const activeAccount = useActiveAccount();

  const { mutateAsync: sendTransaction } = useSendTransaction();


  const contract = getContract({
    client,                          
    chain: sepolia,                  
    address: "0x5708A454E3C63c26efB8deEF8F6Cdc3D2037689e", 
    abi: AirdropABI.abi,           
  });


  const handleClick = async () => {
    try {
      if (!addresses || !amt || !activeAccount) {
        alert("Please provide valid addresses, amount, and connect your wallet.");
        return;
      }
  
      const recipients = addresses.split(",").map(addr => addr.trim());
  
      console.log("Active account:", activeAccount.address);
      console.log("Sending airdrop to:", recipients);
      console.log("Amount per recipient (Ether):", amt);
      
      const weiAmount = toWei(amt);
      const totalEth = (parseFloat(amt) * recipients.length).toString();

      
      console.log("Total Wei value:", totalEth);
  
      const transaction = prepareContractCall({
        contract,
        method: "airdrop",
        params: [recipients, weiAmount],  
        value: toWei(totalEth)
      });

      const result = await sendTransaction(transaction);
  
      console.log("Transaction sent:", result);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Transaction failed. Check the console for details.");
    }
  };

  return (
    <main className="flex flex-col items-center p-5 m-5 space-y-8">
      <div className="flex justify-center">
        <h1>Welcome to our Airdrop :)</h1>
      </div>
      <div className="flex justify-center">
        <img src="TXB.png"></img>
      </div>
      <div className="flex justify-center">
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Airdrop App",
            url: "https://example.com",
          }}
        />
      </div>

      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={e => setAddresses(e.target.value)}
        placeholder="Enter addresses, comma-separated"
      />
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={e => setAmt(e.target.value)}
        placeholder="Enter amount"
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Airdrop
      </button>
    </main>
  );
}