import type {
  CircuitDetailQueryServiceGetByIdOutput,
  ICircuitDetailQueryService,
} from "@/domain/model/queryService/ICircuitDetailQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { Attempt } from "@/utils/attempt";

interface CircuitDetailQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitDetailQueryService implements ICircuitDetailQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitDetailQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getById(id: CircuitId): Promise<CircuitDetailQueryServiceGetByIdOutput> {
    return await Attempt.asyncProceed(
      async () => {
        const res = await this.circuitRepository.getById(id);
        if (!res.ok) {
          throw new Attempt.Abort("CircuitDetailQueryService.getById", `Failed to get circuit. Id: ${id}`, {
            cause: res.error,
          });
        }

        return {
          ok: true,
          value: res.value,
        } as const;
      },
      (err: unknown) => {
        return {
          ok: false,
          error: err,
        } as const;
      },
    );
  }
}
