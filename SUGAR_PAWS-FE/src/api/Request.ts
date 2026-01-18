/* eslint-disable prettier/prettier */
import { getAuthToken } from "@/helper/storage";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

type Response<T> = {
  statusCode: number;
  message: string;
  error?: string;
  data?: T;
};

export type Params = {
  [KEY in string]: unknown;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export function useRequest() {
  class Request {
    static post<T>(
      url: string,
      params?: Params,
      config: AxiosRequestConfig = {}
    ): Promise<Response<T>> {
      return new Promise<Response<T>>((resolve, reject) => {
        axiosInstance
          .post<Response<T>>(url, params, {
            headers: { "Content-Type": "application/json" },
            ...config,
          })
          .then((res: AxiosResponse) => resolve(res.data))
          .catch((e) => reject(e.response?.data || e));
      });
    }

    static get<T>(
      url: string,
      params?: Params,
      config: AxiosRequestConfig = {}
    ): Promise<Response<T>> {
      return new Promise<Response<T>>((resolve, reject) => {
        axiosInstance
          .get<Response<T>>(url, {
            headers: { "Content-Type": "application/json" },
            params,
            ...config,
          })
          .then((res: AxiosResponse) => resolve(res.data))
          .catch((e) => reject(e.response?.data || e));
      });
    }

    static put<T>(
      url: string,
      params?: Params,
      config: AxiosRequestConfig = {}
    ): Promise<Response<T>> {
      return new Promise<Response<T>>((resolve, reject) => {
        axiosInstance
          .put<Response<T>>(url, params, {
            headers: { "Content-Type": "application/json" },
            ...config,
          })
          .then((res: AxiosResponse) => resolve(res.data))
          .catch((e) => reject(e.response?.data || e));
      });
    }

    static patch<T>(
      url: string,
      params?: Params,
      config: AxiosRequestConfig = {}
    ): Promise<Response<T>> {
      return new Promise<Response<T>>((resolve, reject) => {
        axiosInstance
          .patch<Response<T>>(url, params, {
            headers: { "Content-Type": "application/json" },
            ...config,
          })
          .then((res: AxiosResponse) => resolve(res.data))
          .catch((e) => reject(e.response?.data || e));
      });
    }

    static del(
      url: string,
      params?: Params,
      data?: Params
    ): Promise<Response<boolean>> {
      return new Promise<Response<boolean>>((resolve, reject) => {
        axiosInstance
          .delete<Response<boolean>>(url, {
            headers: { "Content-Type": "application/json" },
            params,
            ...(data ? { data } : {}),
          })
          .then((res: AxiosResponse) => resolve(res.data))
          .catch((e) => reject(e.response?.data || e));
      });
    }
  }

  return { Request };
}
