import { CircuitEdge } from "@/domain/model/entity/circuitEdge";
import { CircuitNode } from "@/domain/model/entity/circuitNode";
import { DataIntegrityError } from "@/domain/model/infrastructure/dataIntegrityError";
import { InfraError } from "@/domain/model/infrastructure/infraError";
import {
  CircuitNotFoundError,
  type ICircuitRepository,
  InvalidSaveMethodError,
} from "@/domain/model/infrastructure/repository/ICircuitRepository";
import { ModelValidationError } from "@/domain/model/modelValidationError";
import { UnexpectedError } from "@/domain/model/unexpectedError";
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
import { DataCorruptedError, type ILocalStorage, QuotaExceededError } from "../storage/localStorage";

interface CircuitRepositoryDependencies {
  localStorage: ILocalStorage<"circuit">;
}

export class CircuitRepository implements ICircuitRepository {
  private readonly localStorage: ILocalStorage<"circuit">;

  constructor({ localStorage }: CircuitRepositoryDependencies) {
    this.localStorage = localStorage;
  }

  async getAll(): Promise<Result<Array<Circuit>, InfraError | DataIntegrityError | UnexpectedError>> {
    try {
      const res = await this.localStorage.get();
      if (!res.ok) {
        throw res.error;
      }

      const rawCircuits = res.value;
      const circuits =
        rawCircuits?.map((circuit) =>
          Circuit.from({
            id: CircuitId.from(circuit.id),
            title: CircuitTitle.from(circuit.title),
            description: CircuitDescription.from(circuit.description),
            circuitData: CircuitData.from({
              nodes: circuit.circuitData.nodes.map((n) =>
                CircuitNode.from({
                  id: CircuitNodeId.from(n.id),
                  type: CircuitNodeType.from(n.type),
                  inputs: n.inputs.map(CircuitNodePinId.from),
                  outputs: n.outputs.map(CircuitNodePinId.from),
                  coordinate: Coordinate.from(n.coordinate),
                  size: CircuitNodeSize.from(n.size),
                }),
              ),
              edges: circuit.circuitData.edges.map((e) =>
                CircuitEdge.from({
                  id: CircuitEdgeId.from(e.id),
                  from: CircuitNodePinId.from(e.from),
                  to: CircuitNodePinId.from(e.to),
                  waypoints: Waypoint.fromPrimitive(e.waypoints),
                }),
              ),
            }),
            createdAt: CreatedDateTime.fromString(circuit.createdAt),
            updatedAt: UpdatedDateTime.fromString(circuit.updatedAt),
          }),
        ) ?? [];
      return { ok: true, value: circuits };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError:
        case err instanceof DataCorruptedError: {
          const dataIntegrityErrorCause = err;
          return {
            ok: false,
            error: new DataIntegrityError("Circuit data corrupted.", { cause: dataIntegrityErrorCause }),
          };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }

  async getById(
    id: CircuitId,
  ): Promise<Result<Circuit, CircuitNotFoundError | InfraError | DataIntegrityError | UnexpectedError>> {
    try {
      const res = await this.localStorage.get();
      if (!res.ok) {
        throw res.error;
      }

      const rawCircuits = res.value;
      const rawCircuit = rawCircuits?.find((c) => c.id === id);
      if (rawCircuit === undefined) {
        throw new CircuitNotFoundError(id);
      }

      const circuit = Circuit.from({
        id: CircuitId.from(rawCircuit.id),
        title: CircuitTitle.from(rawCircuit.title),
        description: CircuitDescription.from(rawCircuit.description),
        circuitData: CircuitData.from({
          nodes: rawCircuit.circuitData.nodes.map((n) =>
            CircuitNode.from({
              id: CircuitNodeId.from(n.id),
              type: CircuitNodeType.from(n.type),
              inputs: n.inputs.map(CircuitNodePinId.from),
              outputs: n.outputs.map(CircuitNodePinId.from),
              coordinate: Coordinate.from(n.coordinate),
              size: CircuitNodeSize.from(n.size),
            }),
          ),
          edges: rawCircuit.circuitData.edges.map((e) =>
            CircuitEdge.from({
              id: CircuitEdgeId.from(e.id),
              from: CircuitNodePinId.from(e.from),
              to: CircuitNodePinId.from(e.to),
              waypoints: Waypoint.fromPrimitive(e.waypoints),
            }),
          ),
        }),
        createdAt: CreatedDateTime.fromString(rawCircuit.createdAt),
        updatedAt: UpdatedDateTime.fromString(rawCircuit.updatedAt),
      });

      return { ok: true, value: circuit };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError:
        case err instanceof DataCorruptedError: {
          const dataIntegrityErrorCause = err;
          return {
            ok: false,
            error: new DataIntegrityError("Circuit data corrupted.", { cause: dataIntegrityErrorCause }),
          };
        }
        case err instanceof CircuitNotFoundError: {
          const circuitNotFoundError = err;
          return { ok: false, error: circuitNotFoundError };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }

  async save(
    method: "ADD" | "UPDATE",
    circuit: Circuit,
  ): Promise<
    Result<void, CircuitNotFoundError | InfraError | DataIntegrityError | InvalidSaveMethodError | UnexpectedError>
  > {
    try {
      const get = await this.localStorage.get();
      if (!get.ok) {
        throw get.error;
      }

      const current = get.value ?? [];
      switch (method) {
        case "ADD": {
          const save = await this.localStorage.save([...current, circuit]);
          if (!save.ok) {
            throw save.error;
          }

          return { ok: true, value: undefined };
        }
        case "UPDATE": {
          const isExist = current.some((c) => c.id === circuit.id);
          if (!isExist) {
            throw new CircuitNotFoundError(circuit.id);
          }

          const updated = current.map((c) => (c.id === circuit.id ? circuit : c));
          const save = await this.localStorage.save(updated);
          if (!save.ok) {
            throw save.error;
          }

          return { ok: true, value: undefined };
        }
        default: {
          throw new InvalidSaveMethodError(`Invalid save method. Received: '${method}', Required: "ADD" or "UPDATE"`);
        }
      }
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError:
        case err instanceof DataCorruptedError: {
          const dataIntegrityErrorCause = err;
          return {
            ok: false,
            error: new DataIntegrityError("Stored circuit data corrupted.", {
              cause: dataIntegrityErrorCause,
            }),
          };
        }
        case err instanceof QuotaExceededError: {
          const infraError = new InfraError("Failed to save.", { cause: err });
          return { ok: false, error: infraError };
        }
        case err instanceof CircuitNotFoundError: {
          const circuitNotFoundError = err;
          return { ok: false, error: circuitNotFoundError };
        }
        case err instanceof InvalidSaveMethodError: {
          const invalidSaveMethodError = err;
          return { ok: false, error: invalidSaveMethodError };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }

  async delete(
    id: CircuitId,
  ): Promise<Result<void, CircuitNotFoundError | InfraError | DataIntegrityError | UnexpectedError>> {
    try {
      const get = await this.localStorage.get();
      if (!get.ok) {
        throw get.error;
      }

      const current = get.value ?? [];
      const isExist = current.some((c) => c.id === id);
      if (!isExist) {
        throw new CircuitNotFoundError(id);
      }

      const updated = current.filter((c) => c.id !== id);
      const save = await this.localStorage.save(updated);
      if (!save.ok) {
        throw save.error;
      }

      return { ok: true, value: undefined };
    } catch (err: unknown) {
      console.error(err);
      switch (true) {
        case err instanceof ModelValidationError:
        case err instanceof DataCorruptedError: {
          const dataIntegrityErrorCause = err;
          return {
            ok: false,
            error: new DataIntegrityError("Stored circuit data corrupted.", {
              cause: dataIntegrityErrorCause,
            }),
          };
        }
        case err instanceof CircuitNotFoundError: {
          const circuitNotFoundError = err;
          return { ok: false, error: circuitNotFoundError };
        }
        default: {
          const unexpectedError = err instanceof UnexpectedError ? err : new UnexpectedError({ cause: err });
          return { ok: false, error: unexpectedError };
        }
      }
    }
  }
}
