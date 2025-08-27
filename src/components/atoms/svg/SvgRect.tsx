import type { ComponentProps } from "react";

interface SvgRectProps extends ComponentProps<"rect"> {}

export default function SvgRect({ children, ...props }: SvgRectProps) {
  return <rect {...props}>{children}</rect>;
}
