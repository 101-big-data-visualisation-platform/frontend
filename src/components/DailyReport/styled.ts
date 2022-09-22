import styled from "styled-components";

export const DailyReportWrapper = styled("div")`
  padding: 20px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 300px;
  margin: 10px;
  position: relative;
`;

export const DailyReportBarGauge = styled("div")`
  height: 20px;
  width: 100%;
  padding: 2px;
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

export const NumberHeading = styled("h1")`
  font-size: 3rem;
  margin-bottom: 0;
`;
export const NumberSmallText = styled("p")`
  margin-bottom: 0;
  margin-top: 0;
`;
