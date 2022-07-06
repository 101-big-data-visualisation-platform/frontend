import React, { useEffect, useState } from "react";
import LineGraph from "../../components/LineGraph";
import { Container } from "../../components/Container";
import { getTankData } from "../../api/dashboard";

const Dashboard: React.FC = () => {
  type Data = {
    items: [];
  };
  const [data, setData] = useState<Data>({
    items: [],
  });
  const getData1 = async () => {
    // const dataObj = await getWeatherData("IALBAN25", 15000000000000);
    const dataObj: Data = await fetch("./lambda-results-full-300.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());
    setData(dataObj);
  };

  const getData2 = async () => {
    const dataObj: Data = await getTankData(
      "4317031",
      0,
      localStorage.getItem("authorization") || ""
    );
    console.log(dataObj);
  };
  useEffect(() => {
    getData1();
    getData2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Temperature Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 5000,
          }}
          dataSelector="inTemp"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Daily Rain Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 5000,
          }}
          dataSelector="dailyRain"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Absolute Barometer Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 5000,
          }}
          dataSelector="absBaro"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Dew Point Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 5000,
          }}
          dataSelector="dewPoint"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Humidity Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 5000,
          }}
          dataSelector="inHumi"
        />
      </div>
    </Container>
  );
};

export default Dashboard;
