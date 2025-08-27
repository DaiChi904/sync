import type { ComponentProps } from "react";

interface TableHeaderCellProps extends ComponentProps<"th"> {}

export default function TableHeaderCell({ children, ...props }: TableHeaderCellProps) {
  return <th {...props}>{children}</th>;
}
