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
    if (!allData?.find((data) => data.name === name)) {
      setData((prevState: Data[]) => [
        ...prevState,
        { items: dataObj.items, name: name },
      ]);
    }
  };

  const getDataFromAWS = async (link: string, name: string) => {
    const dataObj: ReturnedDataObjAWS = await getAWSData(
      "4317031",
      0,
      localStorage.getItem("authorization") || "",
      link
    );

    // check if arg name does not match any of the allData names before appending new data to to allData
    if (!allData?.find((data) => data.name === name)) {
      setData((prevState: Data[]) => [
        ...prevState,
        { items: dataObj.Items, name: name },
      ]);
    }
  };
  useEffect(() => {
    getDataFromJson("./lambda-results-full-300.json", "weatherData");
    getDataFromAWS("/data/tank", "tankData");
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
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {allGraphs?.map((graphData) => (
          <LineGraph
            data={{
              items:
                allData?.find(
                  (dataObj: { name: string }) =>
                    dataObj.name === graphData.dataName
                )?.items || [],
            }}
            options={{
              graphTitleText: graphData.graphTitleText,
              datasetBackgroundColor: graphData.datasetBackgroundColor,
              datasetBorderColor: graphData.datasetBorderColor,
              decimationSamples: graphData.decimationSamples,
            }}
            dataSelector={graphData.dataSelector}
            dataName={graphData.dataName}
          />
        ))}
      </div>
    </Container>
  );
};

export default Dashboard;
