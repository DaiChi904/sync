import type { ComponentProps } from "react";

interface SvgTitleProps extends ComponentProps<"title"> {}

export default function SvgTitle({ children, ...props }: SvgTitleProps) {
  return <title {...props}>{children}</title>;
}
