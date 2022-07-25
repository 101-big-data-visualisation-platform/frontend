import React, { FC, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataContext from "../../contexts/DataContext";
import { Chart as Chartjs, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import GraphsContext, { Dashboard } from "../../contexts/GraphsContext";
import { Container } from "../../components/Container";
import {
  MinorSeparator,
  StyledButton,
  StyledButton2,
  StyledDiv1,
  StyledDiv2,
  StyledDiv3,
  StyledDiv4,
  StyledDiv5,
} from "./styled";
import { Close, Menu } from "@mui/icons-material";
import ContentToggler from "../../components/ContentToggler";
import GraphSelector from "../../components/graphs/GraphSelector";
import {
  AREACHART,
  LINECHART,
  SCATTERCHART,
  SINGLESTATISTIC,
} from "../../constants";
import { updateUserSettingsAWS } from "../../api/dashboard";
import AuthContext from "../../contexts/AuthContext";

Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

const DetailedView: FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const { allData } = useContext(DataContext);
  const { allDashboards, selectedDashboard, setDashboards } =
    useContext(GraphsContext);
  const graphID = searchParams.get("graphID") || "";
  const [menuDisplayed, setMenuDisplayed] = useState(false);
  const [selectedGraphType, setSelectedGraphType] = useState(
    allDashboards
      ?.find((dashboard) => dashboard.name === selectedDashboard)
      ?.allGraphs?.filter((graph) => graph.graphID === graphID)[0].graphType
  );

  const toggleMenu = () => {
    setMenuDisplayed(!menuDisplayed);
  };

  return (
    <StyledDiv2>
      <Container>
        <StyledDiv1>
          {allDashboards
            ?.find((dashboard) => dashboard.name === selectedDashboard)
            ?.allGraphs?.filter((graph) => graph.graphID === graphID)
            .map((graphData) => (
              <GraphSelector
                detailed={true}
                graphType={graphData.graphType}
                dashboardName={selectedDashboard}
                graphID={graphData.graphID}
                data={{
                  datasets: graphData.datasets.map((dataset) => {
                    return {
                      items:
                        allData?.find((data) => {
                          return data.name === dataset.dataName;
                        })?.items || [],
                      name: dataset.dataName,
                    };
                  }),
                }}
                options={{
                  graphTitleText: graphData.graphTitleText,
                  datasetOptions: graphData.datasets.map((dataset) => {
                    return {
                      datasetBackgroundColor: dataset.datasetBackgroundColor,
                      datasetBorderColor: dataset.datasetBorderColor,
                      label: `Device: ${dataset.deviceID}`,
                      dataName: dataset.dataName,
                      deviceID: dataset.deviceID || "",
                    };
                  }),
                  decimationSamples: graphData.decimationSamples,
                  dataSelector: graphData.dataSelector,
                  minTimestamp: graphData.minTimestamp || 0,
                }}
              />
            ))}
        </StyledDiv1>
      </Container>
      <StyledDiv4>
        <div style={{ display: "flex", alignItems: "center" }}>
          <StyledButton onClick={toggleMenu}>
            {menuDisplayed ? <Close /> : <Menu />}
          </StyledButton>
          {menuDisplayed && (
            <span style={{ marginLeft: "10px" }}>Graph Settings</span>
          )}
        </div>
        {menuDisplayed && (
          <StyledDiv3>
            <ContentToggler title="Selected Timespan">
              <>
                <StyledDiv5>
                  <StyledButton>1 day</StyledButton>
                  <StyledButton>1 week</StyledButton>
                  <StyledButton>1 month</StyledButton>
                  <StyledButton>1 year</StyledButton>
                  <StyledButton>All Time</StyledButton>
                </StyledDiv5>
                <MinorSeparator>
                  <span style={{ marginRight: "10px" }}>OR</span>
                  <input type={"date"} />
                  <StyledButton2 style={{ marginLeft: "10px" }}>
                    Update
                  </StyledButton2>
                </MinorSeparator>
              </>
            </ContentToggler>
            <ContentToggler title="Data Displayed">
              <p>Content</p>
            </ContentToggler>
            <ContentToggler title="Granularity">
              <p>Content</p>
            </ContentToggler>
            <ContentToggler title="Style Settings">
              <p>Content</p>
            </ContentToggler>
            <ContentToggler title="Graph Selection">
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
                    const dashboardsModified = allDashboards?.map(
                      (dashboard) => {
                        if (selectedDashboard === dashboard.name) {
                          return {
                            name: dashboard.name,
                            allGraphs: [
                              {
                                ...dashboard.allGraphs.find(
                                  (graph) => graph.graphID === graphID
                                ),
                                graphType: selectedGraphType,
                              },
                              ...dashboard.allGraphs.filter(
                                (graph) => graph.graphID !== graphID
                              ),
                            ] as any,
                          };
                        } else {
                          return dashboard;
                        }
                      }
                    );
                    try {
                      await updateUserSettingsAWS(
                        user?.username || "",
                        dashboardsModified
                      );
                    } catch (err) {
                      console.log(err);
                    } finally {
                      setDashboards(dashboardsModified);
                    }
                  }}
                >
                  Apply
                </button>
              </>
            </ContentToggler>
            <ContentToggler title="Graph Exporting">
              <p>Content</p>
            </ContentToggler>
            <ContentToggler title="Forcasting">
              <p>Content</p>
            </ContentToggler>
          </StyledDiv3>
        )}
      </StyledDiv4>
    </StyledDiv2>
  );
};

export default DetailedView;
