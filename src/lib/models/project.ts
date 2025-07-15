import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
