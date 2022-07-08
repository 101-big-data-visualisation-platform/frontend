import React, { useContext, useEffect } from "react";
import LineGraph from "../../components/LineGraph";
import { Container } from "../../components/Container";
import { getAWSData } from "../../api/dashboard";
import DataContext from "../../contexts/DataContext";
import GraphsContext from "../../contexts/GraphsContext";

const Dashboard: React.FC = () => {
  const { allData, setData, updatingData } = useContext(DataContext);
  const { allGraphs, setGraphs } = useContext(GraphsContext);

  type ReturnedDataObj = {
    items: [];
  };
  type ReturnedDataObjAWS = {
    Items: [];
  };
  type Data = {
    items: [];
    name: string;
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
        console.log(data.name);
        console.log(name);
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
  };
  useEffect(() => {
    getDataFromJson("./lambda-results-full-300.json", "weatherData");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    allGraphs?.forEach((graph) => {
      // Remove this if statement once backend is completed
      if (graph.dataName === "tankData") {
        const finalDataName: string =
          graph.dataName + graph.deviceID + graph.minTimestamp;
        getDataFromAWS(
          graph.dataURL || "",
          finalDataName,
          graph.deviceID || "",
          graph.minTimestamp || 0
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGraphs]);
  useEffect(() => {
    setGraphs([
      {
        dataName: "weatherData",
        dataSelector: "inTemp",
        graphTitleText: "Temperature Data",
        datasetBackgroundColor: "red",
        datasetBorderColor: "red",
        decimationSamples: 5000,
      },
      {
        dataName: "weatherData",
        dataSelector: "dailyRain",
        graphTitleText: "Daily Rain Data",
        datasetBackgroundColor: "red",
        datasetBorderColor: "red",
        decimationSamples: 5000,
      },
      {
        dataName: "weatherData",
        dataSelector: "absBaro",
        graphTitleText: "Absolute Barometer Data",
        datasetBackgroundColor: "red",
        datasetBorderColor: "red",
        decimationSamples: 5000,
      },
      {
        dataName: "weatherData",
        dataSelector: "dewPoint",
        graphTitleText: "Dew Point Data",
        datasetBackgroundColor: "red",
        datasetBorderColor: "red",
        decimationSamples: 5000,
      },
      {
        dataName: "weatherData",
        dataSelector: "inHumi",
        graphTitleText: "Humidity Data",
        datasetBackgroundColor: "red",
        datasetBorderColor: "red",
        decimationSamples: 5000,
      },
      {
        dataName: "tankData",
        dataSelector: "battery",
        graphTitleText: "Tank Battery Data",
        datasetBackgroundColor: "red",
        datasetBorderColor: "red",
        decimationSamples: 5000,
        dataURL: "/data/tank",
        deviceID: "4317031",
        minTimestamp: 0,
      },
      {
        dataName: "tankData",
        dataSelector: "tankState",
        graphTitleText: "Tank State Data",
        datasetBackgroundColor: "red",
        datasetBorderColor: "red",
        decimationSamples: 5000,
        dataURL: "/data/tank",
        deviceID: "4317031",
        minTimestamp: 1594246178000,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      <h1>Dashboard</h1>
      {allData && !updatingData ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {allGraphs?.map((graphData) => (
            <LineGraph
              data={{
                items:
                  allData?.find((dataObj: { name: string }) => {
                    const deviceID = graphData.deviceID
                      ? graphData.deviceID
                      : "";
                    const minTimestamp =
                      graphData.minTimestamp !== undefined
                        ? graphData.minTimestamp
                        : "";
                    return (
                      dataObj.name ===
                      graphData.dataName + deviceID + minTimestamp
                    );
                  })?.items || [],
              }}
              options={{
                graphTitleText: `${graphData.graphTitleText} device:${
                  graphData.deviceID
                } since:${
                  (graphData?.minTimestamp || 0) > 0
                    ? new Date(
                        graphData?.minTimestamp || "invalid date"
                      ).toLocaleDateString()
                    : "all time"
                }`,
                datasetBackgroundColor: graphData.datasetBackgroundColor,
                datasetBorderColor: graphData.datasetBorderColor,
                decimationSamples: graphData.decimationSamples,
              }}
              dataSelector={graphData.dataSelector}
              dataName={
                graphData.dataName + graphData.deviceID + graphData.minTimestamp
              }
            />
          ))}
        </div>
      ) : (
        "Loading Data"
      )}
    </Container>
  );
};

export default Dashboard;
