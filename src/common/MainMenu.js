import React, { useState } from "react";
import { Menu } from "./icons/Menu";
import { Overlay } from "./Overlay";

export const MainMenu = () => {
  const [open, setOpen] = useState(false);

  const handleClick = e => {
    e.preventDefault();
    setOpen(!open);
  };

  return (
    <div className="MainMenu">
      <Overlay open={open} handleClick={handleClick} />
      <div className={`MainMenu-IconContainer `}>
        <Menu className={open && "MainMenu-Active"} onClick={handleClick} />
        <div className={`MainMenu-List ${!open && "Hidden"}`}>Logout</div>
      </div>
    </div>
  );
};
