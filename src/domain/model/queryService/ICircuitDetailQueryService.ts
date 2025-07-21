import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitOverview } from "../entity/circuitOverview";
import type { CircuitId } from "../valueObject/circuitId";

export type CircuitDetailQueryServiceGetByIdOutput = Result<
  Readonly<{ circuitOverview: CircuitOverview; guiData: CircuitGuiData; graphData: CircuitGraphData }>
>;

export interface ICircuitDetailQueryService {
  getById(id: CircuitId): Promise<CircuitDetailQueryServiceGetByIdOutput>;
}
