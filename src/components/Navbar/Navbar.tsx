import React, { Dispatch, SetStateAction } from "react";
import { BrandH1, Button, MainDiv } from "./styled";
import themes from "../../themes/schema.json";

type Theme = {
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

interface Props {
  setSelectedTheme: Dispatch<SetStateAction<Theme>>;
  selectedTheme: Theme;
}

const Navbar: React.FC<Props> = ({ setSelectedTheme, selectedTheme }) => {
  type voidFunc = () => void;
  const handleClick: voidFunc = () => {
    const theme: Theme =
      selectedTheme.name === "dark" ? themes.data.light : themes.data.dark;
    setSelectedTheme(theme);
    localStorage.setItem("theme", JSON.stringify(theme));
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
