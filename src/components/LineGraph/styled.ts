import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledDiv1 = styled("div")`
  width: 500px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  margin: 10px;
  flex-grow: 1;
  border-radius: 15px;
`;

export const StyledButton = styled("button")`
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  padding: 5px;
  border-radius: 5px;
  margin-right: 10px;
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }
  font-size: 0.8rem;
`;

export const StyledLink = styled(Link)`
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  padding: 5px;
  text-decoration: none;
  border-radius: 5px;
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.primary};
  }
  font-size: 0.8rem;
  margin-right: 10px;
`;
