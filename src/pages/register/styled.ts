import IconButton from "@mui/material/IconButton";
import { OutlinedInput } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { navbarHeight } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const breakpoint1: string = "900px";
const breakpoint2: string = "500px";

export const StyledDiv6 = styled("div")`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  @media (max-width: ${breakpoint2}) {
    flex-direction: column;
    & > * {
      margin-top: 10px;
    }
  }
`;

export const StyledDiv5 = styled("div")`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: ${breakpoint1}) {
    display: block;
  }
`;

export const StyledDiv4 = styled("div")`
  width: 45%;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-right: 20px;
  @media (max-width: ${breakpoint1}) {
    width: 100%;
    padding-right: 0;
  }
`;

export const StyledDiv3 = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  position: relative;
  z-index: 1;
  justify-content: space-between;
  @media (max-width: ${breakpoint1}) {
    flex-direction: column;
  }
`;

export const StyledDiv2 = styled("div")`
  width: 800px;
  background: ${({ theme }) => theme.colors.primary2};
  height: 500px;
  border-radius: 30px;
  margin: 0 20px;
  padding: 50px;
  position: relative;
  overflow: hidden;
  @media (max-width: ${breakpoint1}) {
    height: fit-content;
  }
`;

export const StyledDiv1 = styled("div")`
  width: 98vw;
  height: calc(100vh - ${navbarHeight});
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: ${breakpoint2}) {
    height: calc(100vh + 200px);
  }
`;

export const StyledH1 = styled("h1")`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 2rem;
`;

export const RegisterHeader = styled("h1")`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 2rem;
  width: 100%;
`;

export const LinkButton = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: 300ms;
  &:hover {
    color: ${({ theme }) => theme.colors.secondaryHover};
  }
`;

export const StyledArrowBackIcon = styled(ArrowBackIcon)`
  font-size: 1rem !important;
  margin-right: 10px;
`;

export const StyledP = styled("p")`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.5rem;
  text-align: center;
  margin-top: 0;
  @media (max-width: ${breakpoint1}) {
    text-align: left;
  }
`;

export const LoginLinkButton = styled(Link)`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  border: none;
  padding: 10px 30px;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => theme.colors.secondaryHover};
  }
`;

export const StyledForm = styled("form")`
  display: flex;
  flex-direction: column;
`;

export const StyledInput = styled(OutlinedInput)`
  margin-bottom: 10px;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.secondary};

  height: 40px;
  overflow: hidden;
  border-radius: 5px;
  &:focus,
  &:hover {
    outline: none !important;
  }
  & fieldset {
    border-width: 0 !important;
    padding: 0 0;
  }
  & input {
    padding: 0 20px !important;
    height: 40px;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const InputLabel = styled("p")`
  margin-top: 0;
  margin-bottom: 0;
`;

export const RegisterButton = styled("button")`
  background: #65b1f7;
  color: white;
  padding: 10px 30px;
  border-radius: 5px;
  border: none;
  transition: 300ms;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
  }
  &:disabled {
    background: gray;
    color: lightgray;
  }
`;

export const StyledIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.secondary} !important;
`;
