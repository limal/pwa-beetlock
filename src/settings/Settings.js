import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import "../css/Settings.scss";

export const Settings = ({ history, ...props }) => {
  return (
    <div className="Settings">
      <h1 className="Settings__Header">Settings</h1>
      <Link to={ROUTES.bridgeWifi} className="Settings__Option">
        Change bridge WiFi
      </Link>
    </div>
  );
};
