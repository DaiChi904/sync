import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import type {
  CircuitOverviewsQueryServiceGetAllOutput,
  ICircuitOverviewsQueryService,
} from "@/domain/model/queryService/ICircuitOverviewsQueryService";
import type { ICircuitRepository } from "@/domain/model/repository/ICircuitRepository";

interface CircuitOverviewQueryServiceDependencies {
  circuitRepository: ICircuitRepository;
}

export class CircuitOverviewsQueryService implements ICircuitOverviewsQueryService {
  private readonly circuitRepository: ICircuitRepository;

  constructor({ circuitRepository }: CircuitOverviewQueryServiceDependencies) {
    this.circuitRepository = circuitRepository;
  }

  async getAll(): Promise<CircuitOverviewsQueryServiceGetAllOutput> {
    const res = await this.circuitRepository.getAll();

    switch (res.ok) {
      case true: {
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

        return { ok: true, value: circuitOverviews };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }
}
