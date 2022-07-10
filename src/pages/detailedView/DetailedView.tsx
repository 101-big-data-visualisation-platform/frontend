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
import GraphsContext from "../../contexts/GraphsContext";
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
Chartjs.register(...registerables);
Chartjs.register(zoomPlugin);

const DetailedView: FC = () => {
  const [searchParams] = useSearchParams();
  const { allData } = useContext(DataContext);
  const { allGraphs } = useContext(GraphsContext);
  const dataName = searchParams.get("dataName") || "";
  const dataSelector = searchParams.get("dataSelector") || "";
  const theme = useContext(ThemeContext);
  const chartRef = useRef<Chartjs<"line">>();
  const [finalData, setFinalData] = useState<ChartData<"line">>({
    datasets: [],
  });
  const [menuDisplayed, setMenuDisplayed] = useState(false);
  type Graph = {
    dataName: string;
    dataSelector: string;
    graphTitleText: string;
    datasetBackgroundColor: string;
    datasetBorderColor: string;
    decimationSamples: number;
  };
  const [graphSettings, setGraphSettings] = useState<Graph>();
  const getData1 = () => {
    // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    // const dataObj: Data = JSON.parse(JSON.stringify(dataMain));
    const itemsArray: [] =
      allData?.find((data) => data.name === dataName)?.items || [];

    type Item = {
      timeStamp: string;
    };
    interface IItem {
      [key: string]: string;
    }
    const processedItems = itemsArray.map((item: Item) => {
      return {
        x: parseInt(item.timeStamp),
        y: parseFloat((item as IItem)[dataSelector]),
      };
    });
    setFinalData({
      datasets: [
        {
          data: processedItems,
          label: dataSelector,
          backgroundColor: graphSettings?.datasetBackgroundColor,
          borderColor: graphSettings?.datasetBorderColor,
          yAxisID: "y",
          pointRadius: 1,
          borderWidth: 1,
        },
      ],
    });
  };
  const getGraphs = () => {
    const relatedGraph = allGraphs?.find((graph) => {
      if (
        graph.dataName +
          (graph.deviceID !== undefined ? graph.deviceID : "") +
          (graph.minTimestamp !== undefined
            ? graph.minTimestamp?.toString()
            : "") ===
          dataName &&
        graph.dataSelector === dataSelector
      ) {
        return true;
      } else {
        return false;
      }
    });
    console.log(relatedGraph?.datasetBackgroundColor);
    setGraphSettings(relatedGraph);
  };

  useEffect(() => {
    getData1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData, graphSettings]);
  useEffect(() => {
    getGraphs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGraphs, allData]);

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
        algorithm: "lttb",
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
          <button
            onClick={() => {
              chartRef?.current?.resetZoom();
            }}
          >
            Reset Zoom
          </button>
          <Line data={finalData} options={optionsFinal} ref={chartRef} />
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
