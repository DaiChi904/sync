"use client";

import { useCallback, useEffect, useState } from "react";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import { type HomePageError, homePageError, type IHomePageHandler } from "@/domain/model/handler/IHomePageHandler";
import type { IGetCircuitOverviewsUsecase } from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";
import { useObjectState } from "@/hooks/objectState";
import { Attempt } from "@/utils/attempt";

interface HomePageHandlerDependencies {
  getCircuitOverviewsUsecase: IGetCircuitOverviewsUsecase;
}

export const useHomePageHandler = ({ getCircuitOverviewsUsecase }: HomePageHandlerDependencies): IHomePageHandler => {
  const [error, setError] = useObjectState<HomePageError>(homePageError);

  const [circuitOverviews, setCircuitOverviews] = useState<Array<CircuitOverview> | undefined>(undefined);

  const fetch = useCallback(async (): Promise<void> => {
    await Attempt.asyncProceed(
      async () => {
        const circuitOverviews = await getCircuitOverviewsUsecase.getOverviews();
        if (!circuitOverviews.ok) {
          throw new Attempt.Abort("homePageHandler.fetch", "Failed to get circuit overviews.", {
            cause: circuitOverviews.error,
          });
        }

        setCircuitOverviews(circuitOverviews.value);
      },
      () => {
        setError("failedToGetCircuitOverviewsError", true);
      },
    );
  }, [getCircuitOverviewsUsecase, setError]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    error,
    circuitOverviews,
  };
};
