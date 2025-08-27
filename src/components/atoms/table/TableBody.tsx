import type { ComponentProps } from "react";

interface TableBodyProps extends ComponentProps<"tbody"> {}

export default function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>;
}
