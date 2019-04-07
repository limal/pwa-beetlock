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
import axios from "axios";
import { PrivateRoute } from "./routes/PrivateRoute";
import lockOpen from "./lock-open.png";
import lockClosed from "./lock-closed.png";
import { Angles } from "./Angles";
import { Layout } from "./common/Layout";
import { Home } from "./common/Home";
import { Login } from "./auth/Login";
import { Locks } from "./locks/Locks";
import { HotSpot } from "./common/HotSpot";
import { ROUTES } from "./routes/routes";
import { FindBridge } from "./locks/FindBridge";
import { FoundBridge } from "./locks/FoundBridge";
import { SignUp } from "./auth/SignUp";

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
    const accessToken = localStorage.getItem("accessToken");
    if (!isEmpty(accessToken)) {
      actions.authenticate({ accessToken });
    }
  }, [state.accessToken]);

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
            <Route path={ROUTES.login} component={Login} />
            <Route path={ROUTES.signUp} component={SignUp} />
          </Switch>
        </div>
      </Layout>
    </Router>
  );
};
