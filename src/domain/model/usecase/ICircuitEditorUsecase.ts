import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitData } from "../valueObject/circuitData";
import type { CircuitId } from "../valueObject/circuitId";

export interface ICircuitEditorUsecase {
  add(newCircuit: Circuit): Promise<Result<void>>;
  save(newCircuit: Circuit): Promise<Result<void>>;
  delete(id: CircuitId): Promise<Result<void>>;
  isValidData(circuit: CircuitData): Result<void>;
}
