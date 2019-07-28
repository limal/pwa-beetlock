import React, { Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import { useOvermind } from "../overmind/overmind";
import { ROUTES } from "../routes/routes";
import "../css/Layout.scss";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = useOvermind();

  return (
    <Route
      {...rest}
      render={props =>
        state.authenticated ? (
          <Component {...props} />
        ) : state.bootstrapped ? (
          <Fragment>
            <h1>Redirecting to login</h1>
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          </Fragment>
        ) : (
          <div className="Padding">
            <h1 className="PrivateRoute__Header">Authenticating...</h1>
            <a href={ROUTES.home} className="Button">
              Back to home
            </a>
          </div>
        )
      }
    />
  );
};
