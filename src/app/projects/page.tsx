"use client";
import "@/styles/globals.css";
import { useEffect, useRef, useState } from "react";
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from "@/store/projectsApi";
import { useSearchParams, useRouter } from "next/navigation";
import LoginRequiredModal from "../../components/LoginRequiredModal";
import Link from "next/link";
import RowsPerPageDropdown from "../../components/RowsPerPageDropdown";
import StatusDropdown from "../../components/StatusDropdown";
import SortDropdown from "../../components/SortDropdown";
import ProjectTable from "../../components/ProjectTable";
import { ROUTES } from "@/constants/routes";
import Pagination from "../../components/Pagination";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import AuthButton from "@/components/AuthButton";
import { useAuthContext } from "@/components/AuthContext";
import Toast from "@/components/Toast";
import { Suspense } from "react";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const { data, error, isLoading, refetch } = useGetProjectsQuery({
    page,
    limit,
    status,
    sort,
  });
  const [deleteProject] = useDeleteProjectMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginWarn, setShowLoginWarn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetch();
  }, [page, status, limit, sort, refetch]);

  const handleDelete = async (id: string) => {
    if (!user) {
      setShowLoginWarn(true);
      return;
    }
    setDeleteId(id);
  };

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

  // Show toast for add, edit, delete, login success
  useEffect(() => {
    const toastParam = searchParams.get("toast");
    if (toastParam === "added") {
      setToast({ message: "Project added successfully!", type: "success" });
    } else if (toastParam === "updated") {
      setToast({ message: "Project updated successfully!", type: "success" });
    } else if (toastParam === "deleted") {
      setToast({ message: "Project deleted successfully!", type: "success" });
    } else if (toastParam === "login") {
      setToast({ message: "Login successful!", type: "success" });
    } else if (toastParam === "logout") {
      setToast({ message: "Signed out successfully!", type: "success" });
    } else if (toastParam === "error") {
      setToast({ message: "Failed to add project.", type: "error" });
    }
    if (toastParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("toast");
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleEdit = (id: string) => {
    if (!user) {
      setShowLoginWarn(true);
      return;
    }
    router.push(ROUTES.EDIT_PROJECT(id));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteProject(deleteId);
    setDeleteId(null);
    setToast({ message: "Project deleted successfully!", type: "success" });
    refetch();
  };

  return (
    <>
      <LoginRequiredModal
        open={showLoginWarn}
        onClose={() => setShowLoginWarn(false)}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="p-4 sm:p-8 min-h-screen bg-white">
        <div className="flex flex-col gap-4 mb-8 w-full">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text drop-shadow-lg animate-slide-down">
              Projects
            </h1>
            <div className="ml-auto">
              {/* AuthButton at top right */}
              <AuthButton />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 w-full">
            <div className="flex flex-col sm:flex-row gap-7 w-full sm:w-auto sm:justify-end">
              <div className="order-1 w-full sm:w-auto flex justify-center">
                {user ? (
                  <Link
                    href={ROUTES.ADD_PROJECT}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:scale-105 transition-transform duration-200 text-white px-6 py-1 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 animate-pop w-full sm:w-auto text-center flex justify-center items-center"
                  >
                    + Add Project
                  </Link>
                ) : (
                  <button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white px-6 py-1 rounded-xl text-lg font-semibold w-full sm:w-auto text-center flex justify-center items-center opacity-80 cursor-pointer"
                    onClick={() => setShowLoginWarn(true)}
                  >
                    + Add Project
                  </button>
                )}
              </div>

              <div className="order-2 flex items-center gap-2 w-full sm:w-auto">
                <label className="font-medium text-gray-700 whitespace-nowrap">
                  Status :
                </label>
                <StatusDropdown
                  value={status}
                  onChange={(val) => {
                    setStatus(val);
                    setPage(1);
                  }}
                />
              </div>

              <div className="order-3 flex items-center gap-2 w-full sm:w-auto">
                <label className="font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <SortDropdown
                  value={sort}
                  onChange={(val) => {
                    setSort(val);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl shadow-md bg-white/90 animate-fade-in border border-gray-200">
          <div className="max-h-[650px] min-h-[100px] overflow-y-scroll scrollbar pr-4">
            {error && (
              <p className="p-8 text-center text-lg text-red-500 animate-pulse">
                {typeof error === "string"
                  ? error
                  : "status" in error
                  ? `Error ${error.status}: ${
                      typeof error.data === "string"
                        ? error.data
                        : "An error occurred."
                    }`
                  : "An error occurred."}
              </p>
            )}
            {isLoading && !error ? (
              <p className="p-8 text-center text-lg text-gray-500 animate-pulse">
                Loading...
              </p>
            ) : !error && data ? (
              <ProjectTable
                projects={data.projects}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 text-gray-600 items-center justify-between animate-fade-in-delay w-full">
          <div className="flex items-center justify-start">
            <RowsPerPageDropdown
              limit={limit}
              setLimit={(val) => {
                setLimit(val);
                setPage(1);
              }}
            />
          </div>

          <div className="flex-1 flex items-center justify-center text-sm sm:text-base">
            {data && data.total > 0 ? (
              <span>
                {(page - 1) * limit + 1}-{Math.min(page * limit, data.total)}
                {" of "}
                {data.total}
              </span>
            ) : (
              <span>0 of 0</span>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Pagination
              page={page}
              total={data?.total ?? 0}
              limit={limit}
              setPage={setPage}
            />
          </div>
        </div>
        <DeleteConfirmModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </>
  );
}
