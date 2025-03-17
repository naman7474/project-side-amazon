import { enqueueSnackbar } from "notistack";
import { useState } from "react";

import axios, { AxiosResponse, DefaultErrorMessage } from "@/utils/axios";

interface APIResponse<T> {
  data?: T;
  isLoading: boolean;
  error: Error | null;
  getData: (url: string) => Promise<void>;
  postData: (url: string, payload: Record<string, any>) => Promise<void>;
  putData: (url: string, payload: Record<string, any>) => Promise<void>;
  postFormData: (url: string, payload: Record<string, any>) => Promise<void>;
}

export const useApi = <T = Record<string, any>>(): APIResponse<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const performRequest = async (
    requestFn: () => Promise<AxiosResponse<T>>
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await requestFn();
      setData(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err as Error);
      if (err?.message || err?.error) {
        enqueueSnackbar(err.message || err.error || DefaultErrorMessage, {
          variant: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async (url: string): Promise<void> => {
    await performRequest(() => axios.get(url));
  };

  const postData = async (
    url: string,
    payload: Record<string, any>
  ): Promise<void> => {
    await performRequest(() => axios.post(url, payload));
  };

  const putData = async (
    url: string,
    payload: Record<string, any>
  ): Promise<void> => {
    await performRequest(() => axios.put(url, payload));
  };

  const postFormData = async (
    url: string,
    payload: Record<string, any>
  ): Promise<void> => {
    await performRequest(() =>
      axios.post(url, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        baseURL: process.env.NEXT_PUBLIC_UPLOAD_HOST_API,
      })
    );
  };

  return { data, isLoading, error, getData, postData, putData, postFormData };
};
