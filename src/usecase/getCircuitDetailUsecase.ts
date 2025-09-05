import type { Circuit } from "@/domain/model/aggregate/circuit";
import type { ICircuitDetailQueryService } from "@/domain/model/queryService/ICircuitDetailQueryService";
import {
  GetCircuitDetailUsecaseError,
  type IGetCircuitDetailUsecase,
} from "@/domain/model/usecase/IGetCircuitDetailUsecase";
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

  async getById(id: CircuitId): Promise<Result<Circuit, GetCircuitDetailUsecaseError>> {
    try {
      const res = await this.circuitDetailQueryService.getById(id);
      if (!res.ok) {
        throw new GetCircuitDetailUsecaseError(`Failed to get circuit. Id: ${id}`, {
          cause: res.error,
        });
      }

      return { ok: true, value: res.value } as const;
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof GetCircuitDetailUsecaseError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new GetCircuitDetailUsecaseError("Unknown error occurred while getting circuit detail.", { cause: err }),
      };
    }
  }
}
