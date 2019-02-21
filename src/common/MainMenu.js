import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useOvermind } from "../overmind/overmind";
import { Menu } from "./icons/Menu";
import { Overlay } from "./Overlay";

export const MainMenu = () => {
  const { state, actions } = useOvermind();
  const [open, setOpen] = useState(false);

  const toggleOpen = e => {
    e && e.preventDefault();
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
      <div className={`MainMenu-IconContainer `}>
        <Menu className={open && "MainMenu-Active"} onClick={toggleOpen} />
        <div className={`MainMenu-List ${!open && "Hidden"}`}>
          {state.authenticated ? (
            <MenuItem handleClick={handleLogout}>Logout</MenuItem>
          ) : (
            <MenuItem>
              <Link to="/login" onClick={toggleOpen}>
                Login
              </Link>
            </MenuItem>
          )}
        </div>
      </div>
    </div>
  );
};
