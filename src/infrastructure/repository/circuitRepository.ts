import { ModelValidationError } from "@/domain/model/modelValidationError";
import { CircuitData } from "@/domain/model/valueObject/circuitData";
import { CircuitDescription } from "@/domain/model/valueObject/circuitDescription";
import { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import { CircuitId } from "@/domain/model/valueObject/circuitId";
import { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import { CircuitNodeSize } from "@/domain/model/valueObject/circuitNodeSize";
import { CircuitNodeType } from "@/domain/model/valueObject/circuitNodeType";
import { CircuitTitle } from "@/domain/model/valueObject/circuitTitle";
import { Coordinate } from "@/domain/model/valueObject/coordinate";
import { CreatedDateTime } from "@/domain/model/valueObject/createdDateTime";
import { UpdatedDateTime } from "@/domain/model/valueObject/updatedDateTime";
import { Waypoint } from "@/domain/model/valueObject/waypoint";
import type { Result } from "@/utils/result";
import { Circuit } from "../../domain/model/aggregate/circuit";
import { CircuitRepositoryError, type ICircuitRepository } from "../../domain/model/repository/ICircuitRepository";
import type { ILocalStorage } from "../storage/localStorage";

interface CircuitRepositoryDependencies {
  localStorage: ILocalStorage<"circuit">;
}

export class CircuitRepository implements ICircuitRepository {
  private readonly localStorage: ILocalStorage<"circuit">;

  constructor({ localStorage }: CircuitRepositoryDependencies) {
    this.localStorage = localStorage;
  }

  async getAll(): Promise<Result<Array<Circuit>, CircuitRepositoryError>> {
    try {
      const res = await this.localStorage.get();
      if (!res.ok) {
        throw new CircuitRepositoryError("Failed to get circuits.", { cause: res.error });
      }

      const rawCircuits = res.value;
      const circuits =
        rawCircuits?.map((circuit) =>
          Circuit.from({
            id: CircuitId.from(circuit.id),
            title: CircuitTitle.from(circuit.title),
            description: CircuitDescription.from(circuit.description),
            circuitData: CircuitData.from({
              nodes: circuit.circuitData.nodes.map((n) => ({
                id: CircuitNodeId.from(n.id),
                type: CircuitNodeType.from(n.type),
                inputs: n.inputs.map(CircuitNodePinId.from),
                outputs: n.outputs.map(CircuitNodePinId.from),
                coordinate: Coordinate.from(n.coordinate),
                size: CircuitNodeSize.from(n.size),
              })),
              edges: circuit.circuitData.edges.map((e) => ({
                id: CircuitEdgeId.from(e.id),
                from: CircuitNodePinId.from(e.from),
                to: CircuitNodePinId.from(e.to),
                waypoints: Waypoint.fromPrimitive(e.waypoints),
              })),
            }),
            createdAt: CreatedDateTime.fromString(circuit.createdAt),
            updatedAt: UpdatedDateTime.fromString(circuit.updatedAt),
          }),
        ) ?? [];
      return { ok: true, value: circuits };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof ModelValidationError) {
        return {
          ok: false,
          error: new CircuitRepositoryError("Failed to get circuits. Invalid model provided.", {
            cause: err,
          }),
        };
      }

      if (err instanceof CircuitRepositoryError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitRepositoryError("Unknown error occurred while getting circuits.", {
          cause: err,
        }),
      };
    }
  }

  async getById(id: CircuitId): Promise<Result<Circuit, CircuitRepositoryError>> {
    try {
      const res = await this.localStorage.get();
      if (!res.ok) {
        throw new CircuitRepositoryError("Failed to get circuit.", { cause: res.error });
      }

      const rawCircuits = res.value;
      const rawCircuit = rawCircuits?.find((c) => c.id === id);
      if (rawCircuit === undefined) {
        throw new CircuitRepositoryError(
          `Failed to get circuit. Subject not found. You might specify a invalid Id. Id: ${id}`,
        );
      }

      const circuit = Circuit.from({
        id: CircuitId.from(rawCircuit.id),
        title: CircuitTitle.from(rawCircuit.title),
        description: CircuitDescription.from(rawCircuit.description),
        circuitData: CircuitData.from({
          nodes: rawCircuit.circuitData.nodes.map((n) => ({
            id: CircuitNodeId.from(n.id),
            type: CircuitNodeType.from(n.type),
            inputs: n.inputs.map(CircuitNodePinId.from),
            outputs: n.outputs.map(CircuitNodePinId.from),
            coordinate: Coordinate.from(n.coordinate),
            size: CircuitNodeSize.from(n.size),
          })),
          edges: rawCircuit.circuitData.edges.map((e) => ({
            id: CircuitEdgeId.from(e.id),
            from: CircuitNodePinId.from(e.from),
            to: CircuitNodePinId.from(e.to),
            waypoints: Waypoint.fromPrimitive(e.waypoints),
          })),
        }),
        createdAt: CreatedDateTime.fromString(rawCircuit.createdAt),
        updatedAt: UpdatedDateTime.fromString(rawCircuit.updatedAt),
      });

      return { ok: true, value: circuit };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof ModelValidationError) {
        return {
          ok: false,
          error: new CircuitRepositoryError("Failed to get circuit. Invalid model provided.", {
            cause: err,
          }),
        };
      }

      if (err instanceof CircuitRepositoryError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitRepositoryError("Unknown error occurred while getting circuit.", {
          cause: err,
        }),
      };
    }
  }

  async save(method: "ADD" | "UPDATE", circuit: Circuit): Promise<Result<void, CircuitRepositoryError>> {
    try {
      const get = await this.localStorage.get();
      if (!get.ok) {
        throw new CircuitRepositoryError("Failed to save circuit. Couldn't get circuits.", { cause: get.error });
      }

      const current = get.value ?? [];
      switch (method) {
        case "ADD": {
          const save = await this.localStorage.save([...current, circuit]);
          if (!save.ok) {
            throw new CircuitRepositoryError("Failed to add circuits.", {
              cause: save.error,
            });
          }

          return { ok: true, value: undefined } as const;
        }
        case "UPDATE": {
          if (current.length === 0) {
            throw new CircuitRepositoryError("Failed to update circuit. No circuits saved.");
          }

          const isExist = current.some((c) => c.id === circuit.id);
          if (!isExist) {
            throw new CircuitRepositoryError(
              `Failed to update circuit. Subject not found. You might specify a invalid Id. Id: ${circuit.id}`,
            );
          }

          const updated = current.map((c) => (c.id === circuit.id ? circuit : c));
          const save = await this.localStorage.save(updated);
          if (!save.ok) {
            throw new CircuitRepositoryError("Failed to update circuit.", {
              cause: save.error,
            });
          }

          return { ok: true, value: undefined } as const;
        }
        default: {
          throw new CircuitRepositoryError("Invalid method was specified.");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitRepositoryError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitRepositoryError(`Unknown error occurred while ${method}ing circuit.`, {
          cause: err,
        }),
      };
    }
  }

  async delete(id: CircuitId): Promise<Result<void, CircuitRepositoryError>> {
    try {
      const get = await this.localStorage.get();
      if (!get.ok) {
        throw new CircuitRepositoryError("Failed to delete circuit. Couldn't get circuits.", { cause: get.error });
      }

      const current = get.value ?? [];
      if (current.length === 0) {
        throw new CircuitRepositoryError("Failed to delete circuit. No circuits saved.");
      }

      const isExist = current.some((c) => c.id === id);
      if (!isExist) {
        throw new CircuitRepositoryError(
          `Failed to delete circuit. Subject not found. You might specify a invalid Id. Id: ${id}`,
        );
      }

      const updated = current.filter((c) => c.id !== id);
      const save = await this.localStorage.save(updated);
      if (!save.ok) {
        throw new CircuitRepositoryError("Failed to save circuits.", { cause: save.error });
      }

      return { ok: true, value: undefined };
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof CircuitRepositoryError) {
        return { ok: false, error: err };
      }

      return {
        ok: false,
        error: new CircuitRepositoryError("Unknown error occurred while deleting circuit.", {
          cause: err,
        }),
      };
    }
  }
}
