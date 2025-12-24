"use client";

import { useEffect } from "react";
import {
  CIRCUIT_EMULATION_ERROR_KINDS,
  type CircuitEmulationErrorKind,
  type ICircuitEmulationPageController,
} from "@/domain/model/controller/ICircuitEmulationPageController";
import type { ICreateEmulationSessionUsecase } from "@/domain/model/usecase/ICreateEmulationSessionUsecase";
import type { IGetCircuitDetailUsecase } from "@/domain/model/usecase/IGetCircuitDetailUsecase";
import type { CircuitId } from "@/domain/model/valueObject/circuitId";
import type { CircuitParserService } from "@/domain/service/circuitParserService";
import { useCircuitDiagram } from "@/hooks/circuitDiagram";
import { usePartialState } from "@/hooks/partialState";
import { usePageError } from "@/hooks/usePageError";
import { useViewBox } from "@/hooks/viewBox";
import { useEmulationSessionSubController } from "./emulationSessionSubController";
import { useUiStateSubController } from "./uiStateSubController";

export interface CircuitEmulationPageControllerDependencies {
  query: CircuitId;
  getCircuitDetailUsecase: IGetCircuitDetailUsecase;
  createEmulationSessionUsecase: ICreateEmulationSessionUsecase;
  circuitParserUsecase: CircuitParserService;
}

export const useCircuitEmulationPageController = ({
  query,
  getCircuitDetailUsecase,
  createEmulationSessionUsecase,
  circuitParserUsecase,
}: CircuitEmulationPageControllerDependencies): ICircuitEmulationPageController => {
  const pageError = usePageError<CircuitEmulationErrorKind>([...CIRCUIT_EMULATION_ERROR_KINDS]);
  const [uiState, setUiState] = usePartialState<ICircuitEmulationPageController["uiState"]>({
    toolBarMenu: { open: "none" },
    activityBarMenu: { open: "evalMenu" },
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

  // Emulation Session Sub-Controller
  const emulationSession = useEmulationSessionSubController({
    query,
    getCircuitDetailUsecase,
    createEmulationSessionUsecase,
    circuitParserUsecase,
    setError: pageError.setError,
  });

  // UI State Sub-Controller
  const uiStateController = useUiStateSubController({
    setUiState,
  });

  useEffect(() => {
    emulationSession.fetch();
  }, [emulationSession.fetch]);

  useEffect(() => {
    if (!isViewBoxInitialized && emulationSession.guiData) {
      initViewBox(emulationSession.guiData);
    }
  }, [isViewBoxInitialized, initViewBox, emulationSession.guiData]);

  useEffect(() => {
    emulationSession.initializeCircuit();
  }, [emulationSession.initializeCircuit]);

  useEffect(() => {
    emulationSession.initializeSession();
  }, [emulationSession.initializeSession]);

  return {
    error: pageError,
    uiState,
    circuit: emulationSession.circuit,
    guiData: emulationSession.guiData,
    currentTick: emulationSession.currentTick,
    evalDuration: emulationSession.evalDuration,
    entryInputs: emulationSession.entryInputs,
    outputs: emulationSession.outputs,
    viewBox,
    circuitDiagramContainerRef,
    circuitDiagramSvgRef,
    panningRef,
    handleViewBoxMouseDown,
    handleViewBoxMouseMove,
    handleViewBoxMouseUp,
    handleViewBoxZoom,
    preventBrowserZoom,
    updateEntryInputs: emulationSession.updateEntryInputs,
    evalCircuit: emulationSession.evalCircuit,
    changeEvalDuration: emulationSession.changeEvalDuration,
    openToolBarMenu: uiStateController.openToolBarMenu,
    closeToolBarMenu: uiStateController.closeToolBarMenu,
    changeActivityBarMenu: uiStateController.changeActivityBarMenu,
  };
};
