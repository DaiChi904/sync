import type { Result } from "@/utils/result";
import type { CircuitOverview } from "../entity/circuitOverview";

export class GetCircuitOverviewsUsecaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "GetCircuitOverviewsUsecaseError";
    this.cause = options?.cause;
  }
}

export interface IGetCircuitOverviewsUsecase {
  getOverviews(): Promise<Result<Array<CircuitOverview>, GetCircuitOverviewsUsecaseError>>;
}
