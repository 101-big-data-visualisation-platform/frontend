import styled from "styled-components";

export const StyledDiv1 = styled("div")`
  width: 400px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  margin:10px;
  flex-grow: 1;
  border-radius:15px;
`;
