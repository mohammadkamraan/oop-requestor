"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var HttpClient = require("./httpClient").HttpClient;
var IRequests = require("./httpClient-types").IRequests;
var HomeRequest = /** @class */ (function (_super) {
    __extends(HomeRequest, _super);
    function HomeRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HomeRequest.prototype.append = function () {
        return {
            requests: [
                {
                    url: "https://jsonplaceholder.typicode.com/posts",
                    method: "GET"
                },
            ],
            expectedData: ["posts"]
        };
    };
    HomeRequest.getInstance = function () {
        return new HomeRequest();
    };
    HomeRequest.prototype.requestCompleted = function () {
        console.log("request was success full");
        return;
    };
    return HomeRequest;
}(HttpClient));
var homeRequest = HomeRequest.getInstance();
homeRequest.queries = ["hello"];
homeRequest.requestsHandler();
