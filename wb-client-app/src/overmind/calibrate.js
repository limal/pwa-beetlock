import axios from "axios";
import to from "await-to-js";
import { endpoints } from "../util/endpoints";

export const calibrateEffects = {
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
  }
};

export const calibrateActions = {
  phaseOpen: async ({ state, effects }, phaseOpen = true) => {
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

    console.log("err, response", err, response);
  }
};
