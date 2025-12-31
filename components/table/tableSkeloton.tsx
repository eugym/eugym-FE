import { Skeleton } from "@mui/material";

export function TableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: columns }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton height={20} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
