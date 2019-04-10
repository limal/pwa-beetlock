import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useOvermind } from "../overmind/overmind";
import BezierEasing from "bezier-easing";
import { LockIcon } from "../common/icons/LockIcon";

const easing = BezierEasing(0.36, 0, 0.13, 1.01);

export const LockControl = ({ ...props }) => {
  const [deltaX, setDeltaX] = useState(0);
  const { state, actions } = useOvermind();

  const reset = () => {
    setDeltaX(0);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      reset();
    },
    onSwipedRight: () => {
      console.log("actions");
      actions.openLock();
      reset();
    },
    onSwiping: e => {
      setDeltaX(e.deltaX);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const calculateDistance = x => {
    const sign = (Math.abs(x) + 1) / (x + 1); // + 1 for x === 0
    const distance = Math.min(1, Math.abs(x / 200.0));

    return easing(distance) * -sign * 50;
  };

  return (
    <div className="LockControl" {...swipeHandlers}>
      <LockIcon
        width="200"
        height="200"
        className="LockControl__Icon"
        style={{ left: calculateDistance(deltaX) }}
      />
      <pre>{state.lock.readMessage}</pre>
      {state.lock.error && (
        <div className="ErrorMessage">
          Couldn't open/close the lock due to below error:
          <br />
          <br />"{state.lock.error}""
          <br />
          <br />
          Please check that lock and bridge are powered on and try again.
        </div>
      )}
    </div>
  );
};
