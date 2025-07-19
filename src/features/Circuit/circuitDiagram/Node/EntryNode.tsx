import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

type EntryNodeProps = CircuitGuiNode;

export default function EntryNode({ node }: { node: EntryNodeProps }) {
  return (
    <g>
      <circle cx={node.coordinate.x} cy={node.coordinate.y} r={5} fill="green" />
    </g>
  );
}
