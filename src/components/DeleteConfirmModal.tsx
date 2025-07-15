import React from "react";
import BaseModal from "./BaseModal";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Delete Project?"
      icon={
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      }
      actions={
        <>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 cursor-pointer text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-500 cursor-pointer text-white font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
        </>
      }
      centerTitle
    >
      Are you sure you want to delete this project? This action cannot be
      undone.
    </BaseModal>
  );
}
