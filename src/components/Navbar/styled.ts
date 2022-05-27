import styled from "styled-components";

export const MainDiv = styled("div")`
  display: flex;
  justify-content: space-between;
`;

export const BrandH1 = styled("h1")`
  font-size: 2rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Button = styled("button")``;
