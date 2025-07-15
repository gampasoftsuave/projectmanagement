import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/lib/models/project";

// GET: Fetch a project by ID
export async function GET(req: NextRequest, context: any) {
  await connectDB();
  const { id } = context.params;

  const project = await Project.findById(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT: Update a project by ID
export async function PUT(req: NextRequest, context: any) {
  await connectDB();
  const { id } = context.params;

  const data = await req.json();
  const project = await Project.findByIdAndUpdate(id, data, { new: true });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// DELETE: Remove a project by ID
export async function DELETE(req: NextRequest, context: any) {
  await connectDB();
  const { id } = context.params;

  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
