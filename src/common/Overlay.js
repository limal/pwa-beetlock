import React from "react";

export const Overlay = ({ handleClick, open }) => {
  return (
    <div className={`Overlay ${!open && "Hidden"}`} onClick={handleClick} />
  );
};
