import { Overmind } from "overmind";
import { createHook } from "overmind-react";
import axios from "axios";
import to from "await-to-js";
import { endpoints } from "../util/endpoints";

const SERVER_URL = "http://localhost:3001";
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
      found: false,
      wifis: []
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
    getBridge: async ({ accessToken }) => {
      let [err, response] = await to(
        axios.post(endpoints.getBridge, { uuid: BRIDGE_UUID })
      );

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
    getBridge: async ({ state, effects }, { accessToken }) => {
      state.bridge.found = false;
      state.bridge.wifis = [];
      const response = await effects.getBridge({ accessToken });
      if (response && response.status < 300) {
        state.bridge.found = true;
        state.bridge.wifis = response;
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
    }
  }
});

export const useOvermind = createHook(overmind);