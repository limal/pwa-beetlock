import React, { Fragment, useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import "../css/Locks.scss";
import {
  Battery04,
  Battery14,
  Battery24,
  Battery34,
  Battery44
} from "./icons/Battery";

const VOLTAGE_MAX = 419;
const VOLTAGE_MIN = 320;

let voltage = 419;

const Batteries = {
  zero: Battery04,
  one: Battery14,
  two: Battery24,
  three: Battery34,
  four: Battery44
};

export const BatteryIndicator = () => {
  const { state, actions } = useOvermind();

  //   useEffect(() => {
  //     actions.getBattery();
  //     setInterval(() => {
  //       actions.setBattery({ voltage });
  //       voltage--;
  //     }, 100);
  //   }, [state.lock.connected]);

  console.log("* voltage", voltage);

  const percentage =
    state.lock.battery.voltage < VOLTAGE_MIN
      ? 1
      : Math.round(
          ((Math.min(state.lock.battery.voltage, VOLTAGE_MAX) - VOLTAGE_MIN) /
            (VOLTAGE_MAX - VOLTAGE_MIN)) *
            100
        );

  let icon = "zero";

  if (percentage > 5 && percentage < 25) {
    icon = "one";
  }
  if (percentage >= 25 && percentage < 75) {
    icon = "two";
  }
  if (percentage >= 75 && percentage < 90) {
    icon = "three";
  }
  if (percentage >= 90) {
    icon = "four";
  }

  const BatteryIcon = Batteries[icon];

  return (
    <span className="BatteryIndicator">
      <BatteryIcon />
      <span className="BatteryIndicator__Text">{`${percentage}%`}</span>
    </span>
  );
};
