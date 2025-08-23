import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitOverview } from "../entity/circuitOverview";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";

export interface CircuitEmulationPageError {
  failedToGetCircuitDetailError: boolean;
  failedToGenGuiCircuitDataError: boolean;
  failedToSetupEmulatorServiceError: boolean;
  failedToEvalCircuitError: boolean;
}

export const circuitEmulationPageError: CircuitEmulationPageError = {
  failedToGetCircuitDetailError: false,
  failedToGenGuiCircuitDataError: false,
  failedToSetupEmulatorServiceError: false,
  failedToEvalCircuitError: false,
};

export interface ICircuitEmulationPageHandler {
  error: CircuitEmulationPageError;
  overview: CircuitOverview | undefined;
  guiData: CircuitGuiData | undefined;
  currentPhase: Phase;
  entryInputs: InputRecord;
  outputs: Record<CircuitNodeId, EvalResult>;
  updateEntryInputs: (nodeID: CircuitNodeId, value: EvalResult) => void;
  evalCircuit: () => void;
  uiState: {
    toolBarMenu: {
      open: "none" | "file" | "view" | "goTo" | "help";
    };
    activityBarMenu: {
      open: "evalMenu";
    };
  };
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "evalMenu") => void;
}
