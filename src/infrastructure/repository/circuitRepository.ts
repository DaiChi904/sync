import { CircuitData } from "@/domain/model/valueObject/circuitData";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { CreatedDateTime } from "@/domain/model/valueObject/createdDateTime";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";
import { Circuit } from "../../domain/model/aggregate/circuit";
import type {
  CircuitRepositoryDeleteOutput,
  CircuitRepositoryGetAllOutput,
  CircuitRepositoryGetByIdOutput,
  CircuitRepositorySaveOutput,
  ICircuitRepository,
} from "../../domain/model/repository/ICircuitRepository";
import type { ILocalStorage } from "../storage/localStorage";

interface CircuitRepositoryDependencies {
  localStorage: ILocalStorage<"circuit">;
}

export class CircuitRepositoryGetByIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitRepositoryGetByIdError";
  }
}

export class CircuitRepositorySaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitRepositorySaveError";
  }
}

export class CircuitRepositoryDeleteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitRepositoryDeleteError";
  }
}

export class CircuitRepository implements ICircuitRepository {
  private readonly localStorage: ILocalStorage<"circuit">;

  constructor({ localStorage }: CircuitRepositoryDependencies) {
    this.localStorage = localStorage;
  }

  async getAll(): Promise<CircuitRepositoryGetAllOutput> {
    const res = await this.localStorage.get();

    switch (res.ok) {
      case true: {
        const rawCircuits = res.value;

        const circuits =
          rawCircuits?.map((circuit) =>
            Circuit.from({
              id: CircuitId.from(circuit.id),
              title: CircuitTitle.from(circuit.title),
              description: CircuitDescription.from(circuit.description),
              circuitData: CircuitData.from(circuit.circuitData),
              createdAt: CreatedDateTime.fromString(circuit.createdAt),
              updatedAt: UpdatedDateTime.fromString(circuit.updatedAt),
            }),
          ) ?? [];

        return { ok: true, value: circuits };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }

  async getById(id: CircuitId): Promise<CircuitRepositoryGetByIdOutput> {
    const res = await this.localStorage.get();

    switch (res.ok) {
      case true: {
        const rawCircuits = res.value;
        const rawCircuit = rawCircuits?.find((c) => c.id === id);
        if (rawCircuit === undefined)
          return { ok: false, error: new CircuitRepositoryGetByIdError("Circuit not found.") };

        const circuit = Circuit.from({
          id: CircuitId.from(rawCircuit.id),
          title: CircuitTitle.from(rawCircuit.title),
          description: CircuitDescription.from(rawCircuit.description),
          circuitData: CircuitData.from(rawCircuit.circuitData),
          createdAt: CreatedDateTime.fromString(rawCircuit.createdAt),
          updatedAt: UpdatedDateTime.fromString(rawCircuit.updatedAt),
        });

        return { ok: true, value: circuit };
      }
      case false: {
        return { ok: false, error: res.error };
      }
    }
  }

  async save(method: "ADD" | "UPDATE", circuit: Circuit): Promise<CircuitRepositorySaveOutput> {
    const getRes = await this.localStorage.get();

    switch (getRes.ok) {
      case true: {
        const current = getRes.value ?? [];
        switch (method) {
          case "ADD": {
            const saveRes = await this.localStorage.save([...current, circuit]);
            return saveRes.ok ? { ok: true, value: undefined } : { ok: false, error: saveRes.error };
          }
          case "UPDATE": {
            if (current.length === 0) return { ok: false, error: new CircuitRepositorySaveError("No circuits found.") };

            const isExist = current.some((c) => c.id === circuit.id);
            if (!isExist) return { ok: false, error: new CircuitRepositorySaveError("Subject not found.") };

            const updated = current.map((c) => (c.id === circuit.id ? circuit : c));
            const saveRes = await this.localStorage.save(updated);
            return saveRes.ok ? { ok: true, value: undefined } : { ok: false, error: saveRes.error };
          }
          default: {
            return { ok: false, error: new CircuitRepositorySaveError("Invalid method.") };
          }
        }
      }
      case false: {
        return { ok: false, error: getRes.error };
      }
    }
  }

  async delete(id: CircuitId): Promise<CircuitRepositoryDeleteOutput> {
    const getRes = await this.localStorage.get();

    switch (getRes.ok) {
      case true: {
        const current = getRes.value ?? [];
        if (current.length === 0) return { ok: false, error: new CircuitRepositoryDeleteError("No circuits found.") };

        const isExist = current.some((c) => c.id === id);
        if (!isExist) return { ok: false, error: new CircuitRepositoryDeleteError("Subject not found.") };

        const updated = current.filter((c) => c.id !== id);
        const saveRes = await this.localStorage.save(updated);
        return saveRes.ok ? { ok: true, value: undefined } : { ok: false, error: saveRes.error };
      }
      case false: {
        return { ok: false, error: getRes.error };
      }
    }
  }
}
