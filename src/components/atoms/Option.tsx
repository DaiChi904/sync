import type { HTMLAttributes, ReactNode } from "react";

interface OptionProps extends HTMLAttributes<HTMLOptionElement> {
  children?: ReactNode;
}

export default function Option({ children, ...props }: OptionProps) {
  return <option {...props}>{children}</option>;
}
