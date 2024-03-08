import { NullAble } from "./httpClient-types";
import { IConnectionOptions } from "./websocket-types";

export function Connection(options: IConnectionOptions): MethodDecorator {
  let websocket: NullAble<WebSocket> = null;
  return function (_: any, _1: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);

      if (!websocket) {
        websocket = new WebSocket(options.url, options.protocols);
        websocket.onopen = event => {
          args.push(event, websocket);
          descriptor.value.apply(this, args);
        };
      }

      websocket.onmessage = event => {
        args.push(event, websocket);
        descriptor.value.apply(this, args);
      };

      websocket.onclose = () => {
        websocket = null;
      };

      return result;
    };

    return descriptor;
  };
}
