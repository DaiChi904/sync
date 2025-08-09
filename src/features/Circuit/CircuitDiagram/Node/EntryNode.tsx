import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

interface EntryNodeProps {
  node: CircuitGuiNode;
  isInFocus?: boolean;
  focusElement?: (value: CircuitGuiNode) => void;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
}

export default function EntryNode({ node, isInFocus, focusElement, handleNodeMouseDown }: EntryNodeProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
    <g
      onClick={() => focusElement?.(node)}
      onMouseDown={isInFocus ? (ev) => handleNodeMouseDown?.(ev, node) : undefined}
    >
      {isInFocus && (
        // biome-ignore lint/nursery/useUniqueElementIds: No need for unique id.
        <rect
          id="node-focused-frame"
          x={node.coordinate.x - 12.5}
          y={node.coordinate.y - 12.5}
          width={25}
          height={25}
          fill="rgba(0,0,0,0)"
          stroke="#fff"
          strokeWidth={1}
        />
      )}
      {/* Main body */}
      <circle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="green" />
    </g>
  );
}
