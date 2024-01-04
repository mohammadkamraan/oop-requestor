import {
  STATUS,
  IRequest,
  IRequests,
  ISucceed,
  IFinished,
  IFiled,
  IShouldRequestSend,
  NullAble,
  COMMON_HTTP_METHODS,
  IMapResultToData,
  Constructable,
  IOnInit,
} from "./httpClient-types";
export abstract class HttpClient<DataType = any, ErrorType = any, QueryType = any>
  implements ISucceed, IFinished, IFiled, IShouldRequestSend, IMapResultToData, IOnInit
{
  private _data: NullAble<DataType> = null;
  private _queries: NullAble<QueryType> = null;
  private _status: NullAble<STATUS> = null;
  private _error: NullAble<ErrorType> = null;
  private _requests: ClientRequest[] = [];
  private _expectedData: string[] = [];
  private _requestKey: NullAble<string> = null;

  public get data() {
    return this._data;
  }
  protected set data(data) {
    this._data = data;
  }

  public get queries() {
    return this._queries;
  }

  public set queries(value) {
    this._queries = value;
  }

  public get status() {
    return this._status;
  }

  public get error() {
    return this._error;
  }
  public get requestKey(): string {
    return this._requestKey as string;
  }
  public set requestKey(requestKey: string) {
    this._requestKey = requestKey;
  }

  private httpPackage(): any {
    return fetch;
  }

  private async requestHandler(request: IRequest) {
    const handler = this.httpPackage();
    const result = await handler(request.url, request as any);
    const data = await result.json();
    return data;
  }

  private setAppendedData() {
    const appendedData = this.append();
    this._expectedData = appendedData.expectedData;
    this._requests = appendedData.requests;
  }

  private async requestsHandler() {
    const result = await Promise.all(this._requests.map(request => this.requestHandler(request)));

    let data: { [key: string]: any } = {};
    for (let index = 0; index < this._expectedData.length; index++) {
      data[this._expectedData[index]] = result[index];
    }
    this.mapResultToData(data as DataType);
  }

  public async sendRequests() {
    this._status = STATUS.LOADING;
    try {
      this.setAppendedData();
      const shouldRequestSend = await this.shouldRequestSend();
      if (!shouldRequestSend) return;
      this._status = STATUS.SUCCESS;
      await this.requestsHandler();
      await this.requestSucceed();
    } catch (error: ErrorType | any) {
      this._error = error;
      await this.requestFailed();
      this._status = STATUS.ERROR;
    } finally {
      await this.requestFinished();
    }
  }

  public mapResultToData(data: DataType) {
    this._data = data;
  }

  public async requestSucceed() {
    return;
  }

  public async requestFailed() {
    return;
  }

  public async requestFinished() {
    return;
  }

  public async shouldRequestSend() {
    return true;
  }

  public onInitialization(): void {
    return;
  }

  protected abstract append(): ClientRequests;
}

export class ClientRequest implements IRequest {
  body?: { [key: string]: any } | undefined;
  method: string | COMMON_HTTP_METHODS;
  params?: { [key: string]: string } | undefined;
  url: string;

  constructor(
    url: string,
    method: string | COMMON_HTTP_METHODS,
    params?: { [key: string]: string } | undefined,
    body?: { [key: string]: any } | undefined
  ) {
    this.body = body;
    this.method = method;
    this.params = params;
    this.url = url;
  }
}

export class ClientRequests implements IRequests {
  requests: IRequest[];
  expectedData: string[];

  constructor(requests: IRequest[], expectedData: string[]) {
    this.requests = requests;
    this.expectedData = expectedData;
  }
}

export class HttpClientManager {
  static httpClientInstances: Map<string, HttpClient> = new Map();

  private constructor(instanceKey: string) {
    HttpClientManager.GetHttpInstance(instanceKey)!.onInitialization();
    HttpClientManager.GetHttpInstance(instanceKey)!.requestKey = instanceKey;
  }

  static GetInstance<DataType = any, ErrorType = any, QueryType = any>(
    httpClient: Constructable<HttpClient<DataType, ErrorType, QueryType>>,
    instanceKey: string
  ): HttpClientManager {
    if (!HttpClientManager.GetHttpInstance(instanceKey)) {
      HttpClientManager.httpClientInstances.set(instanceKey, new httpClient());
    }
    const httpClientManager = new HttpClientManager(instanceKey);
    return httpClientManager;
  }

  static GetHttpInstance<DataType = any, ErrorType = any, QueriesType = any>(
    instanceKey: string
  ): HttpClient<DataType, ErrorType, QueriesType> | undefined {
    const httpClient: HttpClient<DataType, ErrorType, QueriesType> | undefined = HttpClientManager.httpClientInstances.get(instanceKey);
    return httpClient;
  }

  static InstancesAreEmpty(): boolean {
    return HttpClientManager.httpClientInstances.size === 0;
  }

  public async sendRequests(queries: any, requestKey: string) {
    const httpClientInstance = HttpClientManager.GetHttpInstance(requestKey);
    if (HttpClientManager.InstancesAreEmpty() || !httpClientInstance) {
      throw new Error("you should call static getInstance method before calling the sendRequests method. NO INSTANCE FOUND");
    }
    httpClientInstance.queries = queries;
    await httpClientInstance.sendRequests();
    HttpClientManager.httpClientInstances.set(requestKey, httpClientInstance);
  }

  static ClearAll() {
    HttpClientManager.httpClientInstances.clear();
  }

  static ClearByKey(instanceKey: string) {
    if (!HttpClientManager.GetHttpInstance(instanceKey)) throw new Error("No matched instances, possibly the provided key is wrong");
    HttpClientManager.httpClientInstances.delete(instanceKey);
  }
}
