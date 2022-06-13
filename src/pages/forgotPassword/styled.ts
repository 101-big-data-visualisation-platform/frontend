import { OutlinedInput } from "@mui/material";
import styled from "styled-components";
import { navbarHeight } from "../../constants";

const breakpoint1: string = "400px";
const breakpoint2: string = "800px";

export const StyledDiv2 = styled("div")`
  width: 700px;
  @media (max-width: ${breakpoint2}) {
    width: 100%;
  }
`;
export const StyledDiv1 = styled("div")`
  width: 100%;
  height: calc(100vh - ${navbarHeight});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: ${breakpoint1}) {
    align-items: flex-start;
  }
`;

export const StyledInput = styled(OutlinedInput)`
  margin-top: 10px;
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
  @media (max-width: ${breakpoint1}) {
    width: 100%;
  }
`;

export const SendButton = styled("button")`
  background: #65b1f7;
  color: white;
  padding: 10px 30px;
  border-radius: 5px;
  border: none;
  transition: 300ms;
  height: 40px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
  }
  &:disabled {
    background: gray;
    color: lightgray;
  }
  @media (max-width: ${breakpoint1}) {
    width: 100%;
    margin-left: 0;
    margin-bottom: 10px;
  }
`;
