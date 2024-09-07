import axios from "axios";
import { setCookie } from "react-use-cookie";
import { directus } from "../directus";
import { refresh } from "@directus/sdk";
import { mode } from "../config";

export let isRefreshing = false;
export let refreshSubscribers = [];
let callbackErrorAuthentication = () => {};

axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const updateIsRefreshing = (value) => {
  isRefreshing = value;
};
export const updateRefreshSubscribers = (value) => {
  refreshSubscribers = value;
};
const removeCookie = () => {
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "expires=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const refreshAccessToken = async () => {
  let res = {};
  if (mode !== "developments") {
    res = await directus.refresh().catch(() => {
      removeCookie();
      return null;
    });
  } else {
    res = await directus.request(refresh("json", "sPT-3fSduLeYRd4jxsfw0_U3NpRqEYAfg0PDNb0HlTbA_g2o7mk6CTMQTsyqWByP"));
  }

  // const res = await directus.request(refresh("json", "sPT-3fSduLeYRd4jxsfw0_U3NpRqEYAfg0PDNb0HlTbA_g2o7mk6CTMQTsyqWByP"));
  const { access_token, expires } = res;
  setCookie("expires", expires);
  setCookie("auth_token", access_token);
  return access_token;
};

export function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

export function onRrefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export const constructCallBack = (handle) => {
  callbackErrorAuthentication = handle;
};

export async function interceptorError(error) {
  if (error?.response?.status == 401) {
    const originalRequest = error.config;
    const retryOrigReq = new Promise((resolve, _) => {
      subscribeTokenRefresh((token) => {
        originalRequest.headers["Authorization"] = token ? "Bearer " + token : "";
        resolve(axios(originalRequest));
      });
    });
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const result = await refreshAccessToken();
        if (!result) {
          isRefreshing = false;
          return Promise.reject(error);
        }
        isRefreshing = false;
        onRrefreshed(result);
      } catch (error) {
        isRefreshing = false;
        callbackErrorAuthentication();
        return Promise.reject(error);
      }
    }
    return retryOrigReq;
  } else {
    return Promise.reject(error);
  }
}
