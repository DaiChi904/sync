import Box from "../atoms/Box";

interface LayoutContainerProps {
  padding?: number;
  children: React.ReactNode;
}

export default function LayoutContainer({ padding = 0, children }: LayoutContainerProps) {
  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    width: "100%",
    minHeight: "100dvh",
    padding: `${padding}px`,
  };
  return <Box style={style}>{children}</Box>;
}
