import axios from "axios";
import to from "await-to-js";
import { endpoints } from "../util/endpoints";

export const calibrateEffects = {
  calibrateClose: async ({ accessToken, ipAddress }) => {
    let response, err;

    [err, response] = await to(
      axios.post(
        endpoints.sendToLock(ipAddress),
        { message: "CALCLOSE" },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
    );

    return [err, response];
  },
  calibrateOpen: async ({ accessToken, ipAddress }) => {
    let response, err;

    [err, response] = await to(
      axios.post(
        endpoints.sendToLock(ipAddress),
        { message: "CALOPEN" },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
    );

    return [err, response];
  },
  calibrateSave: async ({ accessToken, ipAddress }) => {
    let response, err;

    [err, response] = await to(
      axios.post(
        endpoints.sendToLock(ipAddress),
        { message: "CALSAVE" },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
    );

    return [err, response];
  },
  calibrateSendAngles: async ({ accessToken, ipAddress, opened, closed }) => {
    let response, err;

    [err, response] = await to(
      axios.post(
        endpoints.sendToLock(ipAddress),
        { message: `AS${parseInt(opened)}:${parseInt(closed)}` },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
    );

    return [err, response];
  },
  phaseOpen: async ({ accessToken, ipAddress, phaseOpen }) => {
    let response, err;

    [err, response] = await to(
      axios.post(
        endpoints.sendToLock(ipAddress),
        { message: `PHASEOP${phaseOpen ? "1" : "0"}` },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
    );

    return [err, response];
  },
  time: async ({ accessToken, ipAddress, time }) => {
    let response, err;

    [err, response] = await to(
      axios.post(
        endpoints.sendToLock(ipAddress),
        { message: `CALTIME${parseInt(time)}` },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
    );

    return [err, response];
  }
};

export const calibrateActions = {
  calibrateClose: async ({ state, effects }) => {
    state.lock.error = null;
    let [err, response] = await effects.calibrateClose({
      accessToken: state.accessToken,
      ipAddress: state.bridge.ip
    });

    if (!err) {
      if (response && response.data.status === "ok") {
      } else {
        state.lock.error = response.data.error;
      }
    }
  },
  calibrateOpen: async ({ state, effects }) => {
    state.lock.error = null;
    let [err, response] = await effects.calibrateOpen({
      accessToken: state.accessToken,
      ipAddress: state.bridge.ip
    });

    if (!err) {
      if (response && response.data.status === "ok") {
      } else {
        state.lock.error = response.data.error;
      }
    }
  },
  calibrateSave: async ({ state, effects }) => {
    state.lock.error = null;
    let [err, response] = await effects.calibrateSave({
      accessToken: state.accessToken,
      ipAddress: state.bridge.ip
    });

    if (!err) {
      if (response && response.data.status === "ok") {
      } else {
        state.lock.error = response.data.error;
      }
    }
  },
  calibrateSendAngles: async ({ state, effects }) => {
    state.lock.error = null;
    let [err, response] = await effects.calibrateSendAngles({
      accessToken: state.accessToken,
      ipAddress: state.bridge.ip,
      opened: state.lock.calibrate.opened,
      closed: state.lock.calibrate.closed
    });

    if (!err) {
      if (response && response.data.status === "ok") {
      } else {
        state.lock.error = response.data.error;
      }
    }
  },
  setPhaseOpen: async ({ state, effects }, phaseOpen = true) => {
    state.lock.error = null;
    let [err, response] = await effects.phaseOpen({
      accessToken: state.accessToken,
      ipAddress: state.bridge.ip,
      phaseOpen
    });

    if (!err) {
      if (response && response.data.status === "ok") {
      } else {
        state.lock.error = response.data.error;
      }
    }
  },
  setAngles: ({ state, effects }, { openedAngle = -1, closedAngle = -1 }) => {
    if (openedAngle > 0) {
      state.lock.calibrate.opened = openedAngle;
    }
    if (closedAngle > 0) {
      state.lock.calibrate.closed = closedAngle;
    }
  },
  setTime: async ({ state, effects }, time = 10) => {
    state.lock.error = null;
    let [err, response] = await effects.time({
      accessToken: state.accessToken,
      ipAddress: state.bridge.ip,
      time
    });

    if (!err) {
      if (response && response.data.status === "ok") {
      } else {
        state.lock.error = response.data.error;
      }
    }
  }
};
