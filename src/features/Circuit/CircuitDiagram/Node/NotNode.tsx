import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

type NotNodeProps = CircuitGuiNode;

export default function NotNode({ node }: { node: NotNodeProps }) {
  return (
    <g>
      {/* Main triangle */}
      <path
        d={`
            M ${node.coordinate.x - node.size.x / 2} ${node.coordinate.y - node.size.y / 2}
            L ${node.coordinate.x + node.size.x / 2} ${node.coordinate.y}
            L ${node.coordinate.x - node.size.x / 2} ${node.coordinate.y + node.size.y / 2}
            Z
        `}
        fill="#333"
        stroke="#fff"
        strokeWidth={1}
      />

      {/* Circle of output (circle of NOT) */}
      <circle
        cx={node.coordinate.x + node.size.x / 2}
        cy={node.coordinate.y}
        r={node.size.y * 0.1}
        fill="#333"
        stroke="#fff"
        strokeWidth={1}
      />

      {/* Input pin */}
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
