import type { Result } from "@/utils/result";
import type { Circuit } from "../../aggregate/circuit";
import type { UnexpectedError } from "../../unexpectedError";
import type { CircuitId } from "../../valueObject/circuitId";
import type { DataIntegrityError } from "../dataIntegrityError";
import type { InfraError } from "../infraError";

export interface ICircuitDetailQueryService {
  getById(id: CircuitId): Promise<Result<Circuit, DataIntegrityError | InfraError | UnexpectedError>>;
}
