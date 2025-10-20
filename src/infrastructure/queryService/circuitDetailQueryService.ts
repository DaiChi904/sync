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
        case err instanceof ModelValidationError:
        case err instanceof DataIntegrityError: {
          const dataIntegrityErrorCause = err;
          return {
            ok: false,
            error: new DataIntegrityError("Circuit data corrupted.", { cause: dataIntegrityErrorCause }),
          };
        }
        case err instanceof InfraError: {
          const infraErrorCause = err;
          return {
            ok: false,
            error: new InfraError("Acquisition of circuit overviews failed.", { cause: infraErrorCause }),
          };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err }, "Acquisition of circuit overviews failed.");
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
