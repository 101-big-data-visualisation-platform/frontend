import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import {
  AuthButton,
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
import { Auth } from "aws-amplify";
import { Menu, MenuItem } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

  const open = Boolean(anchorEl);

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

  const logout: voidFunc = async () => {
    await Auth.signOut();
    setUser(null);
    navigate("/");
  };
  const handleAuthButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
            {!user?.username ? (
              <>
                <LinkButton to="/login">Login</LinkButton>
                <LinkButton to="/register">Register</LinkButton>
              </>
            ) : (
              <>
                <AuthButton
                  endIcon={<ArrowDownward />}
                  onClick={handleAuthButtonClick}
                >
                  {user.username} Logged In
                </AuthButton>
                <Menu
                  style={{ zIndex: 100000 }}
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            )}
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
