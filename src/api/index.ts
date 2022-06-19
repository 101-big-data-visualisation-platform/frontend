import axios from "axios";

export const api = axios.create({
  baseURL: "https://mohiop4p.herokuapp.com/",
  timeout: 5000,
  headers: { "Access-Control-Allow-Origin": "*" },
});
