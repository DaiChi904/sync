import type { ComponentProps } from "react";

interface SecondaryTextareaProps extends ComponentProps<"textarea"> {
  variant?: "filled" | "outlined";
}

export default function SecondaryTextarea({ variant = "outlined", ...props }: SecondaryTextareaProps) {
  return <textarea {...props} className={`textarea-primary-${variant}`} />;
}
