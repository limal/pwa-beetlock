import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import BezierEasing from "bezier-easing";
import { LockIcon } from "../common/icons/LockIcon";

const easing = BezierEasing(0.36, 0, 0.13, 1.01);

export const LockControl = ({ ...props }) => {
  const [deltaX, setDeltaX] = useState(0);

  const reset = () => {
    setDeltaX(0);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      reset();
    },
    onSwipedRight: () => {
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
      <div>deltaX: {deltaX}</div>
      <LockIcon
        width="200"
        height="200"
        className="LockControl__Icon"
        style={{ left: calculateDistance(deltaX) }}
      />
    </div>
  );
};
