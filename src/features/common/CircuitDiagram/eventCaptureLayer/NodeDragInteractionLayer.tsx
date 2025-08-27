import DragInteractionLayer from "./baseLayers/DragInteractionLayer";

interface NodeDragInteractionLayerProps {
  isActive: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseMove?: (...args: any[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseUp?: (...args: any[]) => void;
  viewBoxX?: number;
  viewBoxY?: number;
}

export default function NodeDragInteractionLayer({
  isActive,
  onMouseMove,
  onMouseUp,
  viewBoxX,
  viewBoxY,
}: NodeDragInteractionLayerProps) {
  return (
    isActive && (
      // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
      // biome-ignore lint/nursery/useUniqueElementIds: No need for unique id.
      <DragInteractionLayer
        isActive={isActive}
        id="node-drag-interaction-layer"
        viewBoxX={viewBoxX}
        viewBoxY={viewBoxY}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    )
  );
}
