import type { ComponentProps } from "react";

interface SvgPathProps extends ComponentProps<"path"> {}

export default function SvgPath({ children, ...props }: SvgPathProps) {
  return <path {...props}>{children}</path>;
}
