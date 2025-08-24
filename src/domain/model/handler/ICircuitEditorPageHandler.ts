import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitGuiEdge } from "../entity/circuitGuiEdge";
import type { CircuitGuiNode } from "../entity/circuitGuiNode";
import type { CircuitDescription } from "../valueObject/circuitDescription";
import type { CircuitEdgeId } from "../valueObject/circuitEdgeId";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "../valueObject/circuitNodeSize";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { CircuitTitle } from "../valueObject/circuitTitle";
import type { Coordinate } from "../valueObject/coordinate";
import type { Waypoint } from "../valueObject/waypoint";

export interface CircuitEditorPageError {
  failedToGetCircuitDetailError: boolean;
  failedToParseCircuitDataError: boolean;
  failedToUpdateCircuitDataError: boolean;
  failedToRenderCircuitError: boolean;
  failedToSaveCircuitError: boolean;
}

export const circuitEditorPageError: CircuitEditorPageError = {
  failedToGetCircuitDetailError: false,
  failedToParseCircuitDataError: false,
  failedToUpdateCircuitDataError: false,
  failedToRenderCircuitError: false,
  failedToSaveCircuitError: false,
};

export interface ICircuitEditorPageHandler {
  error: CircuitEditorPageError;
  circuit: Circuit | undefined;
  guiData: CircuitGuiData | undefined;
  viewBox: { x: number; y: number; w: number; h: number } | undefined;
  isPanningRef: React.RefObject<boolean>;
  handleMouseDown: (ev: React.MouseEvent) => void;
  handleMouseMove: (ev: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleWheel: (ev: React.WheelEvent) => void;
  preventBrowserZoom: (ref: React.RefObject<SVGSVGElement | null>) => void;
  save: () => void;
  changeTitle: (title: CircuitTitle) => void;
  changeDescription: (description: CircuitDescription) => void;
  addCircuitNode: (newNode: {
    id: CircuitNodeId;
    type: CircuitNodeType;
    inputs: CircuitNodePinId[];
    outputs: CircuitNodePinId[];
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }) => void;
  updateCircuitNode: (newNode: {
    id: CircuitNodeId;
    type: CircuitNodeType;
    inputs: CircuitNodePinId[];
    outputs: CircuitNodePinId[];
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }) => void;
  deleteCircuitNode: (nodeId: CircuitNodeId) => void;
  addCircuitEdge: (newEdge: {
    id: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    waypoints: Waypoint | null;
  }) => void;
  updateCircuitEdge: (newEdge: {
    id: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    waypoints: Waypoint | null;
  }) => void;
  deleteCircuitEdge: (edgeId: CircuitEdgeId) => void;
  circuitDiagramContainer: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
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
  uiState: {
    toolbarMenu: { open: "none" | "file" | "view" | "help" };
    diagramUtilityMenu: { open: "none" | "edge" | "node"; at: Coordinate | null };
    toolBarMenu: { open: "none" | "file" | "view" | "goTo" | "help" };
    activityBarMenu: { open: "infomation" | "circuitDiagram" | "rowCircuitData" };
  };
  openUtilityMenu: (kind: "node" | "edge") => (ev: React.MouseEvent) => void;
  closeUtilityMenu: () => void;
  openToolBarMenu: (kind: "file" | "view" | "goTo" | "help") => void;
  closeToolBarMenu: () => void;
  changeActivityBarMenu: (kind: "infomation" | "circuitDiagram" | "rowCircuitData") => void;
}
