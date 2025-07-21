"use client";

import { useCallback, useEffect, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type CircuitViewPageError,
  circuitViewPageError,
  type ICircuitViewPageHandler,
} from "@/domain/model/handler/ICircuitViewPageHandler";
import { handleValidationError } from "@/domain/model/modelValidationError";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { useObjectState } from "@/hooks/objectState";

interface CircuitViewPageHandlerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  circuitParserUsecase: ICircuitParserService;
}

export const useCircuitViewPageHandler = ({
  query,
  getCircuitDetailUsecase,
  circuitParserUsecase,
}: CircuitViewPageHandlerDependencies): ICircuitViewPageHandler => {
  const [error, setError] = useObjectState<CircuitViewPageError>(circuitViewPageError);

  const [overview, setOverview] = useState<CircuitOverview | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);

  const fetch = useCallback((): void => {
    handleValidationError(
      async () => {
        const circuitDetail = await getCircuitDetailUsecase.getById(query);
        if (!circuitDetail.ok) {
          console.error(circuitDetail.error);
          setError("failedToGetCircuitDetailError", true);
          return;
        }

        const circuitGuiData = circuitParserUsecase.parseToGuiData(circuitDetail.value.circuitData);
        if (!circuitGuiData.ok) {
          console.error(circuitGuiData.error);
          setError("failedToParseCircuitDataError", true);
          return;
        }

        setOverview(
          CircuitOverview.from({
            id: circuitDetail.value.id,
            title: circuitDetail.value.title,
            description: circuitDetail.value.description,
            createdAt: circuitDetail.value.createdAt,
            updatedAt: circuitDetail.value.updatedAt,
          }),
        );
        setGuiData(circuitGuiData.value);
      },
      () => setError("failedToGetCircuitDetailError", true),
    );
  }, [query, getCircuitDetailUsecase, setError, circuitParserUsecase]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    error,
    overview,
    guiData,
  };
};
