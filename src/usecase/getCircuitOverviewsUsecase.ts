import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type { ICircuitOverviewsQueryService } from "@/domain/model/infrastructure/queryService/ICircuitOverviewsQueryService";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
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
    return this.circuitOverviewsQueryService.getAll();
  }
}
