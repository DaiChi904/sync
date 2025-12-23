import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import { InfraError } from "@/domain/model/infrastructure/infraError";
import type { ICircuitOverviewsQueryService } from "@/domain/model/infrastructure/queryService/ICircuitOverviewsQueryService";
import { ModelValidationError } from "@/domain/model/modelValidationError";
import { UnexpectedError } from "@/domain/model/unexpectedError";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { CreatedDateTime } from "@/domain/model/valueObject/createdDateTime";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";
import type { Result } from "@/utils/result";
import type { ILocalStorage } from "../storage/localStorage";

interface CircuitOverviewsQueryServiceDependencies {
  localStorage: ILocalStorage<"circuit">;
}

export class CircuitOverviewsQueryService implements ICircuitOverviewsQueryService {
  private readonly localStorage: ILocalStorage<"circuit">;

  constructor({ localStorage }: CircuitOverviewsQueryServiceDependencies) {
    this.localStorage = localStorage;
  }

  async getAll(): Promise<Result<Array<CircuitOverview>, InfraError | DataIntegrityError | UnexpectedError>> {
    try {
      const res = await this.localStorage.get();
      if (!res.ok) {
        throw res.error;
      }

      const rawCircuits = res.value;
      const circuitOverviews =
        rawCircuits?.map((circuit) =>
          CircuitOverview.from({
            id: CircuitId.from(circuit.id),
            title: CircuitTitle.from(circuit.title),
            description: CircuitDescription.from(circuit.description),
            createdAt: CreatedDateTime.fromString(circuit.createdAt),
            updatedAt: UpdatedDateTime.fromString(circuit.updatedAt),
          }),
        ) ?? [];

      return { ok: true, value: circuitOverviews };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError: {
          const dataIntegrityError = new DataIntegrityError("Circuit data corrupted.", { cause: err });
          return {
            ok: false,
            error: dataIntegrityError,
          };
        }
        case err instanceof DataIntegrityError: {
          return { ok: false, error: err };
        }
        case err instanceof InfraError: {
          return { ok: false, error: err };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
