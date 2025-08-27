interface OnClickEventBackdropProps {
  id?: string;
  viewBoxX?: number;
  viewBoxY?: number;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onClick?: (...args: any[]) => void;
}

export default function OnClickEventBackdrop({ id, viewBoxX, viewBoxY, onClick }: OnClickEventBackdropProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
    <rect
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
