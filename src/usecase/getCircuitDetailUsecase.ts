import type { ICircuitDetailQueryService } from "@/domain/model/queryService/ICircuitDetailQueryService";
import type {
  IGetCircuitDetailUsecase,
  IGetCircuitDetailUsecaseGetByIdOutput,
} from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";

interface GetCircuitDeailUsecaseDependencies {
  circuitDetailQueryService: ICircuitDetailQueryService;
}

export class GetCircuitDetailUsecase implements IGetCircuitDetailUsecase {
  private readonly circuitDetailQueryService: ICircuitDetailQueryService;

  constructor({ circuitDetailQueryService }: GetCircuitDeailUsecaseDependencies) {
    this.circuitDetailQueryService = circuitDetailQueryService;
  }

  async getById(id: CircuitId): Promise<IGetCircuitDetailUsecaseGetByIdOutput> {
    const res = await this.circuitDetailQueryService.getById(id);

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
