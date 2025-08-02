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
    if (!res.ok) {
      return { ok: false, error: res.error };
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
  }

  async getById(id: CircuitId): Promise<CircuitRepositoryGetByIdOutput> {
    const res = await this.localStorage.get();
    if (!res.ok) {
      return { ok: false, error: res.error };
    }

    const rawCircuits = res.value;
    const rawCircuit = rawCircuits?.find((c) => c.id === id);
    if (rawCircuit === undefined) {
      return { ok: false, error: new CircuitRepositoryGetByIdError("Circuit not found.") };
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
  }

  async save(method: "ADD" | "UPDATE", circuit: Circuit): Promise<CircuitRepositorySaveOutput> {
    const res = await this.localStorage.get();
    if (!res.ok) {
      return { ok: false, error: res.error };
    }

    const current = res.value ?? [];
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

  async delete(id: CircuitId): Promise<CircuitRepositoryDeleteOutput> {
    const res = await this.localStorage.get();
    if (!res.ok) {
      return { ok: false, error: res.error };
    }

    const current = res.value ?? [];
    if (current.length === 0) return { ok: false, error: new CircuitRepositoryDeleteError("No circuits found.") };

    const isExist = current.some((c) => c.id === id);
    if (!isExist) return { ok: false, error: new CircuitRepositoryDeleteError("Subject not found.") };

    const updated = current.filter((c) => c.id !== id);
    const saveRes = await this.localStorage.save(updated);
    return saveRes.ok ? { ok: true, value: undefined } : { ok: false, error: saveRes.error };
  }
}
