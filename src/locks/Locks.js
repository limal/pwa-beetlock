import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { WifiSetup } from "./WifiSetup";
import "../css/Locks.scss";

export const Locks = () => {
  const { state, actions } = useOvermind();

  const getBridge = e => {
    e.preventDefault();
    actions.getBridge();
  };

  return (
    <div className="Locks">
      {state.bridge.found ? (
        <WifiSetup />
      ) : (
        <div>
          <p>Please connect to your bridge first</p>
          <button
            className="Button Button--padded"
            type="submit"
            onClick={getBridge}
            disabled={state.bridge.loading}
          >
            Find bridge
          </button>
        </div>
      )}
    </div>
  );
};
