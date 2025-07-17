import type {
  CircuitOverviewsQueryServiceGetAllOutput,
  ICircuitOverviewsQueryService,
} from "@/domain/model/queryService/ICircuitOverviewsQueryService";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { CreatedDateTime } from "@/domain/model/valueObject/createdDateTime";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";
import type { ILocalStorage } from "../storage/localStorage";

interface CircuitOverviewQueryServiceDependencies {
  localStorage: Pick<ILocalStorage<"circuit">, "get">;
}

export class CircuitOverviewsQueryService implements ICircuitOverviewsQueryService {
  private readonly localStorage: Pick<ILocalStorage<"circuit">, "get">;

  constructor({ localStorage }: CircuitOverviewQueryServiceDependencies) {
    this.localStorage = localStorage;
  }

  async getAll(): Promise<CircuitOverviewsQueryServiceGetAllOutput> {
    const res = await this.localStorage.get();

    switch (res.ok) {
      case true: {
        const rawCircuits = res.value;

        const circuitOverviews =
          rawCircuits?.map((circuit) => ({
            id: CircuitId.from(circuit.id),
            title: CircuitTitle.from(circuit.title),
            description: CircuitDescription.from(circuit.description),
            createdAt: CreatedDateTime.fromString(circuit.createdAt),
            updatedAt: UpdatedDateTime.fromString(circuit.updatedAt),
          })) ?? [];

        return { ok: true, value: circuitOverviews };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }
}
