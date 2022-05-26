import React, { Dispatch, SetStateAction } from "react";
import { BrandH1, Button, MainDiv } from "./styled";
import themes from "../../themes/schema.json";

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
  type voidFunc = () => void;
  const handleClick: voidFunc = () => {
    setSelectedTheme(
      selectedTheme.name === "dark" ? themes.data.light : themes.data.dark
    );
  };
  return (
    <MainDiv>
      <BrandH1>Mohio</BrandH1>
      <Button onClick={handleClick}>
        {selectedTheme.name === "light" ? "Dark" : "Light"}
      </Button>
    </MainDiv>
  );
};

export default Navbar;
