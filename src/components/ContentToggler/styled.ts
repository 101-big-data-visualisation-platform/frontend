import styled from "styled-components";

export const StyledButton = styled("button")`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.5rem;
`;

export const StyledUL = styled("ul")`
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  margin-top: 0;
  margin-bottom: 0;
`;
