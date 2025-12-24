import { SvgCircle, SvgClipPath, SvgDefs, SvgGroup, SvgPath } from "@/components/atoms/svg";
import type { LogicGateNodeProps } from "./types";

export default function JunctionNode({
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
      <SvgDefs>
        {/* 左半分 */}
        <SvgClipPath id={`leftClip-${node.id}`}>
          <SvgPath
            d={`
        M ${node.coordinate.x} ${node.coordinate.y}
        m -20,0
        a 20,20 0 0,1 20,-20
        l 0,40
        a 20,20 0 0,1 -20,-20
        z
      `}
          />
        </SvgClipPath>

        {/* 右半分 */}
        <SvgClipPath id={`rightClip-${node.id}`}>
          <SvgPath
            d={`
        M ${node.coordinate.x} ${node.coordinate.y}
        m 0,-20
        a 20,20 0 0,1 20,20
        a 20,20 0 0,1 -20,20
        z
      `}
          />
        </SvgClipPath>
      </SvgDefs>

      {/* Main body */}
      <SvgCircle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="#FFC107" />
      {isInFocus && (
        <>
          <SvgCircle
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={20}
            clipPath={`url(#leftClip-${node.id})`}
            fill="transparent"
            stroke="#4CAF50"
            strokeWidth={5}
            onMouseDown={(ev) => handleNodePinMouseDown?.(ev, node.inputs[0].id, "to", "ADD")}
          />

          <SvgCircle
            cx={node.coordinate.x}
            cy={node.coordinate.y}
            r={20}
            clipPath={`url(#rightClip-${node.id})`}
            fill="transparent"
            stroke="#F44336"
            strokeWidth={5}
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
