// import { RxCross2 } from "react-icons/rx";
import { useEffect, useRef } from "react";
// import { ClipSpinner } from "../spinners/ClipSpinner";
import { ClipLoader } from "react-spinners";
import { Plus } from "lucide-react";

export interface IAction {
  label: string;
  action: (props: any) => any;
  loading?: boolean;
}

export interface IActionPopupProps {
  position: any;
  open: boolean;
  width?: string;
  actions: IAction[];
  onClose: () => void;
  noActionMessage?: string;
  maxHeight?: string;
  loading?: boolean;
}

interface IActionOptions {
  width?: string;
  maxHeight?: string;
  actions?: IAction[];
  loading?: boolean;
  onClose?: () => void;
  noActionMessage?: string;
  callActionWith?: any;
  scrollLastToView?: boolean;
  scrollParentBy?: (value: number) => void;
}

export function Options({
  loading,
  actions,
  maxHeight,
  width,
  onClose,
  noActionMessage,
  callActionWith,
  scrollLastToView,
  scrollParentBy,
}: IActionOptions) {
  const lastRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (scrollLastToView) {
      scrollParentBy?.(100);
    }

    // eslint-disable-next-line
  }, [lastRef, scrollLastToView]);

  return (
    <div
      style={{
        width: width,
      }}
      className={`
      flex flex-col relative p-2 gap-0 bg-primary-0 shadow-light
     `}
    >
      {actions?.map((action: IAction, idx: number) => (
        <button
          className="bg-transparent text-sm text-primary-300 flex justify-start py-3 px-2 cursor-pointer hover:bg-primary-100"
          key={idx}
          disabled={action.loading}
          onClick={(e) =>
            callActionWith ? action.action(callActionWith) : action.action(e)
          }
        >
          <span
            ref={idx === 0 ? lastRef : null}
            className="flex gap-2 text-left"
          >
            {action.label}
            {action?.loading ? <ClipLoader color="blue" /> : null}
          </span>
        </button>
      ))}

      {actions?.length === 0 ? (
        <p className="text-sm font-normal text-primary-200">
          {noActionMessage || "No actions to perform now"}
        </p>
      ) : null}
      {maxHeight ? null : onClose ? (
        <Plus onClick={onClose} className="cancel-icon" />
      ) : null}
    </div>
  );
}
