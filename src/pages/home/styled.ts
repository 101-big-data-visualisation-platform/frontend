import { Link } from "react-router-dom";
import styled from "styled-components";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SpeedIcon from "@mui/icons-material/Speed";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";

const navbarHeight: string = "79.88px";
const breakpoint1: string = "1000px";
const breakpoint2: string = "500px";

export const MainDiv = styled("div")`
  position: relative;
  bottom: 0;
  width: 100%;
  height: calc(100vh - ${navbarHeight});
`;

export const InnerDiv = styled("div")`
  position: absolute;
  width: 100%;
`;

export const LargeHeading = styled("h1")`
  font-size: 5rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 0;
  margin-bottom: 0;
  @media (max-width: ${breakpoint1}) {
    font-size: 4rem;
  }
  @media (max-width: ${breakpoint2}) {
    font-size: 2rem;
  }
`;

export const SubHeading = styled("h2")`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 0;
  margin-bottom: 0;
  @media (max-width: ${breakpoint1}) {
    font-size: 1rem;
  }
`;

export const LearnMoreLinkButton = styled(Link)`
  background: #98c3eb;
  border: none;
  border-radius: 5px;
  padding: 15px;
  font-size: 1rem;
  width: 90%;
  text-align: center;
  color: white;
  text-decoration: none;
  display: block;
  transition: 300ms;
  cursor: pointer;
  &:hover {
    background: #65b1f7;
  }
  @media (max-width: ${breakpoint2}) {
    width: 93%;
  }
`;

export const StartLinkButton = styled(Link)`
  background: #31495f;
  border: none;
  border-radius: 5px;
  padding: 15px;
  font-size: 2rem;
  width: 90%;
  font-weight: 600;
  letter-spacing: 6px;
  margin-top: 10px;
  text-align: center;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  display: block;
  transition: 300ms;
  cursor: pointer;
  &:hover {
    background: #5685b0;
  }
  @media (max-width: ${breakpoint2}) {
    width: 93%;
    margin-bottom: 10px;
  }
`;

export const StyledImage = styled("img")`
  width: 100%;
`;

export const StyledDiv5 = styled("div")`
  width: 50%;
  @media (max-width: ${breakpoint2}) {
    width: 100%;
  }
`;

export const StyledDiv4 = styled("div")`
  margin-top: 50px;
  ${StyledDiv5}:first-of-type {
    margin-right: 20px;
  }
  display: flex;
  @media (max-width: ${breakpoint2}) {
    display: block;
    ${StyledDiv5}:first-of-type {
      margin-right: 0 !important;
    }
  }
`;

export const StyledDiv3 = styled("div")`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  @media (max-width: ${breakpoint1}) {
    flex-direction: row;
  }
`;

export const StyledDiv2 = styled("div")`
  display: flex;
  @media (max-width: ${breakpoint1}) {
    flex-direction: column;
  }
`;

export const StyledDiv1 = styled("div")`
  margin-top: 100px;
  width: 800px;
  @media (max-width: ${breakpoint1}) {
    width: 100%;
  }
`;

const iconStyles: string = `
  font-size: 7rem !important;
  @media (max-width: ${breakpoint1}) {
    font-size: 4rem !important;
  }
  @media (max-width: ${breakpoint2}) {
    font-size: 2rem !important;
  }
`;

export const AssessmentIconStyled = styled(AssessmentIcon)`
  ${iconStyles}
`;
export const SpeedIconStyled = styled(SpeedIcon)`
  ${iconStyles}
`;
export const QueryBuilderIconStyled = styled(QueryBuilderIcon)`
  ${iconStyles}
`;
