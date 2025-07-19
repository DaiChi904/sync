import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";

type AndNodeProps = CircuitGuiNode;

export default function AndNode({ node }: { node: AndNodeProps }) {
  return (
    <g>
      {/* Main body */}
      <path
        d={`
            M ${node.coordinate.x - node.size.x / 2} ${node.coordinate.y - node.size.y / 2}
            H ${node.coordinate.x + node.size.x / 2 - node.size.y / 2}
            A ${node.size.y / 2} ${node.size.y / 2} 0 0 1 ${node.coordinate.x + node.size.x / 2 - node.size.y / 2} ${node.coordinate.y + node.size.y / 2}
            H ${node.coordinate.x - node.size.x / 2}
            Z
        `}
        fill="#333"
        stroke="#fff"
        strokeWidth={1}
      />

      {/* Input pins */}
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
