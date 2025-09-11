import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitId } from "../valueObject/circuitId";

export class CircuitDetailQueryServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitDetailQueryServiceError";
    this.cause = options?.cause;
  }
}

export interface ICircuitDetailQueryService {
  getById(id: CircuitId): Promise<Result<Circuit, CircuitDetailQueryServiceError>>;
}
