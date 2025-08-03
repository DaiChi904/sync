import type { ICircuitOverviewsQueryService } from "@/domain/model/queryService/ICircuitOverviewsQueryService";
import type {
  IGetCircuitOverviewsUsecase,
  IGetCircuitOverviewsUsecaseGetOverviewsOutput,
} from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";
import { Attempt } from "@/utils/attempt";

interface GetCircuitOverviewsUsecaseDependencies {
  circuitOverviewsQueryService: ICircuitOverviewsQueryService;
}

export class GetCircuitOverviewsUsecase implements IGetCircuitOverviewsUsecase {
  private readonly circuitOverviewsQueryService: ICircuitOverviewsQueryService;

  constructor({ circuitOverviewsQueryService }: GetCircuitOverviewsUsecaseDependencies) {
    this.circuitOverviewsQueryService = circuitOverviewsQueryService;
  }

  async getOverviews(): Promise<IGetCircuitOverviewsUsecaseGetOverviewsOutput> {
    return await Attempt.asyncProceed(
      async () => {
        const res = await this.circuitOverviewsQueryService.getAll();
        if (!res.ok) {
          throw new Attempt.Abort("GetCircuitOverviewsUsecase.getOverviews", "Failed to get circuits", {
            cause: res.error,
          });
        }

        return { ok: true, value: res.value } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }
}
