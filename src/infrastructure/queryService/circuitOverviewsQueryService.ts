import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import type {
  CircuitOverviewsQueryServiceGetAllOutput,
  ICircuitOverviewsQueryService,
} from "@/domain/model/queryService/ICircuitOverviewsQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";
import { Attempt } from "@/utils/attempt";

interface CircuitOverviewsQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitOverviewsQueryService implements ICircuitOverviewsQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitOverviewsQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getAll(): Promise<CircuitOverviewsQueryServiceGetAllOutput> {
    return await Attempt.asyncProceed(
      async () => {
        const res = await this.circuitRepository.getAll();
        if (!res.ok) {
          throw new Attempt.Abort("Failed to get circuits.", { cause: res.error });
        }

        const rawCircuits = res.value;
        const circuitOverviews =
          rawCircuits?.map((circuit) =>
            CircuitOverview.from({
              id: circuit.id,
              title: circuit.title,
              description: circuit.description,
              createdAt: circuit.createdAt,
              updatedAt: circuit.updatedAt,
            }),
          ) ?? [];

        return { ok: true, value: circuitOverviews } as const;
      },
      (err: unknown) => {
        return { ok: false, error: err } as const;
      },
    );
  }
}
