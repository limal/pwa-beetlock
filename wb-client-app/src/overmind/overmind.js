import { Overmind } from "overmind";
import { createHook } from "overmind-react";
import axios from "axios";
import to from "await-to-js";
import { endpoints } from "../util/endpoints";
import { BRIDGE_STEPS } from "../util/constants";

// const SERVER_URL = "http://localhost:3001";
// const SERVER_URL = "http://open.wb-lock.com:32100";
const SERVER_URL = process.env.REACT_APP_WB_CLOUD_URL;
const BRIDGE_UUID = "3eaff70b-b611-4bb0-8d4c-baffb56f9455";

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
        axios.post(endpoints.connectWifi(ipAddress), { ssid, password })
      );

      return err ? err.resopnse : response;
    },
    getBridge: async ({ accessToken }) => {
      let [err, response] = await to(
        axios.post(endpoints.getBridge, { uuid: BRIDGE_UUID })
      );

      return err ? err.resopnse : response;
    },
    getWifis: async ({ accessToken, ipAddress }) => {
      console.log("* ip", ipAddress, endpoints.getWifis(ipAddress));
      let [err, response] = await to(axios.get(endpoints.getWifis(ipAddress)));

      return err ? err.resopnse : response;
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
    getBridge: async ({ state, effects }, { accessToken } = {}) => {
      state.bridge.wifis = [];
      const response = await effects.getBridge({ accessToken });
      if (response && response.status < 300) {
        state.bridge.step = BRIDGE_STEPS.passwordRequired;
        state.bridge.ip = "localhost:3020"; //response.data.ip + ":3020";
        state.bridge.ssid = response.data.ssid;
      } else {
        state.bridge.step = BRIDGE_STEPS.error;
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