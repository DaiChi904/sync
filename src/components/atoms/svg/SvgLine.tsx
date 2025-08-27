import type { ComponentProps } from "react";

interface SvgLineProps extends ComponentProps<"line"> {}

export default function SvgLine({ children, ...props }: SvgLineProps) {
  return <line {...props}>{children}</line>;
}
