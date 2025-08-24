import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitData } from "../valueObject/circuitData";

export interface ICircuitEditorUsecase {
  add(newCircuit: Circuit): Promise<Result<void>>;
  save(newCircuit: Circuit): Promise<Result<void>>;
  isValidData(circuit: CircuitData): Result<void>;
}
