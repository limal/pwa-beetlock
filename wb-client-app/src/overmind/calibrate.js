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
