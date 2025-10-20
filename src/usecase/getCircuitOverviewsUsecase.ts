import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import type { ICircuitOverviewsQueryService } from "@/domain/model/infrastructure/queryService/ICircuitOverviewsQueryService";
import {
  GetCircuitOverviewsUsecaseError,
  type IGetCircuitOverviewsUsecase,
} from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";
import type { Result } from "@/utils/result";

interface GetCircuitOverviewsUsecaseDependencies {
  circuitOverviewsQueryService: ICircuitOverviewsQueryService;
}

export class GetCircuitOverviewsUsecase implements IGetCircuitOverviewsUsecase {
  private readonly circuitOverviewsQueryService: ICircuitOverviewsQueryService;

  constructor({ circuitOverviewsQueryService }: GetCircuitOverviewsUsecaseDependencies) {
    this.circuitOverviewsQueryService = circuitOverviewsQueryService;
  }

  async getOverviews(): Promise<Result<Array<CircuitOverview>, GetCircuitOverviewsUsecaseError>> {
    try {
      const res = await this.circuitOverviewsQueryService.getAll();
      if (!res.ok) {
        throw new GetCircuitOverviewsUsecaseError("Failed to get circuit overviews.", {
          cause: res.error,
        });
      }

      return { ok: true, value: res.value } as const;
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof GetCircuitOverviewsUsecaseError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new GetCircuitOverviewsUsecaseError("Unknown error occurred while getting circuit overviews.", {
          cause: err,
        }),
      };
    }
  }
}
