import { STATUS, IRequest, IRequests } from "./httpClient-types";
export abstract class HttpClient<DataType> {
  private _data: null | DataType = null;
  private _queries: { [key: string]: any } | null = null;
  private _status: STATUS | null = null;

  public get data() {
    return this._data;
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

  private httpPackage(): any {
    return fetch;
  }

  private async requestHandler(request: IRequest) {
    const handler = this.httpPackage();
    const result = await handler(request.url, request as any);
    const data = await result.json();
    return data;
  }

  public async requestsHandler() {
    const { requests, expectedData } = this.append();
    const httpRequests = requests.map(request => this.requestHandler(request));
    try {
      if (!this.shouldSendRequest()) return;
      const result = await Promise.all(httpRequests);
      let data = {};
      for (let index = 0; index < expectedData.length; index++) {
        data[expectedData[index]] = result[index];
      }
      this._data = data as DataType;
      await this.requestCompleted();
    } catch (error) {
      await this.requestFailed(error);
    } finally {
      await this.requestFinished();
    }
  }

  private async requestCompleted() {
    return;
  }

  private async requestFailed(error) {
    return;
  }

  private async requestFinished() {
    return;
  }

  private async shouldSendRequest(): Promise<boolean> {
    return true;
  }

  protected abstract append(): IRequests;
}
