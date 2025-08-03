import type { ICircuitDetailQueryService } from "@/domain/model/queryService/ICircuitDetailQueryService";
import type {
  IGetCircuitDetailUsecase,
  IGetCircuitDetailUsecaseGetByIdOutput,
} from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { Attempt } from "@/utils/attempt";

interface GetCircuitDeailUsecaseDependencies {
  circuitDetailQueryService: ICircuitDetailQueryService;
}

export class GetCircuitDetailUsecase implements IGetCircuitDetailUsecase {
  private readonly circuitDetailQueryService: ICircuitDetailQueryService;

  constructor({ circuitDetailQueryService }: GetCircuitDeailUsecaseDependencies) {
    this.circuitDetailQueryService = circuitDetailQueryService;
  }

  async getById(id: CircuitId): Promise<IGetCircuitDetailUsecaseGetByIdOutput> {
    return await Attempt.asyncProceed(
      async () => {
        const res = await this.circuitDetailQueryService.getById(id);
        if (!res.ok) {
          throw new Attempt.Abort("GetCircuitDetailUsecase.getById", `Failed to get circuit. Id: ${id}`, {
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
