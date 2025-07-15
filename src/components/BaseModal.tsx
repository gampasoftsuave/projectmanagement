import "@/styles/custom-animations.css";
import React from "react";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: string;
  centerTitle?: boolean;
}

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  actions,
  icon,
  maxWidth = "max-w-sm",
  centerTitle = false,
}: BaseModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 w-full ${maxWidth} relative animate-pop`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center gap-2 mb-4 ${
            centerTitle ? "justify-center" : ""
          }`}
        >
          {icon}
          <h2 className="text-xl font-bold text-blue-700">{title}</h2>
        </div>
        <div className="mb-6 text-gray-700 text-center">{children}</div>
        {actions && <div className="flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}
