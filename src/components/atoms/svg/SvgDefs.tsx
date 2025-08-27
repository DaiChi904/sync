import type { ComponentProps } from "react";

interface SvgDefsProps extends ComponentProps<"defs"> {}

export default function SvgDefs({ children, ...props }: SvgDefsProps) {
  return <defs {...props}>{children}</defs>;
}
