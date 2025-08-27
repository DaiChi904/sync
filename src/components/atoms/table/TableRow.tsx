import type { ComponentProps } from "react";

interface TableRowProps extends ComponentProps<"tr"> {}

export default function TableRow({ children, ...props }: TableRowProps) {
  return <tr {...props}>{children}</tr>;
}
