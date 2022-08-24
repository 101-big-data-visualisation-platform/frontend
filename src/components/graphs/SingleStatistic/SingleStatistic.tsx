import { LinearProgress } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import GraphsContext from "../../../contexts/GraphsContext";
import {
  StyledButton,
  StyledButton2,
  StyledDiv1,
  StyledDiv2,
  StyledDiv3,
  StyledLink,
} from "./styled";
import ReactSpeedometer from "react-d3-speedometer";
import { ThemeContext } from "styled-components";

type SingleStatisticProps = {
  detailed: boolean;
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
    dataSelector: string;
  };
  graphID: string;
  dashboardName: string;
};

const SingleStatistic = ({
  data,
  detailed,
  options,
  graphID,
  dashboardName,
}: SingleStatisticProps) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards } = useContext(GraphsContext);
  const theme = useContext(ThemeContext);

  if (detailed) {
    return (
      <>
        <StyledButton2
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
        </StyledButton2>
        {deleting && (
          <LinearProgress style={{ marginTop: "10px" }} color="inherit" />
        )}
        <StyledDiv2>
          <div style={{ width: "300px", textAlign: "center" }}>
            <h1>{options.graphTitleText}</h1>
            <p>latest {options.dataSelector} data</p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
            {data.datasets.map((dataset: { items: any[]; name: string }) => {
              var dateOptions: any = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              return (
                <StyledDiv3>
                  <p>
                    {
                      options.datasetOptions.find(
                        (option) => option.dataName === dataset.name
                      )?.label
                    }
                  </p>
                  <ReactSpeedometer
                    needleColor={theme.name === "light" ? "black" : "white"}
                    textColor={theme.name === "light" ? "black" : "white"}
                    maxSegmentLabels={1}
                    forceRender={true}
                    value={parseFloat(
                      dataset.items[dataset.items.length - 1]?.[
                        options.dataSelector
                      ]
                    )}
                    fluidWidth
                    minValue={(() => {
                      let min = dataset?.items[0]?.[options.dataSelector];

                      for (let i = 1; i < dataset.items.length; i++) {
                        if (dataset?.items[i]?.[options.dataSelector] < min) {
                          min = parseFloat(
                            dataset?.items[i]?.[options.dataSelector]
                          );
                        }
                      }
                      return min;
                    })()}
                    maxValue={(() => {
                      let max = dataset?.items[0]?.[options.dataSelector];
                      for (let i = 1; i < dataset.items.length; i++) {
                        if (dataset?.items[i]?.[options.dataSelector] > max) {
                          max = parseFloat(
                            dataset?.items[i]?.[options.dataSelector]
                          );
                        }
                      }
                      return max;
                    })()}
                    segments={20}
                  />
                  <p>
                    {new Date(
                      parseInt(
                        dataset.items[dataset.items.length - 1]?.timeStamp
                      )
                    ).toLocaleDateString("en-US", dateOptions)}
                  </p>
                </StyledDiv3>
              );
            })}
          </div>
        </StyledDiv2>
      </>
    );
  } else {
    return (
      <StyledDiv1>
        <StyledLink
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
        <StyledDiv2>
          <div style={{ width: "300px", textAlign: "center" }}>
            <h1 style={{ marginBottom: "0" }}>{options.graphTitleText}</h1>
            <p style={{ marginTop: "0" }}>latest {options.dataSelector} data</p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
            {data.datasets.map((dataset: { items: any[]; name: string }) => {
              var dateOptions: any = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              return (
                <StyledDiv3>
                  <p>
                    {
                      options.datasetOptions.find(
                        (option) => option.dataName === dataset.name
                      )?.label
                    }
                  </p>
                  <ReactSpeedometer
                    needleColor={theme.name === "light" ? "black" : "white"}
                    textColor={theme.name === "light" ? "black" : "white"}
                    maxSegmentLabels={1}
                    forceRender={true}
                    value={parseFloat(
                      dataset.items[dataset.items.length - 1]?.[
                        options.dataSelector
                      ]
                    )}
                    minValue={(() => {
                      let min = dataset?.items[0]?.[options.dataSelector];

                      for (let i = 1; i < dataset.items.length; i++) {
                        if (dataset?.items[i]?.[options.dataSelector] < min) {
                          min = parseFloat(
                            dataset?.items[i]?.[options.dataSelector]
                          );
                        }
                      }
                      return min;
                    })()}
                    maxValue={(() => {
                      let max = dataset?.items[0]?.[options.dataSelector];
                      for (let i = 1; i < dataset.items.length; i++) {
                        if (dataset?.items[i]?.[options.dataSelector] > max) {
                          max = parseFloat(
                            dataset?.items[i]?.[options.dataSelector]
                          );
                        }
                      }
                      return max;
                    })()}
                    segments={20}
                  />
                  <p>
                    {new Date(
                      parseInt(
                        dataset.items[dataset.items.length - 1]?.timeStamp
                      )
                    ).toLocaleDateString("en-US", dateOptions)}
                  </p>
                </StyledDiv3>
              );
            })}
          </div>
        </StyledDiv2>
      </StyledDiv1>
    );
  }
};

export default SingleStatistic;
