import React, { Fragment } from "react";
import "../css/RadialProgress.scss";

export const RadialProgress = ({
  active = false,
  opened = false,
  closed = false
}) => {
  return (
    <div className="RadialProgress">
      {active ? (
        <Fragment>
          <svg
            className={`RadialProgress__Background ${
              opened ? "RadialProgress__Background--opened" : ""
            }
              ${closed ? "RadialProgress__Background--closed" : ""}`}
            height="300"
            width="300"
            viewBox="0 0 300 300"
          >
            <circle cx="150" cy="150" r="101" fill="currentColor" />
          </svg>
          <svg
            className={`RadialProgress__Background__White ${
              opened ? "RadialProgress__Background__White--opened" : ""
            } ${closed ? "RadialProgress__Background__White--closed" : ""}`}
            height="300"
            width="300"
            viewBox="0 0 300 300"
          >
            <circle cx="150" cy="150" r="101" fill="currentColor" />
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
                opened ? "RadialProgress__Meter__Meter--opened" : ""
              }${closed ? "RadialProgress__Meter__Meter--closed" : ""}`}
              stroke="currentColor"
              d="M41 149.5a77 77 0 1 1 117.93 0"
              fill="none"
              strokeDasharray="350"
              strokeDashoffset="350"
            />
          </svg>
        </Fragment>
      ) : null}
    </div>
  );
};
