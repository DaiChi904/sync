import type { RefObject } from "react";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../valueObject/circuitGuiData";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { EvalDuration } from "../valueObject/evalDuration";
import type { EvalResult } from "../valueObject/evalResult";
import type { InputRecord } from "../valueObject/inputRecord";
import type { Tick } from "../valueObject/tick";
import type { ViewBox } from "../valueObject/viewBox";
import type { EmulationActivityBarMenuState, ToolBarMenuState } from "./common/uiState";
import type { PageErrorState } from "./ICircuitEditorPageController";

/** Error kinds for Circuit Emulation page */
export const CIRCUIT_EMULATION_ERROR_KINDS = [
  "guiRenderError",
  "emulationEnvironmentCreationError",
  "failedToEvalCircuitError",
] as const;

export type CircuitEmulationErrorKind = (typeof CIRCUIT_EMULATION_ERROR_KINDS)[number];

export interface CircuitEmulationPageUiStateModel {
  toolBarMenu: ToolBarMenuState;
  activityBarMenu: EmulationActivityBarMenuState;
}

export class CircuitEmulationPageControllerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEmulationPageControllerError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEmulationPageController {
  error: PageErrorState<CircuitEmulationErrorKind>;
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
