import React, { FC, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DataContext from "../../contexts/DataContext";
import { Chart as Chartjs, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import GraphsContext from "../../contexts/GraphsContext";
import { Container } from "../../components/Container";
import {
  StyledButton,
  StyledDiv1,
  StyledDiv2,
  StyledDiv3,
  StyledDiv4,
} from "./styled";
import { Close, Menu } from "@mui/icons-material";
import ContentToggler from "../../components/ContentToggler";
import GraphSelector from "../../components/graphs/GraphSelector";
import SelectedTimespan from "./SelectedTimespan";
import GraphSelection from "./GraphSelection";

Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

const DetailedView: FC = () => {
  const [searchParams] = useSearchParams();
  const { allData } = useContext(DataContext);
  const { allDashboards, selectedDashboard } = useContext(GraphsContext);
  const graphID = searchParams.get("graphID") || "";
  const [menuDisplayed, setMenuDisplayed] = useState(false);

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
                  graphTitleText: `${graphData.graphTitleText} since: ${
                    (graphData?.minTimestamp || 0) > 0
                      ? new Date(
                          graphData.minTimestamp || 0
                        ).toLocaleDateString()
                      : "all time"
                  }`,
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
              <SelectedTimespan graphID={graphID} />
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
              <GraphSelection graphID={graphID} />
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
