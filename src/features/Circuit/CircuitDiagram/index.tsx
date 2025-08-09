import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import Edge from "./Edge";
import Node from "./Node";

interface CircuitDiagramProps {
  data: CircuitGuiData;
  outputRecord?: Record<CircuitNodeId, EvalResult>;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  focusedElement?: { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge } | null;
  focusElement?: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge) => void;
  };
  draggingNode?: CircuitGuiNode | null;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove?: (ev: React.MouseEvent) => void;
  handleNodeMouseUp?: () => void;
  draggingNodePin?: {
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to" | "waypoints";
    method: "ADD" | "UPDATE";
  } | null;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to" | "waypoints",
    method: "ADD" | "UPDATE",
  ) => void;
  handleNodePinMouseMove?: (ev: React.MouseEvent) => void;
  handleNodePinMouseUp?: (ev: React.MouseEvent) => void;
  tempEdge?: { from: Coordinate; to: Coordinate } | null;
}

export default function CircuitDiagram({
  data,
  outputRecord,
  svgRef,
  focusedElement,
  focusElement,
  draggingNode,
  handleNodeMouseDown,
  handleNodeMouseMove,
  handleNodeMouseUp,
  draggingNodePin,
  handleNodePinMouseDown,
  handleNodePinMouseMove,
  handleNodePinMouseUp,
  tempEdge,
}: CircuitDiagramProps) {
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

  const MARRGIN = 20;
  const minX = Math.min(...data.nodes.map((node) => node.coordinate.x - node.size.x / 2)) - MARRGIN; // 余白つける
  const minY = Math.min(...data.nodes.map((node) => node.coordinate.y - node.size.y / 2)) - MARRGIN;
  const maxX = Math.max(...data.nodes.map((node) => node.coordinate.x + node.size.x / 2)) + MARRGIN;
  const maxY = Math.max(...data.nodes.map((node) => node.coordinate.y + node.size.y / 2)) + MARRGIN;
  const viewWidth = maxX - minX;
  const viewHeight = maxY - minY;

  // Make focused element on top.
  const focusedNode =
    focusedElement?.kind === "node" ? data?.nodes.find((node) => node.id === focusedElement?.value.id) : undefined;
  const orderdNode = focusedNode
    ? [...data.nodes.filter((node) => node.id !== focusedElement?.value.id), focusedNode]
    : data.nodes;

  return (
    <svg ref={svgRef} viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`} style={{ background: "#222" }}>
      <title>Circuit Diagram</title>
      {data?.edges.map((edge) => {
        const isInFocus = focusedElement?.kind === "edge" && edge.id === focusedElement?.value.id;
        return (
          <Edge
            key={edge.id}
            edge={edge}
            pinMap={pinMap}
            outputMap={outputMap}
            waypointsMap={waypointsMap}
            isInFocus={isInFocus}
            focusElement={focusElement?.("edge")}
            handleNodePinMouseDown={handleNodePinMouseDown}
          />
        );
      })}
      {orderdNode.map((node) => {
        const isInFocus = focusedElement?.kind === "node" && node.id === focusedElement?.value.id;
        return (
          <Node
            key={node.id}
            node={node}
            isInFocus={isInFocus}
            focusElement={focusElement?.("node")}
            handleNodeMouseDown={handleNodeMouseDown}
          />
        );
      })}

      {draggingNodePin && (
        // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="transparent"
          pointerEvents="all"
          onMouseMove={handleNodePinMouseMove}
          onMouseUp={handleNodePinMouseUp}
        />
      )}

      {tempEdge && (
        // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
        <line
          x1={tempEdge.from.x}
          y1={tempEdge.from.y}
          x2={tempEdge.to.x}
          y2={tempEdge.to.y}
          stroke="#9ca19d"
          strokeWidth={2}
          onMouseUp={handleNodePinMouseUp}
        />
      )}

      {draggingNode && (
        // biome-ignore lint/a11y/noStaticElementInteractions: No need for a11y support.
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="transparent"
          pointerEvents="all"
          onMouseMove={handleNodeMouseMove}
          onMouseUp={handleNodeMouseUp}
        />
      )}
    </svg>
  );
}
