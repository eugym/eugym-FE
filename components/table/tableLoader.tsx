import { Skeleton } from "@mui/material";

export interface ITableLoaderProps {
  columnSize: number;
}

export function TableLoader({ columnSize }: ITableLoaderProps) {
  return (
    <>
      {[...Array(10)].map((val, i) => (
        <tr key={i}>
          {[...Array(columnSize)].map((valu, i) => (
            <td key={i} className="p-1">
              <Skeleton
                variant="rectangular"
                animation="wave"
                className="rounded h-7 bg-primary-100"
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
