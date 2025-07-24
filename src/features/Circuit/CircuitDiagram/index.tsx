import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import Edge from "./Edge";
import Node from "./Node";

interface CircuitDiagramProps {
  data: CircuitGuiData;
  outputRecord?: Record<CircuitNodeId, EvalResult>;
}

export default function CircuitDiagram({ data, outputRecord }: CircuitDiagramProps) {
  const pinMap = new Map<CircuitNodePinId, Coordinate>();
  const waypointsMap = new Map<CircuitNodePinId, Coordinate[]>();
  const outputMap = new Map<CircuitNodePinId, EvalResult>();

  data.nodes.forEach((node) => {
    node.inputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
    node.outputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
  });

  data.edges.forEach((edge) => {
    if (edge.waypoints) {
      waypointsMap.set(edge.from, edge.waypoints);
      waypointsMap.set(edge.to, edge.waypoints);
    }
  });

  data?.nodes.forEach((node) => {
    node.inputs.forEach((pin) => {
      const output = outputRecord?.[node.id];
      outputMap.set(pin.id, output ?? EvalResult.from(true));
    });
    node.outputs.forEach((pin) => {
      const output = outputRecord?.[node.id];
      outputMap.set(pin.id, output ?? EvalResult.from(true));
    });
  });

  const minX = Math.min(...data.nodes.map((node) => node.coordinate.x - node.size.x / 2));
  const minY = Math.min(...data.nodes.map((node) => node.coordinate.y - node.size.y / 2));
  const maxX = Math.max(...data.nodes.map((node) => node.coordinate.x + node.size.x / 2));
  const maxY = Math.max(...data.nodes.map((node) => node.coordinate.y + node.size.y / 2));

  return (
    <svg width={maxX + minX} height={maxY + minY} style={{ background: "#222" }}>
      <title>Circuit Diagram</title>
      {data?.edges.map((edge) => (
        <Edge key={edge.id} edge={edge} pinMap={pinMap} outputMap={outputMap} waypointsMap={waypointsMap} />
      ))}
      {data?.nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </svg>
  );
}
