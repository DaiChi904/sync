import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

interface AndNodeProps {
  node: CircuitGuiNode;
  isInFocus?: boolean;
  focusElement?: (value: CircuitGuiNode) => void;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  openNodeUtilitiesMenu?: (ev: React.MouseEvent) => void;
}

export default function AndNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  openNodeUtilitiesMenu,
}: AndNodeProps) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
    <g
      onClick={() => focusElement?.(node)}
      onMouseDown={isInFocus ? (ev) => handleNodeMouseDown?.(ev, node) : undefined}
      onContextMenu={(ev) => {
        ev.preventDefault();
        openNodeUtilitiesMenu?.(ev);
      }}
    >
      {isInFocus && (
        // biome-ignore lint/nursery/useUniqueElementIds: No need for unique id.
        <rect
          id="node-focused-frame"
          x={node.coordinate.x - node.size.x / 2 - 10}
          y={node.coordinate.y - node.size.y / 2 - 10}
          width={node.size.x + 20}
          height={node.size.y + 20}
          fill="rgba(0,0,0,0)"
          stroke="#fff"
          strokeWidth={1}
        />
      )}
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
        stroke="#fff"
        strokeWidth={1}
      />

      {/* Input pins */}
      {node.inputs.map((pin) => (
        <circle key={pin.id} cx={pin.coordinate.x} cy={pin.coordinate.y} r={4} fill="#0ff" stroke="#0ff" />
      ))}

      {/* Output pin */}
      {node.outputs.map((pin) => (
        <circle key={pin.id} cx={pin.coordinate.x} cy={pin.coordinate.y} r={4} fill="#f0f" stroke="#f0f" />
      ))}
    </g>
  );
}
