import styled from "styled-components";
import { StyledButton } from "../styled";

export const StyledButton2 = styled("button")`
  background: ${({ theme }) => theme.colors.tertiary};
  border: none;
  border-radius: 2px;
  padding: 2px 20px;
  color: white;
  &:hover {
    background: skyblue;
  }
`;

export const StyledDiv5 = styled("div")`
  margin-top: 10px;
  & ${StyledButton} {
    margin-right: 5px;
  }
`;

export const MinorSeparator = styled("div")`
  margin-top: 10px;
`;
