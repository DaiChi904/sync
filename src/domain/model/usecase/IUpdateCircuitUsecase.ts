import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type {
  CircuitNotFoundError,
  InvalidSaveMethodError,
} from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { Result } from "@/utils/result";

export interface IUpdateCircuitUsecase {
  execute(
    newCircuit: Circuit,
  ): Promise<
    Result<void, DataIntegrityError | InfraError | InvalidSaveMethodError | CircuitNotFoundError | UnexpectedError>
  >;
}
