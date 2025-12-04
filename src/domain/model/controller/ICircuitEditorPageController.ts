import type { RefObject } from "react";
import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiEdge } from "../entity/circuitGuiEdge";
import type { CircuitGuiNode } from "../entity/circuitGuiNode";
import type { CircuitNode } from "../entity/circuitNode";
import type { CircuitDescription } from "../valueObject/circuitDescription";
import type { CircuitEdgeId } from "../valueObject/circuitEdgeId";
import type { CircuitGuiData } from "../valueObject/circuitGuiData";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { CircuitTitle } from "../valueObject/circuitTitle";
import type { Coordinate } from "../valueObject/coordinate";
import type { ViewBox } from "../valueObject/viewBox";

export interface CircuitEditorPageErrorModel {
  failedToGetCircuitDetailError: boolean;
  failedToParseCircuitDataError: boolean;
  failedToUpdateCircuitDataError: boolean;
  failedToRenderCircuitError: boolean;
  failedToSaveCircuitError: boolean;
}

export const initialCircuitEditorPageError: CircuitEditorPageErrorModel = {
  failedToGetCircuitDetailError: false,
  failedToParseCircuitDataError: false,
  failedToUpdateCircuitDataError: false,
  failedToRenderCircuitError: false,
  failedToSaveCircuitError: false,
};

export interface CircuitEditorPageUiStateModel {
  toolbarMenu: { open: "none" | "file" | "view" | "help" };
  diagramUtilityMenu: { open: "none" | "edge" | "node"; at: Coordinate | null };
  toolBarMenu: { open: "none" | "file" | "view" | "goTo" | "help" };
  activityBarMenu: { open: "infomation" | "circuitDiagram" | "rowCircuitData" };
  showGridLines: boolean;
}

export class CircuitEditorPageControllerError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CircuitEditorPageControllerError";
    this.cause = options?.cause;
  }
}

export interface ICircuitEditorPageController {
  error: CircuitEditorPageErrorModel;
  uiState: CircuitEditorPageUiStateModel;
  circuit: Circuit | undefined;
  guiData: CircuitGuiData | undefined;
  viewBox: ViewBox;
  activeSnap: {
    x: Coordinate | null;
    y: Coordinate | null;
  };
  panningRef: React.RefObject<boolean>;
  handleViewBoxMouseDown: (ev: React.MouseEvent) => void;
  handleViewBoxMouseMove: (ev: React.MouseEvent) => void;
  handleViewBoxMouseUp: () => void;
  handleViewBoxZoom: (ev: React.WheelEvent) => void;
  preventBrowserZoom: (ref: RefObject<SVGSVGElement | null>) => void;
  save: () => void;
  deleteCircuit: () => void;
  changeTitle: (title: CircuitTitle) => void;
  changeDescription: (description: CircuitDescription) => void;
  addCircuitNode: (newNode: CircuitNode) => void;
  deleteCircuitNode: (nodeId: CircuitNodeId) => void;
  deleteCircuitEdge: (edgeId: CircuitEdgeId) => void;
  circuitDiagramContainer: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  focusedElement:
    | { kind: "node"; value: CircuitGuiNode }
    | { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } }
    | null;
  focusElement: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge & { waypointIdx: number }) => void;
  };
  draggingNode: CircuitGuiNode | null;
  handleNodeMouseDown: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove: (ev: React.MouseEvent) => void;
  handleNodeMouseUp: () => void;
  draggingNodePin: {
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to";
    method: "ADD" | "UPDATE";
  } | null;
  handleNodePinMouseDown: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => void;
  handleNodePinMouseMove: (ev: React.MouseEvent) => void;
  handleNodePinMouseUp: (ev: React.MouseEvent) => void;
  tempEdge: { from: Coordinate; to: Coordinate } | null;
  addEdgeWaypoint: (id: CircuitEdgeId) => (at: Coordinate, index: number) => void;
  deleteEdgeWaypoint: (id: CircuitEdgeId) => (index: number) => void;
  draggingWaypoint: {
    id: CircuitEdgeId;
    offset: Coordinate;
    index: number;
  } | null;
  handleWaypointMouseDown: (id: CircuitEdgeId) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => void;
  handleWaypointMouseMove: (ev: React.MouseEvent) => void;
  handleWaypointMouseUp: () => void;
  openUtilityMenu: (kind: "node" | "edge") => (ev: React.MouseEvent) => void;
  closeUtilityMenu: () => void;
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "infomation" | "circuitDiagram" | "rowCircuitData") => void;
  toggleShowGridLines: () => void;
}
