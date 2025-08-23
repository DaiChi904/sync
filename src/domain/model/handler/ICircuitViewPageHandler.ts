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
  uiState: {
    toolBarMenu: {
      open: "none" | "file" | "view" | "goTo" | "help";
    };
    activityBarMenu: {
      open: "infomation" | "circuitDiagram";
    };
  };
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "infomation" | "circuitDiagram") => void;
}
