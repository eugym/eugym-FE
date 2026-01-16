"use client";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export function Pagination({
  currentPage,
  pageCount,
  perPage,
  perPageOptions = [10, 20, 50, 100],
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;

  function goToPage(page: number) {
    if (page < 1 || page > pageCount) return;
    onPageChange(page);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-4  bg-white">
      {/* Page Info */}
      <p className="text-sm text-gray-500">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{pageCount}</span>
      </p>

      <div className="flex items-center gap-3">
        {/* Per Page */}
        {onPerPageChange && (
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none"
          >
            {perPageOptions.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        )}

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={isFirstPage}
            aria-label="Previous page"
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: pageCount }).map((_, i) => {
            const page = i + 1;

            // Show only nearby pages
            if (
              page === 1 ||
              page === pageCount ||
              Math.abs(page - currentPage) <= 1
            ) {
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    page === currentPage
                      ? "bg-primary-100 text-primary-700 border-primary-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            }

            // Ellipsis
            if (
              (page === currentPage - 2 && page > 1) ||
              (page === currentPage + 2 && page < pageCount)
            ) {
              return (
                <span key={page} className="px-2 text-gray-400">
                  …
                </span>
              );
            }

            return null;
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={isLastPage}
            aria-label="Next page"
            className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
