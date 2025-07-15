// Mock NextResponse.json for API route unit tests
jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: unknown, { status = 200 } = {}) => ({
      status,
      json: async () => data,
    }),
  },
}));

// Robust mock for mongoose before any other imports
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: { readyState: 1 },
  model: jest.fn(),
  models: {},
  Schema: class {},
}));

jest.mock("../src/lib/mongodb", () => ({
  connectDB: jest.fn(),
}));

jest.mock("../src/lib/models/project", () => {
  const mock = {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
  };
  return {
    __esModule: true,
    default: mock,
  };
});

import { GET, POST } from "@/app/api/projects/route";
import Project from "../src/lib/models/project";

describe("API /api/projects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET returns paginated projects", async () => {
    (Project.find as jest.Mock).mockReturnValue({
      skip: () => ({
        limit: () => ({
          sort: () => [
            { _id: "1", name: "A" },
            { _id: "2", name: "B" },
          ],
        }),
      }),
    });
    (Project.countDocuments as jest.Mock).mockResolvedValue(2);
    const req = {
      url: "http://localhost/api/projects?page=1&limit=2",
      headers: new Map(),
      method: "GET",
      clone: () => req,
      body: null,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => "",
      // add any other required properties/methods as needed
    } as unknown as import("next/server").NextRequest;
    const result = await GET(req);
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json.projects.length).toBe(2);
    expect(json.total).toBe(2);
  });

  it("POST creates a new project", async () => {
    const newProject = { name: "New", description: "desc", status: "active" };
    (Project.create as jest.Mock).mockResolvedValue({
      ...newProject,
      _id: "123",
    });
    const req = {
      json: () => Promise.resolve(newProject),
      url: "http://localhost/api/projects",
      headers: new Map(),
      method: "POST",
      clone: () => req,
      body: null,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      text: async () => "",
      // add any other required properties/methods as needed
    } as unknown as import("next/server").NextRequest;
    const result = await POST(req);
    expect(result.status).toBe(201);
    const json = await result.json();
    expect(json.name).toBe("New");
    expect(json._id).toBe("123");
  });
});
