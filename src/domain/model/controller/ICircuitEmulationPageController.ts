import type { RefObject } from "react";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../valueObject/circuitGuiData";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { EvalDuration } from "../valueObject/evalDuration";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Tick } from "../valueObject/tick";
import type { ViewBox } from "../valueObject/viewBox";

export interface CircuitEmulationPageErrorModel {
  guiRenderError: boolean;
  emulationEnvironmentCreationError: boolean;
  failedToEvalCircuitError: boolean;
}

export const initialCircuitEmulationPageError: CircuitEmulationPageErrorModel = {
  guiRenderError: false,
  emulationEnvironmentCreationError: false,
  failedToEvalCircuitError: false,
};

export interface CircuitEmulationPageUiStateModel {
  toolBarMenu: {
    open: "none" | "file" | "view" | "goTo" | "help";
  };
  activityBarMenu: {
    open: "evalMenu";
  };
}

export class CircuitEmulationPageControllerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulationPageControllerError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEmulationPageController {
  error: CircuitEmulationPageErrorModel;
  uiState: CircuitEmulationPageUiStateModel;
  circuit: Circuit | undefined;
  guiData: CircuitGuiData | undefined;
  currentTick: Tick;
  evalDuration: EvalDuration;
  entryInputs: InputRecord;
  outputs: Record<CircuitNodeId, EvalResult>;
  viewBox: ViewBox;
  circuitDiagramContainerRef: RefObject<HTMLDivElement | null>;
  circuitDiagramSvgRef: RefObject<SVGSVGElement | null>;
  panningRef: RefObject<boolean>;
  handleViewBoxMouseDown: (ev: React.MouseEvent) => void;
  handleViewBoxMouseMove: (ev: React.MouseEvent) => void;
  handleViewBoxMouseUp: () => void;
  handleViewBoxZoom: (ev: React.WheelEvent) => void;
  preventBrowserZoom: (ref: RefObject<SVGSVGElement | null>) => void;
  updateEntryInputs: (nodeID: CircuitNodeId, value: EvalResult) => void;
  evalCircuit: () => void;
  changeEvalDuration: (duration: EvalDuration) => void;
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "evalMenu") => void;
}
