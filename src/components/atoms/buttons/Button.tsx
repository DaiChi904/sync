import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}
