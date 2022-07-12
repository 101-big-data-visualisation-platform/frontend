import React, { useContext, useEffect, useRef, useState } from "react";
import LineGraph from "../../components/LineGraph";
import { Container } from "../../components/Container";
import { getAWSData } from "../../api/dashboard";
import DataContext from "../../contexts/DataContext";
import GraphsContext from "../../contexts/GraphsContext";
// REMOVE THESE IMPORTS IN FINAL PRODUCT
import { Line } from "react-chartjs-2";
import {
  Chart as Chartjs,
  registerables,
  ChartOptions,
  ChartData,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import { ThemeContext } from "styled-components";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

const Dashboard: React.FC = () => {
  const { allData, setData, updatingData } = useContext(DataContext);
  const { allGraphs, setGraphs } = useContext(GraphsContext);

  // TEMPORARY GRAPH START
  const theme = useContext(ThemeContext);
  const chartRef = useRef<Chartjs<"line">>();
  const [finalData, setFinalData] = useState<ChartData<"line">>({
    datasets: [],
  });

  const getData1 = async () => {
    // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    type Data = {
      items: [];
    };
    // const dataObj: Data = JSON.parse(JSON.stringify(dataMain));
    const itemsArray1: [] = await fetch(
      "lambda-results-inTemp-moving-average.json",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((response) => response.json());
    const itemsArray2: [] = await fetch(
      "lambda-results-inTemp-11point-moving-average.json",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    ).then((response) => response.json());

    let dataObj: Data = await fetch("lambda-results-full-300.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());

    const itemsArray: [] = dataObj.items;
    type Item = {
      timeStamp: string;
    };
    interface IItem {
      [key: string]: string;
    }

    const processedItems1 = itemsArray.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat((item as IItem)["inTemp"]),
      };
    });

    const processedItems2 = itemsArray1.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat((item as IItem)["inTemp"]),
      };
    });

    const processedItems3 = itemsArray2.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat((item as IItem)["inTemp"]),
      };
    });

    setFinalData({
      datasets: [
        {
          data: processedItems1,
          label: "inTemp",
          backgroundColor: "red",
          borderColor: "red",
          yAxisID: "y",
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          data: processedItems2,
          label: "inTemp moving average",
          backgroundColor: "green",
          borderColor: "green",
          yAxisID: "y",
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          data: processedItems3,
          label: "inTemp 11 point moving average",
          backgroundColor: "blue",
          borderColor: "blue",
          yAxisID: "y",
          pointRadius: 0,
          borderWidth: 1,
        },
      ],
    });
  };

  const optionsFinal: ChartOptions<"line"> = {
    elements: {
      line: {
        tension: 0,
      },
    },
    responsive: true,
    animation: false,
    parsing: false,
    scales: {
      x: {
        type: "time",
        title: {
          text: "time",
          display: true,
          color: theme.colors.secondary,
        },
        grid: {
          color: theme.colors.primary3,
        },
        ticks: {
          color: theme.colors.secondary,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          text: "inTemp",
          display: true,
          color: theme.colors.secondary,
        },
        grid: {
          color: theme.colors.primary3,
        },
        ticks: {
          color: theme.colors.secondary,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "inTemp weather data with moving averages",
        color: theme.colors.secondary,
        font: {
          size: 20,
        },
      },
      decimation: {
        enabled: true,
        samples: 5000,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
            backgroundColor: theme.colors.primary2,
          },
          mode: "x",
        },
        pan: {
          mode: "x",
          enabled: true,
          modifierKey: "ctrl",
        },
        limits: {
          x: {
            min: "original",
            max: "original",
          },
        },
      },
    },
  };

  // TEMPORARY GRAPH END

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
    console.log(dataObj);

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
    console.log("CompressedArray:", dataCompressed);
    // COMPRESSION END

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
    console.log(dataObj);
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
        dataName: "weatherDataCompressed",
        dataSelector: "inTemp",
        graphTitleText: "Temperature Data Compressed",
        datasetBackgroundColor: "green",
        datasetBorderColor: "green",
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
                graphData.dataName +
                (graphData.deviceID !== undefined ? graphData.deviceID : "") +
                (graphData.minTimestamp !== undefined
                  ? graphData.minTimestamp?.toString()
                  : "")
              }
            />
          ))}
          <Line options={optionsFinal} data={finalData} />
        </div>
      ) : (
        "Loading Data"
      )}
    </Container>
  );
};

export default Dashboard;
