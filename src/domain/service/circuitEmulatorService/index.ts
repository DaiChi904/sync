import type { NodeInformation } from "@/domain/model/entity/nodeInfomation.type";
import type { ICircuitEmulatorService } from "@/domain/model/service/ICircuitEmulatorService";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodeInputId } from "@/domain/model/valueObject/circuitNodeInputId";
import type { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { EvalResult } from "@/domain/model/valueObject/evalResult";
import { ExecutionOrder } from "@/domain/model/valueObject/executionOrder";
import { InputRecord } from "@/domain/model/valueObject/inputRecord";
import { Phase } from "@/domain/model/valueObject/phase";
import { Tick } from "@/domain/model/valueObject/tick";
import { Attempt } from "@/utils/attempt";
import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "./../../model/entity/circuitGraphData";
import { CircuitNode } from "./circuitNode";

export class CircuitEmulatorServiceFromError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitEmulatorServiceFromError";
  }
}

export class CircuitEmulatorServiceEvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitEmulatorServiceEvalError";
  }
}

export class CircuitEmulatorServiceGetInfomationByIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitEmulatorServiceGetInfomationByIdError";
  }
}

export class CircuitEmulatorServiceReferIncomingInputs extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitEmulatorServiceReferIncomingInputs";
  }
}

export class CircuitEmulatorService implements ICircuitEmulatorService {
  private readonly nodes: CircuitNode[];

  private constructor(nodes: CircuitNode[]) {
    this.nodes = nodes;
  }

  static from(circuitGraphData: CircuitGraphData): Result<CircuitEmulatorService> {
    return Attempt.proceed(
      () => {
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

        // If I use "const node", VSCode recognize node as instance of CircuitNode for some reason. Therefore, I use destructuring to avoid this.
        for (const { nodeID, type } of allNodes) {
          const inputsToNode = allEdges.filter((edge) => edge.to === nodeID).map((edge) => edge.from);
          const outputFromNode = allEdges.filter((edge) => edge.from === nodeID).map((edge) => edge.to);

          const res = CircuitNode.from(nodeID, type, inputsToNode, outputFromNode);
          if (!res.ok) {
            throw new Attempt.Abort(
              "CircuitEmulatorService.from",
              `Failed to generate circuit nodes. NodeId: ${nodeID}, Type: ${type}`,
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
            throw new Attempt.Abort("CircuitEmulatorService.from", "Failed to assign execution orders.", {
              cause: new CircuitEmulatorServiceFromError(`Node not found: ${nodeID}`),
            });
          }

          target.setup(ExecutionOrder.from(idx + 1));
        });

        // Ascending order sorting by execution-order for ease of handling in other methods.
        return {
          ok: true,
          value: new CircuitEmulatorService([
            ...circuitNodes.sort((a, b) => a.getInformation().executionOrder - b.getInformation().executionOrder),
          ]),
        } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }

  setup(): Result<void> {
    return Attempt.proceed(
      () => {
        // Initialize the output in phase 0 until all EvalResults are stabilized to make it executable.
        const previousOutputs = new Map<CircuitNodeId, EvalResult>();
        let tick = 0;
        const tickLimit = this.nodes.length * 2;

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
                  throw new Attempt.Abort("CircuitEmulatorService.setup", "Failed to setup emulator service client.", {
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
                  throw new Attempt.Abort("CircuitEmulatorService.setup", "Failed to setup emulator service client.", {
                    cause: currentOutput.error,
                  });
                }

                previousOutputs.set(id, currentOutput.value);
                break;
              }
              default: {
                const incomingInputRecord = this.referIncomingInputs(id, Phase.from(0), Tick.from(tick));
                if (!incomingInputRecord.ok) {
                  throw new Attempt.Abort("CircuitEmulatorService.setup", "Failed to setup emulator service client.", {
                    cause: incomingInputRecord.error,
                  });
                }

                const currentOutput = node.eval(incomingInputRecord.value, Phase.from(0), Tick.from(tick));
                if (!currentOutput.ok) {
                  throw new Attempt.Abort("CircuitEmulatorService.setup", "Failed to setup emulator service client.", {
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

        return { ok: true, value: undefined } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }

  eval(entryInputs: InputRecord, phase: number): Result<void> {
    return Attempt.proceed(
      () => {
        const previousOutputs = new Map<CircuitNodeId, EvalResult>();
        let tick = 0;
        const tickLimit = this.nodes.length * 2;

        while (true) {
          let isAllOutputsStable = true;
          for (const node of this.nodes) {
            const { id, type } = node.getInformation();

            switch (type) {
              case "ENTRY": {
                const currentOutput = node.eval(entryInputs, Phase.from(phase), Tick.from(tick));
                if (!currentOutput.ok) {
                  throw new Attempt.Abort("CircuitEmulatorService.eval", "Failed to evaluate node.", {
                    cause: currentOutput.error,
                  });
                }

                previousOutputs.set(id, currentOutput.value);
                break;
              }
              default: {
                const incomingInputRecord = this.referIncomingInputs(id, Phase.from(phase), Tick.from(tick));
                if (!incomingInputRecord.ok) {
                  throw new Attempt.Abort(
                    "CircuitEmulatorService.eval",
                    `Failed to refer incoming inputs of node. NodeId: ${id}`,
                    {
                      cause: incomingInputRecord.error,
                    },
                  );
                }

                const currentOutput = node.eval(incomingInputRecord.value, Phase.from(phase), Tick.from(tick));
                if (!currentOutput.ok) {
                  throw new Attempt.Abort("CircuitEmulatorService.eval", "Failed to evaluate node.", {
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

        return { ok: true, value: undefined } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }

  getInfomationById(id: CircuitNodeId): Result<NodeInformation> {
    return Attempt.proceed(
      () => {
        const node = this.nodes.find((node) => node.getInformation().id === id)?.getInformation();
        if (!node) {
          throw new Attempt.Abort("CircuitEmulatorService.getInfomationById", "Failed to get node information.", {
            cause: new CircuitEmulatorServiceGetInfomationByIdError(`Node not found: ${id}`),
          });
        }

        return { ok: true, value: node } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }

  private referIncomingInputs(nodeID: CircuitNodeId, currentPhase: Phase, currentTick: Tick): Result<InputRecord> {
    return Attempt.proceed(
      () => {
        const inputRecord = InputRecord.from({});

        const isFirstTick = currentTick === 0;

        const node = this.nodes.find((node) => node.getInformation().id === nodeID);
        if (!node) {
          throw new Attempt.Abort("CircuitEmulatorService.referIncomingInputs", "Failed to refer incoming inputs.", {
            cause: new CircuitEmulatorServiceReferIncomingInputs(`Node not found: ${nodeID}`),
          });
        }

        const { type, inputs } = node.getInformation();
        if (type === "ENTRY") {
          throw new Attempt.Abort("CircuitEmulatorService.referIncomingInputs", "Failed to refer incoming inputs.", {
            cause: new CircuitEmulatorServiceReferIncomingInputs(
              "Invalid usage. This method is not intended to be used for ENTRY nodes.",
            ),
          });
        }

        for (const input of inputs) {
          const target = this.nodes.find((node) => node.getInformation().id === input);
          const targetInfo = target?.getInformation();
          if (!targetInfo) {
            throw new Attempt.Abort("CircuitEmulatorService.referIncomingInputs", "Failed to refer incoming inputs.", {
              cause: new CircuitEmulatorServiceReferIncomingInputs(`Target node not found. NodeId: ${input}`),
            });
          }

          switch (true) {
            case targetInfo.history.get(currentPhase)?.get(currentTick) === undefined && isFirstTick === true: {
              const source = targetInfo.history.get(Phase.from(currentPhase - 1))?.entries();
              if (!source) {
                throw new Attempt.Abort(
                  "CircuitEmulatorService.referIncomingInputs",
                  "Failed to refer incoming inputs.",
                  {
                    cause: new CircuitEmulatorServiceReferIncomingInputs(
                      `No history found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
                    ),
                  },
                );
              }

              const output = Array.from(source).at(-1);
              if (output === undefined) {
                throw new Attempt.Abort(
                  "CircuitEmulatorService.referIncomingInputs",
                  "Failed to refer incoming inputs.",
                  {
                    cause: new CircuitEmulatorServiceReferIncomingInputs(
                      `No output found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
                    ),
                  },
                );
              }

              inputRecord[CircuitNodeInputId.from(targetInfo.id)] = output[1];
              break;
            }
            case targetInfo.history.get(currentPhase)?.get(currentTick) === undefined && isFirstTick === false: {
              const output = targetInfo.history.get(currentPhase)?.get(Tick.from(currentTick - 1));
              if (output === undefined) {
                throw new Attempt.Abort(
                  "CircuitEmulatorService.referIncomingInputs",
                  "Failed to refer incoming inputs.",
                  {
                    cause: new CircuitEmulatorServiceReferIncomingInputs(
                      `No output found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
                    ),
                  },
                );
              }

              inputRecord[CircuitNodeInputId.from(targetInfo.id)] = output;
              break;
            }
            // The above two cases are applied to nodes which receive inputs from a feedback loop.
            default: {
              const output = targetInfo.history.get(currentPhase)?.get(currentTick);
              if (output === undefined) {
                throw new Attempt.Abort(
                  "CircuitEmulatorService.referIncomingInputs",
                  "Failed to refer incoming inputs.",
                  {
                    cause: new CircuitEmulatorServiceReferIncomingInputs(
                      `No output found for node: ${nodeID}, phase: ${currentPhase - 1}, tick: ${currentTick}`,
                    ),
                  },
                );
              }

              inputRecord[CircuitNodeInputId.from(targetInfo.id)] = output;
              break;
            }
          }
        }

        return { ok: true, value: inputRecord } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }
}
