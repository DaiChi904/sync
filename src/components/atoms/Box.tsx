import type { HTMLAttributes, ReactNode } from "react";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export default function Box({ children, ...props }: BoxProps) {
  return <div {...props}>{children}</div>;
}
