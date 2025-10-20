import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { UnexpectedError } from "../UnexpectedError";
import type { CircuitId } from "../valueObject/circuitId";

export class CircuitNotFoundError extends Error {
  constructor(id: CircuitId, options?: { cause?: unknown }) {
    super(`Circuit with id ${id} was not found.`, options);
    this.name = "CircuitNotFoundError";
  }
}

export class CircuitInfraError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CircuitInfraError";
  }
}

export class CircuitDataIntegrityError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CircuitDataIntegrityError";
  }
}

export class InvalidSaveMethodError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "InvalidSaveMethodError";
  }
}

export interface ICircuitRepository {
  getAll: () => Promise<Result<Array<Circuit>, CircuitInfraError | CircuitDataIntegrityError | UnexpectedError>>;
  getById: (
    id: CircuitId,
  ) => Promise<Result<Circuit, CircuitNotFoundError | CircuitInfraError | CircuitDataIntegrityError | UnexpectedError>>;
  save: (
    method: "ADD" | "UPDATE",
    circuit: Circuit,
  ) => Promise<
    Result<
      void,
      CircuitNotFoundError | CircuitInfraError | CircuitDataIntegrityError | InvalidSaveMethodError | UnexpectedError
    >
  >;
  delete: (
    id: CircuitId,
  ) => Promise<Result<void, CircuitNotFoundError | CircuitInfraError | CircuitDataIntegrityError | UnexpectedError>>;
}
