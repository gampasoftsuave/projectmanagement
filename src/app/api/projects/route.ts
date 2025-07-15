import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/project";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
  const status = searchParams.get("status");
  const sortParam = searchParams.get("sort");
  const sort = sortParam === "asc" ? 1 : -1;
  const filter = status ? { status } : {};
  const projects = await Project.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: sort });
  const total = await Project.countDocuments(filter);
  return NextResponse.json({ projects, total });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  if ("id" in data) delete data.id;
  const project = await Project.create(data);
  return NextResponse.json(project, { status: 201 });
}
