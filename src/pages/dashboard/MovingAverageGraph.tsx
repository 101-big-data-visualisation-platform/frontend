import React, { FC, useContext, useEffect, useRef, useState } from "react";
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

const MovingAverageGraph: FC = () => {
  // TEMPORARY GRAPH START
  const theme = useContext(ThemeContext);
  const chartRef = useRef<Chartjs<"line">>();
  const [finalData, setFinalData] = useState<ChartData<"line">>({
    datasets: [],
  });
  useEffect(() => {
    getData1();
  }, []);
  const getData1 = async () => {
    type ReturnedDataObj = {
      items: {
        timestamp: number;
        inTemp: number;
      }[];
    };
    let dataObj: ReturnedDataObj = await fetch("lambda-results-full-300.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());

    const itemsArray: any[] = dataObj.items;
    type Item = {
      timeStamp: string;
    };
    interface IItem {
      [key: string]: string;
    }

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

    const processedItems1 = itemsArray.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat((item as IItem)["inTemp"]),
      };
    });

    let averagedData = [];
    for (let i = 500; i < dataCompressed.length - 500; i++) {
      let hundredPoints = [];
      hundredPoints.push(dataCompressed[i].inTemp);
      for (let j = 1; j < 501; j++) {
        hundredPoints.push(dataCompressed[i - j].inTemp);
        hundredPoints.push(dataCompressed[i + j].inTemp);
      }

      let sum = 0;
      for (let k = 0; k < 501; k++) {
        sum = sum + parseFloat(hundredPoints[k]);
      }
      sum = sum / 501;
      let newJson = { timeStamp: dataCompressed[i].timeStamp, inTemp: sum };
      averagedData.push(newJson);
    }

    const processedItems2 = averagedData.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat((item as IItem)["inTemp"]),
      };
    });

    console.log("Moving Average:", processedItems2);

    // const processedItems2 = itemsArray1.map((item: Item) => {
    //   return {
    //     x: parseInt(item.timeStamp),
    //     y: parseFloat((item as IItem)["inTemp"]),
    //   };
    // });

    // const processedItems3 = itemsArray2.map((item: Item) => {
    //   return {
    //     x: parseInt(item.timeStamp),
    //     y: parseFloat((item as IItem)["inTemp"]),
    //   };
    // });

    setFinalData({
      datasets: [
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
          data: processedItems1,
          label: "inTemp",
          backgroundColor: "red",
          borderColor: "red",
          yAxisID: "y",
          pointRadius: 0,
          borderWidth: 1,
        },
        // {
        //   data: processedItems3,
        //   label: "inTemp 11 point moving average",
        //   backgroundColor: "blue",
        //   borderColor: "blue",
        //   yAxisID: "y",
        //   pointRadius: 0,
        //   borderWidth: 1,
        // },
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
  return (
    <>
      <button
        onClick={() => {
          chartRef.current?.resetZoom();
        }}
      >
        Zoom Out
      </button>
      <Line options={optionsFinal} data={finalData} ref={chartRef} />
    </>
  );
};

export default MovingAverageGraph;
