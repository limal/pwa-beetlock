import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useOvermind } from "../overmind/overmind";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = useOvermind();

  return (
    <Route
      {...rest}
      render={props =>
        state.authenticated ? (
          <Component {...props} />
        ) : state.bootstrapped ? (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        ) : null
      }
    />
  );
};
