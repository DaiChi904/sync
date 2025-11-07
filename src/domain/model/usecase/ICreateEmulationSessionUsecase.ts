import type { Result } from "@/utils/result";
import type { IEmulationOrganizer } from "../service/IEmulationOrganizer";
import type { CircuitGraphData } from "../valueObject/circuitGraphData";
import type { EvalDelay } from "../valueObject/evalDelay";

export class EmulationSessionCreationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "EmulationSessionCreationError";
    this.cause = options?.cause;
  }
}

export interface IEmulationSession extends IEmulationOrganizer {}

export interface ICreateEmulationSessionUsecase {
  createSession(
    circuitGraphData: CircuitGraphData,
    config: { evalDelay: EvalDelay },
  ): Result<IEmulationSession, EmulationSessionCreationError>;
}
