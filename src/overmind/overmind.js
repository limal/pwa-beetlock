import { Overmind } from "overmind";
import { createHook } from "overmind-react";
import axios from "axios";
import to from "await-to-js";

export const overmind = new Overmind({
  state: {
    authenticated: false,
    accessToken: null,
    refreshToken: null,
    login: {
      errors: null,
      loading: false
    }
  },
  effects: {
    request: async ({ username, password }) => {
      let response, err;

      [err, response] = await to(
        axios.post("http://localhost:3001/auth", {
          username,
          password
        })
      );

      if (err) {
        return err.response;
      } else {
        return response;
      }
    }
  },
  actions: {
    login: async ({ state, effects }, { username, password }) => {
      state.login.loading = true;
      const response = await effects.request({
        username,
        password
      });

      if (response.status < 300) {
        state.accessToken = response.data.token;
        state.refreshToken = response.data.refresh_token;
        state.login.errors = null;
      } else {
        state.accessToken = null;
        state.refreshToken = null;
        state.login.errors = response.data;
      }

      state.login.loading = false;
    }
  }
});

export const useOvermind = createHook(overmind);
