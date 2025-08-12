import type { Coordinate } from "@/domain/model/valueObject/coordinate";

interface NodePinDragInteractionLayerProps {
  isActive: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseMove?: (...args: any[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseUp?: (...args: any[]) => void;
  tempEdge?: { from: Coordinate; to: Coordinate } | null;
}

export default function NodePinDragInteractionLayer({
  isActive,
  onMouseMove,
  onMouseUp,
  tempEdge,
}: NodePinDragInteractionLayerProps) {
  return (
    isActive && (
      <>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support. */}
        {/* biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
        <rect
          id="node-pin-drag-interaction-layer"
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="transparent"
          pointerEvents="all"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        />
        {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support. */}
        <line
          x1={tempEdge?.from.x}
          y1={tempEdge?.from.y}
          x2={tempEdge?.to.x}
          y2={tempEdge?.to.y}
          stroke="#9ca19d"
          strokeWidth={2}
          onMouseUp={onMouseUp}
        />
      </>
    )
  );
}
