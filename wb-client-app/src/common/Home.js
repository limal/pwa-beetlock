import React, { useEffect } from "react";
import { useOvermind } from "../overmind/overmind";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "../css/Locks.scss";
import { Onboarding } from "./Onboarding";

dayjs.extend(relativeTime);

export const Home = ({ history, ...props }) => {
  const { state, actions } = useOvermind();

  if (state.authenticated) {
    history.push("/locks");
  }
  return <Onboarding history={history} {...props} />;
};
