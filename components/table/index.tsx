// import { Options } from "../action-popup";
// import Options from "@/components/action-popUp"
// import { Pagination } from "../pagination";
// import { LuSettings2 } from "react-icons/lu";
// import { capitalizeFirst } from "@/app/utils/utilities";
// import { Pagination } from "../pagination";
// import { TableLoader } from "./TableLoader";

import { Search, EllipsisVertical, ListFilterPlus } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
export interface ITableHead {
  name: string;
  label: string | ReactNode;
}

export interface IBodyOption {
  type: string;
  value: string | ReactNode;
}

export interface ITableBody {
  id: string;
  [key: string]: string | ReactNode | any;
}

// ***** new  *****
export interface ITableDropdownOptions {
  label: string;
  action: (row: any) => void;
  loading?: boolean;
}

export interface ITableRoleDropdownOptions {
  label: string;
  action: (row: any) => void;
  loading?: boolean;
}

export interface ITableProps {
  headers: ITableHead[];
  body: ITableBody[];
  dropdownOptions?: ITableDropdownOptions[];
  handleActionClicked?: (row: ITableBody) => any;
  showDropdown?: boolean;
  showSerialNumber?: boolean;
  pageCount?: number;
  onPerPageChange?: (perPage: string) => void;
  onNextPage?: (nextPage: number) => void;
  showPagination?: boolean;
  loading?: boolean;
  title?: string;
  subTitle?: string;
}

export function Table({
  headers,
  body,
  dropdownOptions,
  handleActionClicked,
  showDropdown,
  showSerialNumber,
  pageCount,
  onPerPageChange,
  onNextPage,
  showPagination,
  loading,
  title,
  subTitle,
}: ITableProps) {
  const [currentActionId, setCurrentActionId] = useState("");
  const tableBodyRef = useRef<HTMLDivElement>(null);

  function scrollBodyBy(value: number) {
    tableBodyRef?.current?.scrollBy({ top: value, behavior: "smooth" });
  }

  function handleActionClick(row: ITableBody): void {
    setCurrentActionId((prev) => (prev === row?.id ? "" : row.id));
    handleActionClicked?.(row);
  }

  let totalCols = headers?.length || 0;

  if ((dropdownOptions?.length as number) > 0) {
    totalCols += 1;
  }

  if (showSerialNumber) {
    totalCols += 1;
  }

  const isBodyEmpty = body?.length === 0;

  return (
    <div
      ref={tableBodyRef}
      className="w-full overflow-x-auto bg-primary-0 mb-2 p-5"
    >
      <div className="w-full py-2 justify-between flex border-b  shadow border-accent pb-4 flex-col sm:flex-row  items-start gap-5 ">
        <div className="flex flex-col sm:justify-start text-left ml-0">
          <h2 className="text-sm font-semibold text-primary-300">{title}</h2>
          <h3 className="text-xs font-normal text-primary-200">{subTitle}</h3>
        </div>
        <div className="flex gap-4 justify-end ">
          <form className="min-w-[40%] sm:w-[50%]  h-full relative">
            <div className="absolute left-0 top-0 bottom-0 flex pl-4 pr-2 justify-center items-center">
              <Search size={20} />
            </div>
            <input
              className="text-input input-with-icon w-full h-full p-2 pl-10 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-accent hover:border-accent"
              placeholder="Search"
            />
          </form>
          <button className="border border-gray-300 shadow-m rounded-2xl hover:border-accent p-2 px-4 text-sm flex gap-2 items-center justify-center text-primary-200  min-w-[40%] sm:w-[50%]">
            <ListFilterPlus size={20} />
            Filter By
          </button>
        </div>
      </div>
      <table className=" table-auto w-full min-w-120  ">
        <thead className="text-left  text-primary-300 text-[#727272]">
          <tr className="">
            {showSerialNumber ? (
              <th className="py-4 pr-4 align-top text-sm">S/N</th>
            ) : null}
            {headers?.map((header: ITableHead, i: number) => (
              <th
                key={i}
                className="py-4 pr-4  text-[.95rem] align-top text-sm"
              >
                {header?.label}
              </th>
            ))}
            {(dropdownOptions?.length || 0) > 0 ? (
              <th className="py-4 pr-4  text-[.95rem] align-top text-sm">
                Action
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="text-left  text-[#727272]">
          {loading ? (
            // <TableLoader columnSize={totalCols} />
            <div>loader...</div>
          ) : (
            body?.map((row: ITableBody, idx: number) => (
              <tr key={idx} className="relative border-b border-gray-300">
                {showSerialNumber ? (
                  <td className="pt-4 pr-4 text-sm align-top ">{idx + 1}</td>
                ) : null}
                {headers.map((header: ITableHead, idx2: number) => (
                  <td
                    key={idx2}
                    className={`py-3 pr-4 text-sm align-top wrap-break-word ${
                      header?.name === "email" ? "lowercase" : "capitalize"
                    }`}
                  >
                    {" "}
                    {row[header.name]}
                  </td>
                ))}
                {(dropdownOptions?.length || 0) > 0 ? (
                  <td className="flex items-center justify-center ">
                    <span className="py-3 pr-4 h-full align-top">
                      <button
                        onClick={() => handleActionClick(row)}
                        className="w-10 h-10 flex items-center justify-center rounded-3xl bg-primary-100"
                      >
                        <EllipsisVertical />
                      </button>
                    </span>
                    {currentActionId === row?.id && showDropdown ? (
                      <>
                        {/*
                      animation: optionsFadeIn 0.35s forwards;
                      z-index: 201; */}
                        <span className="absolute top-[3.4rem] right-0 w-40 overflow-hidden shadow-light mt-[0.3rem] z-[201]">
                          {/* <Options
                            callActionWith={row}
                            actions={dropdownOptions}
                            scrollLastToView
                            scrollParentBy={scrollBodyBy}
                          /> */}
                        </span>
                      </>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!loading && isBodyEmpty ? (
        <h1 className="text-center rounded p-4 bg-primary-100">
          {/* {capitalizeFirst(title?.toLowerCase() || "")} data is empty */}
          data is empty
        </h1>
      ) : null}
      {showPagination ? <></> : null}
    </div>
  );
}
