import React from "react";
import { Logo } from "./Logo";
import { Back } from "./icons/Back";
import { MainMenu } from "./MainMenu";
import "../css/Layout.scss";

const Layout = ({ children }) => {
  return (
    <div className="Layout">
      <div className="Layout-Header">
        {/* <Back className="Flip-H" /> */}
        <Logo />
        <MainMenu />
      </div>
      {children}
    </div>
  );
};

export { Layout };