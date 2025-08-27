import type { ComponentProps } from "react";

interface SvgClipPathProps extends ComponentProps<"clipPath"> {}

export default function SvgClipPath({ children, ...props }: SvgClipPathProps) {
  return <clipPath {...props}>{children}</clipPath>;
}
