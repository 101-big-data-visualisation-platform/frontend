import React, { useEffect, useState } from "react";
import LineGraph from "../../components/LineGraph";
import { Container } from "../../components/Container";

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

  useEffect(() => {
    getData1();
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
            decimationSamples: 50,
          }}
          dataSelector="inTemp"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Daily Rain Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 50,
          }}
          dataSelector="dailyRain"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Absolute Barometer Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 50,
          }}
          dataSelector="absBaro"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Dew Point Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 50,
          }}
          dataSelector="dewPoint"
        />
        <LineGraph
          data={data}
          options={{
            graphTitleText: "Humidity Data",
            datasetBackgroundColor: "red",
            datasetBorderColor: "red",
            decimationSamples: 50,
          }}
          dataSelector="inHumi"
        />
      </div>
    </Container>
  );
};

export default Dashboard;
