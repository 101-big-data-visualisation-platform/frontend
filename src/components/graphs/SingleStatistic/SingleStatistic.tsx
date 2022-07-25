import { LinearProgress } from "@mui/material";
import React, { useContext, useState } from "react";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import GraphsContext from "../../../contexts/GraphsContext";
import {
  StyledButton,
  StyledDiv1,
  StyledDiv2,
  StyledDiv3,
  StyledLink,
  ValueH1,
} from "./styled";

type SingleStatisticProps = {
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
  options,
  graphID,
  dashboardName,
}: SingleStatisticProps) => {
  const [deleting, setDeleting] = useState(false);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards } = useContext(GraphsContext);
  return (
    <StyledDiv1>
      <StyledLink
        to={`/detailed?dataName=${encodeURIComponent(
          JSON.stringify(options.datasetOptions)
        )}&dataSelector=${options.dataSelector}&graphID=${graphID}`}
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
      <StyledDiv2>
        <div style={{ width: "300px", marginLeft: "50px" }}>
          <h1>{options.graphTitleText}</h1>
          <p>latest {options.dataSelector} data</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
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
                <ValueH1>
                  {parseFloat(
                    dataset.items[dataset.items.length - 1]?.[
                      options.dataSelector
                    ]
                  ).toFixed(2)}
                </ValueH1>
                <p>
                  {new Date(
                    parseInt(dataset.items[dataset.items.length - 1]?.timeStamp)
                  ).toLocaleDateString("en-US", dateOptions)}
                </p>
              </StyledDiv3>
            );
          })}
        </div>
      </StyledDiv2>
    </StyledDiv1>
  );
};

export default SingleStatistic;
