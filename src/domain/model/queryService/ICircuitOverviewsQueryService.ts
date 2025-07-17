import type { Result } from "@/utils/result";
import type { CircuitOverview } from "../entity/circuitOverview";

export type CircuitOverviewsQueryServiceGetAllOutput = Result<Array<Readonly<CircuitOverview>>>;

export interface ICircuitOverviewsQueryService {
  getAll(): Promise<CircuitOverviewsQueryServiceGetAllOutput>;
}
