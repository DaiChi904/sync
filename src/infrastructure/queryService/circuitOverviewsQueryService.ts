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
  }
}
