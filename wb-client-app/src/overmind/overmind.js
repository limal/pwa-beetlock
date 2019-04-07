import { Overmind } from "overmind";
import { createHook } from "overmind-react";
import axios from "axios";
import to from "await-to-js";
import { endpoints, wifiEndpoints } from "../util/endpoints";
import { BRIDGE_STEPS } from "../util/constants";

// const SERVER_URL = "http://localhost:3001";
// const SERVER_URL = "http://open.wb-lock.com:32100";
const SERVER_URL = process.env.REACT_APP_WB_CLOUD_URL;
const STATUS_TIMEOUT = 2500;

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
    bridge: {
      ip: null,
      userFriendlyId: null,
      finding: false,
      step: BRIDGE_STEPS.none,
      ssid: null,
      wifis: [],
      wifiReported: null,
      wifiSelected: null,
      wifiPassword: null
    }
  },
  effects: {
    authenticate: async ({ accessToken }) => {
      let response, err;

      console.log("* effects accessToken", accessToken);

      [err, response] = await to(
        axios.get(`${SERVER_URL}/user/info`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      );

      return err ? err.response : response;
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

      return err ? err.response : response;
    },
    login: async ({ username, password }) => {
      let response, err;

      [err, response] = await to(
        axios.post(`${SERVER_URL}/auth`, {
          username,
          password
        })
      );

      return err ? err.response : response;
    }
  },
  actions: {
    authenticate: async ({ state, effects }, { accessToken }) => {
      state.authenticated = false;
      const response = await effects.authenticate({ accessToken });
      if (response && response.status < 300) {
        state.authenticated = true;
      }

      state.bootstrapped = true;
    },
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

      let response = await effects.findBridge({ userFriendlyId });
      if (response && response.status < 300) {
        if (response.data.status === "ok") {
          const ipAddress = response.data.bridge.ip;
          // check if the bridge central API is working
          response = await effects.getStatus({ ipAddress });
          if (response.status === "ok2") {
            state.bridge.finding = false;
            state.bridge.ip = ipAddress;
          } else {
            state.bridge.error = `Found the bridge but cannot connect to it at "${ipAddress}".`;
          }
        }
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
    login: async ({ state, effects }, { username, password }) => {
      state.login.loading = true;
      const response = await effects.login({
        username,
        password
      });

      console.log("* response", response);

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
    },
    logout: ({ state }) => {
      state.authenticated = false;
      state.accessToken = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setWifiSelected: ({ state }, { wifiSelected, wifiPassword }) => {
      state.bridge.wifiSelected = wifiSelected;
      state.bridge.wifiPassword = wifiPassword;
    }
  }
});

export const useOvermind = createHook(overmind);
