import React from "react";
import { SVG } from "../SVG";

interface Props {
  color1: string;
  color2: string;
}

const Mountains: React.FC<Props> = ({ color1, color2 }) => {
  return (
    <SVG
      width="1549"
      height="635"
      viewBox="0 0 1549 635"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1362.02 54.1377C1362.33 53.9541 1362.72 53.9541 1363.03 54.1377L2479.56 709.728C2480.44 710.244 2480.07 711.59 2479.05 711.59H246.002C244.982 711.59 244.617 710.244 245.495 709.728L1362.02 54.1377Z"
        fill={color2}
      />
      <path
        d="M1117.02 0.137657C1117.33 -0.0458956 1117.72 -0.0458807 1118.03 0.137672L2234.56 655.728C2235.44 656.244 2235.07 657.59 2234.05 657.59H1.00162C-0.0176053 657.59 -0.383502 656.244 0.495411 655.728L1117.02 0.137657Z"
        fill={color1}
      />
    </SVG>
  );
};

export default Mountains;
