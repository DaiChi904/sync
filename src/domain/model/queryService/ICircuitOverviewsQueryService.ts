import type { Result } from "@/utils/result";
import type { CircuitDescription } from "../valueObject/circuitDescription";
import type { CircuitId } from "../valueObject/circuitId";
import type { CircuitTitle } from "../valueObject/circuitTitle";
import type { CreatedDateTime } from "../valueObject/createdDateTime";
import type { UpdatedDateTime } from "../valueObject/updatedDateTime";

export type CircuitOverviewsQueryServiceGetAllOutput = Result<
  Array<{
    readonly id: CircuitId;
    readonly title: CircuitTitle;
    readonly description: CircuitDescription;
    readonly createdAt: CreatedDateTime;
    readonly updatedAt: UpdatedDateTime;
  }>
>;

export interface ICircuitOverviewsQueryService {
  getAll(): Promise<CircuitOverviewsQueryServiceGetAllOutput>;
}
