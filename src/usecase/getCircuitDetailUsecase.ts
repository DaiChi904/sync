import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import type { InfraError } from "@/domain/model/infrastructure/infraError";
import type { ICircuitDetailQueryService } from "@/domain/model/infrastructure/queryService/ICircuitDetailQueryService";
import type { UnexpectedError } from "@/domain/model/unexpectedError";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { Result } from "@/utils/result";

interface GetCircuitDeailUsecaseDependencies {
  circuitDetailQueryService: ICircuitDetailQueryService;
}

export class GetCircuitDetailUsecase implements IGetCircuitDetailUsecase {
  private readonly circuitDetailQueryService: ICircuitDetailQueryService;

  constructor({ circuitDetailQueryService }: GetCircuitDeailUsecaseDependencies) {
    this.circuitDetailQueryService = circuitDetailQueryService;
  }

  async getById(id: CircuitId): Promise<Result<Circuit, DataIntegrityError | InfraError | UnexpectedError>> {
    return this.circuitDetailQueryService.getById(id);
  }
}
