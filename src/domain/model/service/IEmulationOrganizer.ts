import type { Result } from "@/utils/result";
import type { CircuitNodeInputId } from "../valueObject/circuitNodeInputId";
import type { EvalDuration } from "../valueObject/evalDuration";
import type { InputRecord } from "../valueObject/inputRecord";
import type { OutputHistory } from "../valueObject/outputHistory";
import type { OutputRecord } from "../valueObject/outputRecord";
import type { Tick } from "../valueObject/tick";

export class EmulationOrganizerInitializationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "EmulationOrganizerInitializationError";
    this.cause = options?.cause;
  }
}

export class EmulationOrganizerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "EmulationOrganizerError";
    this.cause = options?.cause;
  }
}

export class EmulationOrganizerEvalError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "EmulationOrganizerEvalError";
    this.cause = options?.cause;
  }
}

export interface EmulationStatus {
  currentTick: Tick;
}

export interface IEmulationOrganizer {
  init(): Result<void, EmulationOrganizerInitializationError>;
  eval(
    inoutRecord: InputRecord,
    duration: EvalDuration,
  ): Result<{ tick: { from: Tick; to: Tick }; output: OutputRecord }, EmulationOrganizerEvalError>;
  getStatus(): EmulationStatus;
  getEntryInputs(): Array<CircuitNodeInputId>;
  getOutputsByTick(tick: Tick): OutputRecord | null;
  getAllOutputsHistory(): OutputHistory;
}
