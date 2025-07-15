import React from "react";

export default function Pagination({
  page,
  total,
  limit,
  setPage,
}: {
  page: number;
  total: number;
  limit: number;
  setPage: (val: number) => void;
}) {
  function getPaginationNumbers(current: number, total: number) {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(total, current + delta);
      i++
    ) {
      range.push(i);
    }
    if (range.length && range[0] > 2) {
      range.unshift("...");
      range.unshift(1);
    } else if (range.length && range[0] === 2) {
      range.unshift(1);
    }
    const last = range[range.length - 1];
    if (range.length && typeof last === "number" && last < total - 1) {
      range.push("...");
      range.push(total);
    } else if (range.length && typeof last === "number" && last === total - 1) {
      range.push(total);
    }
    return range;
  }
  const totalPages = Math.ceil(total / limit);
  return (
    <div className="flex-1 flex items-center justify-end gap-2 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-2 rounded-lg shadow-sm cursor-pointer bg-white hover:bg-blue-50 disabled:opacity-50 transition"
      >
        Prev
      </button>
      {getPaginationNumbers(page, totalPages).map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(Number(p))}
            className={`px-3 py-2 rounded-lg cursor-pointer shadow-sm transition font-semibold ${
              Number(p) === page
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-blue-50 text-gray-700"
            }`}
            aria-current={Number(p) === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page * limit >= total}
        onClick={() => setPage(page + 1)}
        className="px-3 py-2 cursor-pointer rounded-lg shadow-sm bg-white hover:bg-blue-50 disabled:opacity-50 transition"
      >
        Next
      </button>
    </div>
  );
}
