import type { ComponentProps } from "react";

interface TableCellProps extends ComponentProps<"td"> {}

export default function TableCell({ children, ...props }: TableCellProps) {
  return <td {...props}>{children}</td>;
}
