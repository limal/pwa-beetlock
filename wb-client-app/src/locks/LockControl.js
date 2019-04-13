import React, { useState } from "react";
import Lottie from "react-lottie";
import animationData from "../common/anims/lock.json";
import { useSwipeable } from "react-swipeable";
import { useOvermind } from "../overmind/overmind";
import BezierEasing from "bezier-easing";
import { LockIcon } from "../common/icons/LockIcon";

const TESTING = false;
const easing = BezierEasing(0.36, 0, 0.13, 1.01);

const defaultOptions = {
  loop: true,
  autoplay: false,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

export const LockControl = ({ ...props }) => {
  const [deltaX, setDeltaX] = useState(0);
  const [opened, setOpened] = useState(false);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const { state, actions } = useOvermind();

  const reset = () => {
    setDeltaX(0);
  };

  const eventListeners = [
    {
      eventName: "enterFrame",
      callback: anim => {
        console.log("direction === 1", direction);
        if (direction === 1 && anim.currentTime > 50) {
          setPaused(true);
        }
      }
    }
  ];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      !TESTING && actions.closeLock();
      console.log("direction -1");
      setOpened(false);
      setPaused(false);
      setDirection(-1);
      reset();
    },
    onSwipedRight: () => {
      console.log("direction 1");
      !TESTING && actions.openLock();
      setOpened(true);
      setPaused(false);
      setDirection(1);
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

    return easing(distance) * -sign * 100;
  };

  return (
    <div className="LockControl" {...swipeHandlers}>
      <h1 className="Locks__Header">{opened ? "OPENED" : "CLOSED"}</h1>
      <Lottie
        options={defaultOptions}
        height={160}
        width={320}
        isStopped={false}
        isPaused={paused}
        speed={3}
        eventListeners={eventListeners}
        direction={direction}
      />
      <LockIcon
        width="200"
        height="200"
        className={`LockControl__Icon ${
          opened ? "LockControl__Icon--opened" : "LockControl__Icon--closed"
        }`}
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
