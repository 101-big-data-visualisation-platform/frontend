import styled from "styled-components";
import { navbarHeight } from "../../constants";

export const StyledDiv1 = styled("div")`
  width: 85%;
  margin: 20px auto;
`;

export const StyledDiv2 = styled("div")`
  display: flex;
  border-top: 2px solid ${({ theme }) => theme.colors.secondary};
`;

export const StyledDiv3 = styled("div")`
  width: 350px;
`;

export const StyledDiv4 = styled("div")`
  background-color: ${({ theme }) => theme.colors.primary2};
  min-height: calc(100vh - ${navbarHeight});
  padding: 20px;
  border-left: 2px solid ${({ theme }) => theme.colors.secondary};
`;

export const StyledButton = styled("button")`
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 2px;
  color: ${({ theme }) => theme.colors.secondary};
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

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

export const MinorSeparator = styled("div")`
  margin-top: 10px;
`;

