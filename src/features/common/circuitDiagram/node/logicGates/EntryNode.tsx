import { SvgCircle, SvgGroup } from "@/components/atoms/svg";
import type { LogicGateNodeProps } from "./types";

export default function EntryNode({
  node,
  isInFocus,
  focusElement,
  handleNodeMouseDown,
  handleNodePinMouseDown,
  openNodeUtilityMenu,
}: LogicGateNodeProps) {
  return (
    <SvgGroup
      onClick={() => focusElement?.(node)}
      onContextMenu={(ev) => {
        ev.preventDefault();
        openNodeUtilityMenu?.(ev);
      }}
    >
      {/* Main body */}
      <SvgCircle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="#4CAF50" />
      {isInFocus && (
        <>
          <SvgCircle
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={20}
            fill="transparent"
            stroke="#4CAF50"
            strokeWidth={2.5}
            onMouseDown={(ev) => handleNodePinMouseDown?.(ev, node.outputs[0].id, "from", "ADD")}
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
