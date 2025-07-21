import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitId } from "../valueObject/circuitId";

export type IGetCircuitDetailUsecaseGetByIdOutput = Result<Readonly<Circuit>>;

export interface IGetCircuitDetailUsecase {
  getById(id: CircuitId): Promise<IGetCircuitDetailUsecaseGetByIdOutput>;
}
