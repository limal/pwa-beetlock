import React, { Fragment, useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { LockIcon } from "../common/icons/LockIcon";
import { LockControl } from "./LockControl";
import "../css/Locks.scss";

export const Locks = () => {
  const { state, actions } = useOvermind();

  useEffect(() => {
    actions.getBattery();
  }, [state.lock.connected]);

  return (
    <div className="Locks">
      {state.lock.connected ? (
        <Fragment>
          {/* <h1 className="Locks__Header">Connected</h1> */}
          {/* <span
            style={{ display: "block", marginBottom: "40px" }}
            onClick={onClick}
          >
            READ
          </span> */}
          <LockControl />
        </Fragment>
      ) : (
        <Fragment>
          <h1 className="Locks__Header">Lock not connected to bridge</h1>
          <LockIcon
            width="200"
            height="200"
            className="Locks__Lock Locks__Lock--disconnected"
          />
          <div className="Locks__Buttons">
            <button className="Button" type="submit">
              SETUP LOCK
            </button>
          </div>
        </Fragment>
      )}
    </div>
  );
};
