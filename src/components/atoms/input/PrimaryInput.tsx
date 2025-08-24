import type { ComponentProps } from "react";

interface PrimaryInput extends ComponentProps<"input"> {
  variant?: "filled" | "outlined";
}

export default function PrimaryInput({ variant = "outlined", ...props }: PrimaryInput) {
  return (
    <input
      {...props}
      className={`input-primary-${variant}`}
    />
  );
}
