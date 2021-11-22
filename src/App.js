import * as React from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
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
      </div>
    </div>
  );
}
