import type { CircuitOverview } from "../entity/circuitOverview";

export interface HomePageError {
  failedToGetCircuitOverviewsError: boolean;
}

export const homePageError: HomePageError = {
  failedToGetCircuitOverviewsError: false,
};

export interface IHomePageHandler {
  error: HomePageError;
  circuitOverviews: Array<CircuitOverview> | undefined;
}
