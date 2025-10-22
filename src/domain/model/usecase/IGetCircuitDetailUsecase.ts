import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { DataIntegrityError } from "../infrastructure/dataIntegrityError";
import type { InfraError } from "../infrastructure/infraError";
import type { UnexpectedError } from "../unexpectedError";
import type { CircuitId } from "../valueObject/circuitId";

export interface IGetCircuitDetailUsecase {
  getById(id: CircuitId): Promise<Result<Circuit, DataIntegrityError | InfraError | UnexpectedError>>;
}
