import React, { Fragment, useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import { WifiSetup } from "./WifiSetup";
import { BRIDGE_STEPS } from "../util/constants";
import { Spinner } from "../common/Spinner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LockIcon } from "../common/icons/LockIcon";
import { LockControl } from "./LockControl";
import "../css/Locks.scss";

export const Locks = () => {
  const { state, actions } = useOvermind();

  const onClick = e => {
    console.log("* onClick Read)");
    actions.readFromLock();
  };

  const onSend = command => e => {
    console.log("* onSend", command);
    actions.sendToLock({ message: command });
  };

  return (
    <div className="Locks">
      {state.lock.connected ? (
        <Fragment>
          {/* <h1 className="Locks__Header">Connected</h1> */}
          <span
            style={{ display: "block", marginBottom: "40px" }}
            onClick={onClick}
          >
            READ
          </span>
          <span
            style={{ display: "block", marginBottom: "40px" }}
            onClick={onSend("BATTSTAT")}
          >
            BATTSTAT
          </span>
          <span
            style={{ display: "block", marginBottom: "40px" }}
            onClick={onSend("GETBATT")}
          >
            GETBATT
          </span>
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
