import type { RefObject } from "react";
import type { CircuitGuiEdge } from "@/domain/model/entity/circuitGuiEdge";
import type { CircuitGuiNode } from "@/domain/model/entity/circuitGuiNode";
import type { CircuitEdgeId } from "@/domain/model/valueObject/circuitEdgeId";
import type { CircuitGuiData } from "@/domain/model/valueObject/circuitGuiData";
import type { CircuitNodeId } from "@/domain/model/valueObject/circuitNodeId";
import type { CircuitNodePinId } from "@/domain/model/valueObject/circuitNodePinId";
import type { Coordinate } from "@/domain/model/valueObject/coordinate";
import type { EvalResult } from "@/domain/model/valueObject/evalResult";
import type { ViewBox } from "@/domain/model/valueObject/viewBox";

export interface CircuitDiagramDataProps {
  guiData: CircuitGuiData;
  outputRecord?: Record<CircuitNodeId, EvalResult>;
}

export interface DiagramDisplayOptions {
  showTouchableArea?: boolean;
}

export interface SelectionHandlers {
  focusedElement?:
    | { kind: "node"; value: CircuitGuiNode }
    | { kind: "edge"; value: CircuitGuiEdge & { waypointIdx: number } }
    | null;
  focusElement?: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge & { waypointIdx: number }) => void;
  };
}

export interface ViewBoxHandlers {
  viewBox?: ViewBox;
  panningRef?: RefObject<boolean>;
  circuitDiagramContainerRef?: RefObject<HTMLDivElement | null>;
  circuitDiagramSvgRef?: RefObject<SVGSVGElement | null>;
  handleViewBoxMouseDown?: (ev: React.MouseEvent) => void;
  handleViewBoxMouseMove?: (ev: React.MouseEvent) => void;
  handleViewBoxMouseUp?: () => void;
  handleViewBoxZoom?: (ev: React.WheelEvent) => void;
  preventBrowserZoom?: (ref: RefObject<SVGSVGElement | null>) => void;
}

/**
 * Node dragging handlers
 */
export interface NodeInteractionHandlers {
  draggingNode?: CircuitGuiNode | null;
  handleNodeMouseDown?: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove?: (ev: React.MouseEvent) => void;
  handleNodeMouseUp?: () => void;
  deleteCircuitNode?: (nodeId: CircuitNodeId) => void;
}

export interface EdgeInteractionHandlers {
  draggingNodePin?: {
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to";
    method: "ADD" | "UPDATE";
  } | null;
  handleNodePinMouseDown?: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to",
    method: "ADD" | "UPDATE",
  ) => void;
  handleNodePinMouseMove?: (ev: React.MouseEvent) => void;
  handleNodePinMouseUp?: (ev: React.MouseEvent) => void;
  tempEdge?: { from: Coordinate; to: Coordinate } | null;
  deleteCircuitEdge?: (edgeId: CircuitEdgeId) => void;
}

export interface WaypointInteractionHandlers {
  addEdgeWaypoint?: (id: CircuitEdgeId) => (at: Coordinate, index: number) => void;
  deleteEdgeWaypoint?: (id: CircuitEdgeId) => (index: number) => void;
  handleWaypointMouseDown?: (
    id: CircuitEdgeId,
  ) => (offset: Coordinate, index: number) => (ev: React.MouseEvent) => void;
  draggingWaypoint?: {
    id: CircuitEdgeId;
    offset: Coordinate;
    index: number;
  } | null;
  handleWaypointMouseMove?: (ev: React.MouseEvent) => void;
  handleWaypointMouseUp?: () => void;
}

export interface UtilityMenuHandlers {
  diagramUtilityMenuState?: {
    open: "none" | "node" | "edge";
    at: Coordinate | null;
  };
  openUtilityMenu?: (kind: "node" | "edge") => (ev: React.MouseEvent) => void;
  closeUtilityMenu?: () => void;
}

export interface CircuitDiagramProps {
  data: CircuitDiagramDataProps;
  display?: DiagramDisplayOptions;
  selection?: SelectionHandlers;
  viewBox?: ViewBoxHandlers;
  nodeInteraction?: NodeInteractionHandlers;
  edgeInteraction?: EdgeInteractionHandlers;
  waypointInteraction?: WaypointInteractionHandlers;
  utilityMenu?: UtilityMenuHandlers;
}
