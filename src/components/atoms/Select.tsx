import type { ComponentProps } from "react";

interface SelectProps extends ComponentProps<"select"> {}

export default function Select({ children, ...props }: SelectProps) {
  return <select {...props}>{children}</select>;
}
