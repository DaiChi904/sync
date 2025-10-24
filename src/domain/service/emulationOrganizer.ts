import type { Result } from "@/utils/result";
import type { ICircuitEmulatorService } from "../model/service/ICircuitEmulatorService";
import {
  EmulationOrganizerEvalError,
  EmulationOrganizerInitializationError,
  type EmulationStatus,
  type IEmulationOrganizer,
} from "../model/service/IEmulationOrganizer";
import { CircuitNodeInputId } from "../model/valueObject/circuitNodeInputId";
import { EvalDelay } from "../model/valueObject/evalDelay";
import type { EvalDuration } from "../model/valueObject/evalDuration";
import { EvalResult } from "../model/valueObject/evalResult";
import { InputRecord } from "../model/valueObject/inputRecord";
import { OutputHistory } from "../model/valueObject/outputHistory";
import type { OutputRecord } from "../model/valueObject/outputRecord";
import { Tick } from "../model/valueObject/tick";

const EXTRA_ITERATION_LIMIT = 20;

interface EmulationOrganizerDependencies {
  circuitEmulatorService: ICircuitEmulatorService;
}

export class EmulationOrganizer implements IEmulationOrganizer {
  private readonly circuitEmulatorService: ICircuitEmulatorService;
  private currentTick: Tick;
  private history: OutputHistory;

  private constructor({ circuitEmulatorService }: EmulationOrganizerDependencies) {
    this.circuitEmulatorService = circuitEmulatorService;
    this.currentTick = Tick.from(0);
    this.history = OutputHistory.from(new Map());
  }

  static from(circuitEmulatorService: ICircuitEmulatorService): IEmulationOrganizer {
    return new EmulationOrganizer({ circuitEmulatorService });
  }

  init(): Result<void, EmulationOrganizerInitializationError> {
    const allNodesInfo = this.circuitEmulatorService.getAllNodesInfo();
    const nodeAmount = allNodesInfo.length;
    const maxDelay = Math.max(0, ...allNodesInfo.map((node) => EvalDelay.unBrand(node.delay)));
    const iterationLimit = nodeAmount * 2 + nodeAmount * maxDelay + EXTRA_ITERATION_LIMIT;

    const inputRecord = InputRecord.from({});
    const entryInputs = this.getEntryInputs();
    entryInputs.forEach((inputId) => {
      inputRecord[inputId] = EvalResult.from(false);
    });

    this.circuitEmulatorService.reset();
    this.currentTick = Tick.from(0);
    this.history = OutputHistory.from(new Map());

    let previousOutputRecord: OutputRecord | null = null;
    let consecutiveStableTicks = 0;
    const stabilityThreshold = maxDelay + 1;
    for (let i = 0; i < iterationLimit; i++) {
      const res = this.circuitEmulatorService.eval(inputRecord);
      if (!res.ok) {
        console.error(res.error);
        return {
          ok: false,
          error: new EmulationOrganizerInitializationError("Initialization of emulation organizer failed.", {
            cause: res.error,
          }),
        };
      }

      const currentOutputRecord: OutputRecord = res.value;

      if (previousOutputRecord && JSON.stringify(previousOutputRecord) === JSON.stringify(currentOutputRecord)) {
        consecutiveStableTicks++;
      } else {
        consecutiveStableTicks = 0;
      }
      if (consecutiveStableTicks >= stabilityThreshold) {
        this.history.set(this.currentTick, currentOutputRecord);
        break;
      }

      previousOutputRecord = currentOutputRecord;
    }

    return { ok: true, value: undefined };
  }

  eval(
    inputRecord: InputRecord,
    duration: EvalDuration,
  ): Result<{ tick: { from: Tick; to: Tick }; output: OutputRecord }, EmulationOrganizerEvalError> {
    const tickFrom = this.currentTick;
    const tickTo = Tick.from(this.currentTick + duration);

    for (let i = 0; i < duration; i++) {
      this.currentTick++;

      const res = this.circuitEmulatorService.eval(inputRecord);
      if (!res.ok) {
        const err = new EmulationOrganizerEvalError("Evaluation failed.", { cause: res.error });
        console.error(err);
        return { ok: false, error: err };
      }

      const outputsRecord = res.value;
      this.history.set(this.currentTick, outputsRecord);
    }

    const finalOutputRecord = this.history.get(tickTo);
    if (!finalOutputRecord) {
      const err = new EmulationOrganizerEvalError("No final output record found.");
      console.error(err);
      return { ok: false, error: err };
    }

    return { ok: true, value: { tick: { from: tickFrom, to: tickTo }, output: finalOutputRecord } };
  }

  getStatus(): EmulationStatus {
    return {
      currentTick: this.currentTick,
    };
  }

  getEntryInputs(): Array<CircuitNodeInputId> {
    const entryInputs = this.circuitEmulatorService.getAllNodesInfo().filter((node) => node.type === "ENTRY");
    const entryInputIds = entryInputs.map((node) => node.id).map(CircuitNodeInputId.from);
    return entryInputIds;
  }

  getOutputsByTick(tick: Tick): OutputRecord | null {
    return this.history.get(tick) ?? null;
  }

  getAllOutputsHistory(): OutputHistory {
    return this.history;
  }
}
