import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import { InfraError } from "@/domain/model/infrastructure/infraError";
import type { ICircuitOverviewsQueryService } from "@/domain/model/infrastructure/queryService/ICircuitOverviewsQueryService";
import type { ICircuitRepository } from "@/domain/model/infrastructure/repository/ICircuitRepository";
import { ModelValidationError } from "@/domain/model/modelValidationError";
import { UnexpectedError } from "@/domain/model/unexpectedError";
import type { Result } from "@/utils/result";

interface CircuitOverviewsQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitOverviewsQueryService implements ICircuitOverviewsQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitOverviewsQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getAll(): Promise<Result<Array<CircuitOverview>, InfraError | DataIntegrityError | UnexpectedError>> {
    try {
      const res = await this.circuitRepository.getAll();
      if (!res.ok) {
        throw res.error;
      }

      const rawCircuits = res.value;
      const circuitOverviews =
        rawCircuits?.map((circuit) =>
          CircuitOverview.from({
            id: circuit.id,
            title: circuit.title,
            description: circuit.description,
            createdAt: circuit.createdAt,
            updatedAt: circuit.updatedAt,
          }),
        ) ?? [];

      return { ok: true, value: circuitOverviews };
    } catch (err: unknown) {
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
  }
}
