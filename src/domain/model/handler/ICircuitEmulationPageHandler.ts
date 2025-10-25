import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { EvalDuration } from "../valueObject/evalDuration";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Tick } from "../valueObject/tick";

export interface CircuitEmulationPageErrorModel {
  emulationEnvironmentCreationError: boolean;
  failedToEvalCircuitError: boolean;
}

export const initialCircuitEmulationPageError: CircuitEmulationPageErrorModel = {
  emulationEnvironmentCreationError: false,
  failedToEvalCircuitError: false,
};

export interface CircuitEmulationPageUiStateModel {
  toolBarMenu: {
    open: "none" | "file" | "view" | "goTo" | "help";
  };
  activityBarMenu: {
    open: "evalMenu";
  };
}

export class CircuitEmulationPageHandlerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulationPageHandlerError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEmulationPageHandler {
  error: CircuitEmulationPageErrorModel;
  uiState: CircuitEmulationPageUiStateModel;
  circuit: Circuit | undefined;
  guiData: CircuitGuiData | undefined;
  currentTick: Tick;
  evalDuration: EvalDuration;
  entryInputs: InputRecord;
  outputs: Record<CircuitNodeId, EvalResult>;
  updateEntryInputs: (nodeID: CircuitNodeId, value: EvalResult) => void;
  evalCircuit: () => void;
  changeEvalDuration: (duration: EvalDuration) => void;
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "evalMenu") => void;
}
