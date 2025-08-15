import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";

interface JunctionNodeProps {
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

export default function JunctionNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: JunctionNodeProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
    <g
      onClick={() => focusElement?.(node)}
      onContextMenu={(ev) => {
        ev.preventDefault();
        openNodeUtilityMenu?.(ev);
      }}
    >
      <defs>
        {/* 左半分 */}
        <clipPath id={`leftClip-${node.id}`}>
          <path
            d={`
        M ${node.coordinate.x} ${node.coordinate.y}
        m -20,0
        a 20,20 0 0,1 20,-20
        l 0,40
        a 20,20 0 0,1 -20,-20
        z
      `}
          />
        </clipPath>

        {/* 右半分 */}
        <clipPath id={`rightClip-${node.id}`}>
          <path
            d={`
        M ${node.coordinate.x} ${node.coordinate.y}
        m 0,-20
        a 20,20 0 0,1 20,20
        a 20,20 0 0,1 -20,20
        z
      `}
          />
        </clipPath>
      </defs>

      {/* Main body */}
      <circle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="#FFC107" />
      {isInFocus && (
        <>
          {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.*/}
          <circle
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={20}
            clipPath={`url(#leftClip-${node.id})`}
            fill="rgba(0,0,0,0)"
            stroke="#4CAF50"
            strokeWidth={5}
            onMouseDown={(ev) => handleNodePinMouseDown?.(ev, node.inputs[0].id, "from", "ADD")}
          />

          {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.*/}
          <circle
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={20}
            clipPath={`url(#rightClip-${node.id})`}
            fill="rgba(0,0,0,0)"
            stroke="#F44336"
            strokeWidth={5}
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
