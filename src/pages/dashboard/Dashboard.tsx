import React, { useContext, useEffect } from "react";
import LineGraph from "../../components/LineGraph";
import { Container } from "../../components/Container";
import { getAWSDashboard, getAWSData } from "../../api/dashboard";
import DataContext from "../../contexts/DataContext";
import GraphsContext from "../../contexts/GraphsContext";
import MovingAverageGraph from "./MovingAverageGraph";
import AuthContext from "../../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { allData, setData, updatingData } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const { allGraphs, setGraphs } = useContext(GraphsContext);

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
    let dataObj: ReturnedDataObj = await fetch(link, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());

    // COMPRESSION START

    let dataCompressed: any = [];
    let lastIngestedPoint: { timestamp: number; inTemp: number } = {
      timestamp: 0,
      inTemp: 0,
    };

    for (let i = 0; i < dataObj.items.length; i++) {
      if (i === 0) {
        dataCompressed.push(dataObj.items[i]);
        lastIngestedPoint = dataObj.items[i];
        continue;
      }
      if (lastIngestedPoint?.inTemp !== dataObj.items[i]?.inTemp) {
        dataCompressed.push(dataObj.items[i]);
        lastIngestedPoint = dataObj.items[i];
        continue;
      }
      if (lastIngestedPoint?.inTemp !== dataObj.items[i + 1]?.inTemp) {
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
    setGraphs(dashboardData.items);
  };

  useEffect(() => {
    getDataFromJson("./lambda-results-full-300.json", "weatherData");
    getDataFromJsonAndCompress(
      "./lambda-results-full-300.json",
      "weatherDataCompressed"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    allGraphs?.forEach((graph) => {
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
  }, [allGraphs]);
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <h1>Dashboard</h1>
      {allData && !updatingData ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {allGraphs?.map((graphData) => (
              <LineGraph
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
                    };
                  }),
                  decimationSamples: graphData.decimationSamples,
                  dataSelector: graphData.dataSelector,
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
