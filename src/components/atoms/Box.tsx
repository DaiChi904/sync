import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

export default Box;
