import type { Result } from "@/utils/result";
import type { CircuitOverview } from "../entity/circuitOverview";

export type IGetCircuitOverviewsUsecaseGetOverviewsOutput = Result<Array<Readonly<CircuitOverview>>>;

export interface IGetCircuitOverviewsUsecase {
  getOverviews(): Promise<IGetCircuitOverviewsUsecaseGetOverviewsOutput>;
}
