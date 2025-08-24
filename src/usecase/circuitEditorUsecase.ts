import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { ICircuitEditorUsecase } from "@/domain/model/usecase/ICircuitEditorUsecase";
import type { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import { Attempt } from "@/utils/attempt";
import type { Result } from "@/utils/result";

interface CircuitEditorUsecaseDependencies {
  circuitRepository: ICircuitRepository;
  circuitParserService: ICircuitParserService;
}

export class CircuitEditorUsecaseGenerateNewCircuitDataError extends Error {
  constructor(message: string, options?: { cause: unknown }) {
    super(message);
    this.cause = options?.cause;
    this.name = "CircuitEditorUsecaseGenerateNewCircuitDataError";
  }
}

export class CircuitEditorUsecase implements ICircuitEditorUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitEditorUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async add(newCircuit: Circuit): Promise<Result<void>> {
    return await Attempt.asyncProceed(
      async () => {
        const res = await this.circuitRepository.save("ADD", newCircuit);
        if (!res.ok) {
          throw new Attempt.Abort("CircuitEditorUsecase.add", "Failed to add circuit.", { cause: res.error });
        }

        return { ok: true, value: undefined } as const;
      },
      (err: unknown) => {
        return {
          ok: false,
          error: err,
        } as const;
      },
    );
  }

  async save(newCircuit: Circuit): Promise<Result<void>> {
    return await Attempt.asyncProceed(
      async () => {
        const res = await this.circuitRepository.save("UPDATE", newCircuit);
        if (!res.ok) {
          throw new Attempt.Abort("CircuitEditorUsecase.save", "Failed to save circuit.", { cause: res.error });
        }

        return { ok: true, value: undefined } as const;
      },
      (err: unknown) => {
        return {
          ok: false,
          error: err,
        } as const;
      },
    );
  }

  async delete(id: CircuitId): Promise<Result<void>> {
    return await Attempt.asyncProceed(
      async () => {
        const res = await this.circuitRepository.delete(id);
        if (!res.ok) {
          throw new Attempt.Abort("CircuitEditorUsecase.delete", "Failed to delete circuit.", { cause: res.error });
        }

        return { ok: true, value: undefined } as const;
      },
      (err: unknown) => {
        return {
          ok: false,
          error: err,
        } as const;
      },
    );
  }

  isValidData(circuit: CircuitData): Result<void> {
    const flags = {
      foundDuplicatedNodeId: false,
      foundDuplicatedEdgeId: false,
      foundDuplicatedNodePinId: false,
      foundDuplicatedEdge: false,
      foundSelfLoopConnection: false,
      foundDuplicatedNodePinKind: false,
    };

    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();
    const nodePinIds = new Set<string>();
    const nodePinDict = new Map<CircuitNodePinId, [CircuitNodeId, "input" | "output"]>();

    const { nodes, edges } = circuit;

    return Attempt.proceed(
      () => {
        for (const node of nodes) {
          if (nodeIds.has(node.id)) {
            flags.foundDuplicatedNodeId = true;
          }
          nodeIds.add(node.id);

          for (const inputPin of node.inputs) {
            if (nodePinIds.has(inputPin)) {
              flags.foundDuplicatedNodePinId = true;
            }
            nodePinIds.add(inputPin);
            nodePinDict.set(inputPin, [node.id, "input"]);
          }

          for (const outputPin of node.outputs) {
            if (nodePinIds.has(outputPin)) {
              flags.foundDuplicatedNodePinId = true;
            }
            nodePinIds.add(outputPin);
            nodePinDict.set(outputPin, [node.id, "output"]);
          }
        }

        for (const edge of edges) {
          if (edgeIds.has(edge.id)) {
            flags.foundDuplicatedEdgeId = true;
          }
          edgeIds.add(edge.id);

          if (edge.from === edge.to) {
            flags.foundSelfLoopConnection = true;
          }

          const from = nodePinDict.get(edge.from);
          const to = nodePinDict.get(edge.to);
          if (from && to && from[0] === to[0]) {
            flags.foundSelfLoopConnection = true;
          }

          if (from && to && from[1] === to[1]) {
            flags.foundDuplicatedNodePinKind = true;
          }

          const existingEdge = edges.find((e) => e.from === edge.from && e.to === edge.to);
          if (existingEdge && existingEdge.id !== edge.id) {
            flags.foundDuplicatedEdge = true;
          }
        }

        if (Object.entries(flags).some(([_, value]) => value)) {
          throw new Attempt.Abort("CircuitEditorUsecase.isValidData", "Invalid data.");
        }

        return { ok: true, value: undefined } as const;
      },
      (err: unknown) => {
        if (err instanceof Attempt.Abort) {
          const messages = Object.entries(flags)
            .filter(([_, value]) => value)
            .map(([key]) => key);

          return {
            ok: false,
            error: new CircuitEditorUsecaseGenerateNewCircuitDataError(`${messages.join(", ")}.`, { cause: err }),
          } as const;
        }

        return {
          ok: false,
          error: err,
        } as const;
      },
    );
  }
}
