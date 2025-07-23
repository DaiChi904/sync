import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";

interface EdgeProps {
  edge: CircuitGuiEdge;
  pinMap: Map<CircuitNodePinId, Coordinate>;
  outputMap?: Map<CircuitNodePinId, EvalResult>;
}

export default function Edge({ edge, pinMap, outputMap }: EdgeProps) {
  const from = pinMap.get(edge.from);
  const to = pinMap.get(edge.to);
  if (!from || !to) return null;

  return (
    <g>
      <line
        key={edge.id}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        // biome-ignore lint/style/noNonNullAssertion: This is fine.
        stroke={outputMap!.get(edge.from) === true ? "#00a120" : "#9ca19d"}
        strokeWidth={2}
      />
    </g>
  );
}
