## What is new on version 1.1.0 :

**Complete support of JavaScript fetch api options**

# oop-requestor

**what is oop-requestor:**  
OOP-Requestor is a powerful and lightweight library designed for sending HTTP requests in TypeScript. This library is crafted to separate HTTP request code from the main logic, providing developers with a seamless experience. It offers several useful hooks at each phase of an HTTP request, allowing for functionalities like caching, pagination, logging, cancelation, and more.

# Features

1. **Lightweight yet Powerful:**  
   OOP-Requestor is designed to be light on resources while offering extensive capabilities. Despite its minimal footprint, it empowers developers to achieve a wide range of functionalities.

2. **Unparalleled Flexibility:**  
   Developers enjoy unmatched flexibility with OOP-Requestor, granting them the freedom to implement their HTTP requests exactly as they envision. Whether it's intricate request lifecycles, caching strategies, or other custom requirements, OOP-Requestor adapts to your needs.

3. **Exceptional TypeScript Typechecking Support:**  
   OOP-Requestor provides robust typechecking support in TypeScript, ensuring a seamless development experience with fewer runtime errors and improved code quality.

4. **Universal Compatibility:**  
   OOP-Requestor is not bound to a specific framework. It seamlessly integrates with popular libraries and frameworks such as React, React Native, Vue, and more. Wherever TypeScript is used, OOP-Requestor can follow.

5. **Singleton Instances:**  
   Enjoy the convenience of using OOP-Requestor instances throughout your application wherever HTTP requests are needed. This promotes consistency and ease of management.

6. **Comprehensive Request Lifecycles:**  
   OOP-Requestor introduces useful lifecycles at every phase of an HTTP request, allowing developers to hook into critical moments such as request initiation, response handling, and everything in between.
7. **Modular Design for Clean Code:** OOP-Requestor advocates clean code practices by encouraging developers to separate HTTP handling code from the main logic and even across different files. This modular design promotes maintainability and readability.

Explore the versatility and power of OOP-Requestor, offering a developer-friendly environment for crafting HTTP requests tailored to your specific needs.

# Installation

You can install OOP-Requestor using npm:

```bash
npm install oop-requestor
```

# Usage Guide

To use OOP-Requestor, you should create your own class that **must** extend from `HttpClient`. Your class **must** implement the `append` method, which is the only abstract method of the `HttpClient` class. The `append` method is responsible for returning your specific requests.

**Example:**

```typescript
import { HttpClientManager, HttpClient, ClientRequest, ClientRequests } from "oop-requestor";

class HomeHttpClient extends HttpClient {
  append(): ClientRequests {
    const requests = [
      new ClientRequest("https://jsonplaceholder.typicode.com/posts", "get"),
      new ClientRequest("https://jsonplaceholder.typicode.com/comments", "get"),
    ];
    return new ClientRequests(requests, ["posts", "comments"]);
  }
}

async function main() {
  const queries = {};
  const httpClientManager = HttpClientManager.GetInstance<DataType, ErrorType>(HomeHttpClient, instanceKey);

  await httpClientManager.sendRequests(queries, instanceKey);

  const httpClientInstance = HttpClientManager.GetHttpInstance<DataType, ErrorType, QueriesType>(instanceKey);

  console.log(httpClientInstance.data, httpClientInstance.error);
}
```

## HttpClientManager Overview

`HttpClientManager` is a class designed for managing instances of HTTP clients. It facilitates the management of HTTP requests through a straightforward process. Let's delve into how it works:

### Static Method: GetInstance

One of the key static methods of `HttpClientManager` is `GetInstance`. This method returns an instance of `HttpClientManager`. The method takes two parameters:

1. Your HTTP client class.
2. An instance key used to manage and store your HTTP client instance in the application.

**Important Note:**

- The instance key must be unique. If it's not unique, your instances might get replaced.

### Instance Method: sendRequests

The return type of the `GetInstance` static method includes a method called `sendRequests`. This method is asynchronous and takes care of sending your HTTP requests. It requires two parameters:

1. Queries (more on this later).
2. The provided instance key.

After calling this method, your HTTP requests will be sent. If the request is successful, your HTTP client class will have the data of the request in the `data` property. If the request fails, the error data will be available in the `error` property.

## Retrieving HTTP Client Instance

To retrieve the HTTP client instance, use the static method `GetHttpInstance` of `HttpClientManager`. Provide it with the unique instance key. This method returns the HTTP client instance associated with that key.

---

# API References

## HttpClient&lt;DataType, ErrorType, QueriesType&gt;

The `HttpClient` abstract class is parameterized with three generics:

- **DataType:** The type of the instance data.
- **ErrorType:** The type of the instance error.
- **QueriesType:** The type of the instance queries.

### Hooks

The `HttpClient` instance provides hooks that can be overridden in derived classes. These hooks run in a specific order.

#### `onInitialization()`

This hook is called when an instance of `HttpClient` is being created. It's useful for actions such as setting event listeners, for example, on the window focus event. The `this.queries` data is not available in this method but `this.requestKey` is available.

**Example:**

```typescript
class HomeHttpClient extends HttpClient implements IOnInit {
  append(): ClientRequests {
    const requests = [
      new ClientRequest("https://jsonplaceholder.typicode.com/posts", "get"),
      new ClientRequest("https://jsonplaceholder.typicode.com/comments", "get"),
    ];
    return new ClientRequests(requests, ["posts", "comments"]);
  }

  public override onInitialization() {
    // Your code here
  }
}
```

**Important Note**
this method will not be called automatically if you don't use HttpClientManager class.

---

#### `append(): ClientRequests`

This method is called before your request is sent. The `this.queries` property is filled with the provided data in this method.

This hook is an excellent place to specify which requests you want to send. You can return requests based on specific requirements and potentially filter them using the data in `this.queries`. Extract URL params or queries from `this.queries` in this method. However, please note that you should provide the `this.queries` data, which will be covered later.

##### `ClientRequests`

The `ClientRequests` class provides a collection of requests and has two required parameters in its constructor.

- **First Parameter (Array of `ClientRequest`):** Represents an array of `ClientRequest` instances.
- **Second Parameter (Array of Strings):** Represents an array of strings. Each string corresponds to the data that will be set in the `HttpClient` class.

##### `ClientRequest`

The `ClientRequest` class represents individual HTTP requests. It has the following parameters in its constructor:

- **Required `url`:** Represents the endpoint of the request. -
- **Required `method`:** Represents the HTTP method of the request. -
- **Optional `params`:** Represents the parameters of the request. -
- **Optional `body`:** Represents the body of the request.
- **Optional `headers`:** Represents the headers of the request.
- **Optional `mode`:** Represents the mode of the fetch api request.
- **Optional `cache`:** Represents the cache of the fetch api request.
- **Optional `credentials`:** Represents the credentials of the fetch api request.
- **Optional `redirect`:** Represents the redirect of the fetch api request.
- **Optional `referrerPolicy`:** Represents the referrerPolicy of the fetch api request.

**Example:**

```typescript
class HomeHttpClient extends HttpClient {
  append(): ClientRequests {
    const requests = [new ClientRequest(`https://jsonplaceholder.typicode.com/photos${this.queries.photoID}", "get`)];
    return new ClientRequests(requests, ["photo"]);
  }
}
```

In this example, the data in the `HttpClient` instance will be structured as follows:

```typescript
// After sending requests using HttpClientManager
console.log(httpClientInstance.data.photo); // Data from the "photo" request
```

---

#### `shouldRequestSend(): boolean`

The `shouldRequestSend` hook is an asynchronous method called after the `append()` hook. It serves as an excellent place for canceling a request based on specific checks. The return value of this method determines whether the request will be sent or not.

- If the method returns `false`, the request will not be sent.
- If the method returns `true`, the request will proceed to be sent.

**Example:**

```typescript
class HomeHttpClient extends HttpClient implements IShouldRequestSend {
  append(): ClientRequests {
    const requests = [
      new ClientRequest("https://jsonplaceholder.typicode.com/posts", "get"),
      new ClientRequest("https://jsonplaceholder.typicode.com/comments", "get"),
    ];
    return new ClientRequests(requests, ["posts", "comments"]);
  }

  public override async shouldRequestSend(): Promise<boolean> {
    // Your cancellation logic here
    // Return false to cancel the request
    // Return true to proceed with the request
  }
}
```

---

#### `mapResultToData(result: any): void`

The `mapResultToData` hook is used for mapping HTTP results to the instance `data` property. The default implementation sets the result received as a parameter to the instance `data` property. This hook is a great place for tasks such as concatenating data, handling pagination, or any other custom mapping logic.
the updated `this.queries` is available.

**Attention:**

- If you don't set `this.data` to any value, `this.data` will always be `null`.
- The `result` parameter is similar to what is explained in the `append` hook. If you've provided data keys for the `ClientRequests` as `['comments', 'photos']`, `result.comments` and `result.photos` are available.

- Override this hook to implement custom mapping logic for your application.
- The `result` parameter represents the result of the HTTP request.

**Example:**

```typescript
class HomeHttpClient extends HttpClient implements IMapResultToData {
  append(): ClientRequests {
    const requests = [
      new ClientRequest(`https://jsonplaceholder.typicode.com/posts${this.queries.postsPage}`, "get"),
      new ClientRequest("https://jsonplaceholder.typicode.com/comments", "get"),
    ];
    return new ClientRequests(requests, ["posts", "comments"]);
  }

  public override async mapResultToData(result: any) {
    if (this.data === null) {
      super.mapResultToData(result);
    } else {
      this.data = {
        posts: [...this.data.posts, ...data.posts],
        comments: data.comments,
      };
    }
  }
}
```

#### `async requestSucceed(): void`

The `requestSucceed` hook is called after the request was successful. This hook is an asynchronous method and is an excellent place for implementing caching strategies or any other actions you want to perform with the data available in the `this.data` property. in this method the status property of instance class in `STATUS.SUCCESS`.

- Override this hook to implement custom logic that should run after a successful HTTP request.

**Example:**

```typescript
class HomeHttpClient extends HttpClient implements ISucceed {
  append(): ClientRequests {
    const requests = [
      new ClientRequest(`https://jsonplaceholder.typicode.com/posts`, "get"),
      new ClientRequest("https://jsonplaceholder.typicode.com/comments", "get"),
    ];
    return new ClientRequests(requests, ["posts", "comments"]);
  }

  public override async requestSucceed() {
    // Your logic here for handling data after a successful request
    // This.data property is available for any processing or caching strategies
  }
}
```

---

## `async requestFailed(): void`

The `requestFailed` hook is called when the HTTP request encounters an error. This hook is asynchronous. In this hook, the `status` property is set to `STATUS.ERROR`, and the `this.error` data is filled with error data. This hook is a great place for performing logging actions or deciding whether to resend the request.

- Override this hook to implement custom logic that should run when an HTTP request fails.

**Example:**

```typescript
class HomeHttpClient extends HttpClient implements IFailed {
  append(): ClientRequests {
    const requests = [
      new ClientRequest(`https://jsonplaceholder.typicode.com/posts`, "get"),
      new ClientRequest("https://jsonplaceholder.typicode.com/comments", "get"),
    ];
    return new ClientRequests(requests, ["posts", "comments"]);
  }

  public override async requestFailed() {
    // Your logic here for handling errors after a failed request
    // Status is set to STATUS.ERROR, and error data is available in this.error
  }
}
```

---

## `async requestFinished(): void` Hook

The `requestFinished` hook is called in the `finally` block, regardless of whether the HTTP request was successful or encountered an error. This hook is asynchronous.

- Override this hook to implement custom logic that should run after the request is finished, regardless of its outcome.

**Example:**

```typescript
class HomeHttpClient extends HttpClient implements IFinished {
  append(): ClientRequests {
    const requests = [
      new ClientRequest(`https://jsonplaceholder.typicode.com/posts`, "get"),
      new ClientRequest("https://jsonplaceholder.typicode.com/comments", "get"),
    ];
    return new ClientRequests(requests, ["posts", "comments"]);
  }

  public override async requestFinished() {
    // Your logic here for actions after the request is finished
  }
}
```

---

# `HttpClientManager` Class

**Note:**

- The `HttpClientManager` is not constructable, and you should call the static `GetInstance` method to create an instance.

### Static Method: `GetInstance(httpClient: HttpClient(Cosntructable), requestKey: string): HttpClientManager`

This static method is used to create an instance of the `HttpClientManager`. It takes two parameters:

- **`httpClient` (Constructable):** The class of the HTTP client that extends from `HttpClient`.
- **`requestKey` (String):** A unique key for identifying the HTTP client instance.

- This method creates an instance of the provided `HttpClient` class.
- It stores the instance in a hash table with the unique `requestKey`.
- It calls the `onInitialization` hook of the `HttpClient` instance.

#### Example

```typescript
const httpClientManager = HttpClientManager.GetInstance(YourHttpClientClass, "uniqueKey");
```

---

### Instance Method: `async sendRequests<DataType, ErrorType, QueriesType>(queries: any, requestKey: string): HttpClient`

This instance method is used to send requests using the provided `HttpClient` instance. It takes two parameters:

- **`queries` (Any):** The queries data to be set in the `HttpClient` instance.
- **`requestKey` (String):** The unique key identifying the HTTP client instance.

- This method retrieves the `HttpClient` instance associated with the provided `requestKey` from hash table.
- It sets the `queries` property of the `HttpClient` instance with the provided queries data.
- It sends the requests based on the updated `queries` property.
- After the request is finished, it stores the updated `HttpClient` instance in the hash table.
- It returns the updated `HttpClient` instance.

_Important note:_
After calling the `sendRequests` method of `HttpClientManager` updated queries will be set in the HttpClient instance `this.queries` property.

**Example**

```typescript
const updatedHttpClient = await httpClientManager.sendRequests<DataType, ErrorType, QueriesType>(yourQueries, "uniqueKey");
```

---

### Static Method: `GetAllRequestKeys(): IterableIterator<string>`

This static method is used to retrieve all available instance unique keys stored in the hash table.

#### Example

```typescript
const keysIterator = HttpClientManager.GetAllRequestKeys();
for (const key of keysIterator) {
  console.log(key);
}
```

---

### Static Method: `GetHttpInstance<DataType, ErrorType, QueriesType>(): HttpClient | undefined`

This static method is used to retrieve available `HttpClient` instances from the hash table. It takes three generic parameters:

- **`DataType` (Any):** The type of instance data.
- **`ErrorType` (Any):** The type of instance error.
- **`QueriesType` (Any):** The type of instance queries.

- This method returns the `HttpClient` instance associated with the provided unique key.
- If no instance is found for the given key, it returns `undefined`.
- The generics can be used to specify the expected types for the instance.

#### Example

```typescript
const httpClientInstance = HttpClientManager.GetHttpInstance<DataType, ErrorType, QueriesType>("uniqueKey");
```

---

### Static Method: `InstancesAreEmpty(): boolean`

This static method is used to check if the hash table of `HttpClient` instances is empty or not.

#### Example

```typescript
const areEmpty = HttpClientManager.InstancesAreEmpty();
console.log(areEmpty); // true if empty, false if
```

## Memory Management

### `ClearAll(): void`

This static method is used to clear all instances of `HttpClient` in the app.

### Example

```typescript
HttpClientManager.ClearAll();
```

### `ClearByKey(requestKey: string): void`

This static method is used to delete a specific `HttpClient` instance by its `requestKey`.

This method removes the `HttpClient` instance associated with the provided `requestKey` from the memory.

### Example

```typescript
const requestKeyToDelete = "uniqueKey";
HttpClientManager.ClearByKey(requestKeyToDelete);
```
