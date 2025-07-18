import type { ICircuitOverviewsQueryService } from "@/domain/model/queryService/ICircuitOverviewsQueryService";
import type {
  IGetCircuitOverviewsUsecase,
  IGetCircuitOverviewsUsecaseGetOverviewsOutput,
} from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";

interface GetCircuitOverviewsUsecaseDependencies {
  circuitOverviewsQueryService: ICircuitOverviewsQueryService;
}

export class GetCircuitOverviewsUsecase implements IGetCircuitOverviewsUsecase {
  private readonly circuitOverviewsQueryService: ICircuitOverviewsQueryService;

  constructor({ circuitOverviewsQueryService }: GetCircuitOverviewsUsecaseDependencies) {
    this.circuitOverviewsQueryService = circuitOverviewsQueryService;
  }

  async getOverviews(): Promise<IGetCircuitOverviewsUsecaseGetOverviewsOutput> {
    const res = await this.circuitOverviewsQueryService.getAll();

    switch (res.ok) {
      case true: {
        return { ok: true, value: res.value };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }
}
