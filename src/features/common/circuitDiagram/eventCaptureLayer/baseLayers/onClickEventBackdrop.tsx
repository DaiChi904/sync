import { SvgRect } from "@/components/atoms/svg";

interface OnClickEventBackdropProps {
  id?: string;
  viewBoxX?: number;
  viewBoxY?: number;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onClick?: (...args: any[]) => void;
}

export default function OnClickEventBackdrop({ id, viewBoxX, viewBoxY, onClick }: OnClickEventBackdropProps) {
  return (
    <SvgRect
      id={id}
      x={viewBoxX}
      y={viewBoxY}
      width="100%"
      height="100%"
      fill="transparent"
      pointerEvents="all"
      onClick={onClick}
    />
  );
}
