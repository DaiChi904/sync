import type { ComponentProps, CSSProperties } from "react";
import Box from "./Box";

interface FlexProps extends ComponentProps<typeof Box> {
  alignItems?: CSSProperties["alignItems"];
  alignContent?: CSSProperties["alignContent"];
  justifyItems?: CSSProperties["justifyItems"];
  justifyContent?: CSSProperties["justifyContent"];
  direction?: CSSProperties["flexDirection"];
  basis?: CSSProperties["flexBasis"];
  wrap?: CSSProperties["flexWrap"];
  grow?: CSSProperties["flexGrow"];
  shrink?: CSSProperties["flexShrink"];
  children?: React.ReactNode;
}

export default function Flex({
  alignItems,
  alignContent,
  justifyItems,
  justifyContent,
  direction = "row",
  basis,
  wrap = "nowrap",
  grow = 0,
  shrink = 1,
  children,
  ...props
}: FlexProps) {
  const style: CSSProperties = {
    display: "flex",
    alignItems,
    alignContent,
    justifyItems,
    justifyContent,
    flexDirection: direction,
    flexWrap: wrap,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink,
    ...props.style,
  };

  return (
    <Box {...props} style={style}>
      {children}
    </Box>
  );
}
