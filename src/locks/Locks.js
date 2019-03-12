import React from "react";
import { useOvermind } from "../overmind/overmind";
import "../css/Locks.scss";

export const Locks = () => {
  const { state, actions } = useOvermind();

  const getBridge = e => {
    e.preventDefault();
    actions.getBridge({});
  };

  return (
    <div className="Locks">
      {state.bridge.found ? (
        <div>Bridge found!</div>
      ) : (
        <div>
          <p>Please connect to your bridge first</p>
          <div className="Login-Buttons">
            <button
              className="Button"
              type="submit"
              onClick={getBridge}
              disabled={state.bridge.loading}
            >
              Find bridge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
