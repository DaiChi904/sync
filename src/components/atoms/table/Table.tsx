import type { ComponentProps } from "react";

interface TableProps extends ComponentProps<"table"> {}

export default function Table({ children, ...props }: TableProps) {
  return <table {...props}>{children}</table>;
}
