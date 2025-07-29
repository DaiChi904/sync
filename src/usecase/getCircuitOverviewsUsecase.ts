import type { ICircuitOverviewsQueryService } from "@/domain/model/queryService/ICircuitOverviewsQueryService";
import type {
  IGetCircuitOverviewsUsecase,
  IGetCircuitOverviewsUsecaseGetOverviewsOutput,
} from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";

export class GetCircuitOverviewsUsecaseError extends Error {
  constructor(message: string, options: { cause: unknown }) {
    super(message);
    this.name = "GetCircuitOverviewsUsecaseError";
    this.cause = options.cause;
  }
}

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
    if (!res.ok) {
      return {
        ok: false,
        error: new GetCircuitOverviewsUsecaseError("Failed to get circuit overviews.", { cause: res.error }),
      };
    }

    return { ok: true, value: res.value };
  }
}
