import type { Result } from "@/utils/result";
import type { CircuitOverview } from "../../entity/circuitOverview";
import type { UnexpectedError } from "../../unexpectedError";
import type { DataIntegrityError } from "../dataIntegrityError";
import type { InfraError } from "../infraError";

export interface ICircuitOverviewsQueryService {
  getAll(): Promise<Result<Array<CircuitOverview>, DataIntegrityError | InfraError | UnexpectedError>>;
}
