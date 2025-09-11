import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import { ModelValidationError } from "@/domain/model/modelValidationError";
import {
  CircuitOverviewsQueryServiceError,
  type ICircuitOverviewsQueryService,
} from "@/domain/model/queryService/ICircuitOverviewsQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { Result } from "@/utils/result";

interface CircuitOverviewsQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitOverviewsQueryService implements ICircuitOverviewsQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitOverviewsQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getAll(): Promise<Result<Array<CircuitOverview>, CircuitOverviewsQueryServiceError>> {
    try {
      const res = await this.circuitRepository.getAll();
      if (!res.ok) {
        throw new CircuitOverviewsQueryServiceError("Failed to get circuit overviews.", {
          cause: res.error,
        });
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

      return { ok: true, value: circuitOverviews } as const;
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof ModelValidationError) {
        return {
          ok: false,
          error: new CircuitOverviewsQueryServiceError(
            "Failed to parse circuit data to gui data. Invalid model provided.",
            {
              cause: err,
            },
          ),
        };
      }

      if (err instanceof CircuitOverviewsQueryServiceError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitOverviewsQueryServiceError("Unknown error occurred while getting circuit overviews.", {
          cause: err,
        }),
      };
    }
  }
}
