import type { Result } from "@/utils/result";
import type { CircuitOverview } from "../entity/circuitOverview";
import type { DataIntegrityError } from "../infrastructure/dataIntegrityError";
import type { InfraError } from "../infrastructure/infraError";
import type { UnexpectedError } from "../unexpectedError";

export interface IGetCircuitOverviewsUsecase {
  getOverviews(): Promise<Result<Array<CircuitOverview>, DataIntegrityError | InfraError | UnexpectedError>>;
}
