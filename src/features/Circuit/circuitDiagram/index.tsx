import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import Edge from "./Edge";
import Node from "./Node";

interface CircuitDiagramProps {
  data?: CircuitGuiData;
}

export default function CircuitDiagram({ data }: CircuitDiagramProps) {
  const pinMap = new Map<CircuitNodePinId, Coordinate>();

  data?.nodes.forEach((node) => {
    node.inputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
    node.outputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
  });

  return (
    <svg width="1000" height="600" style={{ background: "#222" }}>
      <title>Circuit Diagram</title>
      {data?.edges.map((edge) => (
        <Edge key={edge.id} edge={edge} pinMap={pinMap} />
      ))}
      {data?.nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </svg>
  );
}
