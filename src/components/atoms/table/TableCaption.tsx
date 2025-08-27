import type { ComponentProps } from "react";

interface TableCaptionProps extends ComponentProps<"caption"> {}

export default function TableCaption({ children, ...props }: TableCaptionProps) {
  return <caption {...props}>{children}</caption>;
}
