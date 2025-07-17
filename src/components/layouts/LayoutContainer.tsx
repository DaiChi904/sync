import Box from "../atoms/Box";

interface LayoutContainerProps {
    padding?: number
    children: React.ReactNode;
}

export default function LayoutContainer({ padding = 0, children }: LayoutContainerProps) {
    const style: React.CSSProperties = {
        padding: `${padding}px`,
        width: "100%",
        height: "100%",
    };
    return (
        <Box style={style}>
            {children}
        </Box>
    );
}