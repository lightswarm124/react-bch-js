import React, { Component } from "react";

import { bchjs } from './config';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      mnemonic: null,
      hdPath: null,
      cashAddr: null,
      legacyAddr: null,
      slpAddr: null,
      blockInfo: {
        hash: null,
        block: null,
        difficulty: null
      }
    };
    this.generateWallet = this.generateWallet.bind(this);
  }

  componentDidMount() {
    console.log(process.env.REACT_APP_NETWORK);
    this.generateWallet();
  }

  async generateWallet(path = "m/44'/145'/0'/0/0") {
    const mnemonic = bchjs.Mnemonic.generate(
      128,
      bchjs.Mnemonic.wordLists()['english']
    );

    const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);
    const masterHDNode = bchjs.HDNode.fromSeed(rootSeed, process.env.REACT_APP_NETWORK);
    const childHDNode = masterHDNode.derivePath(path);
    const cashAddr = bchjs.HDNode.toCashAddress(childHDNode);
    const legacyAddr = bchjs.HDNode.toLegacyAddress(childHDNode);
    const slpAddr = bchjs.SLP.Address.toSLPAddress(cashAddr);

    const latestBlockInfo = await bchjs.Blockchain.getBlockchainInfo()
      .then(async (res) => {
        console.log(res);
        return res;
      }).catch((err) => {
        console.log(err);
        return;
      });

    await this.setState({
      mnemonic: mnemonic,
      hdPath: path,
      cashAddr: cashAddr,
      legacyAddr: legacyAddr,
      slpAddr: slpAddr,
      blockInfo: {
        hash: latestBlockInfo.bestblockhash,
        block: latestBlockInfo.blocks,
        difficulty: latestBlockInfo.difficulty
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <button onClick={() => this.generateWallet()}>Create Wallet</button>
          </div>
          <div>
            <p>Mnemonic: {this.state.mnemonic}</p>
            <p>HDPath: {this.state.hdPath}</p>
            <p>CashAddr: {this.state.cashAddr}</p>
            <p>LegacyAddr: {this.state.legacyAddr}</p>
            <p>SLPAddr: {this.state.SLPAddr}</p>
          </div>
          <div>
            <p>Latest Block Hash: {this.state.blockInfo.hash}</p>
            <p>Latest Block Height: {this.state.blockInfo.block}</p>
            <p>Latest Block Difficulty: {this.state.blockInfo.difficulty}</p>
          </div>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>You are running this application in <b>{process.env.REACT_APP_NETWORK}</b> mode.</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
