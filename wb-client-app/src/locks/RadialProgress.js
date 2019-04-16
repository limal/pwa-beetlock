import React, { Fragment } from "react";
import "../css/RadialProgress.scss";

export const RadialProgress = ({ active = false }) => {
  return (
    <div className="RadialProgress">
      <svg
        className={`RadialProgress__Background ${
          active ? "RadialProgress__Background--active" : ""
        }`}
        height="300"
        width="300"
        viewBox="0 0 300 300"
      >
        <circle cx="150" cy="150" r="101" fill="#fff" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="300"
        width="300"
        viewBox="0 0 200 200"
        data-value="40"
        className="RadialProgress__Meter"
      >
        <path
          className="RadialProgress__Meter__Background"
          d="M41 149.5a77 77 0 1 1 117.93 0"
          fill="none"
        />
        <path
          className={`RadialProgress__Meter__Meter ${
            active ? "RadialProgress__Meter__Meter--full" : ""
          }`}
          stroke="currentColor"
          d="M41 149.5a77 77 0 1 1 117.93 0"
          fill="none"
          strokeDasharray="350"
          strokeDashoffset="350"
        />
      </svg>
    </div>
  );
};
