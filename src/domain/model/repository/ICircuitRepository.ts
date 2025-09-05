import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitId } from "../valueObject/circuitId";

export class CircuitRepositoryError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitRepositoryError";
    this.cause = options?.cause;
  }
}

export interface ICircuitRepository {
  getAll: () => Promise<Result<Array<Circuit>, CircuitRepositoryError>>;
  getById: (id: CircuitId) => Promise<Result<Circuit, CircuitRepositoryError>>;
  save: (method: "ADD" | "UPDATE", circuit: Circuit) => Promise<Result<void, CircuitRepositoryError>>;
  delete: (id: CircuitId) => Promise<Result<void, CircuitRepositoryError>>;
}
