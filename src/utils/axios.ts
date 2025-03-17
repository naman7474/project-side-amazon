import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { localStorageRemoveItem } from "@/libs/utils/localStorage";

import { HOST_API } from "@/config";
import { paths } from "@/routes/paths";
import { USER_STORAGE_KEY } from "@/utils/constants";

axios.defaults.baseURL = HOST_API;
const axiosInstance = axios.create();
// eslint-disable-next-line
axiosInstance.defaults.headers.common["source"] = "dashboard";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorageRemoveItem(USER_STORAGE_KEY);
      if (
        window.location.pathname !== paths.auth.login &&
        window.location.pathname !== "/login"
      )
        window.location.href = paths.auth.login;
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export type { AxiosRequestConfig };

export type { AxiosResponse };

export default axiosInstance;

export const DefaultErrorMessage = "Something went wrong.";

export const API_ENDPOINTS = {
  auth: {
    login: "/accounts/users/login",
    register: "/accounts/users/register",
  },
  dashboard: {
    overview: "/dashboard/overview",
    partners: {
      list: "/partners",
    },
    seller: {
      detail: (sellerId: string) => `/sellers/${sellerId}`,
    },
    uploadFile: "/upload",
  },
  oauth: {
    amazon: "/oauth/amazon",
  },
};
