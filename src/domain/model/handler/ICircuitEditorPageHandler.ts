import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../entity/circuitGuiData";
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
  failedToSaveCircuitError: boolean;
}

export const circuitEditorPageError: CircuitEditorPageError = {
  failedToGetCircuitDetailError: false,
  failedToParseCircuitDataError: false,
  failedToUpdateCircuitDataError: false,
  failedToSaveCircuitError: false,
};

export interface ICircuitEditorPageHandler {
  error: CircuitEditorPageError;
  circuit: Circuit | undefined;
  guiData: CircuitGuiData | undefined;
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
}
