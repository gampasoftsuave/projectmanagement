"use client";
import "@/styles/custom-animations.css";
import "../../../../styles/dropdowns.css";
import { useEffect, useState, useRef } from "react";
import ProjectListBackButton from "@/components/ProjectListBackButton";
import { STATUS_OPTIONS } from "@/constants/status";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/store/projectsApi";
import { ROUTES } from "@/constants/routes";
import { useRouter, useParams } from "next/navigation";
import Toast from "@/components/Toast";

export default function EditProjectPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    _id: "",
    name: "",
    description: "",
    status: "",
  });
  const [initialForm, setInitialForm] = useState({
    _id: "",
    name: "",
    description: "",
    status: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { data } = useGetProjectByIdQuery(id as string, {
    skip: !id,
  });
  const [updateProject, { isLoading: loading }] = useUpdateProjectMutation();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!dropdownOpen) setHighlighted(-1);
  }, [dropdownOpen, form.status]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    if (data) {
      const loaded = {
        _id: data._id,
        name: data.name,
        description: data.description || "",
        status: data.status || "",
      };
      setForm(loaded);
      setInitialForm(loaded);
    }
  }, [data]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!dropdownOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % STATUS_OPTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(
        (h) => (h - 1 + STATUS_OPTIONS.length) % STATUS_OPTIONS.length
      );
    } else if (e.key === "Enter" && highlighted >= 0) {
      setForm((prev) => ({ ...prev, status: STATUS_OPTIONS[highlighted] }));
      setDropdownOpen(false);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const update: Record<string, string> = {};
    if (form.description !== initialForm.description)
      update.description = form.description;
    if (form.status !== initialForm.status) update.status = form.status;
    if (form.name !== initialForm.name) update.name = form.name;
    if (Object.keys(update).length === 0) {
      setToast({ message: "No changes to update.", type: "error" });
      return;
    }
    setError(null);
    try {
      await updateProject({ id: id as string, update }).unwrap();
      router.push(`${ROUTES.PROJECTS}?toast=updated`);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { error?: string } }).data === "object" &&
        (err as { data?: { error?: string } }).data !== null &&
        "error" in (err as { data?: { error?: string } }).data!
      ) {
        setError(
          ((err as { data?: { error?: string } }).data as { error?: string })
            .error || "Failed to update project."
        );
      } else {
        setError("Failed to update project.");
      }
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative">
        <ProjectListBackButton />
        <div className="w-full max-w-xl py-12 px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text drop-shadow-lg mb-8 text-center">
            Edit Project
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl shadow-2xl p-8 animate-fade-in bg-white"
          >
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project ID (UUID)
              </label>
              <input
                type="text"
                value={form._id}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div
                className="relative w-full"
                ref={dropdownRef}
                tabIndex={0}
                onKeyDown={handleDropdownKeyDown}
              >
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  className="w-full cursor-pointer border border-gray-300 rounded-lg px-4 py-2 pr-8 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-base text-black bg-white appearance-none text-left flex items-center justify-between"
                  onClick={() => setDropdownOpen((open) => !open)}
                  onBlur={(e) => {
                    if (
                      !e.relatedTarget ||
                      !dropdownRef.current?.contains(e.relatedTarget as Node)
                    ) {
                      setDropdownOpen(false);
                    }
                  }}
                >
                  <span>
                    {form.status
                      ? form.status.charAt(0).toUpperCase() +
                        form.status.slice(1)
                      : "-- Select Status --"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 dropdown-listbox${
                    dropdownOpen ? " open" : ""
                  }`}
                  role="listbox"
                  tabIndex={-1}
                >
                  {STATUS_OPTIONS.map((opt: string, i: number) => (
                    <div
                      key={opt}
                      role="option"
                      aria-selected={form.status === opt}
                      className={`px-4 py-2 cursor-pointer select-none transition-colors duration-150 text-black ${
                        form.status === opt
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : ""
                      } ${highlighted === i ? "bg-blue-50" : ""}`}
                      onMouseDown={() => {
                        setForm((prev) => ({ ...prev, status: opt }));
                        setDropdownOpen(false);
                      }}
                      onMouseEnter={() => setHighlighted(i)}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:scale-105 transition-transform duration-200 text-white px-6 py-2 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 animate-pop disabled:opacity-60 text-center"
              >
                {loading ? "Loading..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
