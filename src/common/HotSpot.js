import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { ROUTES } from "../routes/routes";
import { GoBack } from "./GoBack";

import "../css/Locks.scss";

export const HotSpot = ({ history }) => {
  const { state, actions } = useOvermind();

  const handleConnect = e => {
    history.push(ROUTES.findBridge);
  };

  return (
    <div className="HotSpot">
      <h1 className="HotSpot__Header">WIFI HOT SPOT</h1>
      <p className="HotSpot__Text">Create a hot spot on your mobile phone.</p>
      <p className="HotSpot__Text">
        Please name your WiFi hot spot according to the labels on the back of
        the bridge.
      </p>
      <p className="HotSpot__Text">
        You need to match the WiFi hot spot's name and password exactly
        otherwise the bridge won't be able to connect to it.
      </p>
      <input
        className="Button HotSpot__Buttons"
        type="submit"
        value="NEXT"
        onClick={handleConnect}
      />
      <GoBack history={history} route={ROUTES.home} />
    </div>
  );
};
