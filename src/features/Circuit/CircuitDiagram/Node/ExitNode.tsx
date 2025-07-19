import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

type ExitNodeProps = CircuitGuiNode;

export default function ExitNode({ node }: { node: ExitNodeProps }) {
  return (
    <g>
      <circle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="green" />
    </g>
  );
}
