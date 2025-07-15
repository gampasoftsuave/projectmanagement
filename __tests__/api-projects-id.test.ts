// Mock NextResponse.json for API route unit tests
jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: (data: unknown, { status = 200 } = {}) => ({
        status,
        json: async () => data,
      }),
    },
  };
});

// Mock mongoose and model before any other imports
jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");
  return {
    ...actual,
    model: jest.fn(() => ({})),
    models: {},
    Schema: actual.Schema,
  };
});

jest.mock("../src/lib/models/project", () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

import { createMocks } from "node-mocks-http";
import { GET, PUT, DELETE } from "@/app/api/projects/[id]/route";
import Project from "../src/lib/models/project";

jest.mock("../src/lib/mongodb", () => ({ connectDB: jest.fn() }));
jest.mock("../src/lib/models/project");

const mockProject = {
  _id: "123",
  name: "Test",
  description: "desc",
  status: "active",
  toJSON() {
    return this;
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("API /api/projects/[id]", () => {
  it("GET returns project if found", async () => {
    (Project.findById as jest.Mock).mockResolvedValue(mockProject);
    const { req } = createMocks({
      method: "GET",
      query: { id: "123" },
    });
    const result = await GET(req, { params: { id: "123" } });
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json._id).toBe("123");
  });

  it("GET returns 404 if not found", async () => {
    (Project.findById as jest.Mock).mockResolvedValue(null);
    const { req } = createMocks({
      method: "GET",
      query: { id: "notfound" },
    });
    const result = await GET(req, { params: { id: "notfound" } });
    expect(result.status).toBe(404);
  });

  it("PUT updates and returns project", async () => {
    (Project.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProject);
    const body = { name: "Updated" };
    const req = {
      json: () => Promise.resolve(body),
      // minimal mock for required NextRequest properties
      headers: new Map(),
      method: "PUT",
      url: "http://localhost/api/projects/123",
      clone: () => req,
      body: null,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => "",
      // add any other required properties/methods as needed
    } as unknown as import("next/server").NextRequest;
    const result = await PUT(req, { params: { id: "123" } });
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json.name).toBe("Test");
  });

  it("PUT returns 404 if not found", async () => {
    (Project.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    const body = { name: "x" };
    const req = {
      json: () => Promise.resolve(body),
      headers: new Map(),
      method: "PUT",
      url: "http://localhost/api/projects/notfound",
      clone: () => req,
      body: null,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => "",
    } as unknown as import("next/server").NextRequest;
    const result = await PUT(req, { params: { id: "notfound" } });
    expect(result.status).toBe(404);
  });

  it("DELETE deletes and returns success", async () => {
    (Project.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProject);
    const req = {
      headers: new Map(),
      method: "DELETE",
      url: "http://localhost/api/projects/123",
      clone: () => req,
      body: null,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => "",
      // add any other required properties/methods as needed
    } as unknown as import("next/server").NextRequest;
    const result = await DELETE(req, { params: { id: "123" } });
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json.success).toBe(true);
  });

  it("DELETE returns 404 if not found", async () => {
    (Project.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    const req = {
      headers: new Map(),
      method: "DELETE",
      url: "http://localhost/api/projects/notfound",
      clone: () => req,
      body: null,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => "",
    } as unknown as import("next/server").NextRequest;
    const result = await DELETE(req, { params: { id: "notfound" } });
    expect(result.status).toBe(404);
  });
});
