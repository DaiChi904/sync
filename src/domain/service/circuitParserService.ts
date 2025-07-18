import type { Result } from "@/utils/result";
import { CircuitGraphData } from "../model/entity/circuitGraphData";
import { CircuitGraphNode } from "../model/entity/circuitGraphNode";
import { CircuitGuiData } from "../model/entity/circuitGuiData";
import { CircuitGuiEdge } from "../model/entity/circuitGuiEdge";
import { CircuitGuiNode } from "../model/entity/circuitGuiNode";
import type { ICircuitParserService } from "../model/service/ICircuitParserService";
import { CircuitEdgeId } from "../model/valueObject/circuitEdgeId";
import { CircuitNodeId } from "../model/valueObject/circuitNodeId";
import { CircuitNodePinId } from "../model/valueObject/circuitNodePinId";
import { CircuitNodeSize } from "../model/valueObject/circuitNodeSize";
import { CircuitNodeType } from "../model/valueObject/circuitNodeType";
import { Coordinate } from "../model/valueObject/coordinate";

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
  parseToGuiData(textData: string): Result<CircuitGuiData> {
    const lines = textData
      .split(";")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const nodes: Array<CircuitGuiNode> = [];
    const edges: Array<CircuitGuiEdge> = [];

    for (const line of lines) {
      const parts = line.split(",").map((part) => part.trim());
      const token = parts[0];

      switch (token) {
        case "Node": {
          const id = CircuitNodeId.from(parts[1]);
          const type = CircuitNodeType.from(parts[2]);
          // The positional relationship on the GUI is guaranteed by the order of definition in the data.
          const rawInputs = parts[3]
            .replace("[", "")
            .replace("]", "")
            .trim()
            .split("|")
            .map((input) => CircuitNodePinId.from(input.trim()));
          const rawOutputs = parts[4]
            .replace("[", "")
            .replace("]", "")
            .trim()
            .split("|")
            .map((output) => CircuitNodePinId.from(output.trim()));
          const rawCoordinate = parts[5].replace("[", "").replace("]", "").trim().split(":");
          const coordinate = Coordinate.from({ x: Number(rawCoordinate[0]), y: Number(rawCoordinate[1]) });
          const rawSize = parts[6].replace("[", "").replace("]", "").trim().split(":");
          const size = CircuitNodeSize.from({ x: Number(rawSize[0]), y: Number(rawSize[1]) });

          const inputs =
            type !== "ENTRY" && type !== "EXIT" && type !== "JUNCTION"
              ? rawInputs.map((input, idx) => ({
                  id: input,
                  coordinate: Coordinate.from({
                    x: coordinate.x - size.x / 2,
                    y:
                      rawInputs.length === 1
                        ? coordinate.y
                        : coordinate.y - size.y / 2 + (size.y / (rawInputs.length + 1)) * (1 + idx),
                  }),
                }))
              : rawInputs.map((input) => ({
                  id: input,
                  coordinate: Coordinate.from({
                    x: coordinate.x,
                    y: coordinate.y,
                  }),
                }));
          const outputs =
            type !== "ENTRY" && type !== "EXIT" && type !== "JUNCTION"
              ? rawOutputs.map((output, idx) => ({
                  id: output,
                  coordinate: Coordinate.from({
                    x: coordinate.x + size.x / 2,
                    y:
                      rawInputs.length === 1
                        ? coordinate.y
                        : coordinate.y - size.y / 2 + (size.y / (rawOutputs.length + 1)) * (1 + idx),
                  }),
                }))
              : rawOutputs.map((output) => ({
                  id: output,
                  coordinate: Coordinate.from({
                    x: coordinate.x,
                    y: coordinate.y,
                  }),
                }));

          nodes.push(
            CircuitGuiNode.from({
              id,
              type,
              inputs: type !== "ENTRY" ? inputs : [],
              outputs: type !== "EXIT" ? outputs : [],
              coordinate,
              size,
            }),
          );
          break;
        }
        case "Edge": {
          const id = CircuitEdgeId.from(parts[1]);
          const edge = parts[2].replace("[", "").replace("]", "").trim().split("->");
          const from = CircuitNodePinId.from(edge[0].trim());
          const to = CircuitNodePinId.from(edge[1].trim());
          const rawWaypoints = parts[3]
            .replace("[", "")
            .replace("]", "")
            .trim()
            .split("|")
            .map((point) => point.trim());
          const waypoints =
            rawWaypoints[0] !== "NONE"
              ? rawWaypoints.map((raw) => {
                  const rawCoordinate = raw.split(":");
                  return Coordinate.from({ x: Number(rawCoordinate[0]), y: Number(rawCoordinate[1]) });
                })
              : [];
          edges.push(CircuitGuiEdge.from({ id, from, to, waypoints }));
          break;
        }
        default:
          return { ok: false, error: new CircuitParserServiceParseToGuiDataError(`Unknown token: ${token}`) };
      }
    }

    return { ok: true, value: CircuitGuiData.from({ nodes, edges }) };
  }

  parseToGraphData(textData: string): Result<CircuitGraphData> {
    const lines = textData
      .split(";")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const res: Array<CircuitGraphNode> = [];
    const nodes = new Map<
      CircuitNodeId,
      { type: CircuitNodeType; inputs: Array<CircuitNodePinId>; outputs: Array<CircuitNodePinId> }
    >();
    const edges = new Map<CircuitEdgeId, { from: CircuitNodePinId; to: CircuitNodePinId }>();

    for (const line of lines) {
      const parts = line.split(",").map((part) => part.trim());
      const token = parts[0];

      switch (token) {
        case "Node": {
          const id = CircuitNodeId.from(parts[1]);
          const type = CircuitNodeType.from(parts[2]);
          const inputs = parts[3]
            .replace("[", "")
            .replace("]", "")
            .trim()
            .split("|")
            .map((input) => CircuitNodePinId.from(input.trim()));
          const outputs = parts[4]
            .replace("[", "")
            .replace("]", "")
            .trim()
            .split("|")
            .map((output) => CircuitNodePinId.from(output.trim()));
          nodes.set(id, { type, inputs, outputs });
          break;
        }
        case "Edge": {
          const id = CircuitEdgeId.from(parts[1]);
          const edge = parts[2].replace("[", "").replace("]", "").trim().split("->");
          const from = CircuitNodePinId.from(edge[0].trim());
          const to = CircuitNodePinId.from(edge[1].trim());
          edges.set(id, { from, to });
          break;
        }
        default:
          return { ok: false, error: new CircuitParserServiceParseToGraphDataError(`Unknown token: ${token}`) };
      }
    }

    for (const [nodeId, nodeValue] of nodes.entries()) {
      const tempRes: CircuitGraphNode = CircuitGraphNode.from({
        id: CircuitNodeId.from(nodeId),
        type: CircuitNodeType.from(nodeValue.type),
        inputs: [],
        outputs: [],
      });

      const connectedIn = Array.from(edges.entries())
        .filter((edge) => nodeValue.inputs.includes(edge[1].to))
        .map((edge) => edge[0]);
      const connectedOut = Array.from(edges.entries())
        .filter((edge) => nodeValue.outputs.includes(edge[1].from))
        .map((edge) => edge[0]);

      for (const edgeId of connectedIn) {
        const targetEdge = edges.get(edgeId);
        if (!targetEdge)
          return { ok: false, error: new CircuitParserServiceParseToGraphDataError(`No target edge found: ${edgeId}`) };
        const targetNode = Array.from(nodes.entries()).find((node) => node[1].outputs.includes(targetEdge.from));
        if (!targetNode)
          return {
            ok: false,
            error: new CircuitParserServiceParseToGraphDataError(`No target node found: ${targetEdge.from}`),
          };
        tempRes.inputs.push(CircuitNodeId.from(targetNode[0]));
      }

      for (const edgeId of connectedOut) {
        const targetEdge = edges.get(edgeId);
        if (!targetEdge)
          return { ok: false, error: new CircuitParserServiceParseToGraphDataError(`No target edge found: ${edgeId}`) };
        const targetNode = Array.from(nodes.entries()).find((node) => node[1].inputs.includes(targetEdge.to));
        if (!targetNode)
          return {
            ok: false,
            error: new CircuitParserServiceParseToGraphDataError(`No target node found: ${targetEdge.from}`),
          };
        tempRes.outputs.push(CircuitNodeId.from(targetNode[0]));
      }

      res.push(tempRes);
    }

    return { ok: true, value: CircuitGraphData.from(res) };
  }
}
