import { Overmind } from "overmind";
import { createHook } from "overmind-react";
import axios from "axios";
import to from "await-to-js";

export const overmind = new Overmind({
  state: {
    authenticated: false,
    accessToken: null,
    loading: false
  },
  effects: {
    request: async ({ username, password }) => {
      let response, err;

      [response, err] = await to(
        axios.post("http://localhost:3001/auth", {
          username,
          password
        })
      );

      return response.response.data;
    }
  },
  actions: {
    login: async ({ state, effects }) => {
      state.loading = true;
      state.accessToken = await effects.request({
        username: "test@test.com",
        password: "test"
      });
      state.loading = false;
    }
  }
});

export const useOvermind = createHook(overmind);
