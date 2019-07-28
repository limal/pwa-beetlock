import { mutate, pipe } from "overmind";

const authenticate = () =>
  mutate(async function authenticate({ state, effects }, { accessToken }) {
    state.authenticated = false;
    const response = await effects.authenticate({
      accessToken,
      ipAddress: state.bridge.ip
    });
    if (response && response.status < 300) {
      state.authenticated = true;
      state.accessToken = accessToken;
      console.log("* mutate authenticate");
    } else {
      state.accessToken = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  });

const getLockState = () =>
  mutate(async function getLockState({ state, effects }) {
    const response = await effects.getLockState({
      accessToken: state.accessToken,
      ipAddress: state.bridge.ip
    });
    if (response && response.status < 300) {
      state.lock.state = response.data.state;
    } else {
      console.error("* error no user info");
    }

    state.bootstrapped = true;
  });

export const bootstrap = pipe(
  authenticate(),
  getLockState()
);
