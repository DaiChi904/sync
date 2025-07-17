import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type TextSize =
  | "small"
  | "default"
  | "defaultPlus"
  | "medium"
  | "mediumPlus"
  | "large"
  | "largePlus"
  | "superLarge"
  | "superLargePlus"
  | "huge"
  | "hugePlus"
  | "massive"
  | "massivePlus";

const textSize: { [key in TextSize]: number } = {
  small: 12,
  default: 14,
  defaultPlus: 16,
  medium: 18,
  mediumPlus: 20,
  large: 24,
  largePlus: 30,
  superLarge: 36,
  superLargePlus: 48,
  huge: 60,
  hugePlus: 72,
  massive: 96,
  massivePlus: 120,
};

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  textAlign?: CSSProperties["textAlign"];
  children: ReactNode;
}

export default function Typography({ size, textAlign, children, ...props }: TypographyProps) {
  const style: CSSProperties = {
    fontSize: `${textSize[size || "default"]}px`,
    textAlign: textAlign || "left",
    padding: 0,
    margin: 0,
  };
  return (
    <p {...props} style={style}>
      {children}
    </p>
  );
}
