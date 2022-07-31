import { LinearProgress } from "@mui/material";
import React, { FC, useContext, useState } from "react";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import {
  AREACHART,
  LINECHART,
  SCATTERCHART,
  SINGLESTATISTIC,
} from "../../../constants";
import AuthContext from "../../../contexts/AuthContext";
import GraphsContext from "../../../contexts/GraphsContext";

const GraphSelection: FC<{ graphID: string }> = ({ graphID }) => {
  const { user } = useContext(AuthContext);
  const { allDashboards, selectedDashboard, setDashboards } =
    useContext(GraphsContext);
  const [selectedGraphType, setSelectedGraphType] = useState(
    allDashboards
      ?.find((dashboard) => dashboard.name === selectedDashboard)
      ?.allGraphs?.filter((graph) => graph.graphID === graphID)[0].graphType
  );
  const [updating, setUpdating] = useState(false);
  return (
    <>
      <select
        onChange={(evt) => setSelectedGraphType(evt.target.value)}
        defaultValue={selectedGraphType}
      >
        <option value={LINECHART}>Line</option>
        <option value={AREACHART}>Area</option>
        <option value={SCATTERCHART}>Scatter</option>
        <option value={SINGLESTATISTIC}>Latest Values</option>
      </select>
      <button
        onClick={async () => {
          setUpdating(true);
          const dashboardsModified = allDashboards?.map((dashboard) => {
            if (selectedDashboard === dashboard.name) {
              return {
                name: dashboard.name,
                allGraphs: dashboard.allGraphs.map((graph) => {
                  if (graph.graphID === graphID) {
                    return {
                      ...graph,
                      graphType: selectedGraphType,
                    };
                  } else {
                    return graph;
                  }
                }) as any,
              };
            } else {
              return dashboard;
            }
          });
          try {
            await updateUserSettingsAWS(
              user?.username || "",
              dashboardsModified
            );
          } catch (err) {
            console.log(err);
          } finally {
            setDashboards(dashboardsModified);
            setUpdating(false);
          }
        }}
      >
        Apply
      </button>
      {updating && (
        <div style={{ marginTop: "5px" }}>
          <LinearProgress color="inherit" />
        </div>
      )}
    </>
  );
};

export default GraphSelection;
