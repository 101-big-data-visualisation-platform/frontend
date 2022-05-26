import React, { Dispatch, SetStateAction } from "react";
import { BrandH1, MainDiv } from "./styled";

interface Props {
  setSelectedTheme: Dispatch<
    SetStateAction<{
      name: string;
      colors: {
        primary: string;
        primaryHover: string;
        secondary: string;
        secondaryHover: string;
        tertiary: string;
        tertiary2: string;
        tertiary3: string;
      };
    }>
  >;
  selectedTheme: {
    name: string;
    colors: {
      primary: string;
      primaryHover: string;
      secondary: string;
      secondaryHover: string;
      tertiary: string;
      tertiary2: string;
      tertiary3: string;
    };
  };
}

const Navbar: React.FC<Props> = ({ setSelectedTheme, selectedTheme }) => {
  return (
    <MainDiv>
      <BrandH1>Mohio</BrandH1>
    </MainDiv>
  );
};

export default Navbar;
