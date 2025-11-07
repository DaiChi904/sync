import type { CircuitOverview } from "../entity/circuitOverview";
import type { CircuitGuiData } from "../valueObject/circuitGuiData";

export interface CircuitViewPageErrorModel {
  failedToGetCircuitDetailError: boolean;
  failedToParseCircuitDataError: boolean;
}

export const initialCircuitViewPageError: CircuitViewPageErrorModel = {
  failedToGetCircuitDetailError: false,
  failedToParseCircuitDataError: false,
};

export interface CircuitViewPageUiStateModel {
  toolBarMenu: {
    open: "none" | "file" | "view" | "goTo" | "help";
  };
  activityBarMenu: {
    open: "infomation" | "circuitDiagram";
  };
}

export class CircuitViewPageHandlerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "HomePageHandlerError";
    this.cause = options?.cause;
  }
}

export interface ICircuitViewPageHandler {
  error: CircuitViewPageErrorModel;
  uiState: CircuitViewPageUiStateModel;
  overview: CircuitOverview | undefined;
  guiData: CircuitGuiData | undefined;
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "infomation" | "circuitDiagram") => void;
}
