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
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import GraphsContext from "../../../contexts/GraphsContext";
import { LinearProgress } from "@mui/material";
import { GraphWrapperDiv } from "../../GraphWrapperDiv";
import { useNavigate } from "react-router-dom";
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

type LineGraphProps = {
  data: {
    datasets: {
      items: [];
      name: string;
    }[];
  };
  detailed: boolean;
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

const LineGraph = ({
  data,
  detailed,
  options,
  graphID,
  dashboardName,
}: LineGraphProps) => {
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards } = useContext(GraphsContext);
  const chartRef = useRef<Chartjs<"line">>();
  const [finalData, setFinalData] = useState<ChartData<"line">>({
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
      [key: string]: string | number;
    }

    //console.log(data);

    const processedItems = dataObj.datasets.map(
      (arrayOfItems: { items: []; name: string }) => {
        return {
          items: arrayOfItems.items.map((item: Item) => {
            if (options.graphTitleText === "Tiny Data  since:all time") {
              //console.log(parseInt(item.timeStamp));
              //console.log(typeof item.timeStamp);
            }
            return {
              x: parseInt(item.timeStamp),
              y:
                typeof (item as IItem)[options.dataSelector] === "string"
                  ? parseFloat((item as IItem)[options.dataSelector] as string)
                  : ((item as IItem)[options.dataSelector] as number),
            };
          }),
          name: arrayOfItems.name,
        };
      }
    );
        
    setFinalData({
      datasets: processedItems.map((processedItem) => {
        //console.log(processedItem.items);
        
        const relatedGraph = options.datasetOptions.find((dataset) => {
          return dataset.dataName === processedItem.name;
        });
        return {
          data: processedItem.items,
          label: relatedGraph?.label,
          backgroundColor: relatedGraph?.datasetBackgroundColor,
          borderColor: relatedGraph?.datasetBorderColor,
          yAxisID: "y",
          pointRadius: detailed ? 1 : 0,
          borderWidth: 1,
        };
      }),
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
  if (detailed) {
    return (
      <>
        <StyledButton
          onClick={() => {
            chartRef?.current?.resetZoom();
          }}
        >
          Reset Zoom
        </StyledButton>
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
                  allDailyReports: dashboard.allDailyReports,
                };
              } else {
                return dashboard;
              }
            });

            await updateUserSettingsAWS(
              user?.username || "",
              dashboardsModified
            );

            setDeleting(false);
            setDashboards(dashboardsModified);
            navigate("/dashboard");
          }}
          disabled={deleting}
        >
          Delete
        </StyledButton>
        {deleting && (
          <LinearProgress style={{ marginTop: "10px" }} color="inherit" />
        )}

        <Line data={finalData} options={optionsFinal} ref={chartRef} />
      </>
    );
  } else {
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
                  allDailyReports: dashboard.allDailyReports,
                };
              } else {
                return dashboard;
              }
            });

            await updateUserSettingsAWS(
              user?.username || "",
              dashboardsModified
            );

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
          <Line data={finalData} options={optionsFinal} ref={chartRef} />
        </GraphWrapperDiv>
      </StyledDiv1>
    );
  }
};

export default LineGraph;
