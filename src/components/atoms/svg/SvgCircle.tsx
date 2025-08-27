import type { ComponentProps } from "react";

interface SvgCircleProps extends ComponentProps<"circle"> {}

export default function SvgCircle({ children, ...props }: SvgCircleProps) {
  return <circle {...props}>{children}</circle>;
}
