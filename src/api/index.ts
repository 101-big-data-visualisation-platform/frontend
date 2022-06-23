import axios from "axios";

export const apiHeroku = axios.create({
  baseURL: "https://mohiop4p.herokuapp.com/",
  timeout: 5000,
});

export const apiAWS = axios.create({
  baseURL: "https://dntb14v8sk.execute-api.us-east-2.amazonaws.com/prod",
  timeout: 300000,
});
