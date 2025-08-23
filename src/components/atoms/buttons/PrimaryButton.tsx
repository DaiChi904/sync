import type { ComponentProps } from "react";

interface PrimaryButtonProps extends ComponentProps<"button"> {
  variant?: "filled" | "outlined" | "text" | "link";
  animation?: "colorChange" | "push" | "scale" | "slide";
  disabled?: boolean;
}

const variantMap = new Map<string, string>([
  ["filled", "button-primary-filled"],
  ["outlined", "button-primary-outlined"],
  ["text", "button-primary-text"],
  ["link", "button-primary-link"],
]);

const animationMap = new Map<string, string>([
  ["colorChange", "button-animation-color-change"],
  ["push", "button-animation-push"],
  ["scale", "button-animation-scale"],
  ["slide", "button-animation-slide"],
]);

export default function PrimaryButton({
  variant = "filled",
  animation = "colorChange",
  disabled,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={disabled ? "button-primary-disabled" : `${variantMap.get(variant)} ${animationMap.get(animation)}`}
      {...props}
    >
      {children}
    </button>
  );
}
