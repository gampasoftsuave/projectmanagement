import React from "react";
import BaseModal from "./BaseModal";

export default function LoginRequiredModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Login Required"
      icon={
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
          />
        </svg>
      }
      actions={
        <>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
            onClick={onClose}
            autoFocus
          >
            Close
          </button>
          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-gray-200 text-blue-700 font-semibold hover:bg-gray-300 transition cursor-pointer border border-blue-200"
          >
            Sign In
          </a>
        </>
      }
    >
      Please sign in to interact with project data
    </BaseModal>
  );
}
