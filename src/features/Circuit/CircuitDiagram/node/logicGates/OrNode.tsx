import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";

interface OrNodeProps {
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

export default function OrNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: OrNodeProps) {
  // The Or node has a slight depression at the input, so if it is drawn as it is, the connection points cannot be connected neatly to the edge in the GUI, so a little play is made with this value.
  const extraInputWidth = node.size.x * 0.1;
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
            M ${node.coordinate.x - node.size.x / 2 - extraInputWidth} ${node.coordinate.y - node.size.y / 2}
            Q ${node.coordinate.x} ${node.coordinate.y - node.size.y / 2} ${node.coordinate.x + node.size.x / 2} ${node.coordinate.y}
            Q ${node.coordinate.x} ${node.coordinate.y + node.size.y / 2} ${node.coordinate.x - node.size.x / 2 - extraInputWidth} ${node.coordinate.y + node.size.y / 2}
            Q ${node.coordinate.x - node.size.x * 0.3 - extraInputWidth / 2} ${node.coordinate.y} ${node.coordinate.x - node.size.x / 2 - extraInputWidth} ${node.coordinate.y - node.size.y / 2}
            Z
        `}
        fill="#333"
        stroke="#fff"
        strokeWidth={1}
      />

      {/* Input pins */}
      {node.inputs.map((pin) => (
        <circle key={pin.id} cx={pin.coordinate.x} cy={pin.coordinate.y} r={2.5} fill="#333" stroke="#fff" />
      ))}

      {/* Output pin */}
      {node.outputs.map((pin) => (
        <circle key={pin.id} cx={pin.coordinate.x} cy={pin.coordinate.y} r={2.5} fill="#333" stroke="#fff" />
      ))}

      {isInFocus && (
        <>
          {/* biome-ignore lint/nursery/useUniqueElementIds: No need for unique id. */}
          {/** biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support. */}
          <rect
            id="node-focused-frame"
            x={node.coordinate.x - node.size.x / 2 - 10}
            y={node.coordinate.y - node.size.y / 2 - 10}
            width={node.size.x + 20}
            height={node.size.y + 20}
            fill="rgba(0,0,0,0)"
            stroke="#fff"
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
              fill="rgba(0,0,0,0)"
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
              fill="rgba(0,0,0,0)"
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
