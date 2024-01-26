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
  mode?: string;
  cache?: string;
  credentials?: string;
  headers?: { [key: string]: any };
  redirect?: string;
  referrerPolicy?: string;
}

export interface IRequests {
  requests: IRequest[];
  expectedData: string[];
}

export interface ISucceed {
  requestSucceed(): Promise<void> | void;
}

export interface IFailed {
  requestFailed(): Promise<void> | void;
}

export interface IFinished {
  requestFinished(): Promise<void> | void;
}

export interface IShouldRequestSend {
  shouldRequestSend(): boolean | Promise<boolean>;
}

export interface Constructable<T> {
  new (...args: any): T;
}

export interface IMapResultToData {
  mapResultToData(data: any): void;
}

export interface IOnInit {
  onInitialization(): void;
}

export type NullAble<T> = null | T;
