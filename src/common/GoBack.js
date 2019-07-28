import React from "react";

export const GoBack = ({ history, route }) => (
  <p className="GoBack">
    or{" "}
    <span className="Link" onClick={e => history.push(route)}>
      go back
    </span>
  </p>
);
