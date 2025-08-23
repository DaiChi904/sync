import type { ComponentProps } from "react";

interface SecondaryButtonProps extends ComponentProps<"button"> {
  variant?: "filled" | "outlined" | "text" | "link";
  animation?: "colorChange" | "push" | "scale" | "slide";
  disabled?: boolean;
}

const variantMap = new Map<string, string>([
  ["filled", "button-secondary-filled"],
  ["outlined", "button-secondary-outlined"],
  ["text", "button-secondary-text"],
  ["link", "button-secondary-link"],
]);

const animationMap = new Map<string, string>([
  ["colorChange", "button-animation-color-change"],
  ["push", "button-animation-push"],
  ["scale", "button-animation-scale"],
  ["slide", "button-animation-slide"],
]);

export default function SecondaryButton({
  variant = "filled",
  animation = "colorChange",
  disabled,
  children,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      className={disabled ? "button-secondary-disabled" : `${variantMap.get(variant)} ${animationMap.get(animation)}`}
      {...props}
    >
      {children}
    </button>
  );
}
