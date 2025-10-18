import type { Result } from "@/utils/result";
import type { CircuitNodeInputId } from "../valueObject/circuitNodeInputId";
import type { EvalDuration } from "../valueObject/evalDuration";
import type { InputRecord } from "../valueObject/inputRecord";
import type { OutputHistory } from "../valueObject/outputHistory";
import type { OutputRecord } from "../valueObject/outputRecord";
import type { Tick } from "../valueObject/tick";

export interface EmulationStatus {
  currentTick: Tick;
}

export interface IEmulationOrganizer {
  init(): Result<void, EmulationOrganizerError>;
  eval(
    inoutRecord: InputRecord,
    duration: EvalDuration,
  ): Result<{ tick: { from: Tick; to: Tick }; output: OutputRecord }, EmulationOrganizerError>;
  getStatus(): EmulationStatus;
  getEntryInputs(): Array<CircuitNodeInputId>;
  getOutputsByTick(tick: Tick): OutputRecord | null;
  getAllOutputsHistory(): OutputHistory;
}

export class EmulationOrganizerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "EmulationOrganizerError";
    this.cause = options?.cause;
  }
}
