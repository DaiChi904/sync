import { SvgCircle, SvgGroup, SvgPath, SvgRect } from "@/components/atoms/svg";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";

interface NotNodeProps {
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

export default function NotNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: NotNodeProps) {
  return (
    <SvgGroup
      onClick={() => focusElement?.(node)}
      onContextMenu={(ev) => {
        ev.preventDefault();
        openNodeUtilityMenu?.(ev);
      }}
    >
      {/* Main body */}
      <SvgPath
        d={`
            M ${node.coordinate.x - node.size.x / 2} ${node.coordinate.y - node.size.y / 2}
            L ${node.coordinate.x + node.size.x / 2} ${node.coordinate.y}
            L ${node.coordinate.x - node.size.x / 2} ${node.coordinate.y + node.size.y / 2}
            Z
        `}
        fill="#333"
        stroke="var(--color-white)"
        strokeWidth={1}
      />

      {/* Input pin */}
      {node.inputs.map((pin) => (
        <SvgCircle
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
        <SvgCircle
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
          {/* biome-ignore lint/correctness/useUniqueElementIds: No need for unique id. */}
          <SvgRect
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
            <SvgCircle
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
            <SvgCircle
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
    </SvgGroup>
  );
}
