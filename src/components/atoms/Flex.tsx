import type { CSSProperties, HTMLAttributes } from "react";
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

export default function Flex({
	alignItems,
	alignContent,
	justifyItems,
	justifyContent,
	direction,
	wrap,
	gap,
    grow,
	children,
    ...props
}: Omit<FlexProps, "style">) {
	const style: CSSProperties = {
		display: "flex",
        alignItems,
        alignContent,
        justifyItems,
        justifyContent,
        flexDirection: direction,
        flexWrap: wrap,
        gap: gap,
        flexGrow: grow,
	};

	return (
		<Box {...props} style={style}>
			{children}
		</Box>
	);
}
