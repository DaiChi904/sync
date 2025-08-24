import type { ComponentProps } from "react";

interface PrimaryTextareaProps extends ComponentProps<"textarea"> {
  variant?: "filled" | "outlined";
}

export default function PrimaryTextarea({ variant = "outlined", ...props }: PrimaryTextareaProps) {
  return <textarea {...props} className={`textarea-primary-${variant}`} />;
}
