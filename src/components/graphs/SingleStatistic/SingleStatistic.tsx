import { LinearProgress } from "@mui/material";
import React, { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import GraphsContext, { Dashboard } from "../../../contexts/GraphsContext";
import {
  StyledButton,
  StyledButton2,
  StyledDiv1,
  StyledDiv2,
  StyledDiv3,
  StyledLink,
} from "./styled";
import { ThemeContext } from "styled-components";
import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = require("plotly.js-finance-dist");
const Plot = createPlotlyComponent(Plotly);

type SingleStatisticProps = {
  detailed: boolean;
  data: {
    datasets: {
      items: [];
      name: string;
      ID: string;
      customMin: number;
      customMax: number;
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
        <div style={{ width: "100%", textAlign: "center" }}>
          <h1 style={{ marginBottom: "0", fontSize: "1.5rem" }}>
            {options.graphTitleText}
          </h1>
          <p>latest {options.dataSelector} data</p>
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
        </div>

        {deleting && (
          <LinearProgress style={{ marginTop: "10px" }} color="inherit" />
        )}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {data.datasets.map(
            (dataset: {
              items: any[];
              name: string;
              ID: string;
              customMin: number;
              customMax: number;
            }) => {
              return (
                <SingleStatisticGauge
                  allDashboards={allDashboards as any}
                  dashboardName={dashboardName}
                  setDashboards={setDashboards}
                  user={user}
                  options={options}
                  dataset={dataset}
                />
              );
            }
          )}
        </div>
      </>
    );
  } else {
    return (
      <>
        {data.datasets.map(
          (dataset: {
            items: any[];
            name: string;
            ID: string;
            customMin: number;
            customMax: number;
          }) => {
            return (
              <SingleStatisticGauge
                allDashboards={allDashboards as any}
                dashboardName={dashboardName}
                setDashboards={setDashboards}
                user={user}
                options={options}
                dataset={dataset}
              />
            );
          }
        )}
      </>
    );
  }
};

const SingleStatisticGauge: FC<{
  allDashboards: Dashboard[];
  dashboardName: string;
  setDashboards: any;
  user: any;
  options: any;
  dataset: any;
}> = ({
  allDashboards,
  dashboardName,
  setDashboards,
  user,
  options,
  dataset,
}) => {
  const [customMin, setCustomMin] = useState(null);
  const [customMax, setCustomMax] = useState(null);
  const [revisionCounter, setRevisionCounter] = useState(0);
  var dateOptions: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return (
    <StyledDiv1>
      <input
        type="number"
        placeholder="custom min"
        onChange={(evt) => setCustomMin(evt.target.value as any)}
      />
      <input
        type="number"
        placeholder="custom max"
        onChange={(evt) => setCustomMax(evt.target.value as any)}
      />
      <button
        onClick={async () => {
          const dashboardsModified = allDashboards?.map((dashboard) => {
            if (dashboardName === dashboard.name) {
              return {
                name: dashboard.name,
                allGraphs: dashboard.allGraphs.map((graph) => {
                  return {
                    ...graph,
                    datasets: graph.datasets.map((datasetOld) => {
                      if (datasetOld.ID === dataset.ID) {
                        return {
                          ...datasetOld,
                          singleStatisticMin: parseFloat(customMin as any),
                          singleStatisticMax: parseFloat(customMax as any),
                        };
                      } else {
                        return datasetOld;
                      }
                    }),
                  };
                }),
              };
            } else {
              return dashboard;
            }
          });
          await updateUserSettingsAWS(
            user?.username as any,
            dashboardsModified as any
          );
          setDashboards(dashboardsModified);
          setRevisionCounter((prevState) => prevState++);
        }}
      >
        Update Min/Max
      </button>
      <Plot
        revision={revisionCounter}
        data={[
          {
            value: parseFloat(
              parseFloat(
                dataset.items[dataset.items.length - 1]?.[options.dataSelector]
              ).toFixed(2)
            ),
            gauge: {
              axis: {
                range: [
                  dataset.customMin >= 0
                    ? dataset.customMin
                    : (() => {
                        let min: number = parseFloat(
                          dataset?.items[0]?.[options.dataSelector]
                        );

                        for (let i = 1; i < dataset.items.length; i++) {
                          if (dataset?.items[i]?.[options.dataSelector] < min) {
                            min = parseFloat(
                              dataset?.items[i]?.[options.dataSelector]
                            );
                          }
                        }
                        return parseFloat(min.toFixed(2));
                      })(),
                  dataset.customMax >= 0
                    ? dataset.customMax
                    : (() => {
                        let max = parseFloat(
                          dataset?.items[0]?.[options.dataSelector]
                        );
                        for (let i = 1; i < dataset.items.length; i++) {
                          if (dataset?.items[i]?.[options.dataSelector] > max) {
                            max = parseFloat(
                              dataset?.items[i]?.[options.dataSelector]
                            );
                          }
                        }
                        return parseFloat(max.toFixed(2));
                      })(),
                ],
                tickwidth: 1,
                tickcolor: "darkblue",
              },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
            },
            title: {
              text: options.datasetOptions.find(
                (option: { dataName: any }) => option.dataName === dataset.name
              )?.label,
            },
            type: "indicator",
            mode: "gauge+number",
          },
        ]}
        layout={{ width: 600, height: 500, margin: { t: 0, b: 0 } }}
      />
      <p>
        {new Date(
          parseInt(dataset.items[dataset.items.length - 1]?.timeStamp)
        ).toLocaleDateString("en-US", dateOptions)}
      </p>
    </StyledDiv1>
  );
};

export default SingleStatistic;
