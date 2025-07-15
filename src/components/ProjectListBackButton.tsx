"use client";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

export default function ProjectListBackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(ROUTES.PROJECTS)}
      className="absolute cursor-pointer top-6 left-6 z-20 flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold text-base"
      aria-label="Go back to project list"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Go Back
    </button>
  );
}
