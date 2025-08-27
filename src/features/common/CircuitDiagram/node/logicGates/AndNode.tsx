import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";

interface AndNodeProps {
  node: CircuitGuiNode;
  isInFocus?: boolean;
  focusElement?: (value: CircuitGuiNode) => void;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => void;
  openNodeUtilityMenu?: (ev: React.MouseEvent) => void;
}

export default function AndNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: AndNodeProps) {
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
      <path
        d={`
            M ${node.coordinate.x - node.size.x / 2} ${node.coordinate.y - node.size.y / 2}
            H ${node.coordinate.x + node.size.x / 2 - node.size.y / 2}
            A ${node.size.y / 2} ${node.size.y / 2} 0 0 1 ${node.coordinate.x + node.size.x / 2 - node.size.y / 2} ${node.coordinate.y + node.size.y / 2}
            H ${node.coordinate.x - node.size.x / 2}
            Z
        `}
        fill="#333"
        stroke="var(--color-white)"
        strokeWidth={1}
      />

      {/* Input pins */}
      {node.inputs.map((pin) => (
        <circle
          key={pin.id}
          cx={pin.coordinate.x}
          cy={pin.coordinate.y}
          r={2.5}
          fill="#333"
          stroke="var(--color-white)"
        />
      ))}

      {/* Output pin */}
      {node.outputs.map((pin) => (
        <circle
          key={pin.id}
          cx={pin.coordinate.x}
          cy={pin.coordinate.y}
          r={2.5}
          fill="#333"
          stroke="var(--color-white)"
        />
      ))}

      {isInFocus && (
        <>
          {/* biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support. */}
          <rect
            id="node-focused-frame"
            x={node.coordinate.x - node.size.x / 2 - 10}
            y={node.coordinate.y - node.size.y / 2 - 10}
            width={node.size.x + 20}
            height={node.size.y + 20}
            fill="transparent"
            stroke="var(--color-white)"
            strokeWidth={1}
            onMouseDown={isInFocus ? (ev) => handleNodeMouseDown?.(ev, node) : undefined}
          />

          {node.inputs.map((pin) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
            <circle
              key={pin.id}
              cx={pin.coordinate.x}
              cy={pin.coordinate.y}
              r={7.5}
              fill="transparent"
              stroke="#4CAF50"
              strokeWidth={2.5}
              onMouseDown={(ev) => handleNodePinMouseDown?.(ev, pin.id, "to", "ADD")}
            />
          ))}
          {node.outputs.map((pin) => (
            // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
            <circle
              key={pin.id}
              cx={pin.coordinate.x}
              cy={pin.coordinate.y}
              r={7.5}
              fill="transparent"
              stroke="#F44336"
              strokeWidth={2.5}
              onMouseDown={(ev) => handleNodePinMouseDown?.(ev, pin.id, "from", "ADD")}
            />
          ))}
        </>
      )}
    </g>
  );
}
