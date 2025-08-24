import type { ComponentProps } from "react";

interface FormProps extends ComponentProps<"form"> {}

export default function Form({ children, ...props }: FormProps) {
  return <form {...props}>{children}</form>;
}
