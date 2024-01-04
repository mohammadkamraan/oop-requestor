import React, { useEffect, useState } from "react";

import { HttpClient, HttpClientManager } from "./httpClient";
import { NullAble, STATUS, Constructable } from "./httpClient-types";

export function useHttpClient<DataType = unknown, ErrorType = any, QueriesType = any>(
  httpClient: Constructable<HttpClient<DataType, ErrorType>>,
  queries: NullAble<any>,
  instanceKey: string
) {
  const [data, setData] = useState<NullAble<DataType>>(null);
  const [error, setError] = useState<NullAble<ErrorType>>(null);
  const [status, setStatus] = useState<NullAble<STATUS>>(null);

  const sendRequests = async () => {
    const httpClientManager = HttpClientManager.GetInstance<DataType, ErrorType>(httpClient, instanceKey);
    setStatus(STATUS.LOADING);

    await httpClientManager.sendRequests(queries, instanceKey);

    const httpClientInstance = HttpClientManager.GetHttpInstance<DataType, ErrorType, QueriesType>(instanceKey);

    setData(httpClientInstance?.data);
    setError(httpClientInstance?.error as ErrorType);
    setStatus(httpClientInstance?.status as STATUS);
  };

  useEffect(() => {
    sendRequests();
  }, []);

  return [data as DataType, error as ErrorType, status as STATUS, sendRequests] as const;
}
