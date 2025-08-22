import type { ComponentProps } from "react";

interface OptionProps extends ComponentProps<"option"> {}

export default function Option({ children, ...props }: OptionProps) {
  return <option {...props}>{children}</option>;
}
