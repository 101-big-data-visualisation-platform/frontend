import { apiHeroku, apiAWS } from ".";

export const getBatteryData = async () => {
  return await apiHeroku.get("/data/battery").then((response) => response.data);
};
export const getTankData = async () => {
  return await apiHeroku.get("/data/tank").then((response) => response.data);
};

export const getWeatherData = async (
  deviceID: string,
  minTimeStamp: number
) => {
  return await apiAWS
    .get(`/data/weather?deviceID=${deviceID}&min=${minTimeStamp}`)
    .then((response) => response.data);
};
