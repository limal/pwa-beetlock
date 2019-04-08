import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../css/Locks.scss";
import { Onboarding } from "./Onboarding";
import { ROUTES } from "../routes/routes";

dayjs.extend(relativeTime);

export const Home = ({ history, ...props }) => {
  const { state, actions } = useOvermind();

  if (state.authenticated) {
    history.push(ROUTES.locks);
  }

  if (state.bridge.ip && state.bridge.occupied !== null) {
    if (state.bridge.occupied) {
      history.push(ROUTES.login);
    } else {
      history.push(ROUTES.signUp);
    }
  }
  return <Onboarding history={history} {...props} />;
};
