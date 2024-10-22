'use client';

import AirdropABI from '../../Airdrop.json';

import React, { useState } from "react";
import { ConnectButton, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { toWei } from "thirdweb/utils";
import { client } from "./client";
import Confetti from 'react-confetti';

export default function Home() {
  const [addresses, setAddresses] = useState("");
  const [amt, setAmt] = useState("");
  const activeAccount = useActiveAccount();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutateAsync: sendTransaction } = useSendTransaction();


  const contract = getContract({
    client,                          
    chain: sepolia,                  
    address: "0x5708A454E3C63c26efB8deEF8F6Cdc3D2037689e", 
    abi: AirdropABI.abi,           
  });

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

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

      setIsSubmitted(true); 

      console.log("Transaction sent:", result);
      setTimeout(() => {
        openInNewTab('https://sepolia.etherscan.io/tx/'+result.transactionHash); 
      }, 9000);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Transaction failed. Check the console for details.");
    }
  };


  return (
    <main className="flex flex-col items-center p-5 m-5 space-y-8" id='my-app'>
      {isSubmitted ? (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight + 320}
          />
          <img src="https://tr.rbxcdn.com/6e5099d0fd13f1777a6629ee3012dcc4/768/432/Image/Webp" width="630" height="340" />
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <h1 id="welcom">Welcome to our Airdrop :)</h1>
          </div>
          <div className="flex justify-center">
            <img id="txb" src="https://cdn.prod.website-files.com/63c7343f913714b9ef4ea297/63c7343f9137145e434ea334_txblogo.png" height="200" width="200" />
          </div>
        </>
      )}
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