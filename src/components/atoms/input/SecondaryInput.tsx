import type { ComponentProps } from "react";

interface SecondaryInputProps extends ComponentProps<"input"> {
  variant?: "filled" | "outlined";
}

export default function SecondaryInput({ variant = "outlined", ...props }: SecondaryInputProps) {
  return <input {...props} className={`input-secondary-${variant}`} />;
}
