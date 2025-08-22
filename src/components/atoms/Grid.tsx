import type { ComponentProps, CSSProperties } from "react";
import Box from "./Box";

interface GridProps extends ComponentProps<typeof Box> {
  container?: boolean;
  grow?: CSSProperties["flexGrow"];
  xs?: number;
  ys?: number;
  xfs?: number;
  yfs?: number;
}

export default function Grid({
  xs = 1,
  ys = 1,
  xfs = 1,
  yfs = 1,
  grow = 1,
  container = false,
  children,
  ...props
}: GridProps) {
  return (
    <Box
      {...props}
      style={{
        gridColumn: `span ${xs} / span ${xs}`,
        gridRow: `span ${ys} / span ${ys}`,
        display: container ? "grid" : undefined,
        gridTemplateColumns: container ? `repeat(${xfs}, minmax(0, 1fr))` : undefined,
        gridTemplateRows: container ? `repeat(${yfs}, minmax(0, 1fr))` : undefined,
        flexGrow: container ? grow : undefined,
      }}
    >
      {children}
    </Box>
  );
}
