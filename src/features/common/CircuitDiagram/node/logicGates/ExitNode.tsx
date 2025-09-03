import { SvgCircle, SvgGroup } from "@/components/atoms/svg";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";

interface ExitNodeProps {
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

export default function ExitNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: ExitNodeProps) {
  return (
    <SvgGroup
      onClick={() => focusElement?.(node)}
      onContextMenu={(ev) => {
        ev.preventDefault();
        openNodeUtilityMenu?.(ev);
      }}
    >
      {/* Main body */}
      <SvgCircle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="#F44336" />
      {isInFocus && (
        <>
          <SvgCircle
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={20}
            fill="transparent"
            stroke="#F44336"
            strokeWidth={2.5}
            onMouseDown={(ev) => handleNodePinMouseDown?.(ev, node.inputs[0].id, "to", "ADD")}
          />

          {/** biome-ignore lint/correctness/useUniqueElementIds: No need for unique id. */}
          <SvgCircle
            id="node-focused-frame"
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={10}
            fill="transparent"
            stroke="var(--color-white)"
            strokeWidth={1}
            onMouseDown={isInFocus ? (ev) => handleNodeMouseDown?.(ev, node) : undefined}
          />
        </>
      )}
    </SvgGroup>
  );
}
