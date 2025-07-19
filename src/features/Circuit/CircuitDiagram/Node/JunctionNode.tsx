import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

type JunctionNodeProps = CircuitGuiNode;

export default function JunctionNode({ node }: { node: JunctionNodeProps }) {
  return (
    <g>
      <circle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="green" />
    </g>
  );
}
