import type { ComponentProps } from "react";

interface BoxProps extends ComponentProps<"div"> {}

export default function Box({ children, ...props }: BoxProps) {
  return <div {...props}>{children}</div>;
}
