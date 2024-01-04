import React, { useEffect, useState } from "react";

import { HttpClient, HttpClientManager } from "./httpClient";
import { NullAble, STATUS, Constructable } from "./httpClient-types";

export function useHttpClient<DataType, ErrorType>(
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

    const httpClientInstance = HttpClientManager.GetHttpInstance(instanceKey);

    setData(httpClientInstance.data);
    setError(httpClientInstance.error);
    setStatus(httpClientInstance.status);
  };

  useEffect(() => {
    sendRequests();
  }, []);

  return [data as DataType, error as ErrorType, status as STATUS, sendRequests] as const;
}
