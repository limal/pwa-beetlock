import React, { Component, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import { isEmpty } from "ramda";
import { useOvermind } from "./overmind/overmind";
import socketIOClient from "socket.io-client";
import { endpoints } from "./util/endpoints";
import axios from "axios";
import { PrivateRoute } from "./routes/PrivateRoute";
import lockOpen from "./lock-open.png";
import lockClosed from "./lock-closed.png";
import { Angles } from "./Angles";
import { Layout } from "./common/Layout";
import { Home } from "./common/Home";
import { Login } from "./auth/Login";
import { BridgeWifi } from "./locks/BridgeWifi";
import { Locks } from "./locks/Locks";
import { HotSpot } from "./common/HotSpot";
import { ROUTES } from "./routes/routes";
import { FindBridge } from "./locks/FindBridge";
import { FoundBridge } from "./locks/FoundBridge";
import { SignUp } from "./auth/SignUp";
import { Settings } from "./settings/Settings";

// class App extends Component {
//   state = {
//     open: false
//   };

//   componentDidUpdate(prevProp, prevState) {
//     const { open: prevOpen } = prevState;
//     const { open } = this.state;

//     const hasOpened = !prevOpen && open;
//     const hasClosed = prevOpen && !open;

//     if (hasOpened) {
//       this.openLock();
//       console.log("* fetch open");
//     }

//     if (hasClosed) {
//       this.closeLock();
//       console.log("* fetch close");
//     }
//   }

//   toggleLock = () => {
//     this.setState(state => ({
//       open: !state.open
//     }));
//   };

//   openLock = () => {
//     axios.get("http://192.168.1.119:3000/open").then(() => {});
//   };

//   closeLock = () => {
//     axios.get("http://192.168.1.119:3000/close").then(() => {});
//   };

//   stopLock = () => {
//     axios.get("http://192.168.1.119:3000/stop").then(() => {});
//   };

export const App = () => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    if (state.bridge.ip === null) {
      const ipAddress = localStorage.getItem("bridgeIp");

      if (ipAddress) {
        actions.getStatus({ ipAddress });
        actions.getOccupied({ ipAddress });
      }
    } else {
      const accessToken = localStorage.getItem("accessToken");
      if (state.bridge.ip !== null && !isEmpty(accessToken)) {
        const socket = socketIOClient(endpoints.base(state.bridge.ip));
        socket.on("FromAPI", data => {
          console.log(data);
          actions.setLockState(data);
        });
        actions.bootstrap({ accessToken });
      }
    }
  }, [state.bridge.ip]);

  return (
    <Router>
      <Layout>
        <div className="App">
          <Switch>
            <Route path={ROUTES.home} component={Home} exact />
            <Route path={ROUTES.hotSpot} component={HotSpot} />
            <Route path={ROUTES.findBridge} component={FindBridge} />
            <Route path={ROUTES.foundBridge} component={FoundBridge} />
            <PrivateRoute path={ROUTES.locks} component={Locks} exact />
            <PrivateRoute
              path={ROUTES.bridgeWifi}
              component={BridgeWifi}
              exact
            />
            <PrivateRoute path={ROUTES.settings} component={Settings} exact />
            <Route path={ROUTES.login} component={Login} />
            <Route path={ROUTES.signUp} component={SignUp} />
          </Switch>
        </div>
      </Layout>
    </Router>
  );
};
