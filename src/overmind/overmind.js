import { Overmind } from "overmind";
import { createHook } from "overmind-react";
import axios from "axios";
import to from "await-to-js";

const SERVER_URL = "http://localhost:3001";

export const overmind = new Overmind({
  state: {
    authenticated: false,
    bootstrapped: false,
    accessToken: null,
    refreshToken: null,
    login: {
      errors: null,
      loading: false
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
    login: async ({ state, effects }, { username, password }) => {
      state.login.loading = true;
      const response = await effects.login({
        username,
        password
      });

      if (response.status < 300) {
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
    authenticate: async ({ state, effects }, { accessToken }) => {
      state.authenticated = false;
      const response = await effects.authenticate({ accessToken });
      if (response.status < 300) {
        state.authenticated = true;
      }

      state.bootstrapped = true;
    }
  }
});

export const useOvermind = createHook(overmind);
