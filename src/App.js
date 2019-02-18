import React, { Component } from "react";
import axios from "axios";
import lockOpen from "./lock-open.png";
import lockClosed from "./lock-closed.png";
import "./App.css";
import { Angles } from "./Angles";

class App extends Component {
  state = {
    open: false
  };

  componentDidUpdate(prevProp, prevState) {
    const { open: prevOpen } = prevState;
    const { open } = this.state;

    const hasOpened = !prevOpen && open;
    const hasClosed = prevOpen && !open;

    if (hasOpened) {
      this.openLock();
      console.log("* fetch open");
    }

    if (hasClosed) {
      this.closeLock();
      console.log("* fetch close");
    }
  }

  toggleLock = () => {
    this.setState(state => ({
      open: !state.open
    }));
  };

  openLock = () => {
    axios.get("http://192.168.1.119:3000/open").then(() => {});
  };

  closeLock = () => {
    axios.get("http://192.168.1.119:3000/close").then(() => {});
  };

  stopLock = () => {
    axios.get("http://192.168.1.119:3000/stop").then(() => {});
  };

  render() {
    const { open } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">WB LOCK</h1>
          <img src={open ? lockOpen : lockClosed} onClick={this.toggleLock} />
          <Angles />
          <div className="App-controls">
            <h3 className="App-open" onClick={this.openLock}>
              OPEN
            </h3>
            <h3 className="App-close" onClick={this.closeLock}>
              CLOSE
            </h3>
          </div>
          <h3 className="App-stop" onClick={this.stopLock}>
            STOP
          </h3>
        </header>
      </div>
    );
  }
}

export default App;
