import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/GmPortal.json";

const App = () => {
  // Store user's wallet
  const [currentWallet, setCurrentWallet] = React.useState("");
  const [totalGms, setTotalGms] = useState(0);
  const [allGms, setAllGms] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaving, setIsWaving] = useState(false);

  const contractAddress = "0x6d5E002927334b5008451cCe8a5f417515F1a041";
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
        getAllGms();
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

  const getAllGms = async () => {
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

        // Call getAllGms from my solidity contract
        const gms = await gmPortalContract.getAllGms();

        console.log(gms);
        // Only need address, time, message
        let gmsCleaned = [];
        gms.forEach((gm) => {
          gmsCleaned.push({
            address: gm.from,
            timestamp: new Date(gm.timestamp * 1000),
            message: gm.message,
          });
        });

        setAllGms(gmsCleaned.reverse());
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

  const gm = async (message) => {
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
        const gmTxn = await gmPortalContract.gm(message);
        console.log(`Mining... ${gmTxn.hash}`);
        setMessage("");
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
          <p>
            This is a small app that interacts with my first ever solidity
            contract deployed on rinkerby testnet!
          </p>

          <p>
            It is a simple contract that allows you to wish gm to someone, this
            all gets recorded on the blockchain within the{" "}
            <a
              href="https://rinkeby.etherscan.io/address/0x3c731fdf135c73736b90da2d78964922ddccfb91"
              target="_blank"
              rel="noreferrer noopener"
            >
              contract
            </a>
            .
          </p>
        </div>
        <div>
          <div className="message-input-container">
            <textarea
              rows={4}
              name="comment"
              id="comment"
              className="message-input"
              defaultValue={"Enter a message for me!"}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <button
          className="button"
          onClick={(e) => gm(message)}
          disabled={isWaving ? true : false}
        >
          Wish me gm here!
        </button>
        {!currentWallet && (
          <button className="button" onClick={connectToWallet}>
            Connect Wallet!
          </button>
        )}
        {allGms.map((gm, index) => {
          return (
            <div key={index}>
              <div>Address: {gm.address}</div>
              <div>Timestamp: {new Date(gm.timestamp).toString()}</div>
              <div>Message: {gm.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
