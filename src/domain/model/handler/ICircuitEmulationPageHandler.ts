import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitOverview } from "../entity/circuitOverview";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Phase } from "../valueObject/phase";

export interface CircuitEmulationPageError {
  failedToGetCircuitDetailError: boolean;
  failedToParseCircuitDataError: boolean;
  failedToGenerateEmulatorServiceError: boolean;
  failedToSetupError: boolean;
  failedToEvalCircuitError: boolean;
}

export const circuitEmulationPageError: CircuitEmulationPageError = {
  failedToGetCircuitDetailError: false,
  failedToParseCircuitDataError: false,
  failedToGenerateEmulatorServiceError: false,
  failedToSetupError: false,
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
}
