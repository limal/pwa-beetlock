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
import "./css/App.css";
import { Angles } from "./Angles";
import { Layout } from "./common/Layout";
import { Home } from "./common/Home";
import { Login } from "./auth/Login";
import { Locks } from "./locks/Locks";
import { action } from "overmind";

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
      actions.setAccessToken(accessToken);
    }
  }, [state.accessToken]);

  return (
    <Router>
      <Layout>
        <div className="App">
          <Switch>
            {/* A user can't go to the HomePage if is not authenticated */}
            <Route path="/" component={Home} exact />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/locks" component={Locks} exact />
            {/* <Route exact path="/connect/:provider" component={ConnectPage} />
            <Route path="" component={NotFoundPage} /> */}
          </Switch>
          <pre>{JSON.stringify(state)}</pre>
        </div>
      </Layout>
    </Router>
  );
};
