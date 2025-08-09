import type { HTMLAttributes, ReactNode } from "react";

interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  children?: ReactNode;
}

export default function Select({ children, ...props }: SelectProps) {
  return <select {...props}>{children}</select>;
}
