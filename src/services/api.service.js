import axios from "axios";
import axiosRetry from "axios-retry";
import { setOnLineStatus } from "../features/app";

// Axios instance setup
const url = process.env.REACT_APP_BE_SERVER_URL;

export const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 300000,
  timeoutErrorMessage: "Connection is timeout exceeded",
});

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError.response?.data || axiosError;
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: err,
        },
      };
    }
  };


// Set up interceptors
const setUpInterceptor = (store) => {
  // Retry logic
  axiosRetry(axiosInstance, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 500,
    shouldResetTimeout: true,
    retryCondition: (error) => {
      if (!navigator.onLine) {
        store.dispatch(setOnLineStatus(false));
        return false;
      }

      const status = Number(error?.response?.status);
      if (status === 503) {
        return false;
      }

      return (
        (status >= 100 && status <= 199) ||
        (status >= 500 && status <= 599) ||
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        status === 429 ||
        status === 408 ||
        status === 400
      );
    },
  });
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      const appState = await store.getState();
      const accessToken = await appState?.rootReducer?.user?.accessToken;
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setUpInterceptor;
