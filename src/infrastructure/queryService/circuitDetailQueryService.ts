import type { Circuit } from "@/domain/model/aggregate/circuit";
import { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import { InfraError } from "@/domain/model/infrastructure/infraError";
import type { ICircuitDetailQueryService } from "@/domain/model/infrastructure/queryService/ICircuitDetailQueryService";
import type { ICircuitRepository } from "@/domain/model/infrastructure/repository/ICircuitRepository";
import { ModelValidationError } from "@/domain/model/modelValidationError";
import { UnexpectedError } from "@/domain/model/unexpectedError";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { Result } from "@/utils/result";

interface CircuitDetailQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitDetailQueryService implements ICircuitDetailQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitDetailQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getById(id: CircuitId): Promise<Result<Circuit, DataIntegrityError | InfraError | UnexpectedError>> {
    const res = await this.circuitRepository.getById(id);
    if (!res.ok) {
      const err = res.error;
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError: {
          const dataIntegrityError = new DataIntegrityError("Circuit data corrupted.", { cause: err });
          return {
            ok: false,
            error: dataIntegrityError,
          };
        }
        case err instanceof DataIntegrityError: {
          return { ok: false, error: err };
        }
        case err instanceof InfraError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }

    return {
      ok: true,
      value: res.value,
    };
  }
}
