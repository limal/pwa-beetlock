import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { WifiSetup } from "./WifiSetup";
import { BRIDGE_STEPS } from "../util/constants";
import { Spinner } from "../common/Spinner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../css/BridgeWifi.scss";

const CHECK_WIFI_INTERVAL = 5000;

dayjs.extend(relativeTime);

export const BridgeWifi = () => {
  const { state, actions } = useOvermind();
  let interval = null;

  useEffect(() => {
    if (state.bridge.step === BRIDGE_STEPS.confirmingNewWifi && !interval) {
      interval = setInterval(() => {
        actions.checkWifi();
      }, CHECK_WIFI_INTERVAL);
    }
  }, [state.bridge.step]);

  const getBridge = e => {
    e.preventDefault();
    actions.getBridge();
  };

  return (
    <div className="BridgeWifi">
      {state.bridge.step === BRIDGE_STEPS.none && (
        <div>
          <p>Please change your to your bridge first</p>
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
          <h1 className="BridgeWifi__Header">
            Waiting for bridge to connect to Internet...
          </h1>
          <Spinner width={80} className="BridgeWifi__Spinner" />
          <h2 className="BridgeWifi__Subheader">Bridge last contact:</h2>
          <dl className="Details">
            <dt>SSID</dt>
            <dd>{state.bridge.wifiReported}</dd>
            <dt>Updated at</dt>
            <dd>
              {state.bridge.updatedAt &&
                dayjs(state.bridge.updatedAt).fromNow()}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
};
