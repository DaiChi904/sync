import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitOverview } from "../entity/circuitOverview";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";

export interface CircuitEmulationPageErrorModel {
  failedToGetCircuitDetailError: boolean;
  failedToGenGuiCircuitDataError: boolean;
  failedToSetupEmulatorServiceError: boolean;
  failedToEvalCircuitError: boolean;
}

export const initialCircuitEmulationPageError: CircuitEmulationPageErrorModel = {
  failedToGetCircuitDetailError: false,
  failedToGenGuiCircuitDataError: false,
  failedToSetupEmulatorServiceError: false,
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
  overview: CircuitOverview | undefined;
  guiData: CircuitGuiData | undefined;
  currentPhase: Phase;
  entryInputs: InputRecord;
  outputs: Record<CircuitNodeId, EvalResult>;
  updateEntryInputs: (nodeID: CircuitNodeId, value: EvalResult) => void;
  evalCircuit: () => void;
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "evalMenu") => void;
}
