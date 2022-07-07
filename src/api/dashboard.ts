import { apiAWS } from ".";

export const getWeatherData = async (
  deviceID: string,
  minTimeStamp: number
) => {
  return await apiAWS
    .get(`/data/weather?deviceID=${deviceID}&min=${minTimeStamp}`)
    .then((response) => response.data);
};

export const getTankData = async (
  deviceID: string,
  minTimeStamp: number,
  jwt: string
) => {
  return await apiAWS
    .get(`/data/tank?deviceID=${deviceID}&min=${minTimeStamp}`, {
      headers: {
        authorization: jwt,
      },
    })
    .then((response) => response.data);
};

export const getAWSData = async (
  deviceID: string,
  minTimeStamp: number,
  jwt: string,
  endpointURL: string
) => {
  return await apiAWS
    .get(`${endpointURL}?deviceID=${deviceID}&min=${minTimeStamp}`, {
      headers: {
        authorization: jwt,
      },
    })
    .then((response) => response.data);
};
