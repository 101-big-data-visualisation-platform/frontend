import React, { useContext, useEffect, useState } from "react";
import LineGraph from "../../components/LineGraph";
import { Container } from "../../components/Container";
import {
  getAWSDashboard,
  getAWSData,
  updateUserSettingsAWS,
} from "../../api/dashboard";
import DataContext from "../../contexts/DataContext";
import GraphsContext from "../../contexts/GraphsContext";
import MovingAverageGraph from "./MovingAverageGraph";
import AuthContext from "../../contexts/AuthContext";
import AddGraph from "../../components/Modals/AddGraph/AddGraph";

const Dashboard: React.FC = () => {
  const { allData, setData, updatingData } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards } = useContext(GraphsContext);

  // MODAL START
  const [openAddGraph, setOpenAddGraph] = useState(false);
  const [dashboardName, setDashboardName] = useState("default");
  const [dashboardNameInput, setDashboardNameInput] = useState("");

  const handleOpenAdd = () => setOpenAddGraph(true);
  const handleCloseAdd = () => setOpenAddGraph(false);

  // MODAL END

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
  // const getArrayFromJson = async (link: string, name: string) => {
  //   // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
  //   const dataArray: [] = await fetch(link, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   }).then((response) => response.json());
  //   console.log(dataArray);

  //   // check if arg name does not match any of the allData names before appending new data to to allData
  //   if (
  //     !allData?.find((data) => {
  //       return data.name === name;
  //     })
  //   ) {
  //     setData((prevState: Data[]) => [
  //       ...prevState,
  //       { items: dataArray, name: name },
  //     ]);
  //   } else {
  //     console.log("Object Found");
  //   }
  // };

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
      console.log("Object Found");
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
      console.log("Object Found");
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
      localStorage.getItem("authorization") || "",
      link
    );
    // check if arg name does not match any of the allData names before appending new data to to allData
    if (dataObj) {
      if (
        !allData?.find((data) => {
          return data.name === name;
        })
      ) {
        setData((prevState: Data[]) => [
          ...prevState,
          { items: dataObj.Items, name: name },
        ]);
      }
    }
  };

  const fetchDashboard = async () => {
    const dashboardData = await getAWSDashboard(
      localStorage.getItem("authorization") || "",
      user?.username || ""
    );
    console.log(dashboardData);
    if (typeof dashboardData.items === "string") {
      setDashboards(JSON.parse(dashboardData.items));
    } else {
      setDashboards(dashboardData.items);
    }
  };

  useEffect(() => {
    getDataFromJson("./lambda-results-full-300.json", "weatherDataIALBAN250");
    getDataFromJson("./tiny-data.json", "tiny-dataIALBAN250");
    getDataFromJsonAndCompress(
      "./lambda-results-full-300.json",
      "inTemp:weatherDataCompressedIALBAN250"
    );
    getDataFromJsonAndCompress(
      "./lambda-results-full-300.json",
      "absBaro:weatherDataCompressedIALBAN250"
    );
    getDataFromJsonAndCompress(
      "./lambda-results-full-300.json",
      "dailyRain:weatherDataCompressedIALBAN250"
    );
    getDataFromJsonAndCompress(
      "./lambda-results-full-300.json",
      "dewPoint:weatherDataCompressedIALBAN250"
    );
    getDataFromJsonAndCompress(
      "./lambda-results-full-300.json",
      "inHumi:weatherDataCompressedIALBAN250"
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
  }, [allDashboards]);
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <select
        onChange={(evt) => {
          setDashboardName(evt.target.value);
        }}
      >
        {allDashboards?.map((dashboard) => {
          return <option value={dashboard.name}>{dashboard.name}</option>;
        })}
      </select>
      <input
        type="text"
        placeholder="dashboard name"
        onChange={(evt) => {
          setDashboardNameInput(evt.target.value);
        }}
      />
      <button
        onClick={async () => {
          const updatedDashboards = [
            ...(allDashboards as any),
            {
              name: dashboardNameInput,
              allGraphs: [],
            },
          ];
          try {
            await updateUserSettingsAWS(
              localStorage.getItem("authorization") || "",
              user?.username || "",
              updatedDashboards
            );
            setDashboards(updatedDashboards);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        Add Dashboard
      </button>
      <h1>Dashboard: {dashboardName}</h1>
      <button
        onClick={async () => {
          const updatedDashboards = allDashboards?.filter(
            (dashboard) => dashboard.name !== dashboardName
          );
          try {
            await updateUserSettingsAWS(
              localStorage.getItem("authorization") || "",
              user?.username || "",
              updatedDashboards
            );
            setDashboards(updatedDashboards);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        Delete Dashboard
      </button>
      <button onClick={handleOpenAdd}>Add Graph</button>

      <AddGraph
        open={openAddGraph}
        handleClose={handleCloseAdd}
        dashboardName={dashboardName}
      />
      {allData && !updatingData ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {allDashboards
              ?.find((dashboard) => dashboard.name === dashboardName)
              ?.allGraphs?.map((graphData) => (
                <LineGraph
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
                      };
                    }),
                  }}
                  options={{
                    graphTitleText: `${graphData.graphTitleText}  since:${
                      (graphData?.minTimestamp || 0) > 0
                        ? new Date(
                            graphData?.minTimestamp || "invalid date"
                          ).toLocaleDateString()
                        : "all time"
                    }`,
                    datasetOptions: graphData.datasets.map((dataset) => {
                      return {
                        datasetBackgroundColor: dataset.datasetBackgroundColor,
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
              ))}
          </div>
          <MovingAverageGraph />
        </>
      ) : (
        "Loading Data"
      )}
    </Container>
  );
};

export default Dashboard;
