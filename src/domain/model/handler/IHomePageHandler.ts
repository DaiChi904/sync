import type { CircuitOverview } from "../entity/circuitOverview";

export interface HomePageError {
  failedToGetCircuitOverviewsError: boolean;
}

export const homePageError: HomePageError = {
  failedToGetCircuitOverviewsError: false,
};

export interface IHomePageHandler {
  error: HomePageError;
  uiState: {
    tab: { open: "home" | "new" };
  };
  circuitOverviews: Array<CircuitOverview> | undefined;
  changeActivityBarMenu: (kind: "home" | "new") => void;
  addNewCircuit: (kind: "empty") => void;
}
