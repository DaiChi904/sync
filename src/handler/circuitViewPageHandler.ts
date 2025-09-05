"use client";

import { useCallback, useEffect, useState } from "react";
import type { CircuitGuiData } from "@/domain/model/entity/circuitGuiData";
import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import {
  type CircuitViewPageErrorModel,
  CircuitViewPageHandlerError,
  type CircuitViewPageUiStateModel,
  type ICircuitViewPageHandler,
  initialCircuitViewPageError,
} from "@/domain/model/handler/ICircuitViewPageHandler";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { usePartialState } from "@/hooks/partialState";

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
  const [error, setError] = usePartialState<CircuitViewPageErrorModel>(initialCircuitViewPageError);
  const [uiState, setUiState] = usePartialState<CircuitViewPageUiStateModel>({
    toolBarMenu: { open: "none" },
    activityBarMenu: { open: "infomation" },
  });

  const [overview, setOverview] = useState<CircuitOverview | undefined>(undefined);
  const [guiData, setGuiData] = useState<CircuitGuiData | undefined>(undefined);

  const fetch = useCallback(async (): Promise<void> => {
    const circuitDetail = await getCircuitDetailUsecase.getById(query);
    if (!circuitDetail.ok) {
      const err = new CircuitViewPageHandlerError("Failed to get circuit detail.", {
        cause: circuitDetail.error,
      });
      console.error(err);

      setError("failedToGetCircuitDetailError", true);
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

    const circuitGuiData = circuitParserUsecase.parseToGuiData(circuitDetail.value.circuitData);
    if (!circuitGuiData.ok) {
      const err = new CircuitViewPageHandlerError("Failed to parse circuit data.", {
        cause: circuitGuiData.error,
      });
      console.error(err);

      setError("failedToParseCircuitDataError", true);
      return;
    }

    setGuiData(circuitGuiData.value);
  }, [query, getCircuitDetailUsecase, setError, circuitParserUsecase]);

  const openToolBarMenu = useCallback(
    (kind: "file" | "view" | "goTo" | "help") => {
      setUiState("toolBarMenu", { open: kind });
    },
    [setUiState],
  );

  const closeToolBarMenu = useCallback(() => {
    setUiState("toolBarMenu", { open: "none" });
  }, [setUiState]);

  const changeActivityBarMenu = useCallback(
    (kind: "infomation" | "circuitDiagram") => {
      setUiState("activityBarMenu", { open: kind });
    },
    [setUiState],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    error,
    uiState,
    overview,
    guiData,
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  };
};
