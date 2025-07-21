import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitOverview } from "../entity/circuitOverview";

export interface CircuitViewPageError {
  failedToGetCircuitDetailError: boolean;
  failedToParseCircuitDataError: boolean;
}

export const circuitViewPageError: CircuitViewPageError = {
  failedToGetCircuitDetailError: false,
  failedToParseCircuitDataError: false,
};

export interface ICircuitViewPageHandler {
  error: CircuitViewPageError;
  overview: CircuitOverview | undefined;
  guiData: CircuitGuiData | undefined;
}
