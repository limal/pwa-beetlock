import React, { Fragment, useState } from "react";
import "../css/RadialProgress.scss";

export const RadialProgress = ({ active = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="300"
      width="300"
      viewBox="0 0 200 200"
      data-value="40"
      className="RadialProgress"
    >
      <path
        className="RadialProgress__Background"
        d="M41 149.5a77 77 0 1 1 117.93 0"
        fill="none"
      />
      <path
        className={`RadialProgress__Meter ${
          active ? "RadialProgress__Meter--full" : null
        }`}
        stroke="currentColor"
        d="M41 149.5a77 77 0 1 1 117.93 0"
        fill="none"
        strokeDasharray="350"
        strokeDashoffset="350"
      />
    </svg>
  );
};
