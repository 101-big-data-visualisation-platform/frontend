import React, { useContext, useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
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
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import GraphsContext from "../../../contexts/GraphsContext";
import { LinearProgress } from "@mui/material";
import { GraphWrapperDiv } from "../../GraphWrapperDiv";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

type ScatterPlotProps = {
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
      dataName: string;
      deviceID: string;
    }[];
    decimationSamples: number;
    dataSelector: string;
    minTimestamp: number;
  };
  graphID: string;
  dashboardName: string;
};

const ScatterPlot = ({
  data,
  options,
  graphID,
  dashboardName,
}: ScatterPlotProps) => {
  const theme = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards } = useContext(GraphsContext);
  const chartRef = useRef<Chartjs<"scatter">>();
  const [finalData, setFinalData] = useState<ChartData<"scatter">>({
    datasets: [],
  });
  const [deleting, setDeleting] = useState(false);
  const getData1 = async () => {
    type Data = {
      items: [];
      name: string;
    };
    type DataObj = {
      datasets: Data[];
    };
    const dataObj: DataObj = data;

    type Item = {
      timeStamp: string;
    };
    interface IItem {
      [key: string]: string;
    }

    console.log(data);

    const processedItems = dataObj.datasets.map(
      (arrayOfItems: { items: []; name: string }) => {
        return {
          items: arrayOfItems.items.map((item: Item) => {
            if (options.graphTitleText === "Tiny Data  since:all time") {
              console.log(parseInt(item.timeStamp));
              console.log(typeof item.timeStamp);
            }
            return {
              x: parseInt(item.timeStamp),
              y: parseFloat((item as IItem)[options.dataSelector]),
            };
          }),
          name: arrayOfItems.name,
        };
      }
    );
    setFinalData({
      datasets: processedItems.map((processedItem) => {
        const relatedGraph = options.datasetOptions.find((dataset) => {
          return dataset.dataName === processedItem.name;
        });
        return {
          data: processedItem.items,
          label: relatedGraph?.label,
          backgroundColor: relatedGraph?.datasetBackgroundColor,
          borderColor: relatedGraph?.datasetBorderColor,
          yAxisID: "y",
          pointRadius: 1,
          borderWidth: 1,
        };
      }),
    });
  };

  useEffect(() => {
    getData1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const optionsFinal: ChartOptions<"scatter"> = {
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
          text: options.dataSelector,
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
        style={deleting ? { pointerEvents: "none" } : {}}
        to={`/detailed?dataSelector=${options.dataSelector}&graphID=${graphID}`}
      >
        Detailed View
      </StyledLink>
      <StyledButton
        onClick={async () => {
          setDeleting(true);

          const dashboardsModified = allDashboards?.map((dashboard) => {
            if (dashboardName === dashboard.name) {
              return {
                name: dashboard.name,
                allGraphs: dashboard.allGraphs.filter(
                  (graph) => graph.graphID !== graphID
                ),
              };
            } else {
              return dashboard;
            }
          });

          await updateUserSettingsAWS(user?.username || "", dashboardsModified);

          setDeleting(false);
          setDashboards(dashboardsModified);
        }}
        disabled={deleting}
      >
        Delete
      </StyledButton>
      {deleting && (
        <LinearProgress style={{ marginTop: "10px" }} color="inherit" />
      )}
      <GraphWrapperDiv>
        <Scatter data={finalData} options={optionsFinal} ref={chartRef} />
      </GraphWrapperDiv>
    </StyledDiv1>
  );
};

export default ScatterPlot;
