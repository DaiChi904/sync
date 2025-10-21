import type { Circuit } from "@/domain/model/aggregate/circuit";
import { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import { InfraError } from "@/domain/model/infrastructure/infraError";
import type { ICircuitDetailQueryService } from "@/domain/model/infrastructure/queryService/ICircuitDetailQueryService";
import { UnexpectedError } from "@/domain/model/unexpectedError";
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
    try {
      const res = await this.circuitDetailQueryService.getById(id);
      if (!res.ok) {
        throw res.error;
      }

      return { ok: true, value: res.value } as const;
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof DataIntegrityError: {
          const dataIntegrityError = err;
          return { ok: false, error: dataIntegrityError };
        }
        case err instanceof InfraError: {
          const infraError = err;
          return { ok: false, error: infraError };
        }
        default: {
          const unexpectedError = new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
