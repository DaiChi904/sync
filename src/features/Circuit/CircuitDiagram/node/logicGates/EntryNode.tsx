import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";

interface EntryNodeProps {
  node: CircuitGuiNode;
  isInFocus?: boolean;
  focusElement?: (value: CircuitGuiNode) => void;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to" | "waypoints",
    method: "ADD" | "UPDATE",
  ) => void;
  openNodeUtilityMenu?: (ev: React.MouseEvent) => void;
}

export default function EntryNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: EntryNodeProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
    <g
      onClick={() => focusElement?.(node)}
      onContextMenu={(ev) => {
        ev.preventDefault();
        openNodeUtilityMenu?.(ev);
      }}
    >
      {/* Main body */}
      <circle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="#4CAF50" />
      {isInFocus && (
        <>
          {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.*/}
          <circle
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={20}
            fill="rgba(0,0,0,0)"
            stroke="#4CAF50"
            strokeWidth={2.5}
            onMouseDown={(ev) => handleNodePinMouseDown?.(ev, node.outputs[0].id, "from", "ADD")}
          />

          {/** biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
          {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.*/}
          <circle
            id="node-focused-frame"
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={10}
            fill="rgba(0,0,0,0)"
            stroke="#fff"
            strokeWidth={1}
            onMouseDown={isInFocus ? (ev) => handleNodeMouseDown?.(ev, node) : undefined}
          />
        </>
      )}
    </g>
  );
}
