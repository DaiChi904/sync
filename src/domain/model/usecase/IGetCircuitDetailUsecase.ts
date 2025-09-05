import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitId } from "../valueObject/circuitId";

export class GetCircuitDetailUsecaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "GetCircuitDetailUsecaseError";
    this.cause = options?.cause;
  }
}

export interface IGetCircuitDetailUsecase {
  getById(id: CircuitId): Promise<Result<Circuit, GetCircuitDetailUsecaseError>>;
}
