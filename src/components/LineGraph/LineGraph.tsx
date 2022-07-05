import React, { useContext, useEffect, useRef, useState } from "react";
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
import { StyledDiv1 } from "./styled";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

type LineGraphProps = {
  data: {
    items: [];
  };
  options: {
    graphTitleText: string;
    datasetBackgroundColor: string;
    datasetBorderColor: string;
    decimationSamples: number;
  };
  dataSelector: string;
};

const LineGraph = ({ data, options, dataSelector }: LineGraphProps) => {
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
    const dataObj: Data = data;

    const itemsArray: [] = dataObj.items;
    type Item = {
      timeStamp: string;
      inTemp: string;
      absBaro: string;
      dailyRain: string;
      deviceID: string;
      dewPoint: string;
      inHumi: string;
    };
    interface IItem {
      [key: string]: string;
    }
    const processedItems = itemsArray.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat((item as IItem)[dataSelector]),
      };
    });
    setFinalData({
      datasets: [
        {
          data: processedItems,
          label: dataSelector,
          backgroundColor: options.datasetBackgroundColor,
          borderColor: options.datasetBorderColor,
          yAxisID: "y",
        },
      ],
    });
  };

  useEffect(() => {
    getData1();
  }, [data]);
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
          text: dataSelector,
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
        text: options.graphTitleText,
        color: theme.colors.secondary,
        font: {
          size: 20,
        },
      },
      decimation: {
        enabled: true,
        algorithm: "lttb",
        samples: options.decimationSamples,
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

  return (
    <StyledDiv1>
      <button
        style={{ position: "absolute" }}
        onClick={() => {
          console.log("Clicking button");
          chartRef?.current?.resetZoom();
        }}
      >
        Reset Zoom
      </button>
      <Line data={finalData} options={optionsFinal} ref={chartRef} />
    </StyledDiv1>
  );
};

export default LineGraph;