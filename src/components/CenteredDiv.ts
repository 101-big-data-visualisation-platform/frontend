import styled from "styled-components";
import { navbarHeight } from "../constants";

export const CenteredDiv = styled("div")`
  width: 100vw;
  height: calc(100vh - ${navbarHeight});
  display: flex;
  align-items: center;
  justify-content: center;
`;
