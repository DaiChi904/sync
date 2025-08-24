import type { ComponentProps } from "react";

interface SecondaryInputProps extends ComponentProps<"input"> {
  variant?: "filled" | "outlined";
}

export default function PrimaryInput({
  variant = "outlined",
  ...props
}: SecondaryInputProps) {
  return (
    <input
      {...props}
      className={`input-secondary-${variant}`}
    />
  );
}
