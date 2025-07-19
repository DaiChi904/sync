"use client";

import { useCallback, useEffect, useState } from "react";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import { type HomePageError, homePageError, type IHomePageHandler } from "@/domain/model/handler/IHomePageHandler";
import { handleValidationError } from "@/domain/model/modelValidationError";
import type { IGetCircuitOverviewsUsecase } from "@/domain/model/usecase/IGetCircuitOverviewsUsecase";
import { useObjectState } from "@/hooks/objectState";

interface HomePageHandlerDependencies {
  getCircuitOverviewsUsecase: IGetCircuitOverviewsUsecase;
}

export const useHomePageHandler = ({ getCircuitOverviewsUsecase }: HomePageHandlerDependencies): IHomePageHandler => {
  const [error, setError] = useObjectState<HomePageError>(homePageError);

  const [circuitOverviews, setCircuitOverviews] = useState<Array<CircuitOverview> | undefined>(undefined);

  const fetch = useCallback((): void => {
    handleValidationError(
      async () => {
        const res = await getCircuitOverviewsUsecase.getOverviews();

        switch (res.ok) {
          case true: {
            setCircuitOverviews(res.value);
            break;
          }
          case false: {
            console.error(res.error);
            setError("failedToGetCircuitOverviewsError", true);
          }
        }
      },
      () => setError("failedToGetCircuitOverviewsError", true),
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
