import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitData } from "../valueObject/circuitData";
import type { CircuitId } from "../valueObject/circuitId";

export class CircuitEditorUsecaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEditorUsecaseError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEditorUsecase {
  add(newCircuit: Circuit): Promise<Result<void, CircuitEditorUsecaseError>>;
  save(newCircuit: Circuit): Promise<Result<void, CircuitEditorUsecaseError>>;
  delete(id: CircuitId): Promise<Result<void, CircuitEditorUsecaseError>>;
  isValidData(circuit: CircuitData): Result<void, CircuitEditorUsecaseError>;
}
