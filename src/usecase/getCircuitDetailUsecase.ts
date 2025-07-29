import type { ICircuitDetailQueryService } from "@/domain/model/queryService/ICircuitDetailQueryService";
import type {
  IGetCircuitDetailUsecase,
  IGetCircuitDetailUsecaseGetByIdOutput,
} from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";

export class GetCircuitDetailUsecaseError extends Error {
  constructor(message: string, options: { cause: unknown }) {
    super(message);
    this.name = "GetCircuitDetailUsecaseError";
    this.cause = options.cause;
  }
}

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
    if (!res.ok) {
      return {
        ok: false,
        error: new GetCircuitDetailUsecaseError(`Failed to get circuit detail. id = ${id}`, { cause: res.error }),
      };
    }

    return { ok: true, value: res.value };
  }
}
