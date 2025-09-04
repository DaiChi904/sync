import type { NodeInformation } from "@/domain/model/entity/nodeInfomation.type";
import {
  CircuitEmulatorServiceError,
  type ICircuitEmulatorService,
} from "@/domain/model/service/ICircuitEmulatorService";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodeInputId } from "@/domain/model/valueObject/circuitNodeInputId";
import type { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import { ExecutionOrder } from "@/domain/model/valueObject/executionOrder";
import { InputRecord } from "@/domain/model/valueObject/inputRecord";
import { Phase } from "@/domain/model/valueObject/phase";
import { Tick } from "@/domain/model/valueObject/tick";
import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "./../../model/entity/circuitGraphData";
import { CircuitNode } from "./circuitNode";

export class CircuitEmulatorService implements ICircuitEmulatorService {
  private readonly nodes: CircuitNode[];

  private constructor(nodes: CircuitNode[]) {
    this.nodes = nodes;
  }

  static from(circuitGraphData: CircuitGraphData): Result<CircuitEmulatorService, CircuitEmulatorServiceError> {
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
      // If I use "const node", VSCode recognize node as instance of CircuitNode for some reason. Therefore, I use destructuring to avoid this.
      for (const { nodeID, type } of allNodes) {
        const inputsToNode = allEdges.filter((edge) => edge.to === nodeID).map((edge) => edge.from);
        const outputFromNode = allEdges.filter((edge) => edge.from === nodeID).map((edge) => edge.to);

        const res = CircuitNode.from(nodeID, type, inputsToNode, outputFromNode);
        if (!res.ok) {
          throw new CircuitEmulatorServiceError(
            `Failed to generate emulator service client. Couldn't generate circuit nodes. NodeId: ${nodeID}, Type: ${type}`,
            {
              cause: res.error,
            },
          );
        }

        circuitNodes.push(res.value);
      }

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

      // Assign execution order in the order of nodes removed.
      removedNodeIds.forEach((nodeID, idx) => {
        const target = circuitNodes.find((node) => node.getInformation().id === nodeID);
        if (!target) {
          throw new CircuitEmulatorServiceError(
            `Failed to generate emulator service client. Couldn't assign execution orders. Node not found: ${nodeID}`,
          );
        }

        target.setup(ExecutionOrder.from(idx + 1));
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

  setup(): Result<void, CircuitEmulatorServiceError> {
    // Initialize the output in phase 0 until all EvalResults are stabilized to make it executable.
    const previousOutputs = new Map<CircuitNodeId, EvalResult>();
    let tick = 0;
    const tickLimit = this.nodes.length * 2;

    try {
      while (true) {
        let isAllOutputsStable = true;
        for (const node of this.nodes) {
          const { id, type, inputs } = node.getInformation();

          switch (true) {
            case type === "ENTRY": {
              // As ENTRY does not have inputs by specification, it processes differently.
              const entryInputRecord = InputRecord.from({});
              for (const input of inputs) {
                // Give false to all inputs of ENTRY node by its Id.
                entryInputRecord[CircuitNodeInputId.from(input)] = EvalResult.from(false);
              }

              const currentOutput = node.eval(entryInputRecord, Phase.from(0), Tick.from(tick));
              if (!currentOutput.ok) {
                throw new CircuitEmulatorServiceError("Failed to setup emulator service client.", {
                  cause: currentOutput.error,
                });
              }

              previousOutputs.set(id, currentOutput.value);
              break;
            }
            case tick === 0: {
              // As referIncomingInputs cannot be used when tick is 0, this is handled as an exception.
              const inputRecord = InputRecord.from({});

              for (const input of inputs) {
                inputRecord[CircuitNodeInputId.from(input)] = EvalResult.from(previousOutputs.get(input) ?? false);
              }

              const currentOutput = node.eval(inputRecord, Phase.from(0), Tick.from(tick));
              if (!currentOutput.ok) {
                throw new CircuitEmulatorServiceError("Failed to setup emulator service client.", {
                  cause: currentOutput.error,
                });
              }

              previousOutputs.set(id, currentOutput.value);
              break;
            }
            default: {
              const incomingInputRecord = this.referIncomingInputs(id, Phase.from(0), Tick.from(tick));
              if (!incomingInputRecord.ok) {
                throw new CircuitEmulatorServiceError("Failed to setup emulator service client.", {
                  cause: incomingInputRecord.error,
                });
              }

              const currentOutput = node.eval(incomingInputRecord.value, Phase.from(0), Tick.from(tick));
              if (!currentOutput.ok) {
                throw new CircuitEmulatorServiceError("Failed to setup emulator service client.", {
                  cause: currentOutput.error,
                });
              }

              if (currentOutput.value !== previousOutputs.get(id)) {
                isAllOutputsStable = false;
              }
              previousOutputs.set(id, currentOutput.value);
              break;
            }
          }
        }
        if (tick > tickLimit || (isAllOutputsStable && tick !== 0)) {
          break;
        }
        tick++;
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitEmulatorServiceError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitEmulatorServiceError("Unknown error occurred while setting up emulator service client.", {
          cause: err,
        }),
      };
    }

    return { ok: true, value: undefined };
  }

  eval(entryInputs: InputRecord, phase: number): Result<void, CircuitEmulatorServiceError> {
    const previousOutputs = new Map<CircuitNodeId, EvalResult>();
    let tick = 0;
    const tickLimit = this.nodes.length * 2;

    try {
      while (true) {
        let isAllOutputsStable = true;
        for (const node of this.nodes) {
          const { id, type } = node.getInformation();

          switch (type) {
            case "ENTRY": {
              const currentOutput = node.eval(entryInputs, Phase.from(phase), Tick.from(tick));
              if (!currentOutput.ok) {
                throw new CircuitEmulatorServiceError(`Failed to evaluate circuit. Couldn't acquire output of ${id}.`, {
                  cause: currentOutput.error,
                });
              }

              previousOutputs.set(id, currentOutput.value);
              break;
            }
            default: {
              const incomingInputRecord = this.referIncomingInputs(id, Phase.from(phase), Tick.from(tick));
              if (!incomingInputRecord.ok) {
                throw new CircuitEmulatorServiceError(
                  `Failed to evaluate circuit. Couldn't refer incoming inputs of ${id}.`,
                  {
                    cause: incomingInputRecord.error,
                  },
                );
              }

              const currentOutput = node.eval(incomingInputRecord.value, Phase.from(phase), Tick.from(tick));
              if (!currentOutput.ok) {
                throw new CircuitEmulatorServiceError(`Failed to evaluate circuit. Couldn't acquire output of ${id}.`, {
                  cause: currentOutput.error,
                });
              }

              if (currentOutput.value !== previousOutputs.get(id)) {
                isAllOutputsStable = false;
              }
              previousOutputs.set(id, currentOutput.value);
              break;
            }
          }
        }
        if (tick > tickLimit || isAllOutputsStable) {
          break;
        }
        tick++;
      }
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

    return { ok: true, value: undefined };
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

  private referIncomingInputs(
    nodeID: CircuitNodeId,
    currentPhase: Phase,
    currentTick: Tick,
  ): Result<InputRecord, CircuitEmulatorServiceError> {
    const inputRecord = InputRecord.from({});

    const isFirstTick = currentTick === 0;

    try {
      const node = this.nodes.find((node) => node.getInformation().id === nodeID);
      if (!node) {
        throw new CircuitEmulatorServiceError(`Failed to refer incoming inputs. Node not found: ${nodeID}`);
      }

      const { type, inputs } = node.getInformation();
      if (type === "ENTRY") {
        throw new CircuitEmulatorServiceError(
          "Failed to refer incoming inputs because of invalid usage This method is not intended to be used for ENTRY nodes.",
        );
      }

      for (const input of inputs) {
        const target = this.nodes.find((node) => node.getInformation().id === input);
        const targetInfo = target?.getInformation();
        if (!targetInfo) {
          throw new CircuitEmulatorServiceError(
            `Failed to refer incoming inputs. Target node not found. NodeId: ${input}`,
          );
        }

        switch (true) {
          case targetInfo.history.get(currentPhase)?.get(currentTick) === undefined && isFirstTick === true: {
            const source = targetInfo.history.get(Phase.from(currentPhase - 1))?.entries();
            if (!source) {
              throw new CircuitEmulatorServiceError(
                `Failed to refer incoming inputs. No history found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
              );
            }

            const output = Array.from(source).at(-1);
            if (output === undefined) {
              throw new CircuitEmulatorServiceError(
                `Failed to refer incoming inputs. No output found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
              );
            }

            inputRecord[CircuitNodeInputId.from(targetInfo.id)] = output[1];
            break;
          }
          case targetInfo.history.get(currentPhase)?.get(currentTick) === undefined && isFirstTick === false: {
            const output = targetInfo.history.get(currentPhase)?.get(Tick.from(currentTick - 1));
            if (output === undefined) {
              throw new CircuitEmulatorServiceError(
                `Failed to refer incoming inputs. No output found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
              );
            }

            inputRecord[CircuitNodeInputId.from(targetInfo.id)] = output;
            break;
          }
          // The above two cases are applied to nodes which receive inputs from a feedback loop.
          default: {
            const output = targetInfo.history.get(currentPhase)?.get(currentTick);
            if (output === undefined) {
              throw new CircuitEmulatorServiceError(
                `Failed to refer incoming inputs. No output found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
              );
            }

            inputRecord[CircuitNodeInputId.from(targetInfo.id)] = output;
            break;
          }
        }
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitEmulatorServiceError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitEmulatorServiceError("Unknown error occurred while refering incoming inputs.", {
          cause: err,
        }),
      };
    }

    return { ok: true, value: inputRecord };
  }
}
