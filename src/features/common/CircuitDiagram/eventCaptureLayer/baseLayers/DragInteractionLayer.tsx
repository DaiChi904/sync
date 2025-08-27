interface DragInteractionLayerProps {
  id: string;
  isActive: boolean;
  viewBoxX?: number;
  viewBoxY?: number;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseMove?: (...args: any[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseUp?: (...args: any[]) => void;
}

export default function DragInteractionLayer({
  id,
  isActive,
  viewBoxX,
  viewBoxY,
  onMouseMove,
  onMouseUp,
}: DragInteractionLayerProps) {
  return (
    isActive && (
      // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
      <rect
        id={id}
        x={viewBoxX}
        y={viewBoxY}
        width="100%"
        height="100%"
        fill="transparent"
        pointerEvents="all"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    )
  );
}
