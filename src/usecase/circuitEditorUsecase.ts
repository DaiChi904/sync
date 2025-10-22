import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type {
  CircuitNotFoundError,
  ICircuitRepository,
  InvalidSaveMethodError,
} from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import { UnexpectedError } from "@/domain/model/unexpectedError";
import { CircuitDataValidationError, type ICircuitEditorUsecase } from "@/domain/model/usecase/ICircuitEditorUsecase";
import type { CircuitData } from "@/domain/model/valueObject/circuitData";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Result } from "@/utils/result";

interface CircuitEditorUsecaseDependencies {
  circuitRepository: ICircuitRepository;
  circuitParserService: ICircuitParserService;
}

export class CircuitEditorUsecase implements ICircuitEditorUsecase {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitEditorUsecaseDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async add(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  > {
    return await this.circuitRepository.save("ADD", newCircuit);
  }

  async save(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  > {
    return await this.circuitRepository.save("UPDATE", newCircuit);
  }

  async delete(
    id: CircuitId,
  ): Promise<Result<void, DataIntegrityError | InfraError | CircuitNotFoundError | UnexpectedError>> {
    return await this.circuitRepository.delete(id);
  }

  isValidData(circuit: CircuitData): Result<void, CircuitDataValidationError | UnexpectedError> {
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

    try {
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
        throw new CircuitDataValidationError("Detected invalid data.");
      }

      return { ok: true, value: undefined };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof CircuitDataValidationError: {
          const messages = Object.entries(flags)
            .filter(([_, value]) => value)
            .map(([key]) => key);

          return {
            ok: false,
            error: new CircuitDataValidationError(`${messages.join(",\n")}.`, { cause: err }),
          };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
