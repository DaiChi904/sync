"use client";

import { useCallback, useEffect, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type CircuitViewPageError,
  circuitViewPageError,
  type ICircuitViewPageHandler,
} from "@/domain/model/handler/ICircuitViewPageHandler";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { useObjectState } from "@/hooks/objectState";
import { Attempt } from "@/utils/attempt";

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

  const fetch = useCallback(async (): Promise<void> => {
    await Attempt.asyncProceed(
      async () => {
        const circuitDetail = await getCircuitDetailUsecase.getById(query);
        if (!circuitDetail.ok) {
          throw new Attempt.Abort("circuitViewPageHandler.fetch", "Failed to get circuit detail.", {
            cause: circuitDetail.error,
            tag: "getCircuitDetail",
          });
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

        const circuitGuiData = circuitParserUsecase.parseToGuiData(circuitDetail.value.circuitData);
        if (!circuitGuiData.ok) {
          throw new Attempt.Abort("circuitViewPageHandler.fetch", "Failed to parse circuit data.", {
            cause: circuitGuiData.error,
            tag: "parseCircuitData",
          });
        }

        setGuiData(circuitGuiData.value);
      },
      (err: unknown) => {
        switch (true) {
          case Attempt.isAborted(err) && err.tag === "getCircuitDetail": {
            setError("failedToGetCircuitDetailError", true);
            setError("failedToParseCircuitDataError", true);
            break;
          }
          case Attempt.isAborted(err) && err.tag === "parseCircuitData": {
            setError("failedToParseCircuitDataError", true);
            break;
          }
          default: {
            setError("failedToGetCircuitDetailError", true);
            setError("failedToParseCircuitDataError", true);
            break;
          }
        }
      },
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
