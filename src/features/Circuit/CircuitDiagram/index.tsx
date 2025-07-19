import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import Edge from "./Edge";
import Node from "./Node";

interface CircuitDiagramProps {
  data: CircuitGuiData;
}

export default function CircuitDiagram({ data }: CircuitDiagramProps) {
  const pinMap = new Map<CircuitNodePinId, Coordinate>();

  data?.nodes.forEach((node) => {
    node.inputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
    node.outputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
  });

  const minX = Math.min(...data.nodes.map((node) => node.coordinate.x - node.size.x / 2));
  const minY = Math.min(...data.nodes.map((node) => node.coordinate.y - node.size.y / 2));
  const maxX = Math.max(...data.nodes.map((node) => node.coordinate.x + node.size.x / 2));
  const maxY = Math.max(...data.nodes.map((node) => node.coordinate.y + node.size.y / 2));

  return (
    <svg width={maxX + minX} height={maxY + minY} style={{ background: "#222" }}>
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
