import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type { CircuitNotFoundError } from "@/domain/model/infrastructure/repository/ICircuitRepository";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { Result } from "@/utils/result";

export interface IDeleteCircuitUsecase {
  execute(
    id: CircuitId,
  ): Promise<Result<void, DataIntegrityError | InfraError | CircuitNotFoundError | UnexpectedError>>;
}
