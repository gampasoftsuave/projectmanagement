import React, { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "../styles/dropdowns.css";

const sortOptions = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: "desc" | "asc";
  onChange: (val: "desc" | "asc") => void;
}) {
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
      setHighlighted((h) => (h + 1) % sortOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + sortOptions.length) % sortOptions.length);
    } else if (e.key === "Enter" && highlighted >= 0) {
      onChange(sortOptions[highlighted].value as "desc" | "asc");
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      className="relative w-full sm:w-36 flex items-center"
      ref={dropdownRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="min-w-[140px] w-full cursor-pointer border border-gray-300 rounded-lg px-4 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white appearance-none text-black text-left flex items-center justify-between"
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
        <span>{sortOptions.find((opt) => opt.value === value)?.label}</span>
        <span
          className={`pointer-events-none absolute right-2 top-1/2 text-gray-700 bg-white sort-chevron ${
            open ? "open" : ""
          }`}
        >
          <ChevronDown size={22} />
        </span>
      </button>
      <div
        className={`absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 dropdown-listbox${
          open ? " open" : ""
        }`}
        role="listbox"
        tabIndex={-1}
      >
        {sortOptions.map((opt, i) => (
          <div
            key={opt.value}
            role="option"
            aria-selected={value === opt.value}
            className={`px-4 py-2 cursor-pointer select-none transition-colors duration-150 text-black ${
              value === opt.value
                ? "bg-blue-100 text-blue-700 font-semibold"
                : ""
            } ${highlighted === i ? "bg-blue-50" : ""}`}
            onMouseDown={() => {
              onChange(opt.value as "desc" | "asc");
              setOpen(false);
            }}
            onMouseEnter={() => setHighlighted(i)}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}
