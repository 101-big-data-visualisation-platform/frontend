import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as Chartjs,
  registerables,
  ChartOptions,
  ChartData,
} from "chart.js";
import { getData } from "../../api/dashboard";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

const Dashboard: React.FC = () => {
  const chartRef = useRef(this);
  const [data, setData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const getData1 = async () => {
    const dataArray: [] = await getData();
    setData({
      datasets: [
        {
          data: dataArray,
          label: "Dataset 1",
          backgroundColor: "blue",
          borderColor: "blue",
        },
      ],
    });
  };
  useEffect(() => {
    getData1();
  }, []);
  const options: ChartOptions<"line"> = {
    elements: {
      line: {
        tension: 0,
      },
    },
    animation: false,
    parsing: false,
    scales: {
      x: {
        type: "time",
        title: {
          text: "time",
          display: true,
        },
      },
      y: {
        title: {
          text: "value",
          display: true,
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
        text: "Graph Title",
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
    <>
      <h1>Dashboard</h1>
      <p>{JSON.stringify(data)}</p>
      <Line data={data} options={options} ref={chartRef} />
    </>
  );
};

export default Dashboard;
