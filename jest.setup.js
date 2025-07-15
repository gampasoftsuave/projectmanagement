// Polyfill fetch and web APIs for API route tests
const { Request, Response, Headers, fetch } = require("node-fetch");
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.fetch = fetch;

// Robust mongoose mock for all tests
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: { readyState: 1 },
  model: jest.fn(),
  models: {},
  Schema: class {},
}));

// Robust mongodb util mock for all tests
jest.mock("./src/lib/mongodb", () => ({
  connectDB: jest.fn(),
}));
