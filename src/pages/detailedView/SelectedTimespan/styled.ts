import styled from "styled-components";
import { StyledButton } from "../styled";

export const StyledDiv5 = styled("div")`
  margin-top: 10px;
  & ${StyledButton} {
    margin-right: 5px;
  }
`;
