import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mblog-akash.herokuapp.com/",
});
