import { LinearProgress } from "@mui/material";
import React, { FC, useContext, useState } from "react";
import { getAWSData, updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import DataContext from "../../../contexts/DataContext";
import GraphsContext from "../../../contexts/GraphsContext";
import { StyledButton } from "../styled";
import { MinorSeparator, StyledButton2, StyledDiv5 } from "./styled";

const SelectedTimespan: FC<{ graphID: string }> = ({ graphID }) => {
  const { allDashboards, setDashboards, selectedDashboard } =
    useContext(GraphsContext);
  const { user } = useContext(AuthContext);
  const { allData, setData } = useContext(DataContext);

  const [minTimestamp, setMinTimestamp] = useState("");
  const [updating, setUpdating] = useState(false);

  const changeTimespan = async (timespan: string) => {
    setUpdating(true);
    let timestamp = 0;
    const msInS = 1000;
    const sInMin = 60;
    const minsInHour = 60;
    const hoursInDay = 24;
    const daysInWeek = 7;
    const daysInMonth = 30;
    const daysInYear = 365;

    if (timespan === "day") {
      timestamp = Date.now() - msInS * sInMin * minsInHour * hoursInDay;
    } else if (timespan === "week") {
      timestamp =
        Date.now() - msInS * sInMin * minsInHour * hoursInDay * daysInWeek;
    } else if (timespan === "month") {
      timestamp =
        Date.now() - msInS * sInMin * minsInHour * hoursInDay * daysInMonth;
    } else if (timespan === "year") {
      timestamp =
        Date.now() - msInS * sInMin * minsInHour * hoursInDay * daysInYear;
    } else if (timespan === "all") {
      timestamp = 0;
    } else {
      console.log(timespan);
      timestamp = new Date(timespan).getTime();
    }

    const dashboardsDataModified = await Promise.all(
      allDashboards?.map(async (dashboard) => {
        if (selectedDashboard === dashboard.name) {
          return {
            name: dashboard.name,
            allGraphs: await Promise.all(
              dashboard.allGraphs.map(async (graph) => {
                if (graph.graphID === graphID) {
                  return {
                    ...graph,
                    minTimestamp: timestamp,
                    datasets: await Promise.all(
                      graph.datasets.map(async (dataset) => {
                        type ReturnedDataObjAWS = {
                          Items: [];
                        };
                        type Data = {
                          items: [];
                          name: string;
                        };

                        const dataObj: ReturnedDataObjAWS = await getAWSData(
                          dataset.deviceID || "",
                          timestamp,
                          dataset.dataURL || ""
                        );
                        const arrayOfDataname = dataset.dataName.split("-");
                        const newDataName =
                          arrayOfDataname[0] +
                          "-" +
                          arrayOfDataname[1] +
                          "-" +
                          timestamp;
                        // check if arg name does not match any of the allData names before appending new data to to allData

                        if (dataObj) {
                          const alreadyExists =
                            allData?.filter((data) => data.name === newDataName)
                              ?.length || -1 > 0;
                          if (!alreadyExists) {
                            setData((prevState: Data[]) => [
                              ...prevState,
                              { items: dataObj.Items, name: newDataName },
                            ]);
                          }
                        }

                        return {
                          ...dataset,
                          dataName: newDataName,
                        };
                      })
                    ),
                  };
                } else {
                  return graph;
                }
              }) as any
            ),
          };
        } else {
          return dashboard;
        }
      }) as any
    );

    await updateUserSettingsAWS(user?.username || "", dashboardsDataModified);
    setDashboards(dashboardsDataModified);
    setUpdating(false);
  };
  return (
    <>
      <StyledDiv5>
        <StyledButton disabled={updating} onClick={() => changeTimespan("day")}>
          1 day
        </StyledButton>
        <StyledButton
          disabled={updating}
          onClick={() => changeTimespan("week")}
        >
          1 week
        </StyledButton>
        <StyledButton
          disabled={updating}
          onClick={() => changeTimespan("month")}
        >
          1 month
        </StyledButton>
        <StyledButton
          disabled={updating}
          onClick={() => changeTimespan("year")}
        >
          1 year
        </StyledButton>
        <StyledButton disabled={updating} onClick={() => changeTimespan("all")}>
          All Time
        </StyledButton>
      </StyledDiv5>
      <MinorSeparator>
        <span style={{ marginRight: "10px" }}>OR</span>
        <input
          disabled={updating}
          type={"datetime-local"}
          max={`${new Date(Date.now()).toLocaleDateString("sv")} 00:00:00`}
          onChange={(evt) => setMinTimestamp(evt.target.value)}
        />
        <StyledButton2
          style={{ marginLeft: "10px" }}
          onClick={() => {
            changeTimespan(minTimestamp);
          }}
        >
          Update
        </StyledButton2>
      </MinorSeparator>
      {updating && (
        <MinorSeparator>
          <LinearProgress color="inherit" />
        </MinorSeparator>
      )}
    </>
  );
};

export default SelectedTimespan;
