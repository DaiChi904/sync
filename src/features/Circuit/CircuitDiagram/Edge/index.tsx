import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";

interface EdgeProps {
  edge: CircuitGuiEdge;
  pinMap: Map<CircuitNodePinId, Coordinate>;
}

export default function Edge({ edge, pinMap }: EdgeProps) {
  const from = pinMap.get(edge.from);
  const to = pinMap.get(edge.to);
  if (!from || !to) return null;

  return (
    <g>
      <line key={edge.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#0f0" strokeWidth={2} />
    </g>
  );
}
