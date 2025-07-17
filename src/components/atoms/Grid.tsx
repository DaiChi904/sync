import type { CSSProperties, HTMLAttributes } from "react";
import Box from "./Box";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  xs: number;
  ys: number;
  xfs: number;
  yfs: number;
  gap?: CSSProperties["gap"];
  grow?: CSSProperties["flexGrow"];
  container?: boolean;
}

export default function Grid({ xs, ys, xfs, yfs, gap, grow, container, children, ...props }: Omit<GridProps, "style">) {
  const style: CSSProperties = {
    gridColumn: `span ${xs} / span ${xs}`,
    gridRow: `span ${ys} / span ${ys}`,
  };

  if (container) {
    style.display = "grid";
    style.gridTemplateColumns = `repeat(${xfs}, minmax(0, 1fr))`;
    style.gridTemplateRows = `repeat(${yfs}, minmax(0, 1fr))`;
    style.flexGrow = grow;
    style.gap = gap;
  }

  return (
    <Box {...props} style={style}>
      {children}
    </Box>
  );
}
