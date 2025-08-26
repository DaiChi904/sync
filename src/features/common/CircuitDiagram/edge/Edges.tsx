import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import Edge from "./Edge";

interface EdgesProps {
  data: CircuitGuiData;
  outputRecord?: Record<CircuitNodeId, EvalResult>;
  focusedElement?: { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge } | null;
  focusElement?: (value: CircuitGuiEdge & { waypointIdx: number }) => void;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => void;
  handleWaypointMouseDown?: (
    id: CircuitEdgeId,
  ) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => void;
  openEdgeUtilityMenu?: (ev: React.MouseEvent) => void;
}

export default function Edges({
  data,
  outputRecord,
  focusedElement,
  focusElement,
  handleNodePinMouseDown,
  handleWaypointMouseDown,
  openEdgeUtilityMenu,
}: EdgesProps) {
  const pinMap = new Map<CircuitNodePinId, Coordinate>();
  const waypointsMap = new Map<CircuitEdgeId, Coordinate[] | undefined>();
  const outputMap = new Map<CircuitNodePinId, EvalResult>();

  data.nodes.forEach((node) => {
    node.inputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
    node.outputs.forEach((pin) => pinMap.set(pin.id, pin.coordinate));
  });

  data.edges.forEach((edge) =>
    waypointsMap.set(edge.id, edge.waypoints),
  );

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

  // Make focused element on top.
  const focusedEdge =
    focusedElement?.kind === "edge" ? data?.edges.find((node) => node.id === focusedElement?.value.id) : undefined;
  const orderdEdges = focusedEdge
    ? [...data.edges.filter((node) => node.id !== focusedElement?.value.id), focusedEdge]
    : data.edges;

  return orderdEdges.map((edge) => {
    const isInFocus = focusedElement?.kind === "edge" && edge.id === focusedElement?.value.id;
    return (
      <Edge
        key={edge.id}
        edge={edge}
        pinMap={pinMap}
        outputMap={outputMap}
        waypointsMap={waypointsMap}
        isInFocus={isInFocus}
        focusElement={focusElement}
        handleNodePinMouseDown={handleNodePinMouseDown}
        handleWaypointMouseDown={handleWaypointMouseDown?.(edge.id)}
        openEdgeUtilityMenu={isInFocus ? openEdgeUtilityMenu : undefined}
      />
    );
  });
}
