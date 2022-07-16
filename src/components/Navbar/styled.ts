import styled from "styled-components";
import { Container } from "../Container";
import { Link } from "react-router-dom";
import { Button as MUIButton, Menu } from "@mui/material";

export const MainDiv = styled("div")`
  @media (max-width: 800px) {
    display: none;
  }
  background: ${({ theme }) => theme.colors.primary};
  position: relative;
  z-index: 1000;
`;

export const MobileMainDiv = styled("div")`
  display: none;
  @media (max-width: 800px) {
    display: block;
  }
`;

export const BrandH1 = styled("h1")`
  font-size: 2rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Button = styled("button")`
  padding: 10px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  font-size: 1rem;
  min-width: 100px;
  border-radius: 5px;
  transition: 300ms;
  height: 42.4px;
  cursor: pointer;
  &:focus,
  &:hover {
    background: ${({ theme }) => theme.colors.secondaryHover};
  }
`;

export const AuthButton = styled(MUIButton)`
  margin-left: 20px !important;
  width: 100%;
  text-align: center !important;
  font-size: 1rem !important;
  background: transparent !important;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary} !important;
  border: 2px solid ${({ theme }) => theme.colors.secondary} !important;
  min-width: 100px !important;
  border-radius: 5px !important;
  transition: 300ms !important;
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.primary} !important;
    background: ${({ theme }) => theme.colors.secondary} !important;
  }
  @media (max-width: 800px) {
    margin-left: 0 !important;
  }
`;

export const LinkButton = styled(Link)`
  padding: 10px;
  text-align: center;
  font-size: 1rem;
  text-decoration: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  min-width: 100px;
  border-radius: 5px;
  transition: 300ms;
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export const MenuButton = styled("button")`
  padding: 10px;
  text-align: center;
  font-size: 1rem;
  text-decoration: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  min-width: 60px;
  border-radius: 5px;
  cursor: pointer;
  transition: 300ms;
  &:focus,
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export const ButtonsDiv = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  ${Button},${LinkButton} {
    margin-left: 10px;
  }
`;
export const PageLink = styled(Link)`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.secondary};
  transition: 300ms;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.colors.secondaryHover};
  }
`;
export const ContainerStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  ${Button},${LinkButton},${PageLink} {
    margin-bottom: 10px;
  }
`;
export const PagesDiv = styled("div")`
  display: flex;
  align-items: center;
  ${BrandH1} {
    margin-right: 50px;
  }
  ${PageLink} {
    margin-right: 20px;
  }
`;

export const MenuStyled = styled(Menu)`
  & .MuiPaper-root {
    background: ${({ theme }) => theme.colors.primary2} !important;
    color: ${({ theme }) => theme.colors.secondary2} !important;
    box-shadow: none !important;
    margin-top: 10px;
    width: 300px;
  }
  & .MuiSvgIcon-root {
    margin-right: 20px;
  }
  ,
  @media(max-width: 800px) {
    display: none !important;
  }
`;

export const MenuStyledMobile = styled(Menu)`
  display: none;
  & .MuiPaper-root {
    background: ${({ theme }) => theme.colors.primary2} !important;
    color: ${({ theme }) => theme.colors.secondary2} !important;
    box-shadow: none !important;
    margin-top: 10px;
    width: 300px;
  }
  & .MuiSvgIcon-root {
    margin-right: 20px;
  }
  ,
  @media(max-width: 800px) {
    display: block !important;
  }
`;
