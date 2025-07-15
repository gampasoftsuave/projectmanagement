import "@/styles/custom-animations.css";
import { ToastProps } from "@/interface/interface";
import React from "react";

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 min-w-[200px] max-w-xs flex items-center gap-2 px-4 py-2 rounded-xl shadow-2xl border border-opacity-20 backdrop-blur-md bg-white/90 transition-all duration-300 animate-pop toast-custom-shadow ${
        type === "success" ? "border-green-400" : "border-red-400"
      }`}
      role="alert"
    >
      <span className="mt-0.5">
        {type === "success" ? (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </span>
      <div className="flex-1 text-gray-900 font-medium text-sm pr-1">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 text-gray-400 cursor-pointer hover:text-gray-700 focus:outline-none text-lg font-bold px-0.5 rounded transition-colors duration-150"
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}
