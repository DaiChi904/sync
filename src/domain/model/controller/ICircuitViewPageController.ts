import type { RefObject } from "react";
import type { CircuitOverview } from "../entity/circuitOverview";
import type { CircuitGuiData } from "../valueObject/circuitGuiData";
import type { ViewBox } from "../valueObject/viewBox";
import type { ToolBarMenuState } from "./common/uiState";
import type { PageErrorState } from "./ICircuitEditorPageController";

export const CIRCUIT_VIEW_ERROR_KINDS = ["failedToGetCircuitDetailError", "failedToParseCircuitDataError"] as const;

export type CircuitViewErrorKind = (typeof CIRCUIT_VIEW_ERROR_KINDS)[number];

export interface CircuitViewPageUiStateModel {
  toolBarMenu: ToolBarMenuState;
  activityBarMenu: {
    open: "infomation" | "circuitDiagram";
  };
}

export class CircuitViewPageControllerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "HomePageControllerError";
    this.cause = options?.cause;
  }
}

export interface ICircuitViewPageController {
  error: PageErrorState<CircuitViewErrorKind>;
  uiState: CircuitViewPageUiStateModel;
  overview: CircuitOverview | undefined;
  guiData: CircuitGuiData | undefined;
  viewBox: ViewBox;
  circuitDiagramContainerRef: RefObject<HTMLDivElement | null>;
  circuitDiagramSvgRef: RefObject<SVGSVGElement | null>;
  panningRef: RefObject<boolean>;
  handleViewBoxMouseDown: (ev: React.MouseEvent) => void;
  handleViewBoxMouseMove: (ev: React.MouseEvent) => void;
  handleViewBoxMouseUp: () => void;
  handleViewBoxZoom: (ev: React.WheelEvent) => void;
  preventBrowserZoom: (ref: RefObject<SVGSVGElement | null>) => void;
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "infomation" | "circuitDiagram") => void;
}
