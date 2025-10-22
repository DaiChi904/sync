import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { DataIntegrityError } from "../infrastructure/dataIntegrityError";
import type { InfraError } from "../infrastructure/infraError";
import type { CircuitNotFoundError, InvalidSaveMethodError } from "../infrastructure/repository/ICircuitRepository";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitData } from "../valueObject/circuitData";
import type { CircuitId } from "../valueObject/circuitId";

export class CircuitDataValidationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitDataValidationError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEditorUsecase {
  add(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  >;
  save(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  >;
  delete(
    id: CircuitId,
  ): Promise<Result<void, DataIntegrityError | InfraError | CircuitNotFoundError | UnexpectedError>>;
  isValidData(circuit: CircuitData): Result<void, CircuitDataValidationError | UnexpectedError>;
}
