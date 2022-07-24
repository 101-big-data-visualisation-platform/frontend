import React from "react";
import { AREACHART, LINECHART } from "../../../constants";
import AreaGraph from "../AreaGraph";
import LineGraph from "../LineGraph";
type GraphSelectorProps = {
  graphType: string;
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
  graphID,
  options,
  graphType,
}: GraphSelectorProps) => {
  if (graphType === LINECHART) {
    return (
      <LineGraph
        data={data}
        dashboardName={dashboardName}
        graphID={graphID}
        options={options}
      />
    );
  } else if (graphType === AREACHART) {
    return (
      <AreaGraph
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
