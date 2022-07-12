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
import { StyledButton, StyledDiv1, StyledLink } from "./styled";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

type LineGraphProps = {
  data: {
    datasets: {
      items: [];
      name: string;
    }[];
  };
  options: {
    graphTitleText: string;
    datasetOptions: {
      datasetBackgroundColor: string;
      datasetBorderColor: string;
      label: string;
      dataSelector: string;
      dataName: string;
    }[];
    decimationSamples: number;
  };
};

const LineGraph = ({ data, options }: LineGraphProps) => {
  const theme = useContext(ThemeContext);
  const chartRef = useRef<Chartjs<"line">>();
  const [finalData, setFinalData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const getData1 = async () => {
    type Data = {
      items: [];
      name: string;
    };
    type DataObj = {
      datasets: Data[];
    };
    const dataObj: DataObj = data;
    dataObj.datasets.forEach((dataset) => {
      const itemsArray: [] = dataset.items;
      type Item = {
        timeStamp: string;
      };
      interface IItem {
        [key: string]: string;
      }
      const processedItems = itemsArray.map((item: Item) => {
        return {
          x: parseInt(item.timeStamp),
          y: parseFloat(
            (item as IItem)[
              options.datasetOptions.find(
                (option) => option.dataName === dataset.name
              )?.dataSelector || "invalid selector"
            ]
          ),
        };
      });
      setFinalData({
        datasets: [
          {
            data: processedItems,
            label:
              options.datasetOptions.find(
                (option) => option.dataName === dataset.name
              )?.dataSelector || "invalid selector",
            backgroundColor:
              options.datasetOptions.find(
                (option) => option.dataName === dataset.name
              )?.datasetBackgroundColor || "invalid selector",
            borderColor:
              options.datasetOptions.find(
                (option) => option.dataName === dataset.name
              )?.datasetBorderColor || "invalid selector",
            yAxisID: "y",
            pointRadius: 0,
            borderWidth: 1,
          },
        ],
      });
    });
  };

  useEffect(() => {
    getData1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  return (
    <StyledDiv1>
      <StyledButton
        onClick={() => {
          chartRef?.current?.resetZoom();
        }}
      >
        Reset Zoom
      </StyledButton>
      <StyledLink
        to={`/detailed?dataName=${dataName}&dataSelector=${dataSelector}`}
      >
        Detailed View
      </StyledLink>
      <Line data={finalData} options={optionsFinal} ref={chartRef} />
    </StyledDiv1>
  );
};

export default LineGraph;
