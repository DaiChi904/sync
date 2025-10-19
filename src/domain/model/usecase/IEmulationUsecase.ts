import type { Result } from "@/utils/result";
import type { CircuitGraphData } from "../entity/circuitGraphData";
import type { EvalDelay } from "../valueObject/evalDelay";

export class EmulationUsecaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "IEmulationUsecaseError";
    this.cause = options?.cause;
  }
}

export type IEmulationUsecase = {};

export type CreateEmulationUsecase = (
  graphData: CircuitGraphData,
  evalDelay: EvalDelay,
) => Result<IEmulationUsecase, EmulationUsecaseError>;
