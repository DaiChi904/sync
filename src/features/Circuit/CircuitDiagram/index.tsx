import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
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
  focusedElement?: CircuitGuiNode | null;
  focusElement?: (node: CircuitGuiNode) => void;
  draggingNode?: CircuitGuiNode | null;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove?: (ev: React.MouseEvent) => void;
  handleNodeMouseUp?: () => void;
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
  const focusedNode = data?.nodes.find((node) => node.id === focusedElement?.id);
  const orderdNode = focusedNode
    ? [...data.nodes.filter((node) => node.id !== focusedElement?.id), focusedNode]
    : data.nodes;

  return (
    <svg ref={svgRef} viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`} style={{ background: "#222" }}>
      <title>Circuit Diagram</title>
      {data?.edges.map((edge) => (
        <Edge key={edge.id} edge={edge} pinMap={pinMap} outputMap={outputMap} waypointsMap={waypointsMap} />
      ))}
      {orderdNode.map((node) => {
        const isInFocus = node.id === focusedElement?.id;
        return (
          <Node
            key={node.id}
            node={node}
            isInFocus={isInFocus}
            focusElement={focusElement}
            handleNodeMouseDown={handleNodeMouseDown}
          />
        );
      })}

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
