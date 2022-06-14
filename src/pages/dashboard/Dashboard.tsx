import React, { useContext, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as Chartjs,
  registerables,
  ChartOptions,
  ChartData,
} from "chart.js";
import { getBatteryData, getTankData } from "../../api/dashboard";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import { Container } from "../../components/Container";
import { ThemeContext } from "styled-components";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

const Dashboard: React.FC = () => {
  const chartRef = useRef(this);
  const theme = useContext(ThemeContext);
  const [data, setData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const getData1 = async () => {
    const dataArray1: [] = await getBatteryData();
    const dataArray2: [] = await getTankData();
    setData({
      datasets: [
        {
          data: dataArray1,
          label: "Battery",
          backgroundColor: "blue",
          borderColor: "blue",
          yAxisID: "y",
        },
        {
          data: dataArray2,
          label: "Tank",
          backgroundColor: "red",
          borderColor: "red",
          yAxisID: "y1",
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
          text: "Battery Level",
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
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          text: "Tank Level",
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
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      title: {
        display: true,
        text: "Battery Data VS Tank Data",
        color: theme.colors.secondary,
        font: {
          size: 30,
        },
      },
      decimation: {
        enabled: true,
        algorithm: "lttb",
        samples: 3500,
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
      <Line data={data} options={options1} ref={chartRef} />
    </Container>
  );
};

export default Dashboard;
