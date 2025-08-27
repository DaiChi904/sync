import type { ComponentProps } from "react";

interface TableHeadProps extends ComponentProps<"thead"> {}

export default function TableHead({ children, ...props }: TableHeadProps) {
  return <thead {...props}>{children}</thead>;
}
