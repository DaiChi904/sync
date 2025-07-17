import type { Result } from "@/utils/result";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitId } from "../valueObject/circuitId";

export type CircuitRepositoryGetAllOutput = Result<Array<Circuit>>;

export type CircuitRepositoryGetByIdOutput = Result<Circuit>;

export type CircuitRepositorySaveOutput = Result<void>;

export type CircuitRepositoryDeleteOutput = Result<void>;

export interface ICircuitRepository {
  getAll: () => Promise<CircuitRepositoryGetAllOutput>;
  getById: (id: CircuitId) => Promise<CircuitRepositoryGetByIdOutput>;
  save: (method: "ADD" | "UPDATE", circuit: Circuit) => Promise<CircuitRepositorySaveOutput>;
  delete: (id: CircuitId) => Promise<CircuitRepositoryDeleteOutput>;
}
