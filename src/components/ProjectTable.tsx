import React from "react";
import { Project } from "../interface/interface";

export default function ProjectTable({
  projects,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <table className="min-w-full">
      <thead className="sticky top-0 z-9">
        <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
          <th className="px-4 py-3 text-left font-semibold text-gray-700">
            Project ID
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">
            Name
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">
            Timestamp
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">
            Description
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">
            Status
          </th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p: Project) => (
          <tr key={p._id} className="hover:bg-blue-50 transition">
            <td className="px-4 py-2">
              <span className="block w-40 px-2 py-1 text-gray-700 font-mono text-xs">
                {p._id}
              </span>
            </td>
            <td className="px-4 py-2">
              <span className="block w-32 px-2 py-1 text-gray-900 font-medium">
                {p.name}
              </span>
            </td>
            <td className="px-4 py-2">
              <span className="block w-44 px-2 py-1 text-gray-900 font-medium whitespace-nowrap">
                {p.createdAt
                  ? (() => {
                      const d = new Date(p.createdAt);
                      const date = d.toLocaleDateString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      });
                      const time = d.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      });
                      return `${date} ${time}`;
                    })()
                  : ""}
              </span>
            </td>
            <td className="px-4 py-2 text-gray-700">
              <div
                className="max-w-64 truncate cursor-pointer relative group"
                tabIndex={0}
              >
                <span
                  className="block overflow-hidden text-ellipsis whitespace-nowrap"
                  title={p.description}
                >
                  {p.description}
                </span>

                <span
                  className="absolute left-1/2 -translate-x-1/2 top-full z-20 w-max min-w-full bg-white border border-gray-300 shadow-lg rounded-lg p-3 text-sm text-gray-900 whitespace-pre-line break-words opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-200 mt-1"
                  style={{
                    maxWidth: "400px",
                    wordBreak: "break-word",
                    display: "none",
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const parent = el.parentElement;
                    if (!parent) return;
                    const textSpan = parent.querySelector("span.block");
                    if (
                      textSpan &&
                      textSpan.scrollWidth > textSpan.clientWidth
                    ) {
                      el.style.display = "";
                    } else {
                      el.style.display = "none";
                    }
                  }}
                  role="tooltip"
                >
                  {p.description}
                </span>
              </div>
            </td>
            <td className="px-4 py-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  p.status === "active"
                    ? "bg-green-100 text-green-700"
                    : p.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
              </span>
            </td>
            <td className="px-4 py-2 flex gap-2">
              <button
                onClick={() => onEdit(p._id)}
                className="p-2 rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
                aria-label={`Edit project ${p.name}`}
                type="button"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 13l6.071-6.071a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(p._id)}
                className="p-2 rounded cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center"
                aria-label={`Delete project ${p.name}`}
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6h16zm-5 4v6m-4-6v6"
                  />
                </svg>
              </button>
            </td>
          </tr>
        ))}
        {projects.length === 0 && (
          <tr>
            <td
              colSpan={6}
              className="text-center py-8 text-red-500 font-bold text-lg"
            >
              No Projects Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
