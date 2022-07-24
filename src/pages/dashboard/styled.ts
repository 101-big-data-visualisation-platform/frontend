import { navbarHeight } from "./../../constants";
import styled from "styled-components";

export const StyledDiv1 = styled("div")`
  width: 400px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  margin: 10px;
  flex-grow: 1;
  border-radius: 15px;
`;

export const StyledSelect = styled("select")`
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1rem;
`;

export const StyledOption = styled("option")`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 10px 10px;
`;

export const StyledButton = styled("button")`
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    background: ${({ theme }) => theme.colors.secondaryHover};
  }
`;

export const StyledInput = styled("input")`
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0 10px;
  height: 22px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 0.8rem;
`;

export const DeleteButton = styled("button")`
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background: #ff3838;
  color: white;
  &:hover {
    background: red;
  }
  &:disabled {
    background: #945a5a;
    color: lightgray;
  }
`;

export const AddGraphButton = styled("button")`
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background: ${({ theme }) => theme.colors.tertiary2};
  color: white;
  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
  }
`;
