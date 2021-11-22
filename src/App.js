import * as React from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const gm = () => {};

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          This is my first ever solidity contract and blockchain project - want
          to wish me gm?
        </div>

        <button className="waveButton" onClick={gm}>
          gm?!
        </button>
      </div>
    </div>
  );
}
