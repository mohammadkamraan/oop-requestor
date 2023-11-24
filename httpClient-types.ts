export enum STATUS {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}

export enum COMMON_HTTP_METHODS {
  GET = "get",
  PUT = "put",
  POST = "post",
  PATCH = "patch",
}

export interface IRequest {
  method: string | COMMON_HTTP_METHODS;
  url: string;
  body?: { [key: string]: any };
  params?: { [key: string]: string };
}

export interface IRequests {
  requests: IRequest[];
  expectedData: string[];
}

export type HTTP_PACKAGE = (request: IRequest) => any;

export interface IClear {
  clear: () => void;
}

export interface ICompleted {
  requestCompleted: () => void;
}

export interface IFiled {
  requestFailed: () => void;
}
