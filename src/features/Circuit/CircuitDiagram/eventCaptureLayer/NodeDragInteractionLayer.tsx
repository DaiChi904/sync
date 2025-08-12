interface NodeDragInteractionLayerProps {
  isActive: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseMove?: (...args: any[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: This is fine.
  onMouseUp?: (...args: any[]) => void;
}

export default function NodeDragInteractionLayer({ isActive, onMouseMove, onMouseUp }: NodeDragInteractionLayerProps) {
  return (
    isActive && (
      // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
      // biome-ignore lint/nursery/useUniqueElementIds: No need for unique id.
      <rect
        id="node-drag-interaction-layer"
        x={0}
        y={0}
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
