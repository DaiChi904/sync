import type { ComponentProps } from "react";

interface SvgProps extends ComponentProps<"svg"> {}

export default function Svg({ children, ...props }: SvgProps) {
  // biome-ignore lint/a11y/noSvgWithoutTitle: This is atom component.
  return <svg {...props}>{children}</svg>;
}
