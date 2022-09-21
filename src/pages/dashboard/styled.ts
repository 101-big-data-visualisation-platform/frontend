import styled from "styled-components";

export const StyledDiv1 = styled("div")`
  width: 400px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  margin: 10px;
  flex-grow: 1;
  border-radius: 15px;
`;

export const GraphsWrapper = styled("div")`
  display: flex;
  flex-wrap: wrap;
`;

export const StyledSelect = styled("select")`
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1rem;
`;

export const StyledOption = styled("option")`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 10px 10px;
`;

export const StyledButton = styled("button")`
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    background: ${({ theme }) => theme.colors.secondaryHover};
  }
`;

export const StyledInput = styled("input")`
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0 10px;
  height: 22px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  font-size: 0.8rem;
`;

export const DeleteButton = styled("button")`
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background: #ff3838;
  color: white;
  &:hover {
    background: red;
  }
  &:disabled {
    background: #945a5a;
    color: lightgray;
  }
`;

export const AddGraphButton = styled("button")`
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background: ${({ theme }) => theme.colors.tertiary2};
  color: white;
  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
  }
`;

export const AddDailyReportingButton = styled("button")`
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  background: ${({ theme }) => theme.colors.purple100};
  color: white;
  &:hover {
    background: ${({ theme }) => theme.colors.purple100Hover};
  }
`;

export const DashboardContentWrapper = styled("div")`
  padding-top: 50px;
`;

export const DashboardHeading = styled("h1")`
  text-decoration: underline;
`;

export const DailyReportsWrapper = styled("div")`
  display: flex;
  flex-wrap: wrap;
`;

export const DailyReportWrapper = styled("div")`
  padding: 20px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-width: 300px;
  margin: 10px;
  position: relative;
`;

export const DailyReportBarGauge = styled("div")`
  height: 20px;
  width: 100%;
  padding:2px;
  background: ${({ theme }) => theme.colors.secondary};
`;

export const BarGaugeContent = styled("div")`
  height: 100%;
  width: 50%;
  background: green;
`;

export const DailyReportDelete = styled("button")`
  position: absolute;
  top: 10px;
  left: 10px;
`;
