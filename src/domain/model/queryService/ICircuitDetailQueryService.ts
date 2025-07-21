import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitId } from "../valueObject/circuitId";

export type CircuitDetailQueryServiceGetByIdOutput = Result<Readonly<Circuit>>;

export interface ICircuitDetailQueryService {
  getById(id: CircuitId): Promise<CircuitDetailQueryServiceGetByIdOutput>;
}
