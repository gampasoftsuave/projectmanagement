"use client";
import "@/styles/custom-animations.css";
import { useAddProjectMutation } from "@/store/projectsApi";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProjectListBackButton from "@/components/ProjectListBackButton";
import StatusDropdown from "../../../components/StatusDropdown";
import { STATUS_OPTIONS } from "@/constants/status";
import { ROUTES } from "@/constants/routes";
import { ProjectForm } from "@/interface/interface";

export default function AddProjectPage() {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    status: STATUS_OPTIONS[0] as ProjectForm["status"],
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [addProject, { isLoading }] = useAddProjectMutation();

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      setError(null);
    },
    []
  );

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    try {
      await addProject(form).unwrap();
      router.push(`${ROUTES.PROJECTS}?toast=added`);
    } catch (error) {
      const err = error as { data?: { error?: string } };
      setError(err?.data?.error || "Failed to add project. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 relative">
      <ProjectListBackButton />
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 drop-shadow-2xl mb-10 mt-8 z-10 relative animate-slide-down">
        Add Project
      </h1>
      <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-xl w-full animate-fade-in">
        {error && (
          <div className="mb-4 p-3 bg-red-200 text-red-900 rounded-lg shadow animate-fade-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg text-black placeholder-gray-400"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg min-h-[100px] text-black placeholder-gray-400"
          />
          <StatusDropdown
            value={form.status}
            onChange={(val) =>
              setForm((prev) => ({
                ...prev,
                status: val as ProjectForm["status"],
              }))
            }
            options={STATUS_OPTIONS}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:scale-105 transition-transform duration-200 text-white px-6 py-3 rounded-xl text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 animate-pop"
          >
            {isLoading ? "Loading..." : "Add Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
