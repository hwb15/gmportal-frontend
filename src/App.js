import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import * as timeago from "timeago.js";
import "./App.css";
import abi from "./utils/GmPortal.json";

const App = () => {
  // Store user's wallet
  const [currentWallet, setCurrentWallet] = React.useState("");
  const [totalGms, setTotalGms] = useState(0);
  const [allGms, setAllGms] = useState([]);
  const [message, setMessage] = useState("");
  const [isWaving, setIsWaving] = useState(false);

  const contractAddress = "0x0f3AC7fEBe3767E24c051a483d85edce54d17CfF";
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

  function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  }

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
            color: stringToHslColor(gm.from, 30, 80),
          });
        });
        console.log(gmsCleaned);
        setAllGms(gmsCleaned.reverse());
      } else {
        console.log(`No eth obj`);
      }
    } catch (error) {
      console.log(`Error`, error);
    }
  };

  const onNewGm = (from, timestamp, message) => {
    console.log(`New GM`, from, timestamp, message);
    setAllGms((prevState) => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    let gmPortalContract;

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const gmPortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      gmPortalContract.on("NewGm", onNewGm);
    }

    return () => {
      if (gmPortalContract) {
        gmPortalContract.off("NewGm", onNewGm);
      }
    };
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
        const gmTxn = await gmPortalContract.gm(message, { gasLimit: 300000 });
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
        <div className="bio">
          <p>
            This is a small app that interacts with my first ever solidity
            contract deployed on rinkerby testnet!
          </p>

          <p>
            It is a simple contract that allows you to wish gm to me, this all
            gets recorded on the blockchain within the{" "}
            <a
              href={`https://rinkeby.etherscan.io/address/${contractAddress}`}
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
              placeholder="Type your message here..."
              defaultValue={message}
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
      </div>

      <div className="message-feed-container">
        <ul role="list" className="message-feed">
          {allGms.map((gm, index) => (
            <li key={index}>
              <div className="message-feed-item">
                <div
                  className="message-image"
                  style={{ backgroundColor: `${gm.color}` }}
                />
                <div className="message-details-container">
                  <div className="message-details">
                    <h3 className="message-from">
                      {gm.address.substr(0, 35 - 1) + "..."}
                    </h3>
                    <p className="message-time-text">
                      {timeago.format(gm.timestamp)}
                    </p>
                  </div>
                  <p className="message-text">{gm.message}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
