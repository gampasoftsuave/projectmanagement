import React, { useRef, useState, useEffect } from "react";
import "../styles/dropdowns.css";
import { ChevronDown } from "lucide-react";
import { DEFAULT_STATUS_OPTION } from "@/constants/status";
import { StatusDropdownProps } from "@/interface/interface";

export default function StatusDropdown({
  value,
  onChange,
  options,
}: StatusDropdownProps) {
  const statusOptions = options || DEFAULT_STATUS_OPTION;
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) setHighlighted(-1);
  }, [open, value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % statusOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(
        (h) => (h - 1 + statusOptions.length) % statusOptions.length
      );
    } else if (e.key === "Enter" && highlighted >= 0) {
      onChange(statusOptions[highlighted]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className="relative w-full flex items-center"
      ref={dropdownRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="min-w-[140px] w-full border cursor-pointer border-gray-300 rounded-lg px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white appearance-none text-black text-left flex items-center justify-between relative"
        onClick={() => setOpen((o) => !o)}
        onBlur={(e) => {
          if (
            !e.relatedTarget ||
            !dropdownRef.current?.contains(e.relatedTarget as Node)
          ) {
            setOpen(false);
          }
        }}
      >
        <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        <span
          className={`pointer-events-none flex items-center absolute right-2 top-1/2 text-gray-700 bg-white dropdown-chevron-center${
            open ? " open" : ""
          }`}
        >
          <ChevronDown size={22} />
        </span>
      </button>
      <div
        className={`absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? "opacity-100 scale-100 pointer-events-auto max-h-[200px]"
            : "opacity-0 scale-95 pointer-events-none max-h-0"
        }`}
        role="listbox"
        tabIndex={-1}
      >
        {statusOptions.map((opt, i) => (
          <div
            key={opt}
            role="option"
            aria-selected={value === opt}
            className={`px-4 py-2 cursor-pointer select-none transition-colors duration-150 text-black ${
              value === opt ? "bg-blue-100 text-blue-700 font-semibold" : ""
            } ${highlighted === i ? "bg-blue-50" : ""}`}
            onMouseDown={() => {
              onChange(opt);
              setOpen(false);
            }}
            onMouseEnter={() => setHighlighted(i)}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}
