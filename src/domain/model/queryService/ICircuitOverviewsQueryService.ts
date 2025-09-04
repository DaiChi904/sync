import type { Result } from "@/utils/result";
import type { CircuitOverview } from "../entity/circuitOverview";

export class CircuitOverviewsQueryServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitOverviewsQueryServiceError";
    this.cause = options?.cause;
  }
}

export interface ICircuitOverviewsQueryService {
  getAll(): Promise<Result<Array<CircuitOverview>, CircuitOverviewsQueryServiceError>>;
}
