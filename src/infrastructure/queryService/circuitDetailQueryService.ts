import type { Circuit } from "@/domain/model/aggregate/circuit";
import {
  CircuitDetailQueryServiceError,
  type ICircuitDetailQueryService,
} from "@/domain/model/queryService/ICircuitDetailQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { Result } from "@/utils/result";

interface CircuitDetailQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitDetailQueryService implements ICircuitDetailQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitDetailQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getById(id: CircuitId): Promise<Result<Circuit, CircuitDetailQueryServiceError>> {
    const res = await this.circuitRepository.getById(id);
    if (!res.ok) {
      console.error(res.error);
      return {
        ok: false,
        error: new CircuitDetailQueryServiceError(`Failed to get circuit. Id: ${id}`, {
          cause: res.error,
        }),
      };
    }

    return {
      ok: true,
      value: res.value,
    };
  }
}
