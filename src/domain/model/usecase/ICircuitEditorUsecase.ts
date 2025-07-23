import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";

export interface ICircuitEditorUsecase {
  save(newCircuit: Circuit): Promise<Result<void>>;
}
