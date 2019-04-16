import { Overmind } from "overmind";
import { createHook } from "overmind-react";
import axios from "axios";
import to from "await-to-js";
import { endpoints, wifiEndpoints } from "../util/endpoints";
import { BRIDGE_STEPS, LOCK_STATE } from "../util/constants";
import { bootstrap } from "./auth.js";

const STATUS_TIMEOUT = 2500;

const login = async ({ state, effects }, { username, password }) => {
  state.login.loading = true;
  const response = await effects.login({
    ipAddress: state.bridge.ip,
    username,
    password
  });

  if (response && response.status < 300) {
    state.authenticated = true;
    state.accessToken = response.data.token;
    state.refreshToken = response.data.refresh_token;
    state.login.errors = null;
    // TODO remove local storage and store server-side session
    localStorage.setItem("accessToken", state.accessToken);
    localStorage.setItem("refreshToken", state.refreshToken);
  } else {
    state.authenticated = false;
    state.accessToken = null;
    state.refreshToken = null;
    state.login.errors = response.data;
  }

  state.login.loading = false;
};

export const overmind = new Overmind({
  state: {
    authenticated: false,
    bootstrapped: false,
    accessToken: null,
    refreshToken: null,
    login: {
      errors: null,
      loading: false
    },
    signup: {
      errors: null
    },
    bridge: {
      ip: null,
      userFriendlyId: null,
      finding: false,
      occupied: null,
      step: BRIDGE_STEPS.none,
      ssid: null,
      wifis: [],
      wifiReported: null,
      wifiSelected: null,
      wifiPassword: null
    },
    lock: {
      connected: true, // TODO set to false
      readMessage: null,
      state: null,
      battery: {
        voltage: 0
      }
    }
  },
  effects: {
    authenticate: async ({ accessToken, ipAddress }) => {
      let response, err;

      [err, response] = await to(
        axios.get(endpoints.userInfo(ipAddress), {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      );

      return err ? err.response : response;
    },
    closeLock: async ({ ipAddress }) => {
      let response, err;

      [err, response] = await to(
        axios.post(endpoints.sendToLock(ipAddress), { message: "CLOSE" })
      );

      return [err, response];
    },
    connectWifi: async ({ accessToken, ipAddress, ssid, password }) => {
      let [err, response] = await to(
        axios.post(wifiEndpoints.connectWifi(ipAddress), { ssid, password })
      );

      return err ? err.resopnse : response;
    },
    findBridge: async ({ accessToken, userFriendlyId }) => {
      let [err, response] = await to(
        axios.post(endpoints.findBridge, { userFriendlyId })
      );

      return err ? err.resopnse : response;
    },
    getBattery: async ({ ipAddress, cached = true }) => {
      let [err, response] = await to(
        axios.get(
          cached
            ? endpoints.getBatteryCached(ipAddress)
            : endpoints.getBattery(ipAddress)
        )
      );

      return [err, response];
    },
    getLockState: async ({ accessToken, ipAddress }) => {
      let [err, response] = await to(
        axios.get(endpoints.getLockState(ipAddress), {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      );

      console.log("* err, response", err, response);

      return err ? err.resopnse : response;
    },
    getOccupied: async ({ ipAddress }) => {
      let [err, response] = await to(
        axios.get(endpoints.getOccupied(ipAddress))
      );

      return err ? err.resopnse : response;
    },
    getWifis: async ({ accessToken, ipAddress }) => {
      console.log("* ip", ipAddress, wifiEndpoints.getWifis(ipAddress));
      let [err, response] = await to(
        axios.get(wifiEndpoints.getWifis(ipAddress))
      );

      return err ? err.response : response;
    },
    getStatus: async ({ ipAddress }) => {
      console.log("* ip", ipAddress);
      let [err, response] = await to(
        axios.get(endpoints.getStatus(ipAddress), { timeout: STATUS_TIMEOUT })
      );

      return [err, response];
    },
    login: async ({ ipAddress, username, password }) => {
      let response, err;

      [err, response] = await to(
        axios.post(endpoints.auth(ipAddress), {
          username,
          password
        })
      );

      return err ? err.response : response;
    },
    openLock: async ({ ipAddress }) => {
      let response, err;

      [err, response] = await to(
        axios.post(endpoints.sendToLock(ipAddress), { message: "OPEN" })
      );

      return [err, response];
    },
    readFromLock: async ({ ipAddress }) => {
      let response, err;

      [err, response] = await to(axios.get(endpoints.readFromLock(ipAddress)));

      return [err, response];
    },
    register: async ({ ipAddress, username, password }) => {
      let response, err;

      console.log("* ip", ipAddress, username, password);

      [err, response] = await to(
        axios.post(endpoints.register(ipAddress), {
          username,
          password
        })
      );

      return err ? err.response : response;
    },
    sendToLock: async ({ ipAddress, message }) => {
      let response, err;

      [err, response] = await to(
        axios.post(endpoints.sendToLock(ipAddress), { message })
      );

      return [err, response];
    }
  },
  actions: {
    bootstrap,
    // authenticate: async ({ state, effects }, { accessToken }) => {
    //   state.authenticated = false;
    //   const response = await effects.authenticate({
    //     accessToken,
    //     ipAddress: state.bridge.ip
    //   });
    //   if (response && response.status < 300) {
    //     state.authenticated = true;

    //   } else {
    //     state.accessToken = false;
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("refreshToken");
    //   }

    //   state.bootstrapped = true;
    // },
    cancelFindingBridge: ({ state }) => {
      state.bridge.finding = false;
    },
    checkWifi: async ({ state, effects }, { accessToken } = {}) => {
      const response = await effects.getBridge({ accessToken });
      if (response && response.status < 300) {
        state.bridge.updatedAt = response.data.updated_at;
        state.bridge.wifiReported = response.data.ssid;
      }
    },
    closeLock: async ({ state, effects }) => {
      state.lock.readMessage = "";
      state.lock.error = null;
      let [err, response] = await effects.closeLock({
        ipAddress: state.bridge.ip
      });

      if (!err) {
        if (response && response.data.status === "ok") {
          state.lock.readMessage = response.data.read;
          state.lock.state = LOCK_STATE.CLOSED;
        } else {
          state.lock.error = response.data.error;
        }
      }

      console.log("err, response", err, response);
    },
    connectWifi: async ({ state, effects }) => {
      state.bridge.loading = true;
      const response = await effects.connectWifi({
        ipAddress: state.bridge.ip,
        ssid: state.bridge.wifiSelected,
        password: state.bridge.wifiPassword
      });
      if (response && response.status < 300) {
        state.bridge.step = BRIDGE_STEPS.confirmingNewWifi;
      }
      state.bridge.loading = false;
    },
    findBridge: async ({ state, effects }, { userFriendlyId }) => {
      state.bridge.userFriendlyId = userFriendlyId;
      state.bridge.finding = true;

      let err;
      let response = await effects.findBridge({ userFriendlyId });
      if (response && response.status < 300) {
        if (response.data.status === "ok") {
          const ipAddress = response.data.bridge.ip;
          state.bridge.error = null;
          // check if the bridge central API is working
          [err, response] = await effects.getStatus({ ipAddress });
          if (!err && response.data.status === "ok") {
            state.bridge.finding = false;
            state.bridge.ip = ipAddress;

            localStorage.setItem("bridgeIp", state.bridge.ip);
          } else {
            state.bridge.error = `Found the bridge but cannot connect to it at "${ipAddress}".`;
          }
        }
      }
    },
    getBattery: async ({ state, effects }, { cached = true } = {}) => {
      let [err, response] = await effects.getBattery({
        ipAddress: state.bridge.ip,
        cached
      });
      if (!err && response && response.data.status === "ok") {
        console.log("* response.data", response.data);
        state.lock.battery.voltage = response.data.battery.voltage;
      }
    },
    getStatus: async ({ state, effects }, { ipAddress }) => {
      let [err, response] = await effects.getStatus({ ipAddress });
      if (!err && response && response.data.status === "ok") {
        state.bridge.ip = ipAddress;
      } else {
        console.log("* whoops");
      }
    },
    getOccupied: async ({ state, effects }, { ipAddress }) => {
      const response = await effects.getOccupied({ ipAddress });
      state.bridge.occupied = null;
      if (response && response.data.status === "ok") {
        state.bridge.occupied = response.data.occupied === "true";
      }
    },
    getWifis: async ({ state, effects }, { accessToken } = {}) => {
      state.bridge.loading = true;
      state.bridge.wifis = [];
      const response = await effects.getWifis({
        accessToken,
        ipAddress: state.bridge.ip
      });
      state.bridge.loading = false;
      if (response && response.status < 300) {
        state.bridge.wifis = response.data;
      }
    },
    login: login,
    logout: ({ state }) => {
      state.authenticated = false;
      state.accessToken = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    openLock: async ({ state, effects }) => {
      state.lock.readMessage = "";
      state.lock.error = null;
      let [err, response] = await effects.openLock({
        ipAddress: state.bridge.ip
      });

      if (!err) {
        if (response && response.data.status === "ok") {
          state.lock.readMessage = response.data.read;
          state.lock.state = LOCK_STATE.OPENED;
        } else {
          state.lock.error = response.data.error;
        }
      }

      console.log("err, response", err, response);
    },
    readFromLock: async ({ state, effects }) => {
      state.lock.readMessage = "";
      state.lock.error = null;
      let [err, response] = await effects.readFromLock({
        ipAddress: state.bridge.ip
      });

      if (!err) {
        if (response && response.data.status === "ok") {
          state.lock.readMessage = response.data.read;
        } else {
          state.lock.error = response.data.error;
        }
      }

      console.log("err, response", err, response);
    },
    setManualBridge: async ({ state, effects }, { ipAddress }) => {
      state.bridge.finding = true;
      let [err, response] = await effects.getStatus({ ipAddress });
      if (!err && response.data.status === "ok") {
        state.bridge.finding = false;
        state.bridge.ip = ipAddress;
        localStorage.setItem("bridgeIp", ipAddress);
      } else {
        state.bridge.error = `Found the bridge but cannot connect to it at "${ipAddress}".`;
      }
    },
    setWifiSelected: ({ state }, { wifiSelected, wifiPassword }) => {
      state.bridge.wifiSelected = wifiSelected;
      state.bridge.wifiPassword = wifiPassword;
    },
    register: async ({ state, effects }, { username, password }) => {
      console.log("* username", username, password);

      const response = await effects.register({
        ipAddress: state.bridge.ip,
        username,
        password
      });

      if (response.status === 201) {
        return login({ state, effects }, { username, password });
      } else {
        state.signup.errors = response.data;
      }
    },
    sendToLock: async ({ state, effects }, { message }) => {
      state.lock.readMessage = "";
      state.lock.error = null;
      let [err, response] = await effects.sendToLock({
        ipAddress: state.bridge.ip,
        message
      });

      if (!err) {
        if (response && response.data.status === "ok") {
          state.lock.readMessage = response.data.read;
        } else {
          state.lock.error = response.data.error;
        }
      }

      console.log("err, response", err, response);
    },
    setBattery: ({ state }, { voltage }) => {
      state.lock.battery.voltage = voltage;
    }
  }
});

export const useOvermind = createHook(overmind);
