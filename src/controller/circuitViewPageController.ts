"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CircuitViewPageControllerError,
  CIRCUIT_VIEW_ERROR_KINDS,
  type CircuitViewErrorKind,
  type CircuitViewPageUiStateModel,
  type ICircuitViewPageController,
} from "@/domain/model/controller/ICircuitViewPageController";
import { CircuitOverview } from "@/domain/model/entity/circuitOverview";
import type { ICircuitParserService } from "@/domain/model/service/ICircuitParserService";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import { useCircuitDiagram } from "@/hooks/circuitDiagram";
import { usePageError } from "@/hooks/usePageError";
import { usePartialState } from "@/hooks/partialState";
import { useViewBox } from "@/hooks/viewBox";

interface CircuitViewPageControllerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  circuitParserUsecase: ICircuitParserService;
}

export const useCircuitViewPageController = ({
  query,
  getCircuitDetailUsecase,
  circuitParserUsecase,
}: CircuitViewPageControllerDependencies): ICircuitViewPageController => {
  const pageError = usePageError<CircuitViewErrorKind>([...CIRCUIT_VIEW_ERROR_KINDS]);
  const [uiState, setUiState] = usePartialState<CircuitViewPageUiStateModel>({
    toolBarMenu: { open: "none" },
    activityBarMenu: { open: "infomation" },
  });

  const {
    isViewBoxInitialized,
    viewBox,
    circuitDiagramContainerRef,
    circuitDiagramSvgRef,
    panningRef,
    initViewBox,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
  } = useCircuitDiagram(useViewBox());

  const [overview, setOverview] = useState<CircuitOverview>();
  const [guiData, setGuiData] = useState<CircuitGuiData>();

  const fetch = useCallback(async (): Promise<void> => {
    const circuitDetail = await getCircuitDetailUsecase.getById(query);
    if (!circuitDetail.ok) {
      const err = new CircuitViewPageControllerError("Failed to get circuit detail.", {
        cause: circuitDetail.error,
      });
      console.error(err);

      pageError.setError("failedToGetCircuitDetailError");
      pageError.setError("failedToParseCircuitDataError");
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
      const err = new CircuitViewPageControllerError("Failed to parse circuit data.", {
        cause: circuitGuiData.error,
      });
      console.error(err);

      pageError.setError("failedToParseCircuitDataError");
      return;
    }

    setGuiData(circuitGuiData.value);
  }, [query, getCircuitDetailUsecase, pageError.setError, circuitParserUsecase]);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: If dependencies are not exhaustive, it will cause infinite rendering.
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (!isViewBoxInitialized && guiData) {
      initViewBox(guiData);
    }
  }, [isViewBoxInitialized, initViewBox, guiData]);

  return {
    error: pageError,
    uiState,
    overview,
    guiData,
    viewBox,
    circuitDiagramContainerRef,
    circuitDiagramSvgRef,
    panningRef,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
    openToolBarMenu,
    closeToolBarMenu,
    changeActivityBarMenu,
  };
};
