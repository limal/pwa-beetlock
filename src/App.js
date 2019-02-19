import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import axios from "axios";
import PrivateRoute from "./routes/PrivateRoute";
import lockOpen from "./lock-open.png";
import lockClosed from "./lock-closed.png";
import "./css/App.css";
import { Angles } from "./Angles";
import { Home } from "./common/Home";

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
      <Router>
        <div className="App">
          <Switch>
            {/* A user can't go to the HomePage if is not authenticated */}
            <Route path="/" component={Home} exact />
            {/* <Route path="/auth/:authType/:id?" component={AuthPage} />
            <Route exact path="/connect/:provider" component={ConnectPage} />
            <Route path="" component={NotFoundPage} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
