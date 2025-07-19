"use client";

import { useCallback, useEffect, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import type { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type CircuitViewPageError,
  circuitViewPageError,
  type ICircuitViewPageHandler,
} from "@/domain/model/handler/ICircuitViewPageHandler";
import { handleValidationError } from "@/domain/model/modelValidationError";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { useObjectState } from "@/hooks/objectState";

interface HomePageHandlerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
}

export const useCircuitViewPageHandler = ({
  query,
  getCircuitDetailUsecase,
}: HomePageHandlerDependencies): ICircuitViewPageHandler => {
  const [error, setError] = useObjectState<CircuitViewPageError>(circuitViewPageError);

  const [overview, setOverview] = useState<CircuitOverview | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);

  const fetch = useCallback((): void => {
    handleValidationError(
      async () => {
        const res = await getCircuitDetailUsecase.getById(query);

        switch (res.ok) {
          case true: {
            setOverview(res.value.circuitOverview);
            setGuiData(res.value.guiData);
            break;
          }
          case false: {
            console.error(res.error);
            setError("failedToGetCircuitDetailError", true);
          }
        }
      },
      () => setError("failedToGetCircuitDetailError", true),
    );
  }, [query, getCircuitDetailUsecase, setError]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    error,
    overview,
    guiData,
  };
};
