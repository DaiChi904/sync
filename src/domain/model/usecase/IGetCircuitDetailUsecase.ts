import type { Result } from "@/utils/result";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitOverview } from "../entity/circuitOverview";
import type { CircuitId } from "../valueObject/circuitId";

export type IGetCircuitDetailUsecaseGetByIdOutput = Result<
  Readonly<{ circuitOverview: CircuitOverview; guiData: CircuitGuiData }>
>;

export interface IGetCircuitDetailUsecase {
  getById(id: CircuitId): Promise<IGetCircuitDetailUsecaseGetByIdOutput>;
}
