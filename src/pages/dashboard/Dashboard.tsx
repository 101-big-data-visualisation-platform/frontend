import React, { useContext, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as Chartjs,
  registerables,
  ChartOptions,
  ChartData,
} from "chart.js";
import { getWeatherData } from "../../api/dashboard";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import { Container } from "../../components/Container";
import { ThemeContext } from "styled-components";
import Switch from "@mui/material/Switch";
import { StyledDiv1 } from "./styled";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

let arrayOfGraphs: number[] = [];
for (let i = 0; i < 9; i++) {
  arrayOfGraphs.push(i);
}

const Dashboard: React.FC = () => {
  const chartRef = useRef(this);
  const theme = useContext(ThemeContext);
  const [data, setData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const getData1 = async () => {
    const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    console.log(dataObj);
    const itemsArray: [] = dataObj.Items;
    type Item = {
      timeStamp: string;
      inTemp: string;
    };
    console.log(itemsArray);
    const processedItems = itemsArray.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat(item.inTemp),
      };
    });
    console.log(dataObj);
    setData({
      datasets: [
        {
          data: processedItems,
          label: "Temp",
          backgroundColor: "blue",
          borderColor: "blue",
          yAxisID: "y",
        },
      ],
    });
  };

  useEffect(() => {
    getData1();
  }, []);
  const options1: ChartOptions<"line"> = {
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
          text: "Temperature Data",
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
        text: "Temperature Data",
        color: theme.colors.secondary,
        font: {
          size: 20,
        },
      },
      decimation: {
        enabled: true,
        algorithm: "lttb",
        samples: 300,
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
    <Container>
      <h1>Dashboard</h1>
      {data.datasets.map((dataset) => {
        console.log(dataset);
        return (
          <>
            <p>{dataset.label}</p>
            <Switch
              defaultChecked={true}
              onChange={(evt) => {
                setData({
                  datasets: data.datasets.map((datasetObj) => {
                    if (datasetObj.label === dataset.label) {
                      return {
                        ...datasetObj,
                        hidden: !evt.target.checked,
                      };
                    } else {
                      return {
                        ...datasetObj,
                      };
                    }
                  }),
                });
              }}
            />
          </>
        );
      })}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {arrayOfGraphs.map(() => (
          <StyledDiv1>
            <Line data={data} options={options1} ref={chartRef} />
          </StyledDiv1>
        ))}
      </div>
    </Container>
  );
};

export default Dashboard;
