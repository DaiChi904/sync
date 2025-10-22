import type { Result } from "@/utils/result";
import type { Circuit } from "../../aggregate/circuit";
import type { UnexpectedError } from "../../unexpectedError";
import type { CircuitId } from "../../valueObject/circuitId";
import type { DataIntegrityError } from "../dataIntegrityError";
import type { InfraError } from "../infraError";

export class CircuitNotFoundError extends Error {
  constructor(id: CircuitId, options?: { cause?: unknown }) {
    super(`Circuit with id ${id} was not found.`, options);
    this.name = "CircuitNotFoundError";
  }
}

export class InvalidSaveMethodError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "InvalidSaveMethodError";
  }
}

export interface ICircuitRepository {
  getAll: () => Promise<Result<Array<Circuit>, InfraError | DataIntegrityError | UnexpectedError>>;
  getById: (
    id: CircuitId,
  ) => Promise<Result<Circuit, CircuitNotFoundError | InfraError | DataIntegrityError | UnexpectedError>>;
  save: (
    method: "ADD" | "UPDATE",
    circuit: Circuit,
  ) => Promise<
    Result<void, CircuitNotFoundError | InfraError | DataIntegrityError | InvalidSaveMethodError | UnexpectedError>
  >;
  delete: (
    id: CircuitId,
  ) => Promise<Result<void, CircuitNotFoundError | InfraError | DataIntegrityError | UnexpectedError>>;
}
