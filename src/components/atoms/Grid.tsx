import { type CSSProperties, forwardRef, type HTMLAttributes, type Ref } from "react";
import Box from "./Box";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  xs: number;
  ys: number;
  xfs: number;
  yfs: number;
  gap?: CSSProperties["gap"];
  grow?: CSSProperties["flexGrow"];
  container?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ xs, ys, xfs, yfs, gap, grow, container, children, ...props }, ref) => {
    const style: CSSProperties = {
      gridColumn: `span ${xs} / span ${xs}`,
      gridRow: `span ${ys} / span ${ys}`,
      ...props.style,
    };

    if (container) {
      style.display = "grid";
      style.gridTemplateColumns = `repeat(${xfs}, minmax(0, 1fr))`;
      style.gridTemplateRows = `repeat(${yfs}, minmax(0, 1fr))`;
      style.flexGrow = grow;
      style.gap = gap;
    }

    return (
      <Box {...props} style={style} ref={ref}>
        {children}
      </Box>
    );
  },
);

export default Grid;
