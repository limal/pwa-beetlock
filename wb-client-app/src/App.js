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
import { Onboarding } from "./common/Onboarding";
import { action } from "overmind";
import { ROUTES } from "./routes/routes";

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
            <Route path="/" component={Home} exact />
            <Route path={ROUTES.login} component={Login} />
            <PrivateRoute path={ROUTES.locks} component={Locks} exact />
          </Switch>
        </div>
      </Layout>
    </Router>
  );
};
