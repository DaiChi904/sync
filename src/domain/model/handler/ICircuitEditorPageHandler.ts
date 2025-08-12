import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitGuiEdge } from "../entity/circuitGuiEdge";
import type { CircuitGuiNode } from "../entity/circuitGuiNode";
import type { CircuitEdgeId } from "../valueObject/circuitEdgeId";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "../valueObject/circuitNodeSize";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
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
  svgRef: React.RefObject<SVGSVGElement | null>;
  focusedElement: { kind: "node"; value: CircuitGuiNode } | { kind: "edge"; value: CircuitGuiEdge } | null;
  focusElement: {
    (kind: "node"): (value: CircuitGuiNode) => void;
    (kind: "edge"): (value: CircuitGuiEdge) => void;
  };
  draggingNode: CircuitGuiNode | null;
  handleNodeMouseDown: (ev: React.MouseEvent, node: CircuitGuiNode) => void;
  handleNodeMouseMove: (ev: React.MouseEvent) => void;
  handleNodeMouseUp: () => void;
  draggingNodePin: {
    id: CircuitNodePinId;
    offset: Coordinate;
    kind: "from" | "to" | "waypoints";
    method: "ADD" | "UPDATE";
  } | null;
  handleNodePinMouseDown: (
    ev: React.MouseEvent,
    id: CircuitNodePinId,
    kind: "from" | "to" | "waypoints",
    method: "ADD" | "UPDATE",
  ) => void;
  handleNodePinMouseMove: (ev: React.MouseEvent) => void;
  handleNodePinMouseUp: (ev: React.MouseEvent) => void;
  tempEdge: { from: Coordinate; to: Coordinate } | null;
  uiState: {
    isOpenEdgeUtilityMenu: { open: boolean; at: Coordinate | null };
    isOpenNodeUtilityMenu: { open: boolean; at: Coordinate | null };
  };
  openEdgeUtilityMenu: (ev: React.MouseEvent) => void;
  closeEdgeUtilityMenu: () => void;
  openNodeUtilityMenu: (ev: React.MouseEvent) => void;
  closeNodeUtilityMenu: () => void;
}
