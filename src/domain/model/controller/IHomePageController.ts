import type { CircuitOverview } from "../entity/circuitOverview";

export interface HomePageErrorModel {
  failedToGetCircuitOverviewsError: boolean;
}

export const initialHomePageError: HomePageErrorModel = {
  failedToGetCircuitOverviewsError: false,
};

export interface HomePageUiStateModel {
  tab: { open: "home" | "new" };
}

export class HomePageControllerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "HomePageControllerError";
    this.cause = options?.cause;
  }
}

export interface IHomePageController {
  error: HomePageErrorModel;
  uiState: HomePageUiStateModel;
  circuitOverviews: Array<CircuitOverview> | undefined;
  changeActivityBarMenu: (kind: "home" | "new") => void;
  addNewCircuit: (kind: "empty") => void;
}
