import { type CSSProperties, forwardRef, type HTMLAttributes } from "react";
import Box from "./Box";

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  alignItems?: CSSProperties["alignItems"];
  alignContent?: CSSProperties["alignContent"];
  justifyItems?: CSSProperties["justifyItems"];
  justifyContent?: CSSProperties["justifyContent"];
  direction?: CSSProperties["flexDirection"];
  wrap?: CSSProperties["flexWrap"];
  gap?: CSSProperties["gap"];
  grow?: CSSProperties["flexGrow"];
  children?: React.ReactNode;
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ alignItems, alignContent, justifyItems, justifyContent, direction, wrap, gap, grow, children, ...props }, ref) => {
    const style: CSSProperties = {
      display: "flex",
      alignItems,
      alignContent,
      justifyItems,
      justifyContent,
      flexDirection: direction,
      flexWrap: wrap,
      gap,
      flexGrow: grow,
      ...props.style,
    };

    return (
      <Box {...props} style={style} ref={ref}>
        {children}
      </Box>
    );
  },
);

export default Flex;
