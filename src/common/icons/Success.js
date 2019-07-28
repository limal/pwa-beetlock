import React from "react";

export const Success = ({ width = 128, height = 128, ...props }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M10,17.414l-4.707-4.707 l1.414-1.414L10,14.586l7.293-7.293l1.414,1.414L10,17.414z"
      fill="currentColor"
    />
  </svg>
);