import axios from "axios";
import { interceptorError } from "./refresh-token";
import { cms } from "../config";
import { getCookie } from "react-use-cookie";

// axios for API CMS
export const AxiosClient = axios.create({
  baseURL: cms,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getCookie("auth_token"),
  },
});
AxiosClient.interceptors.response.use(function (response) {
  return response?.data;
}, interceptorError);

// axios for API Go
export const AxiosAPI = axios.create({
  baseURL: cms,
  headers: {
    "Content-Type": "application/json",
  },
});
AxiosAPI.interceptors.response.use(function (response) {
  return response;
});

export const fetcherClient = (url, params) => {
  if (url) {
    if (typeof url === "string") return AxiosClient.get(url, { params });
    else if (typeof url === "object") return AxiosClient.get(url[0], { params: url[1] });
  }
};
export const optionsFetch = {
  fetcher: fetcherClient,
};
export default AxiosClient;
