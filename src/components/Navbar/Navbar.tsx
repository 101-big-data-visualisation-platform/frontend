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
  MenuStyled,
  MenuStyledMobile,
  MobileMainDiv,
  PageLink,
  PagesDiv,
} from "./styled";
import themes from "../../themes/schema.json";
import { Container } from "../Container";
import { Auth } from "aws-amplify";
import { CircularProgress, MenuItem } from "@mui/material";
import { ArrowDownward, Logout } from "@mui/icons-material";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import GraphsContext from "../../contexts/GraphsContext";
import DataContext from "../../contexts/DataContext";

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
  const { user, setUser, fetchingUser } = useContext(AuthContext);
  const { setGraphs } = useContext(GraphsContext);
  const { setData } = useContext(DataContext);
  const navigate = useNavigate();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
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
    setLoggingOut(true);
    await Auth.signOut();
    setUser(null);
    setGraphs([]);
    setData([]);
    setLoggingOut(false);
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
                {fetchingUser ? (
                  "Fetching User"
                ) : (
                  <>
                    <LinkButton to="/login">Login</LinkButton>
                    <LinkButton to="/register">Register</LinkButton>
                  </>
                )}
              </>
            ) : (
              <div>
                <AuthButton
                  endIcon={<ArrowDownward />}
                  onClick={handleAuthButtonClick}
                >
                  {user.username} Logged In
                </AuthButton>
                <MenuStyled
                  style={{ zIndex: 100000 }}
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem disabled={loggingOut} onClick={logout}>
                    <Logout /> Logout
                    {loggingOut && (
                      <CircularProgress
                        style={{ marginLeft: "auto" }}
                        size={20}
                      />
                    )}
                  </MenuItem>
                </MenuStyled>
              </div>
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
            {!user?.username ? (
              <>
                {fetchingUser ? (
                  "Fetching User"
                ) : (
                  <>
                    <LinkButton to="/login">Login</LinkButton>
                    <LinkButton to="/register">Register</LinkButton>
                  </>
                )}
              </>
            ) : (
              <div>
                <AuthButton
                  endIcon={<ArrowDownward />}
                  onClick={handleAuthButtonClick}
                >
                  {user.username} Logged In
                </AuthButton>
                <MenuStyledMobile
                  style={{ zIndex: 100000 }}
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem disabled={loggingOut} onClick={logout}>
                    <Logout /> Logout
                    {loggingOut && (
                      <CircularProgress
                        style={{ marginLeft: "auto" }}
                        size={20}
                      />
                    )}
                  </MenuItem>
                </MenuStyledMobile>
              </div>
            )}
          </ContainerStyled>
        )}
      </MobileMainDiv>
    </>
  );
};

export default Navbar;
