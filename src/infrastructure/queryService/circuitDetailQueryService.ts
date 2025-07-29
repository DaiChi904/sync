import type {
  CircuitDetailQueryServiceGetByIdOutput,
  ICircuitDetailQueryService,
} from "@/domain/model/queryService/ICircuitDetailQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";

export class CircuitDetailQueryServiceError extends Error {
  constructor(message: string, options: { cause: unknown }) {
    super(message);
    this.name = "CircuitDetailQueryServiceError";
    this.cause = options.cause;
  }
}

interface CircuitDetailQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitDetailQueryService implements ICircuitDetailQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitDetailQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getById(id: CircuitId): Promise<CircuitDetailQueryServiceGetByIdOutput> {
    const res = await this.circuitRepository.getById(id);
    if (!res.ok) {
      return { ok: false, error: new CircuitDetailQueryServiceError(`Failed to get circuit detail. id = ${id}`, { cause: res.error }) };
    }

    return { ok: true, value: res.value };
  }
}
