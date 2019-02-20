import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useOvermind } from "../overmind/overmind";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = useOvermind();

  return (
    <Route
      {...rest}
      render={props =>
        state.accessToken ? (
          <Component {...props} />
        ) : (
          <pre>{JSON.stringify(state)}</pre>
          // <Redirect
          //   to={{
          //     pathname: "/login",
          //     state: { from: props.location }
          //   }}
          // />
        )
      }
    />
  );
};
