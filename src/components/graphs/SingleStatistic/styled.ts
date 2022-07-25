import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledDiv1 = styled("div")`
  width: 500px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  margin: 10px;
  flex-grow: 1;
  border-radius: 15px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
`;

export const StyledDiv2 = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledDiv3 = styled("div")`
  margin: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  width: 200px;
  border-radius: 5px;
`;

export const StyledButton = styled("button")`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 5px;
  border-radius: 5px;
  margin-right: 10px;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};
  }
  font-size: 0.8rem;
`;

export const StyledLink = styled(Link)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 5px;
  text-decoration: none;
  border-radius: 5px;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.secondary};
  }
  font-size: 0.8rem;
  margin-right: 10px;
`;

export const ValueH1 = styled("h1")`
  font-size: 3rem;
  margin-top: 0;
  margin-bottom: 0;
`;
