import type { CircuitOverview } from "../entity/circuitOverview";
import type { PageErrorState } from "./ICircuitEditorPageController";

export const HOME_ERROR_KINDS = ["failedToGetCircuitOverviewsError"] as const;

export type HomeErrorKind = (typeof HOME_ERROR_KINDS)[number];

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
  error: PageErrorState<HomeErrorKind>;
  uiState: HomePageUiStateModel;
  circuitOverviews: Array<CircuitOverview> | undefined;
  changeActivityBarMenu: (kind: "home" | "new") => void;
  addNewCircuit: (kind: "empty") => void;
}
