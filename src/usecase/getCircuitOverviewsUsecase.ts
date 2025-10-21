import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import { InfraError } from "@/domain/model/infrastructure/infraError";
import type { ICircuitOverviewsQueryService } from "@/domain/model/infrastructure/queryService/ICircuitOverviewsQueryService";
import { UnexpectedError } from "@/domain/model/unexpectedError";
import type { IGetCircuitOverviewsUsecase } from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";
import type { Result } from "@/utils/result";

interface GetCircuitOverviewsUsecaseDependencies {
  circuitOverviewsQueryService: ICircuitOverviewsQueryService;
}

export class GetCircuitOverviewsUsecase implements IGetCircuitOverviewsUsecase {
  private readonly circuitOverviewsQueryService: ICircuitOverviewsQueryService;

  constructor({ circuitOverviewsQueryService }: GetCircuitOverviewsUsecaseDependencies) {
    this.circuitOverviewsQueryService = circuitOverviewsQueryService;
  }

  async getOverviews(): Promise<Result<Array<CircuitOverview>, DataIntegrityError | InfraError | UnexpectedError>> {
    try {
      const res = await this.circuitOverviewsQueryService.getAll();
      if (!res.ok) {
        throw res.error;
      }

      return { ok: true, value: res.value } as const;
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof DataIntegrityError: {
          const dataIntegrityError = err;
          return { ok: false, error: dataIntegrityError };
        }
        case err instanceof InfraError: {
          const infraError = err;
          return { ok: false, error: infraError };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
