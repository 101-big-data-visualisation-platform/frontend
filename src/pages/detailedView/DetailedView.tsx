import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSearchParams } from "react-router-dom";
import DataContext from "../../contexts/DataContext";
import {
  Chart as Chartjs,
  registerables,
  ChartOptions,
  ChartData,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-moment";
import { ThemeContext } from "styled-components";
import GraphsContext, {
  Dashboard,
  Dataset,
  Graph,
} from "../../contexts/GraphsContext";
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

Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

const DetailedView: FC = () => {
  const [searchParams] = useSearchParams();
  const { allData } = useContext(DataContext);
  const { allDashboards, selectedDashboard } = useContext(GraphsContext);
  const dataSelector = searchParams.get("dataSelector") || "";
  const graphID = searchParams.get("graphID") || "";
  const theme = useContext(ThemeContext);
  const chartRef = useRef<Chartjs<"line">>();
  const [finalData, setFinalData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [menuDisplayed, setMenuDisplayed] = useState(false);

  const [graphSettings, setGraphSettings] = useState<Graph>();
  const getData1 = () => {
    // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    // const dataObj: Data = JSON.parse(JSON.stringify(dataMain));
    const arrayOfitemsArray = allDashboards
      ?.find((dashboard) => dashboard.name === selectedDashboard)
      ?.allGraphs.find((graph) => graph.graphID === graphID)
      ?.datasets.map((dataObj: Dataset) => {
        const itemsArray: [] =
          allData?.find((data) => data.name === dataObj.dataName)?.items || [];
        return {
          items: itemsArray,
          name: dataObj.dataName,
        };
      });

    type Item = {
      timeStamp: string;
    };
    interface IItem {
      [key: string]: string;
    }
    const processedItems = arrayOfitemsArray?.map(
      (arrayOfItems: { items: []; name: string }) => {
        return {
          items: arrayOfItems.items.map((item: Item) => {
            return {
              x: parseInt(item.timeStamp),
              y: parseFloat((item as IItem)[dataSelector]),
            };
          }),
          name: arrayOfItems.name,
        };
      }
    );
    setFinalData({
      datasets:
        processedItems?.map((processedItem: { items: any[]; name: string }) => {
          const relatedGraph = graphSettings?.datasets.find((dataset) => {
            return dataset.dataName === processedItem.name;
          });
          return {
            data: processedItem.items,
            label: `Device: ${relatedGraph?.deviceID}`,
            backgroundColor: relatedGraph?.datasetBackgroundColor,
            borderColor: relatedGraph?.datasetBorderColor,
            yAxisID: "y",
            pointRadius: 1,
            borderWidth: 1,
          };
        }) || [],
    });
  };
  const getGraphs = () => {
    for (let i = 0; i < (allDashboards?.length || 0); i++) {
      const dashboard = allDashboards?.[i] ?? ([] as unknown as Dashboard);
      const relatedGraph = dashboard.allGraphs.filter(
        (graph) => graph.graphID === graphID
      );
      if (relatedGraph.length === 1) {
        setGraphSettings(relatedGraph[0]);
        break;
      }
    }
  };

  useEffect(() => {
    getData1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData, graphSettings]);
  useEffect(() => {
    getGraphs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDashboards, allData]);

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
          text: dataSelector,
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
        text: graphSettings?.graphTitleText,
        color: theme.colors.secondary,
        font: {
          size: 20,
        },
      },
      decimation: {
        enabled: true,
        samples: graphSettings?.decimationSamples,
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
              <p>Content</p>
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
