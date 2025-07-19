import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

type OrNodeProps = CircuitGuiNode;

export default function OrNode({ node }: { node: OrNodeProps }) {
  // The Or node has a slight depression at the input, so if it is drawn as it is, the connection points cannot be connected neatly to the edge in the GUI, so a little play is made with this value.
  const extraInputWidth = node.size.x * 0.1;
  return (
    <g>
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
    </g>
  );
}
