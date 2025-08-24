import type { ComponentProps } from "react";

interface LabelProps extends ComponentProps<"label"> {}

export default function Label({ children, ...props }: LabelProps) {
  // biome-ignore lint/a11y/noLabelWithoutControl: This is atom component.
  return <label {...props}>{children}</label>;
}
