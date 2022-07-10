import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import React, { useState } from "react";
import { StyledButton, StyledUL } from "./styled";

const ContentToggler = ({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) => {
  const [isViewActive, setIsViewActive] = useState(false);
  const toggleView = () => {
    setIsViewActive(!isViewActive);
  };
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <StyledButton onClick={toggleView}>
          {isViewActive ? (
            <ArrowUpward fontSize="small" />
          ) : (
            <ArrowDownward fontSize="small" />
          )}
        </StyledButton>
        <span>{title}</span>
      </div>
      <StyledUL />
      {isViewActive && children}
    </div>
  );
};

export default ContentToggler;
