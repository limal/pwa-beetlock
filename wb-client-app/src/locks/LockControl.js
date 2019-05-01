import React, { useState } from "react";
import { LOCK_STATE } from "../util/constants";
import animationData from "../common/anims/lock.json";
import { useSwipeable } from "react-swipeable";
import { useOvermind } from "../overmind/overmind";
import BezierEasing from "bezier-easing";
import { LockIcon } from "../common/icons/LockIcon";
import { RadialProgress } from "./RadialProgress";

const TESTING = false;
const easing = BezierEasing(0.36, 0, 0.13, 1.01);

export const LockControl = ({ ...props }) => {
  const [deltaX, setDeltaX] = useState(0);
  // const [opened, setOpened] = useState(false);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const { state, actions } = useOvermind();

  const reset = () => {
    setDeltaX(0);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      console.log("direction 1");
      !TESTING && actions.openLock();
      // setOpened(true);
      // setPaused(false);
      setDirection(1);
      reset();
    },
    onSwipedRight: () => {
      !TESTING && actions.closeLock();
      console.log("direction -1");
      // setOpened(false);
      // setPaused(false);
      setDirection(-1);
      reset();
    },
    onSwiping: e => {
      setDeltaX(e.deltaX);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  const unknown = state.lock.state === LOCK_STATE.UNKNOWN;
  const opened = state.lock.state === LOCK_STATE.OPENED;
  const closed = state.lock.state === LOCK_STATE.CLOSED;

  const calculateDistance = x => {
    let sign = (Math.abs(x) + 1) / (x + 1); // + 1 for x === 0
    const distance = Math.min(1, Math.abs(x / 200.0));

    if (opened && sign > 0) {
      sign = 0;
    }

    if (!opened && sign < 0) {
      sign = 0;
    }

    return easing(distance) * -sign * 50;
  };

  const iconClassName = !unknown
    ? opened
      ? "LockControl__Icon--opened"
      : "LockControl__Icon--closed"
    : "LockControl__Icon--unknown";

  return (
    <div className="LockControl" {...swipeHandlers}>
      <h1 className="Locks__Header">
        {opened ? "OPENED" : null}
        {closed ? "CLOSED" : null}
      </h1>
      {/* <Lottie
        options={defaultOptions}
        height={160}
        width={320}
        isStopped={false}
        isPaused={paused}
        speed={3}
        eventListeners={eventListeners}
        direction={direction}
      /> */}
      <LockIcon
        width="150"
        height="150"
        className={`LockControl__Icon ${iconClassName}`}
        style={{ left: calculateDistance(deltaX) }}
      />
      <RadialProgress active={!unknown} opened={opened} closed={closed} />
      <pre>{state.lock.readMessage}</pre>
      {state.lock.error && (
        <div className="ErrorMessage">
          Couldn't open/close the lock due to below error:
          <br />
          <br />"{state.lock.error ? console.log(state.lock.error) : null}"
          <br />
          <br />
          Please check that lock and bridge are powered on and try again.
        </div>
      )}
    </div>
  );
};
