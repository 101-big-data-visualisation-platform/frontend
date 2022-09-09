import { LinearProgress, stepClasses } from "@mui/material";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext, { UserInfo } from "../../../contexts/AuthContext";
import GraphsContext, {
  Dashboard,
  GaugeDetails,
  Step,
} from "../../../contexts/GraphsContext";
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
import { Dataset } from "../GraphSelector/GraphSelector";
import { v4 } from "uuid";
const Plotly = require("plotly.js-finance-dist");
const Plot = createPlotlyComponent(Plotly);

type SingleStatisticProps = {
  detailed: boolean;
  data: {
    datasets: {
      items: [];
      name: string;
      ID: string;
      customMin?: number;
      customMax?: number;
      customDetails?: GaugeDetails;
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
              items: [];
              name: string;
              ID: string;
              customMin?: number;
              customMax?: number;
              customDetails?: GaugeDetails;
            }) => {
              return (
                <SingleStatisticGauge
                  detailed={true}
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
            items: [];
            name: string;
            ID: string;
            customMin?: number;
            customMax?: number;
            customDetails?: GaugeDetails;
          }) => {
            return (
              <SingleStatisticGauge
                detailed={false}
                deleting={deleting}
                setDeleting={setDeleting}
                graphID={graphID}
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
  deleting?: boolean;
  setDeleting?: any;
  graphID?: string;
  detailed: boolean;
  allDashboards: Dashboard[];
  dashboardName: string;
  setDashboards: any;
  user: any;
  options: any;
  dataset: Dataset;
}> = ({
  deleting,
  setDeleting,
  graphID,
  detailed,
  allDashboards,
  dashboardName,
  setDashboards,
  user,
  options,
  dataset,
}) => {
  const [customMin, setCustomMin] = useState(dataset.customMin);
  const [customMax, setCustomMax] = useState(dataset.customMax);
  const [newStepMinRange, setNewStepMinRange] = useState(0);
  const [newStepMaxRange, setNewStepMaxRange] = useState(0);
  const [newStepColor, setNewStepColor] = useState("black");
  const [revisionCounter, setRevisionCounter] = useState(0);
  const [settingsAreVisible, setSettingsAreVisible] = useState(false);
  const theme = useContext(ThemeContext);
  useEffect(() => {
    //console.log(dataset);
  }, [dataset]);
  var dateOptions: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (detailed) {
    return (
      <StyledDiv1 style={{ margin: "10px auto" }}>
        <button
          onClick={() => setSettingsAreVisible((prevState) => !prevState)}
        >
          {!settingsAreVisible ? "Display Settings" : "Hide Settings"}
        </button>
        {settingsAreVisible && (
          <>
            <input
              value={customMin}
              type="number"
              placeholder="custom min"
              onChange={(evt) => setCustomMin(evt.target.value as any)}
            />
            <input
              value={customMax}
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
                              //console.log(datasetOld);

                              return {
                                ...datasetOld,
                                singleStatisticMin: parseFloat(
                                  customMin as any
                                ),
                                singleStatisticMax: parseFloat(
                                  customMax as any
                                ),
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
            {dataset.customDetails?.steps.map((step, index) => (
              <GaugeDetailsInput
                key={index}
                step={step}
                allDashboards={allDashboards}
                dashboardName={dashboardName}
                dataset={dataset}
                user={user}
                setDashboards={setDashboards}
                setRevisionCounter={setRevisionCounter}
              />
            ))}

            <input
              type="number"
              placeholder="min step range"
              onChange={(evt) =>
                setNewStepMinRange(parseFloat(evt.target.value))
              }
            />
            <input
              type="number"
              placeholder="max step range"
              onChange={(evt) =>
                setNewStepMaxRange(parseFloat(evt.target.value))
              }
            />
            <input
              type="color"
              value={undefined}
              onChange={(evt) => setNewStepColor(evt.target.value)}
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
                              const newStep: Step = {
                                ID: v4(),
                                range: [newStepMinRange, newStepMaxRange],
                                color: newStepColor,
                              };
                              if (datasetOld.singleStatisticDetails?.steps) {
                                return {
                                  ...datasetOld,
                                  singleStatisticDetails: {
                                    ...(datasetOld.singleStatisticDetails as any),
                                    steps: [
                                      ...datasetOld.singleStatisticDetails
                                        ?.steps,
                                      newStep,
                                    ],
                                  },
                                };
                              } else {
                                return {
                                  ...datasetOld,
                                  singleStatisticDetails: {
                                    ...(datasetOld.singleStatisticDetails as any),
                                    steps: [newStep],
                                  },
                                };
                              }
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
                setRevisionCounter((prevState: any) => prevState++);
              }}
            >
              Add Step
            </button>
          </>
        )}

        <Plot
          revision={revisionCounter}
          data={[
            {
              value: parseFloat(
                parseFloat(
                  dataset.items[dataset.items.length - 1]?.[
                    options.dataSelector
                  ]
                ).toFixed(2)
              ),
              gauge: {
                steps: dataset.customDetails?.steps.map((step) => step),
                threshold: dataset.customDetails?.threshold,
                axis: {
                  range: [
                    (dataset.customMin as any) >= 0
                      ? dataset.customMin
                      : (() => {
                          let min: number = parseFloat(
                            (dataset?.items as any)[0]?.[
                              options.dataSelector
                            ] as any
                          );

                          for (let i = 1; i < dataset.items.length; i++) {
                            if (
                              dataset?.items[i]?.[options.dataSelector] < min
                            ) {
                              min = parseFloat(
                                dataset?.items[i]?.[options.dataSelector]
                              );
                            }
                          }
                          return parseFloat(min.toFixed(2));
                        })(),
                    (dataset.customMax as any) >= 0
                      ? dataset.customMax
                      : (() => {
                          let max = parseFloat(
                            (dataset?.items as any)[0]?.[
                              options.dataSelector
                            ] as any
                          );
                          for (let i = 1; i < dataset.items.length; i++) {
                            if (
                              dataset?.items[i]?.[options.dataSelector] > max
                            ) {
                              max = parseFloat(
                                dataset?.items[i]?.[options.dataSelector]
                              );
                            }
                          }
                          return parseFloat(max.toFixed(2));
                        })(),
                  ],
                  tickwidth: 1,
                  tickcolor: theme.colors.primary,
                },
                bar: { color: "black" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
              },
              title: {
                text: options.datasetOptions.find(
                  (option: { dataName: any }) =>
                    option.dataName === dataset.name
                )?.label,
              },
              type: "indicator",
              mode: "gauge+number",
            },
          ]}
          layout={{
            autosize: true,
            width: 600,
            height: 500,
            margin: { t: 0, b: 0 },
            paper_bgcolor: theme.colors.secondary,
            font: {
              color: theme.colors.primary,
            },
          }}
          config={{
            responsive: true,
          }}
        />
        <p>
          {new Date(
            parseInt(
              (dataset.items[dataset.items.length - 1] as any)?.timeStamp
            )
          ).toLocaleDateString("en-US", dateOptions)}
        </p>
      </StyledDiv1>
    );
  } else {
    return (
      <StyledDiv1>
        <div style={{ width: "300px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "0", fontSize: "1.5rem" }}>
            {options.graphTitleText}
          </h1>
          <p style={{ marginTop: "0" }}>latest {options.dataSelector} data</p>
        </div>
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
          <LinearProgress
            style={{ marginTop: "10px", width: "300px" }}
            color="inherit"
          />
        )}
        <Plot
          revision={revisionCounter}
          config={{
            responsive: true,
          }}
          data={[
            {
              value: parseFloat(
                parseFloat(
                  dataset.items[dataset.items.length - 1]?.[
                    options.dataSelector
                  ]
                ).toFixed(2)
              ),
              gauge: {
                steps: dataset.customDetails?.steps.map((step) => step),
                threshold: dataset.customDetails?.threshold,
                axis: {
                  range: [
                    (dataset.customMin as any) >= 0
                      ? dataset.customMin
                      : (() => {
                          let min: number = parseFloat(
                            (dataset?.items as any)[0]?.[
                              options.dataSelector
                            ] as any
                          );

                          for (let i = 1; i < dataset.items.length; i++) {
                            if (
                              dataset?.items[i]?.[options.dataSelector] < min
                            ) {
                              min = parseFloat(
                                dataset?.items[i]?.[options.dataSelector]
                              );
                            }
                          }
                          return parseFloat(min.toFixed(2));
                        })(),
                    (dataset.customMax as any) >= 0
                      ? dataset.customMax
                      : (() => {
                          let max = parseFloat(
                            (dataset?.items as any)[0]?.[
                              options.dataSelector
                            ] as any
                          );
                          for (let i = 1; i < dataset.items.length; i++) {
                            if (
                              dataset?.items[i]?.[options.dataSelector] > max
                            ) {
                              max = parseFloat(
                                dataset?.items[i]?.[options.dataSelector]
                              );
                            }
                          }
                          return parseFloat(max.toFixed(2));
                        })(),
                  ],
                  tickwidth: 1,
                  tickcolor: theme.colors.primary,
                },
                bar: { color: "black" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
              },
              title: {
                text: options.datasetOptions.find(
                  (option: { dataName: any }) =>
                    option.dataName === dataset.name
                )?.label,
              },
              type: "indicator",
              mode: "gauge+number",
            },
          ]}
          layout={{
            autosize: true,
            width: 600,
            height: 500,
            margin: { t: 0, b: 0 },
            paper_bgcolor: theme.colors.secondary,
            font: {
              color: theme.colors.primary,
            },
          }}
        />
        <p>
          {new Date(
            parseInt(
              (dataset.items[dataset.items.length - 1] as any)?.timeStamp
            )
          ).toLocaleDateString("en-US", dateOptions)}
        </p>
      </StyledDiv1>
    );
  }
};

const GaugeDetailsInput: FC<{
  step: Step;
  allDashboards: Dashboard[];
  dashboardName: string;
  dataset: Dataset;
  user: UserInfo;
  setDashboards: Dispatch<SetStateAction<Dashboard[]>>;
  setRevisionCounter: Dispatch<SetStateAction<any>>;
}> = ({
  step,
  allDashboards,
  dashboardName,
  dataset,
  user,
  setDashboards,
  setRevisionCounter,
}) => {
  const [minStepRange, setMinStepRange] = useState(step.range[0]);
  const [maxStepRange, setMaxStepRange] = useState(step.range[1]);
  const [color, setColor] = useState(step.color);
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
      <div>
        <input
          type="number"
          placeholder="min step range"
          value={minStepRange}
          onChange={(evt) => setMinStepRange(parseFloat(evt.target.value))}
        />
        <input
          type="number"
          placeholder="max step range"
          value={maxStepRange}
          onChange={(evt) => setMaxStepRange(parseFloat(evt.target.value))}
        />
        <input
          type="color"
          value={color}
          onChange={(evt) => setColor(evt.target.value)}
        />
      </div>
      <div style={{ display: "flex" }}>
        <button
          style={{ flexGrow: 1 }}
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
                            singleStatisticDetails: {
                              ...(datasetOld.singleStatisticDetails as any),
                              steps:
                                datasetOld.singleStatisticDetails?.steps.map(
                                  (stepOld) => {
                                    if (stepOld.ID === step.ID) {
                                      const newStep: Step = {
                                        ID: stepOld.ID,
                                        range: [minStepRange, maxStepRange],
                                        color: color,
                                      };
                                      return newStep;
                                    } else {
                                      return stepOld;
                                    }
                                  }
                                ) as any,
                            },
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
            setRevisionCounter((prevState: any) => prevState++);
          }}
        >
          Update Range
        </button>
        <button
          style={{ flexGrow: 1 }}
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
                            singleStatisticDetails: {
                              ...(datasetOld.singleStatisticDetails as any),
                              steps:
                                datasetOld.singleStatisticDetails?.steps.filter(
                                  (stepOld) => {
                                    if (stepOld.ID === step.ID) {
                                      return false;
                                    } else {
                                      return true;
                                    }
                                  }
                                ) as any,
                            },
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
            setRevisionCounter((prevState: any) => prevState++);
          }}
        >
          Delete Range
        </button>
      </div>
    </div>
  );
};

export default SingleStatistic;
