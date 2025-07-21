import type {
  CircuitDetailQueryServiceGetByIdOutput,
  ICircuitDetailQueryService,
} from "@/domain/model/queryService/ICircuitDetailQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";

interface CircuitDetailQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitDetailQueryServiceGetByIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitDetailQueryServiceGetByIdError";
  }
}

export class CircuitDetailQueryService implements ICircuitDetailQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitDetailQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getById(id: CircuitId): Promise<CircuitDetailQueryServiceGetByIdOutput> {
    const res = await this.circuitRepository.getById(id);

    switch (res.ok) {
      case true: {
        const circuit = res.value;

        return {
          ok: true,
          value: circuit,
        };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }
}
