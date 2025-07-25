import type { Result } from "@/utils/result";
import { CircuitGraphData } from "../model/entity/circuitGraphData";
import { CircuitGraphNode } from "../model/entity/circuitGraphNode";
import { CircuitGuiData } from "../model/entity/circuitGuiData";
import { CircuitGuiEdge } from "../model/entity/circuitGuiEdge";
import { CircuitGuiNode } from "../model/entity/circuitGuiNode";
import type { ICircuitParserService } from "../model/service/ICircuitParserService";
import type { CircuitData } from "../model/valueObject/circuitData";
import type { CircuitEdgeId } from "../model/valueObject/circuitEdgeId";
import { CircuitNodeId } from "../model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../model/valueObject/circuitNodePinId";
import type { CircuitNodeType } from "../model/valueObject/circuitNodeType";
import { Coordinate } from "../model/valueObject/coordinate";
import { Waypoint } from "../model/valueObject/waypoint";

export class CircuitParserServiceParseToGuiDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitParserServiceParseToGuiDataError";
  }
}

export class CircuitParserServiceParseToGraphDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitParserServiceParseToGraphDataError";
  }
}

export class CircuitParserService implements ICircuitParserService {
  parseToGuiData(circuitData: CircuitData): Result<CircuitGuiData> {
    const { nodes, edges } = circuitData;

    const guiNodes = nodes.map((node) => {
      const { id, type, inputs: _inputs_, outputs: _outputs_, coordinate, size } = node;

      const inputs = _inputs_.map((input, idx) => ({
        id: input,
        coordinate: !["ENTRY", "EXIT", "JUNCTION"].includes(type)
          ? Coordinate.from({
              x: coordinate.x - size.x / 2,
              y:
                _inputs_.length === 1
                  ? coordinate.y
                  : coordinate.y - size.y / 2 + (size.y / (_inputs_.length + 1)) * (1 + idx),
            })
          : Coordinate.from({
              x: coordinate.x,
              y: coordinate.y,
            }),
      }));
      const outputs = _outputs_.map((output, idx) => ({
        id: output,
        coordinate: !["ENTRY", "EXIT", "JUNCTION"].includes(type)
          ? Coordinate.from({
              x: coordinate.x + size.x / 2,
              y:
                _outputs_.length === 1
                  ? coordinate.y
                  : coordinate.y - size.y / 2 + (size.y / (_outputs_.length + 1)) * (1 + idx),
            })
          : Coordinate.from({
              x: coordinate.x,
              y: coordinate.y,
            }),
      }));

      return CircuitGuiNode.from({
        id,
        type,
        inputs,
        outputs,
        coordinate,
        size,
      });
    });

    const guiEdge = edges.map((edge) => {
      const { id, from, to, waypoints: _waypoints_ } = edge;

      const waypoints = Waypoint.waypointsToCoordinateArray(_waypoints_);

      return CircuitGuiEdge.from({
        id,
        from,
        to,
        waypoints,
      });
    });

    return { ok: true, value: CircuitGuiData.from({ nodes: guiNodes, edges: guiEdge }) };
  }

  parseToGraphData(circuitData: CircuitData): Result<CircuitGraphData> {
    const nodes = new Map<
      CircuitNodeId,
      { type: CircuitNodeType; inputs: Array<CircuitNodePinId>; outputs: Array<CircuitNodePinId> }
    >();
    const edges = new Map<CircuitEdgeId, { from: CircuitNodePinId; to: CircuitNodePinId }>();

    for (const node of circuitData.nodes) {
      const { id, type, inputs, outputs } = node;
      nodes.set(id, { type, inputs, outputs });
    }
    for (const edge of circuitData.edges) {
      const { id, from, to } = edge;
      edges.set(id, { from, to });
    }

    try {
      const graphData = circuitData.nodes.map((node) => {
        const connectedInEdge = Array.from(edges.entries())
          .filter((edge) => node.inputs.includes(edge[1].to))
          .map((edge) => edge[0]);
        const connectedOutEdge = Array.from(edges.entries())
          .filter((edge) => node.outputs.includes(edge[1].from))
          .map((edge) => edge[0]);

        const inputs = connectedInEdge.map((edgeId) => {
          const targetEdge = edges.get(edgeId);
          if (!targetEdge) throw new CircuitParserServiceParseToGraphDataError(`No target edge found: ${edgeId}`);
          const targetNode = Array.from(nodes.entries()).find((node) => node[1].outputs.includes(targetEdge.from));
          if (!targetNode)
            throw new CircuitParserServiceParseToGraphDataError(`No target node found: ${targetEdge.from}`);
          return CircuitNodeId.from(targetNode[0]);
        });

        const outputs = connectedOutEdge.map((edgeId) => {
          const targetEdge = edges.get(edgeId);
          if (!targetEdge) throw new CircuitParserServiceParseToGraphDataError(`No target edge found: ${edgeId}`);
          const targetNode = Array.from(nodes.entries()).find((node) => node[1].inputs.includes(targetEdge.to));
          if (!targetNode)
            throw new CircuitParserServiceParseToGraphDataError(`No target node found: ${targetEdge.from}`);
          return CircuitNodeId.from(targetNode[0]);
        });

        return CircuitGraphNode.from({
          id: node.id,
          type: node.type,
          inputs: inputs.map(CircuitNodeId.from),
          outputs: outputs.map(CircuitNodeId.from),
        });
      });

      return { ok: true, value: CircuitGraphData.from(graphData) };
    } catch (err: unknown) {
      console.error(err);
      return { ok: false, error: err };
    }
  }
}
