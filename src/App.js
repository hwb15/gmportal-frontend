import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/GmPortal.json";

const App = () => {
  // Store user's wallet
  const [currentWallet, setCurrentWallet] = React.useState("");
  const [totalGms, setTotalGms] = useState(0);
  const contractAddress = "0x3c731fDF135c73736B90Da2d78964922ddCCFb91";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log(`Make sure you have installed Metamask!`);
        return;
      } else {
        console.log(`We have the ethereum object`, ethereum);
      }

      // Check authorisation for user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(`Found an authorized acc`, account);
        setCurrentWallet(account);
        getTotalGms();
      } else {
        console.log(`No accounts found`);
      }
    } catch (error) {
      console.log(`Error`, error);
    }
  };

  // Connect to ethereum wallet
  const connectToWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log(`Make sure you have installed Metamask!`);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`Connected ${accounts[0]}`);
      setCurrentWallet(accounts[0]);
    } catch (error) {
      console.log(`Error`, error);
    }
  };

  const getTotalGms = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gmPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const totalGms = await gmPortalContract.getTotalGms();
        setTotalGms(totalGms.toNumber());
      } else {
        console.log(`No eth obj`);
      }
    } catch (error) {
      console.log(`Error`, error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const gm = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gmPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let gmCount = await gmPortalContract.getTotalGms();
        console.log(`Retrieved total gms, ${gmCount.toNumber()}`);

        // write to contract
        const gmTxn = await gmPortalContract.gm();
        console.log(`Mining... ${gmTxn.hash}`);

        await gmTxn.wait();
        console.log(`Mined -- ${gmTxn.hash}`);

        gmCount = await gmPortalContract.getTotalGms();
        console.log(`Retrieved total gms, ${gmCount.toNumber()}`);
      } else {
        console.log(`No ethereum object`);
      }
    } catch (error) {
      console.log(`Error`, error);
    }
  };

  return (
    <div className="mainContainer">
      <div className="header-container">
        <div className="header-emoj">👋</div>
        <div className="header">gm?</div>
      </div>

      <div className="action-container">
        <div className="gm-counter">
          I have been wished gm by {totalGms} people!
        </div>
        <div className="bio">
          Wish me a gm by interacting with my first solidity contract deployed
          on rinkerby! wgmi!
        </div>

        <button className="waveButton" onClick={gm}>
          gm!
        </button>

        {!currentWallet && (
          <button className="connect-button" onClick={connectToWallet}>
            Connect Wallet!
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
