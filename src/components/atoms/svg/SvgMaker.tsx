import type { ComponentProps } from "react";

interface SvgMarkerProps extends ComponentProps<"marker"> {}

export default function SvgMarker({ children, ...props }: SvgMarkerProps) {
  return <marker {...props}>{children}</marker>;
}
