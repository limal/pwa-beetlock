import React, { Fragment } from "react";
import "../css/App.css";

export class Home extends React.Component {
  state = {
    open: false
  };

  render() {
    return (
      <Fragment>
        <h1 className="App-title" />
        {/* <img src={open ? lockOpen : lockClosed} onClick={this.toggleLock} />
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
        </h3> */}
      </Fragment>
    );
  }
}
