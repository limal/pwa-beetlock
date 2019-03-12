import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { WifiSetup } from "./WifiSetup";
import { BRIDGE_STEPS } from "../util/constants";
import "../css/Locks.scss";

export const Locks = () => {
  const { state, actions } = useOvermind();

  const getBridge = e => {
    e.preventDefault();
    actions.getBridge();
  };

  return (
    <div className="Locks">
      {state.bridge.step === BRIDGE_STEPS.none && (
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
      {state.bridge.step === BRIDGE_STEPS.passwordRequired && <WifiSetup />}
      {state.bridge.step === BRIDGE_STEPS.confirmingNewWifi && (
        <div>
          <h1>
            Thanks! Let's wait until we connect to the bridge via your WiFi
          </h1>
        </div>
      )}
    </div>
  );
};
