import * as React from "react";
const SelectIcon = (props) => {
  const stroke = "#afafaf3d";
  return (
    <svg
      className="cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      width={140}
      height={140}
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        style={{
          fill: "none",
          stroke,
          strokeWidth: 16,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
        d="M16 48a32 32 0 0 1 32-32"
      />
      <path
        transform="scale(-1 1)"
        style={{
          fill: "none",
          stroke,
          strokeWidth: 16,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
        d="M-240 48a32 32 0 0 1 32-32"
      />
      <path
        transform="scale(-1)"
        style={{
          fill: "none",
          stroke,
          strokeWidth: 16,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
        d="M-240-208a32 32 0 0 1 32-32"
      />
      <path
        transform="scale(1 -1)"
        style={{
          fill: "none",
          stroke,
          strokeWidth: 16,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
        d="M16-208a32 32 0 0 1 32-32"
      />
      <path
        style={{
          fill: "none",
          stroke,
          strokeWidth: 16,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeMiterlimit: 4,
          strokeDasharray: "none",
          strokeOpacity: 1,
        }}
        d="M240 144v32m0-96v32M16 144v32m0-96v32m96-96H80m96 0h-32m-32 224H80m96 0h-32M96 128h64m-32-32v64"
      />
    </svg>
  );
};

export default SelectIcon;
