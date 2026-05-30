"use client";

import { Search, EllipsisVertical, ListFilterPlus, X } from "lucide-react";
import { ReactNode, useRef, useState, useMemo } from "react";
import TableLoader from "./tableSkeloton";
import EmptyTable from "./emptyTable";
import { TableActions } from "./tableAction";

export interface ITableHead {
  name: string;
  label: string | ReactNode;
}

export interface ITableBody {
  id: string;
  [key: string]: any;
}

export interface ITableDropdownOptions {
  label: string;
  action: (row: ITableBody) => void;
  loading?: boolean;
  danger?: boolean;
}

export interface IFilterOption {
  label: string;
  value: string;
  column: string;
}

export interface ITableProps {
  headers: ITableHead[];
  body: ITableBody[];
  dropdownOptions?: ITableDropdownOptions[];
  handleActionClicked?: (row: ITableBody) => void;
  showSerialNumber?: boolean;
  showDropdown?: boolean;    // kept for backwards-compat; action menu always shows when dropdownOptions provided
  loading?: boolean;
  title?: string;
  subTitle?: string;
  allowSearchBar?: boolean;
  allowFilterBar?: boolean;
  filterOptions?: IFilterOption[];
}

export function Table({
  headers,
  body = [],
  dropdownOptions = [],
  handleActionClicked,
  showSerialNumber,
  loading = false,
  title,
  subTitle,
  allowSearchBar,
  allowFilterBar,
  filterOptions = [],
}: ITableProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<IFilterOption | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // --- Filter + search logic ---
  const filtered = useMemo(() => {
    let rows = body;

    // Column filter
    if (activeFilter?.column && activeFilter.value) {
      rows = rows.filter((row) =>
        String(row[activeFilter.column] ?? "")
          .toLowerCase()
          .includes(activeFilter.value.toLowerCase())
      );
    }

    // Global search across all columns
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      rows = rows.filter((row) =>
        headers.some((h) =>
          String(row[h.name] ?? "").toLowerCase().includes(term)
        )
      );
    }

    return rows;
  }, [body, search, activeFilter, headers]);

  const totalCols =
    headers.length + (showSerialNumber ? 1 : 0) + (dropdownOptions.length > 0 ? 1 : 0);

  const isEmpty = !loading && filtered.length === 0;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div>
          {title && <h2 className="text-base font-semibold text-gray-800">{title}</h2>}
          {subTitle && <p className="text-xs text-gray-500 mt-0.5">{subTitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          {allowSearchBar && (
            <div className="relative flex-1 sm:flex-none sm:w-56">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Filter */}
          {allowFilterBar && filterOptions.length > 0 && (
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                  activeFilter
                    ? "border-green-500 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <ListFilterPlus size={15} />
                {activeFilter ? activeFilter.label : "Filter"}
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-10 z-30 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => { setActiveFilter(null); setFilterOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Clear filter
                  </button>
                  {filterOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveFilter(opt); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${
                        activeFilter?.value === opt.value && activeFilter?.column === opt.column
                          ? "bg-green-50 text-green-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {showSerialNumber && (
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">
                  S/N
                </th>
              )}
              {headers.map((h) => (
                <th
                  key={h.name}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {h.label}
                </th>
              ))}
              {dropdownOptions.length > 0 && (
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={totalCols}>
                  <TableLoader rows={8} columns={totalCols} />
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={totalCols}>
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <EmptyTable />
                    <p className="mt-3 text-sm">
                      {search || activeFilter ? "No results match your search or filter." : "No data available."}
                    </p>
                    {(search || activeFilter) && (
                      <button
                        onClick={() => { setSearch(""); setActiveFilter(null); }}
                        className="mt-2 text-xs text-green-600 hover:underline"
                      >
                        Clear search & filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {showSerialNumber && (
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{idx + 1}</td>
                  )}

                  {headers.map((h) => {
                    const value = row[h.name];
                    const isStatus = h.name === "status";
                    const isEmail = h.name === "email";

                    return (
                      <td
                        key={h.name}
                        className={`px-5 py-3.5 ${isEmail ? "lowercase" : "capitalize"} text-gray-700`}
                      >
                        {isStatus ? (
                          <StatusBadge value={String(value ?? "")} />
                        ) : (
                          <span className="truncate max-w-[180px] block">
                            {value ?? "—"}
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {dropdownOptions.length > 0 && (
                    <td className="px-5 py-3.5 text-right relative">
                      <button
                        onClick={() => {
                          setOpenActionId((prev) => (prev === row.id ? null : row.id));
                          handleActionClicked?.(row);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Row actions"
                      >
                        <EllipsisVertical size={16} />
                      </button>

                      {openActionId === row.id && (
                        <TableActions
                          row={row}
                          options={dropdownOptions}
                          onClose={() => setOpenActionId(null)}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Result count */}
      {!loading && body.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {body.length} {filtered.length === 1 ? "result" : "results"}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const v = value.toLowerCase();
  const styles =
    v === "active"
      ? "bg-green-50 text-green-700 border-green-200"
      : v === "inactive" || v === "disabled"
      ? "bg-red-50 text-red-600 border-red-200"
      : v === "pending"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles}`}>
      {value || "—"}
    </span>
  );
}
