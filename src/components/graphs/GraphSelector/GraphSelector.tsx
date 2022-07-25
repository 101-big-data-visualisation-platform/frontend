import React from "react";
import {
  AREACHART,
  LINECHART,
  SCATTERCHART,
  SINGLESTATISTIC,
} from "../../../constants";
import AreaGraph from "../AreaGraph";
import LineGraph from "../LineGraph";
import ScatterPlot from "../ScatterPlot";
import SingleStatistic from "../SingleStatistic";
type GraphSelectorProps = {
  graphType: string;
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
    decimationSamples: number;
    dataSelector: string;
    minTimestamp: number;
  };
  graphID: string;
  dashboardName: string;
};
const GraphSelector = ({
  data,
  dashboardName,
  detailed,
  graphID,
  options,
  graphType,
}: GraphSelectorProps) => {
  if (graphType === LINECHART) {
    return (
      <LineGraph
        detailed={detailed}
        data={data}
        dashboardName={dashboardName}
        graphID={graphID}
        options={options}
      />
    );
  } else if (graphType === AREACHART) {
    return (
      <AreaGraph
        detailed={detailed}
        data={data}
        dashboardName={dashboardName}
        graphID={graphID}
        options={options}
      />
    );
  } else if (graphType === SCATTERCHART) {
    return (
      <ScatterPlot
        detailed={detailed}
        data={data}
        dashboardName={dashboardName}
        graphID={graphID}
        options={options}
      />
    );
  } else if (graphType === SINGLESTATISTIC) {
    return (
      <SingleStatistic
        detailed={detailed}
        data={data}
        dashboardName={dashboardName}
        graphID={graphID}
        options={options}
      />
    );
  } else {
    return <h1>No Graph Found</h1>;
  }
};

export default GraphSelector;
