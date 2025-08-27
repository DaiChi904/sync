import type { ComponentProps } from "react";

interface TableFootProps extends ComponentProps<"tfoot"> {}

export default function TableFoot({ children, ...props }: TableFootProps) {
  return <tfoot {...props}>{children}</tfoot>;
}
