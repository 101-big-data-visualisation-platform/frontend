import React, { Dispatch, SetStateAction, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  BrandH1,
  Button,
  ButtonsDiv,
  ContainerStyled,
  LinkButton,
  MainDiv,
  MenuButton,
  MobileMainDiv,
  PageLink,
  PagesDiv,
} from "./styled";
import themes from "../../themes/schema.json";
import { Container } from "../Container";

type Theme = {
  name: string;
  colors: {
    primary: string;
    primary2: string;
    primary3: string;
    primaryHover: string;
    secondary: string;
    secondary2: string;
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
  const [displayMenu, setDisplayMenu] = useState(false);

  type voidFunc = () => void;

  const toggleMenu: voidFunc = () => {
    setDisplayMenu(!displayMenu);
  };

  const handleClick: voidFunc = () => {
    const theme: Theme =
      selectedTheme.name === "dark" ? themes.data.light : themes.data.dark;
    setSelectedTheme(theme);
    localStorage.setItem("theme", JSON.stringify(theme));
  };

  return (
    <>
      <MainDiv>
        <Container style={{ display: "flex", justifyContent: "space-between" }}>
          <PagesDiv>
            <BrandH1>Mohio</BrandH1>
            <PageLink to="/">Home</PageLink>
            <PageLink to="/dashboard">Dashboard</PageLink>
          </PagesDiv>
          <ButtonsDiv>
            <Button onClick={handleClick}>
              {selectedTheme.name === "light" ? "Dark" : "Light"}
            </Button>
            <LinkButton to="/login">Login</LinkButton>
            <LinkButton to="/register">Register</LinkButton>
          </ButtonsDiv>
        </Container>
      </MainDiv>
      <MobileMainDiv>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BrandH1>Mohio</BrandH1>
          <MenuButton onClick={toggleMenu}>
            {displayMenu ? <CloseIcon /> : <MenuIcon />}
          </MenuButton>
        </Container>
        {displayMenu && (
          <ContainerStyled>
            <PageLink to="/">Home</PageLink>
            <PageLink to="/dashboard">Dashboard</PageLink>
            <Button onClick={handleClick}>
              {selectedTheme.name === "light" ? "Dark" : "Light"}
            </Button>
            <LinkButton to="/login">Login</LinkButton>
            <LinkButton to="/register">Register</LinkButton>
          </ContainerStyled>
        )}
      </MobileMainDiv>
    </>
  );
};

export default Navbar;
