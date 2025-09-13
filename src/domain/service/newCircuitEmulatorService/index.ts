import type { NodeInformation } from "@/domain/model/entity/nodeInfomation.type";
import {
  CircuitEmulatorServiceError,
  type ICircuitEmulatorService,
} from "@/domain/model/service/ICircuitEmulatorService";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodeInputId } from "@/domain/model/valueObject/circuitNodeInputId";
import type { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import type { EvalDelay } from "@/domain/model/valueObject/evalDelay";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";
import { ExecutionOrder } from "@/domain/model/valueObject/executionOrder";
import { InputRecord } from "@/domain/model/valueObject/inputRecord";
import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../../model/entity/circuitGraphData";
import { CircuitNode } from "./circuitNode";

export class CircuitEmulatorService implements ICircuitEmulatorService {
  private readonly nodes: CircuitNode[];

  private constructor(nodes: CircuitNode[]) {
    this.nodes = nodes;
  }

  static from(
    circuitGraphData: CircuitGraphData,
    evalDelay: EvalDelay,
  ): Result<CircuitEmulatorService, CircuitEmulatorServiceError> {
    const circuitNodes: CircuitNode[] = [];

    const graphNodes: Set<{ nodeID: CircuitNodeId; type: CircuitNodeType }> = new Set();
    // Use Set to store strings in “fromId->toId” format to eliminate duplicate edges.
    const uniqueEdgeStrings: Set<string> = new Set();

    for (const node of circuitGraphData) {
      graphNodes.add({ nodeID: node.id, type: node.type });
      for (const input of node.inputs) {
        uniqueEdgeStrings.add(`${input}->${node.id}`);
      }
      for (const output of node.outputs) {
        uniqueEdgeStrings.add(`${node.id}->${output}`);
      }
    }

    const graphEdges: Map<CircuitNodeId, Array<{ from: CircuitNodeId; to: CircuitNodeId }>> = new Map();
    for (const edgeString of Array.from(uniqueEdgeStrings)) {
      const [from, to] = edgeString.split("->").map(CircuitNodeId.from);
      if (from === undefined || to === undefined) continue;
      const edge = { from: from as CircuitNodeId, to: to as CircuitNodeId };
      // Initialize if there is no array corresponding to the "from" key
      if (!graphEdges.has(from)) {
        graphEdges.set(from, []);
      }
      // biome-ignore lint/style/noNonNullAssertion: As Map is initialized in the previous if statement, this is safe.
      graphEdges.get(from)!.push(edge);
    }

    const allNodes = Array.from(graphNodes);
    const allEdges = Array.from(graphEdges.values()).flat();

    try {
      // --- Define the execution orders of nodes --- //
      // Perform topological sorting to the extent possible.
      const removedNodeIds: Array<CircuitNodeId> = [];
      const removedEages: {
        from: CircuitNodeId;
        to: CircuitNodeId;
      }[] = [];
      // As ENTORYs are always without dependencies, handle them first.
      const entry = allNodes.filter((node) => node.type === "ENTRY");
      removedNodeIds.push(...entry.map((node) => node.nodeID));
      removedEages.push(...allEdges.filter((edge) => entry.some((node) => node.nodeID === edge.from)));

      // Determines execution orders of remaining nodes.
      // Topological sorting is performed to remove those that can be removed in order.
      // If a loop is detected (breakFlag is true), the following operations are performed repeatedly until the execution order can be determined for all of them.
      // The loop is broken by deleting the input (edge) of the node that is the endpoint of the edge cut by the topological sort, and then the topological sort is performed again.
      while (removedNodeIds.length !== allNodes.length) {
        while (true) {
          let breakFlag = true;
          for (const node of allNodes) {
            const inputs = allEdges.filter((edge) => edge.to === node.nodeID && !removedEages.includes(edge));
            if (removedNodeIds.includes(node.nodeID) || inputs.length !== 0) {
              continue;
            }
            removedNodeIds.push(node.nodeID);
            removedEages.push(...allEdges.filter((edge) => edge.from === node.nodeID));
            breakFlag = false;
          }
          if (breakFlag) {
            break;
          }
        }
        const edgeLastRemoved = allEdges.filter((edge) => edge.from === removedNodeIds[removedNodeIds.length - 1]);
        const edgeWillRemove = allEdges.filter((aEdge) => edgeLastRemoved.some((lEdge) => aEdge.to === lEdge.to));
        removedEages.push(...edgeWillRemove);
      }

      removedNodeIds.forEach((nodeID, idx) => {
        const info = allNodes.find((node) => node.nodeID === nodeID);
        if (!info) {
          throw new CircuitEmulatorServiceError(
            `Failed to generate emulator service client. Node not found: ${nodeID}`,
          );
        }

        const { type } = info;
        const inputsToNode = allEdges.filter((edge) => edge.to === nodeID).map((edge) => edge.from);
        const outputFromNode = allEdges.filter((edge) => edge.from === nodeID).map((edge) => edge.to);
        const executionOrder = ExecutionOrder.from(idx);

        const res = CircuitNode.from(nodeID, type, inputsToNode, outputFromNode, executionOrder, evalDelay);
        if (!res.ok) {
          throw new CircuitEmulatorServiceError(
            `Failed to generate emulator service client. Couldn't generate circuit nodes. NodeId: ${nodeID}, Type: ${type}`,
            {
              cause: res.error,
            },
          );
        }

        const node = res.value;
        node.init();
        circuitNodes.push(res.value);
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitEmulatorServiceError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitEmulatorServiceError("Unknown error occurred while generating circuit emulator service.", {
          cause: err,
        }),
      };
    }

    // Ascending order sorting by execution-order for ease of handling in other methods.
    return {
      ok: true,
      value: new CircuitEmulatorService([
        ...circuitNodes.sort((a, b) => a.getInformation().executionOrder - b.getInformation().executionOrder),
      ]),
    };
  }

  reset() {
    this.nodes.forEach((node) => {
      node.init();
    });
  }

  eval(entryInputs: InputRecord): Result<Map<CircuitNodeId, EvalResult>, CircuitEmulatorServiceError> {
    const outputMap = new Map<CircuitNodeId, EvalResult>([]);

    for (const [inputId, inputValue] of Object.entries(entryInputs)) {
      outputMap.set(CircuitNodeId.from(inputId), inputValue);
    }

    try {
      this.nodes.forEach((node) => {
        const info = node.getInformation();
        // Define self id as inputId if node type is ENTRY.
        const inputIds = info.type === "ENTRY" ? [info.id] : info.inputs.map((input) => CircuitNodeId.from(input));
        const inputRecord = this.createInputRecord(inputIds, outputMap);
        if (!inputRecord.ok) {
          throw new CircuitEmulatorServiceError(
            `Failed to evaluate circuit. Couldn't create input record for ${info.id}.`,
            {
              cause: inputRecord.error,
            },
          );
        }

        const res = node.eval(inputRecord.value);
        if (!res.ok) {
          throw new CircuitEmulatorServiceError(`Failed to evaluate circuit. Couldn't acquire output of ${info.id}.`, {
            cause: res.error,
          });
        }

        outputMap.set(info.id, res.value);
      });

      return { ok: true, value: outputMap };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitEmulatorServiceError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitEmulatorServiceError("Unknown error occurred while evaluating circuit.", { cause: err }),
      };
    }
  }

  getInfomationById(id: CircuitNodeId): Result<NodeInformation, CircuitEmulatorServiceError> {
    const node = this.nodes.find((node) => node.getInformation().id === id)?.getInformation();
    if (!node) {
      const err = new CircuitEmulatorServiceError(`Failed to get node information. Node not found: ${id}`);
      console.error(err);
      return {
        ok: false,
        error: err,
      };
    }

    return { ok: true, value: node };
  }

  private createInputRecord(
    inputIds: CircuitNodeId[],
    outputMap: Map<CircuitNodeId, EvalResult>,
  ): Result<InputRecord, CircuitEmulatorServiceError> {
    const inputRecord: InputRecord = InputRecord.from({});
    try {
      for (const inputId of inputIds) {
        const value = outputMap.get(inputId);
        switch (true) {
          // Default case
          case value !== undefined: {
            inputRecord[CircuitNodeInputId.from(inputId)] = value;
            break;
          }
          // In case of inout at the end of loop structure
          case value === undefined: {
            const nodeInfo = this.getInfomationById(inputId);
            if (!nodeInfo.ok) {
              throw new CircuitEmulatorServiceError(
                `Failed to evaluate circuit. Couldn't acquire output of ${inputId}.`,
                {
                  cause: nodeInfo.error,
                },
              );
            }

            const output = nodeInfo.value.lastOutput;
            inputRecord[CircuitNodeInputId.from(inputId)] = output;
            break;
          }
        }
      }

      return { ok: true, value: inputRecord };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitEmulatorServiceError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitEmulatorServiceError("Unknown error occurred while creating input record.", { cause: err }),
      };
    }
  }
}
