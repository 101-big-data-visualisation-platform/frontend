import React, { useContext, useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { getAWSDashboard, getAWSData } from "../../api/dashboard";
import DataContext from "../../contexts/DataContext";
import GraphsContext, {
  Dashboard as DashboardType,
} from "../../contexts/GraphsContext";
import AuthContext from "../../contexts/AuthContext";
import AddGraph from "../../components/Modals/AddGraph/AddGraph";
import {
  AddDailyReportingButton,
  AddGraphButton,
  DailyReportsWrapper,
  DashboardContentWrapper,
  DashboardHeading,
  DeleteButton,
  GraphsWrapper,
  StyledButton,
  StyledOption,
  StyledSelect,
} from "./styled";
import AddDashboard from "../../components/Modals/AddDashboard";
import DeleteDashboard from "../../components/Modals/DeleteDashboard/DeleteDashboard";
import { CenteredDiv } from "../../components/CenteredDiv";
import GraphSelector from "../../components/graphs/GraphSelector";
import AddDailyReport from "../../components/Modals/AddDailyReport";
import DailyReport from "../../components/DailyReport";
import { ThemeContext } from "styled-components";

const Dashboard: React.FC = () => {
  const { allData, setData, updatingData } = useContext(DataContext);
  const theme = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const {
    allDashboards,
    setDashboards,
    selectedDashboard: dashboardName,
    setSelectedDashboard: setDashboardName,
  } = useContext(GraphsContext);

  // MODALS START
  const [openAddGraph, setOpenAddGraph] = useState(false);

  const handleOpenAdd = () => setOpenAddGraph(true);
  const handleCloseAdd = () => setOpenAddGraph(false);

  const [openAddDash, setOpenAddDash] = useState(false);

  const handleOpenAddDash = () => setOpenAddDash(true);
  const handleCloseAddDash = () => setOpenAddDash(false);

  const [openDeleteDash, setOpenDeleteDash] = useState(false);

  const handleOpenDeleteDash = () => setOpenDeleteDash(true);
  const handleCloseDeleteDash = () => setOpenDeleteDash(false);

  const [openAddDaily, setOpenAddDaily] = useState(false);

  const handleOpenAddDaily = () => setOpenAddDaily(true);
  const handleCloseAddDaily = () => setOpenAddDaily(false);

  // MODALS END

  const [loadingDashboard, setLoadingDashboard] = useState(false);

  type ReturnedDataObj = {
    items: {
      timestamp: number;
      inTemp: number;
    }[];
  };
  type ReturnedDataObjAWS = {
    Items: [];
  };
  type Data = {
    items: [];
    name: string;
  };
  const getArrayFromJson = async (link: string, name: string) => {
    // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    const dataArray: [] = await fetch(link, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());
    //console.log(dataArray);

    // check if arg name does not match any of the allData names before appending new data to to allData
    if (
      !allData?.find((data) => {
        return data.name === name;
      })
    ) {
      setData((prevState: Data[]) => [
        ...prevState,
        { items: dataArray, name: name },
      ]);
    } else {
      //console.log("Object Found");
    }
  };
  const getDataFromJsonAndCompress = async (link: string, name: string) => {
    // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    let dataObj: any = await fetch(link, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());

    // COMPRESSION START
    const selectorString = name.split(":")[0];
    let dataCompressed: any = [];

    let lastIngestedPoint: {
      timestamp: number;
      [selectorString: string]: number;
    } = {
      timestamp: 0,
      [selectorString]: 0,
    };

    for (let i = 0; i < dataObj.items.length; i++) {
      if (i === 0) {
        dataCompressed.push(dataObj.items[i]);
        lastIngestedPoint = dataObj.items[i];
        continue;
      }
      if (
        lastIngestedPoint?.[selectorString] !==
        dataObj.items[i]?.[selectorString]
      ) {
        dataCompressed.push(dataObj.items[i]);
        lastIngestedPoint = dataObj.items[i];
        continue;
      }
      if (
        lastIngestedPoint?.[selectorString] !==
        dataObj.items[i + 1]?.[selectorString]
      ) {
        dataCompressed.push(dataObj.items[i]);
        lastIngestedPoint = dataObj.items[i];
      }
    }

    // COMPRESSION END

    // check if arg name does not match any of the allData names before appending new data to to allData
    if (
      !allData?.find((data) => {
        return data.name === name;
      })
    ) {
      setData((prevState: Data[]) => [
        ...prevState,
        { items: dataCompressed, name: name },
      ]);
    } else {
      //console.log("Object Found");
    }
  };

  const getDailyReportFromJson = async (link: string, name: string) => {
    const dataObj: ReturnedDataObj = await fetch(link, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());
    if (
      !allData?.find((data) => {
        return data.name === name;
      })
    ) {
      setData((prevState: Data[]) => [
        ...prevState,
        { dailyReport: dataObj, name: name },
      ]);
    }
  };

  const getDataFromJson = async (link: string, name: string) => {
    // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    const dataObj: ReturnedDataObj = await fetch(link, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());
    console.log(dataObj);

    // check if arg name does not match any of the allData names before appending new data to to allData
    if (
      !allData?.find((data) => {
        return data.name === name;
      })
    ) {
      setData((prevState: Data[]) => [
        ...prevState,
        { items: dataObj.items, name: name },
      ]);
    } else {
      //console.log("Object Found");
    }
  };

  const getDataFromAWS = async (
    link: string,
    name: string,
    deviceID: string,
    minTimestamp: number
  ) => {
    const dataObj: ReturnedDataObjAWS = await getAWSData(
      deviceID,
      minTimestamp,
      link
    );
    // check if arg name does not match any of the allData names before appending new data to to allData
    if (dataObj) {
      const alreadyExists =
        allData?.filter((data) => data.name === name)?.length || -1 > 0;
      if (!alreadyExists) {
        setData((prevState: Data[]) => [
          ...prevState,
          { items: dataObj.Items, name: name },
        ]);
      }
    }
  };

  const fetchDashboard = async () => {
    setLoadingDashboard(true);

    try {
      const dashboardData = await getAWSDashboard(user?.username || "");
      //console.log(dashboardData);
      if (typeof dashboardData.items === "string") {
        if (!dashboardName) {
          const dashboardJSON: DashboardType[] = JSON.parse(
            dashboardData.items
          );
          setDashboardName(dashboardJSON[0].name);
          setDashboards(dashboardJSON);
        }
      } else {
        if (!dashboardName) {
          setDashboardName(dashboardData.items[0].name);
          setDashboards(dashboardData.items);
        }
      }
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    // getDataFromJson("./lambda-results-full-300.json", "weatherDataIALBAN250");
    // getDataFromJson("./tiny-data.json", "tiny-dataIALBAN250");
    // getDataFromJsonAndCompress(
    //   "./lambda-results-full-300.json",
    //   "inTemp:weatherDataCompressedIALBAN250"
    // );
    // getDataFromJsonAndCompress(
    //   "./lambda-results-full-300.json",
    //   "absBaro:weatherDataCompressedIALBAN250"
    // );
    // getDataFromJsonAndCompress(
    //   "./lambda-results-full-300.json",
    //   "dailyRain:weatherDataCompressedIALBAN250"
    // );
    // getDataFromJsonAndCompress(
    //   "./lambda-results-full-300.json",
    //   "dewPoint:weatherDataCompressedIALBAN250"
    // );
    // getDataFromJsonAndCompress(
    //   "./lambda-results-full-300.json",
    //   "inHumi:weatherDataCompressedIALBAN250"
    // );
    getDailyReportFromJson(
      "daily-reporting-updated.json",
      "dailyReport-weatherData"
    );
    getArrayFromJson("seasonality-breakdown.json", "inTemp-IALBAN25-0");
    getArrayFromJson(
      "lambda-results-inTemp-compressed.json",
      "inTempCompressed-IALBAN25-0"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    allDashboards
      ?.find((dashboard) => dashboard.name === dashboardName)
      ?.allGraphs?.forEach((graph) => {
        // Remove this if statement once backend is completed
        graph.datasets.forEach((dataset) => {
          if (dataset.dataName.includes("tankData")) {
            getDataFromAWS(
              dataset.dataURL || "",
              dataset.dataName,
              dataset.deviceID || "",
              graph.minTimestamp || 0
            );
          }
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDashboards, dashboardName]);
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!dashboardName && loadingDashboard) {
    return (
      <CenteredDiv>
        <h1>Loading Dashboard...</h1>
      </CenteredDiv>
    );
  } else if (!dashboardName && !loadingDashboard) {
    return (
      <CenteredDiv>
        <h1>Your dashboard could not be loaded. Please sign in again.</h1>
      </CenteredDiv>
    );
  }
  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: theme.colors.primary,
          zIndex: 100,
          padding: "10px 0",
        }}
      >
        <StyledSelect
          value={dashboardName}
          onChange={(evt) => {
            setDashboardName(evt.target.value);
          }}
        >
          {allDashboards?.map((dashboard) => {
            return (
              <StyledOption value={dashboard.name}>
                {dashboard.name}
              </StyledOption>
            );
          })}
        </StyledSelect>
        <StyledButton onClick={handleOpenAddDash}>New Dashboard</StyledButton>
        <DeleteButton
          disabled={(allDashboards?.length || 0) <= 1}
          onClick={handleOpenDeleteDash}
        >
          Delete Dashboard
        </DeleteButton>
        <AddGraphButton onClick={handleOpenAdd}>Add Graph</AddGraphButton>
        <AddDailyReportingButton onClick={handleOpenAddDaily}>
          Add Daily Reporting
        </AddDailyReportingButton>
      </div>
      <AddDashboard open={openAddDash} handleClose={handleCloseAddDash} />
      <DeleteDashboard
        open={openDeleteDash}
        handleClose={handleCloseDeleteDash}
      />
      <AddGraph open={openAddGraph} handleClose={handleCloseAdd} />
      <AddDailyReport open={openAddDaily} handleClose={handleCloseAddDaily} />
      {allData && !updatingData ? (
        <DashboardContentWrapper>
          <DashboardHeading>Daily Reporting</DashboardHeading>
          <DailyReportsWrapper>
            {(allDashboards?.find(
              (dashboard) => dashboard.name === dashboardName
            )?.allDailyReports?.length || -1) > 0 ? (
              allDashboards
                ?.find((dashboard) => dashboard.name === dashboardName)
                ?.allDailyReports?.map((dailyReport) => {
                  return (
                    <DailyReport
                      dashboardName={dashboardName}
                      dailyReportID={dailyReport.dailyReportID}
                      datasetComparisons={dailyReport.datasetComparisons}
                      dailyReportTitle={dailyReport.dailyReportTitle}
                    />
                  );
                })
            ) : (
              <p>
                You have no daily reports present. Create one{" "}
                <span
                  style={{ textDecoration: "underline" }}
                  onClick={handleOpenAddDaily}
                >
                  here!
                </span>
              </p>
            )}
          </DailyReportsWrapper>

          <DashboardHeading>Graphs</DashboardHeading>
          <GraphsWrapper>
            {(allDashboards?.find(
              (dashboard) => dashboard.name === dashboardName
            )?.allGraphs?.length || -1) > 0 ? (
              allDashboards
                ?.find((dashboard) => dashboard.name === dashboardName)
                ?.allGraphs?.map((graphData) => (
                  <GraphSelector
                    detailed={false}
                    graphType={graphData.graphType}
                    dashboardName={dashboardName}
                    graphID={graphData.graphID}
                    data={{
                      datasets: graphData.datasets.map((dataset) => {
                        return {
                          items:
                            allData.find((data) => {
                              return data.name === dataset.dataName;
                            })?.items || [],
                          name: dataset.dataName,
                          ID: dataset.ID,
                          customMax: dataset.singleStatisticMax,
                          customMin: dataset.singleStatisticMin,
                          customDetails: dataset.singleStatisticDetails,
                        };
                      }),
                    }}
                    options={{
                      graphTitleText: `${graphData.graphTitleText} since: ${
                        (graphData?.minTimestamp || 0) > 0
                          ? new Date(
                              graphData.minTimestamp || 0
                            ).toLocaleDateString()
                          : "all time"
                      }`,
                      datasetOptions: graphData.datasets.map((dataset) => {
                        return {
                          datasetBackgroundColor:
                            dataset.datasetBackgroundColor,
                          datasetBorderColor: dataset.datasetBorderColor,
                          label: `Device: ${dataset.deviceID}`,
                          dataName: dataset.dataName,
                          deviceID: dataset.deviceID || "",
                        };
                      }),
                      decimationSamples: graphData.decimationSamples,
                      dataSelector: graphData.dataSelector,
                      minTimestamp: graphData.minTimestamp || 0,
                    }}
                  />
                ))
            ) : (
              <p>
                You have no graphs present. Create one{" "}
                <span
                  style={{ textDecoration: "underline" }}
                  onClick={handleOpenAdd}
                >
                  here!
                </span>
              </p>
            )}
          </GraphsWrapper>
        </DashboardContentWrapper>
      ) : (
        "Loading Data"
      )}
    </Container>
  );
};

export default Dashboard;
