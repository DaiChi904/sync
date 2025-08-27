import type { ComponentProps } from "react";

interface SvgGroupProps extends ComponentProps<"g"> {}

export default function SvgGroup({ children, ...props }: SvgGroupProps) {
  return <g {...props}>{children}</g>;
}
