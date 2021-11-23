import React, { useEffect } from "react";
import "./App.css";

const App = () => {
  // Store user's wallet
  const [currentWallet, setCurrentWallet] = React.useState("");

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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const gm = () => {};

  return (
    <div className="mainContainer">
      <div className="header-container">
        <div className="header-emoj">👋</div>
        <div className="header">gm?</div>
      </div>

      <div className="action-container">
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
