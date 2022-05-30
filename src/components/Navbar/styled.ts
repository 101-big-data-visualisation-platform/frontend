import styled from "styled-components";
import { Container } from "../Container";
import { Link } from "react-router-dom";

export const MainDiv = styled("div")`
  @media (max-width: 800px) {
    display: none;
  }
  background: ${({ theme }) => theme.colors.primary};
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

export const ContainerStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  ${Button},${LinkButton} {
    margin-bottom: 10px;
  }
`;
