import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { Bridge } from "./icons/Bridge";
import { ROUTES } from "../routes/routes";

import "../css/Locks.scss";

export const Onboarding = ({ history }) => {
  const { state, actions } = useOvermind();

  const handleConnect = e => {
    history.push(ROUTES.locks);
  };

  return (
    <div className="Onboarding">
      <h1 className="Onboarding__Header">Welcome</h1>
      <p className="Onboarding__Text">
        In order to communicate with the lock, you need to connect to the bridge
        first.
      </p>
      <div className="Onboarding__Bridge">
        <Bridge className="Onboarding__Icon" />
      </div>
      <input
        className="Button"
        type="submit"
        value="CONNECT"
        onClick={handleConnect}
      />
    </div>
  );
};
