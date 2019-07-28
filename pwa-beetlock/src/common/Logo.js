import React from "react";
import { Link } from "react-router-dom";
import { WBLockLogo } from "../common/icons/WBLockLogo";

export const Logo = () => (
  <div className="Logo">
    <Link to="/" className="Logo-Link">
      <WBLockLogo />
    </Link>
  </div>
);
