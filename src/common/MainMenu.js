import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useOvermind } from "../overmind/overmind";
import { Menu } from "./icons/Menu";
import { Key } from "./icons/Key";
import { Overlay } from "./Overlay";
import { ROUTES } from "../routes/routes";
import { BatteryIndicator } from "./BatteryIndicator";

export const MainMenu = () => {
  const { state, actions } = useOvermind();
  const [open, setOpen] = useState(false);

  const toggleOpen = e => {
    setOpen(!open);
  };

  const handleLogout = e => {
    actions.logout();
    toggleOpen();
  };

  const MenuItem = ({ children, handleClick }) => (
    <li className="MainMenu-Item" onClick={handleClick}>
      {children}
    </li>
  );

  return (
    <div className="MainMenu">
      <Overlay open={open} handleClick={toggleOpen} />
      <div className={`MainMenu-IconContainer`}>
        {state.authenticated && <Key className="Key" />}
        <BatteryIndicator />
        <Menu className={open ? "MainMenu-Active" : ""} onClick={toggleOpen} />
        <div className={`MainMenu-List ${!open && "Hidden"}`}>
          {state.authenticated ? (
            <Fragment>
              <MenuItem>
                <Link to={ROUTES.home} onClick={toggleOpen}>
                  Home
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to={ROUTES.locks} onClick={toggleOpen}>
                  Locks
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to={ROUTES.settings} onClick={toggleOpen}>
                  Settings
                </Link>
              </MenuItem>
              <MenuItem handleClick={handleLogout}>
                <span>Logout</span>
              </MenuItem>
            </Fragment>
          ) : (
            <Fragment>
              <MenuItem>
                <Link to={ROUTES.login} onClick={toggleOpen}>
                  Login
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to={ROUTES.signUp} onClick={toggleOpen}>
                  Sign up
                </Link>
              </MenuItem>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
