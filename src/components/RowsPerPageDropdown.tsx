import styles from "../styles/RowsPerPageDropdown.module.css";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const rowsPerPageOptions = [25, 50, 100];

interface RowsPerPageDropdownProps {
  limit: number;
  setLimit: (val: number) => void;
}

export default function RowsPerPageDropdown({
  limit,
  setLimit,
}: RowsPerPageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  // Determine dropdown direction on open
  useEffect(() => {
    if (open && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const dropdownHeight = 120; // px, matches max-height
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < dropdownHeight + 16); // 16px margin
    }
  }, [open]);

  useEffect(() => {
    if (!open) setHighlighted(-1);
  }, [open, limit]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % rowsPerPageOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(
        (h) => (h - 1 + rowsPerPageOptions.length) % rowsPerPageOptions.length
      );
    } else if (e.key === "Enter" && highlighted >= 0) {
      setLimit(rowsPerPageOptions[highlighted]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="flex items-center justify-start mb-4 mt-2">
      <label className="font-medium text-gray-700 mr-2">Rows per Page</label>
      <div
        className="relative min-w-[90px] w-fit flex items-center"
        ref={dropdownRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          className="border cursor-pointer border-gray-300 rounded-lg px-3 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white appearance-none text-black w-full text-left flex items-center justify-between relative"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{limit}</span>
          <span
            className={`${styles.chevron} ${
              open ? styles.chevronOpen : ""
            } text-gray-700`}
          >
            <ChevronDown size={22} />
          </span>
        </button>
        <div
          className={`absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out overflow-hidden
            ${
              open
                ? "opacity-100 scale-100 pointer-events-auto max-h-[200px]"
                : "opacity-0 scale-95 pointer-events-none max-h-0"
            }
            ${dropUp ? "bottom-full mb-2" : "top-full mt-2"}
          `}
          role="listbox"
          tabIndex={-1}
        >
          {rowsPerPageOptions.map((opt, i) => (
            <div
              key={opt}
              role="option"
              aria-selected={limit === opt}
              className={`px-4 py-2 cursor-pointer select-none transition-colors duration-150 ${
                limit === opt
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-black"
              } ${highlighted === i ? "bg-blue-50" : ""}`}
              onMouseDown={() => {
                setLimit(opt);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
