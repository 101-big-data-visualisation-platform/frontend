import React, { FC, useContext, useState } from "react";
import { updateUserSettingsAWS } from "../../api/dashboard";
import AuthContext from "../../contexts/AuthContext";
import DataContext from "../../contexts/DataContext";
import GraphsContext, { DatasetComparison } from "../../contexts/GraphsContext";
import { DailyReportWrapper, NumberHeading, NumberSmallText } from "./styled";

const DailyReport: FC<{
  dailyReportTitle: string;
  datasetComparisons: DatasetComparison[];
  dailyReportID: string;
  dashboardName: string;
}> = ({
  dailyReportTitle,
  datasetComparisons,
  dailyReportID,
  dashboardName,
}) => {
  const { allData } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards } = useContext(GraphsContext);
  const [deleting, setDeleting] = useState(false);
  const deleteDailyReport = async () => {
    setDeleting(true);

    const dashboardsModified = allDashboards?.map((dashboard) => {
      if (dashboardName === dashboard.name) {
        return {
          name: dashboard.name,
          allGraphs: dashboard.allGraphs,
          allDailyReports: dashboard.allDailyReports.filter(
            (dailyReport) => dailyReport.dailyReportID !== dailyReportID
          ),
        };
      } else {
        return dashboard;
      }
    });

    await updateUserSettingsAWS(user?.username || "", dashboardsModified);

    setDeleting(false);
    setDashboards(dashboardsModified);
  };
  return (
    <>
      {datasetComparisons.map((datasetComparison) => {
        let datasetA, datasetB, commonDataset;
        let twoDatasets;
        if (datasetComparison.datasetA && datasetComparison.datasetB) {
          datasetA = allData?.find(
            (data) => data.name === datasetComparison.datasetA?.dataName
          );
          datasetB = allData?.find(
            (data) => data.name === datasetComparison.datasetB?.dataName
          );
          twoDatasets = true;
        } else {
          commonDataset = allData?.find(
            (data) => data.name === datasetComparison.commonDataset?.dataName
          );
          twoDatasets = false;
        }

        let comparison: {
          valueA?: number;
          valueB?: number;
          value?: number;
          message: string;
          percentageIncrease?: string;
          difference?: string;
        } = {
          valueA: 0,
          valueB: 0,
          value: 0,
          message: "",
          percentageIncrease: "",
          difference: "",
        };
        if (
          twoDatasets &&
          datasetComparison.timeToCompareA &&
          datasetComparison.timeToCompareB &&
          datasetComparison.uniqueSelectorA &&
          datasetComparison.uniqueSelectorB
        ) {
          let valueA = datasetA?.dailyReport[
            datasetComparison.timeToCompareA
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetA?.deviceID
          )[datasetComparison.uniqueSelectorA];
          let valueB = datasetB?.dailyReport[
            datasetComparison.timeToCompareB
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetB?.deviceID
          )[datasetComparison.uniqueSelectorB];

          comparison = {
            valueA: parseFloat(valueA),
            valueB: parseFloat(valueB),
            percentageIncrease: (
              100 *
              ((parseFloat(valueB) - parseFloat(valueA)) / parseFloat(valueA))
            ).toFixed(2),
            difference: (parseFloat(valueB) - parseFloat(valueA)).toFixed(2),
            message: `This report shows the difference and %increase/decrease between dataset B:${datasetB?.name}'s ${datasetComparison.uniqueSelectorB}(value:${valueB} | timeAgo: ${datasetComparison.timeToCompareB}| deviceID: ${datasetComparison.datasetB?.deviceID}) and dataset A:${datasetA?.name}'s ${datasetComparison.uniqueSelectorA}(value:${valueA} | timeAgo: ${datasetComparison.timeToCompareA}| deviceID: ${datasetComparison.datasetA?.deviceID})`,
          };
        } else if (
          twoDatasets &&
          datasetComparison.timeToCompareA &&
          datasetComparison.timeToCompareB &&
          datasetComparison.commonDataSelector
        ) {
          let valueA = datasetA?.dailyReport[
            datasetComparison.timeToCompareA
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetA?.deviceID
          )[datasetComparison.commonDataSelector];
          let valueB = datasetB?.dailyReport[
            datasetComparison.timeToCompareB
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetB?.deviceID
          )[datasetComparison.commonDataSelector];

          comparison = {
            valueA: parseFloat(valueA),
            valueB: parseFloat(valueB),
            percentageIncrease: (
              100 *
              ((parseFloat(valueB) - parseFloat(valueA)) / parseFloat(valueA))
            ).toFixed(2),
            difference: (parseFloat(valueB) - parseFloat(valueA)).toFixed(2),
            message: `This report shows the difference and %increase/decrease between dataset B:${datasetB?.name}'s ${datasetComparison.commonDataSelector}(value:${valueB} | timeAgo: ${datasetComparison.timeToCompareB}| deviceID: ${datasetComparison.datasetB?.deviceID}) and dataset A:${datasetA?.name}'s ${datasetComparison.commonDataSelector}(value:${valueA} | timeAgo: ${datasetComparison.timeToCompareA}| deviceID: ${datasetComparison.datasetA?.deviceID})`,
          };
        } else if (
          twoDatasets &&
          datasetComparison.commonTime &&
          datasetComparison.uniqueSelectorA &&
          datasetComparison.uniqueSelectorB
        ) {
          let valueA = datasetA?.dailyReport[datasetComparison.commonTime].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetA?.deviceID
          )[datasetComparison.uniqueSelectorA];
          let valueB = datasetB?.dailyReport[datasetComparison.commonTime].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetB?.deviceID
          )[datasetComparison.uniqueSelectorB];

          comparison = {
            valueA: parseFloat(valueA),
            valueB: parseFloat(valueB),
            percentageIncrease: (
              100 *
              ((parseFloat(valueB) - parseFloat(valueA)) / parseFloat(valueA))
            ).toFixed(2),
            difference: (parseFloat(valueB) - parseFloat(valueA)).toFixed(2),
            message: `This report shows the difference and %increase/decrease between dataset B:${datasetB?.name}'s ${datasetComparison.uniqueSelectorB}(value:${valueB} | timeAgo: ${datasetComparison.commonTime}| deviceID: ${datasetComparison.datasetB?.deviceID}) and dataset A:${datasetA?.name}'s ${datasetComparison.uniqueSelectorA}(value:${valueA} | timeAgo: ${datasetComparison.commonTime}| deviceID: ${datasetComparison.datasetA?.deviceID})`,
          };
        } else if (
          twoDatasets &&
          datasetComparison.commonTime &&
          datasetComparison.commonDataSelector
        ) {
          let valueA = datasetA?.dailyReport[datasetComparison.commonTime].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetA?.deviceID
          )[datasetComparison.commonDataSelector];
          let valueB = datasetB?.dailyReport[datasetComparison.commonTime].find(
            (report: any) =>
              report.deviceID === datasetComparison.datasetB?.deviceID
          )[datasetComparison.commonDataSelector];

          comparison = {
            valueA: parseFloat(valueA),
            valueB: parseFloat(valueB),
            percentageIncrease: (
              100 *
              ((parseFloat(valueB) - parseFloat(valueA)) / parseFloat(valueA))
            ).toFixed(2),
            difference: (parseFloat(valueB) - parseFloat(valueA)).toFixed(2),
            message: `This report shows the difference and %increase/decrease between dataset B:${datasetB?.name}'s ${datasetComparison.commonDataSelector}(value:${valueB} | timeAgo: ${datasetComparison.commonTime}| deviceID: ${datasetComparison.datasetB?.deviceID}) and dataset A:${datasetA?.name}'s ${datasetComparison.commonDataSelector}(value:${valueA} | timeAgo: ${datasetComparison.commonTime}| deviceID: ${datasetComparison.datasetA?.deviceID})`,
          };
        } else if (
          !twoDatasets &&
          datasetComparison.commonTime &&
          datasetComparison.commonDataSelector
        ) {
          let value = commonDataset?.dailyReport[
            datasetComparison.commonTime
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.commonDataset?.deviceID
          )[datasetComparison.commonDataSelector];

          comparison = {
            value: parseFloat(value),
            message: `This report shows the ${datasetComparison.commonDataSelector} in dataset ${commonDataset?.name} on device ${datasetComparison.commonDataset?.deviceID} from ${datasetComparison.commonTime} ago`,
          };
        } else if (
          !twoDatasets &&
          datasetComparison.timeToCompareA &&
          datasetComparison.timeToCompareB &&
          datasetComparison.commonDataSelector
        ) {
          let valueA = commonDataset?.dailyReport[
            datasetComparison.timeToCompareA
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.commonDataset?.deviceID
          )[datasetComparison.commonDataSelector];
          let valueB = commonDataset?.dailyReport[
            datasetComparison.timeToCompareB
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.commonDataset?.deviceID
          )[datasetComparison.commonDataSelector];

          comparison = {
            valueA: parseFloat(valueA),
            valueB: parseFloat(valueB),
            percentageIncrease: (
              100 *
              ((parseFloat(valueB) - parseFloat(valueA)) / parseFloat(valueA))
            ).toFixed(2),
            difference: (parseFloat(valueB) - parseFloat(valueA)).toFixed(2),
            message: `This report shows the difference and %increase/decrease in dataset ${commonDataset?.name} between B:${datasetComparison.commonDataSelector}(value:${valueB} | timeAgo: ${datasetComparison.timeToCompareB}| deviceID: ${datasetComparison.commonDataset?.deviceID}) and A:${datasetComparison.commonDataSelector}(value:${valueA} | timeAgo: ${datasetComparison.timeToCompareA}| deviceID: ${datasetComparison.commonDataset?.deviceID})`,
          };
        } else if (
          !twoDatasets &&
          datasetComparison.commonTime &&
          datasetComparison.uniqueSelectorA &&
          datasetComparison.uniqueSelectorB
        ) {
          let valueA = commonDataset?.dailyReport[
            datasetComparison.commonTime
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.commonDataset?.deviceID
          )[datasetComparison.uniqueSelectorA];
          let valueB = commonDataset?.dailyReport[
            datasetComparison.commonTime
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.commonDataset?.deviceID
          )[datasetComparison.uniqueSelectorB];

          comparison = {
            valueA: parseFloat(valueA),
            valueB: parseFloat(valueB),
            percentageIncrease: (
              100 *
              ((parseFloat(valueB) - parseFloat(valueA)) / parseFloat(valueA))
            ).toFixed(2),
            difference: (parseFloat(valueB) - parseFloat(valueA)).toFixed(2),
            message: `This report shows the difference and %increase/decrease in dataset ${commonDataset?.name} between B:${datasetComparison.uniqueSelectorB}(value:${valueB} | timeAgo: ${datasetComparison.commonTime}| deviceID: ${datasetComparison.commonDataset?.deviceID}) and A:${datasetComparison.uniqueSelectorA}(value:${valueA} | timeAgo: ${datasetComparison.commonTime}| deviceID: ${datasetComparison.commonDataset?.deviceID})`,
          };
        } else if (
          !twoDatasets &&
          datasetComparison.timeToCompareA &&
          datasetComparison.timeToCompareB &&
          datasetComparison.uniqueSelectorA &&
          datasetComparison.uniqueSelectorB
        ) {
          let valueA = commonDataset?.dailyReport[
            datasetComparison.timeToCompareA
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.commonDataset?.deviceID
          )[datasetComparison.uniqueSelectorA];
          let valueB = commonDataset?.dailyReport[
            datasetComparison.timeToCompareB
          ].find(
            (report: any) =>
              report.deviceID === datasetComparison.commonDataset?.deviceID
          )[datasetComparison.uniqueSelectorB];

          comparison = {
            valueA: parseFloat(valueA),
            valueB: parseFloat(valueB),
            percentageIncrease: (
              100 *
              ((parseFloat(valueB) - parseFloat(valueA)) / parseFloat(valueA))
            ).toFixed(2),
            difference: (parseFloat(valueB) - parseFloat(valueA)).toFixed(2),
            message: `This report shows the difference and %increase/decrease in dataset ${commonDataset?.name} between B:${datasetComparison.uniqueSelectorB}(value:${valueB} | timeAgo: ${datasetComparison.timeToCompareB}| deviceID: ${datasetComparison.commonDataset?.deviceID}) and A:${datasetComparison.uniqueSelectorA}(value:${valueA} | timeAgo: ${datasetComparison.timeToCompareA}| deviceID: ${datasetComparison.commonDataset?.deviceID})`,
          };
        }
        if ((comparison as any).value) {
          return (
            <DailyReportWrapper>
              <button
                style={{ position: "absolute", top: "10px", right: "10px" }}
                onClick={deleteDailyReport}
                disabled={deleting}
              >
                Delete
              </button>
              <h3>{dailyReportTitle}</h3>
              <NumberHeading>{comparison?.value}</NumberHeading>
              <p style={{ textAlign: "center" }}>{comparison?.message}</p>
            </DailyReportWrapper>
          );
        } else {
          return (
            <DailyReportWrapper>
              <button
                style={{ position: "absolute", top: "10px", right: "10px" }}
                onClick={deleteDailyReport}
                disabled={deleting}
              >
                Delete
              </button>
              <h3>{dailyReportTitle}</h3>
              <NumberHeading
                style={{
                  color:
                    (comparison?.percentageIncrease || -1) < 0
                      ? "red"
                      : (comparison?.percentageIncrease || -1) > 0
                      ? "green"
                      : "black",
                }}
              >
                {comparison?.percentageIncrease}%
              </NumberHeading>
              <NumberSmallText>
                percentage increase/decrease <strong>(B-A)/A</strong>
              </NumberSmallText>

              <NumberHeading
                style={{
                  color:
                    (comparison?.percentageIncrease || -1) < 0
                      ? "red"
                      : (comparison?.percentageIncrease || -1) > 0
                      ? "green"
                      : "black",
                }}
              >
                {comparison?.difference}
              </NumberHeading>
              <NumberSmallText>
                difference <strong>B-A</strong>
              </NumberSmallText>
              <div style={{ textAlign: "center" }}>
                <h3>A</h3>
                <p>
                  {datasetComparison?.uniqueSelectorA?.length || -1 > 0
                    ? datasetComparison?.uniqueSelectorA
                    : datasetComparison.commonDataSelector}{" "}
                  value: {comparison.valueA}
                </p>
                <p>
                  timeAgo:{" "}
                  {datasetComparison?.timeToCompareA?.length || -1 > 0
                    ? datasetComparison?.timeToCompareA
                    : datasetComparison.commonTime}
                </p>
                <p>
                  Dataset:{" "}
                  {datasetComparison.datasetA
                    ? datasetA?.name
                    : commonDataset?.name}
                </p>
                <p>
                  Device:{" "}
                  {datasetComparison.datasetA
                    ? datasetComparison.datasetA.deviceID
                    : datasetComparison.commonDataset?.deviceID}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <h3>B</h3>
                <p>
                  {datasetComparison?.uniqueSelectorB?.length || -1 > 0
                    ? datasetComparison?.uniqueSelectorB
                    : datasetComparison.commonDataSelector}{" "}
                  value: {comparison.valueB}
                </p>
                <p>
                  timeAgo:{" "}
                  {datasetComparison?.timeToCompareB?.length || -1 > 0
                    ? datasetComparison?.timeToCompareB
                    : datasetComparison.commonTime}
                </p>
                Dataset:{" "}
                {datasetComparison.datasetB
                  ? datasetB?.name
                  : commonDataset?.name}
                <p>
                  Device:{" "}
                  {datasetComparison.datasetB
                    ? datasetComparison.datasetB.deviceID
                    : datasetComparison.commonDataset?.deviceID}
                </p>
              </div>
              <br />
            </DailyReportWrapper>
          );
        }
      })}
    </>
  );
};

export default DailyReport;
