import type { Circuit } from "../aggregate/circuit";
import type { CircuitGuiData } from "../entity/circuitGuiData";
import type { CircuitEdgeId } from "../valueObject/circuitEdgeId";
import type { CircuitNodeId } from "../valueObject/circuitNodeId";
import type { CircuitNodePinId } from "../valueObject/circuitNodePinId";
import type { CircuitNodeSize } from "../valueObject/circuitNodeSize";
import type { CircuitNodeType } from "../valueObject/circuitNodeType";
import type { Coordinate } from "../valueObject/coordinate";

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
  circuitEditorData:
    | {
        node: Array<{
          type: "Node";
          nodeId: CircuitNodeId;
          nodeType: CircuitNodeType;
          inputs: CircuitNodePinId[];
          outputs: CircuitNodePinId[];
          coordinate: Coordinate;
          size: CircuitNodeSize;
        }>;
        edge: Array<{
          type: "Edge";
          edgeId: CircuitEdgeId;
          from: CircuitNodePinId;
          to: CircuitNodePinId;
          waypoints: Coordinate[];
        }>;
      }
    | undefined;
  save: () => void;
  addCircuitNode: (newNode: {
    type: "Node";
    nodeId: CircuitNodeId;
    nodeType: CircuitNodeType;
    inputs: CircuitNodePinId[];
    outputs: CircuitNodePinId[];
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }) => void;
  updateCircuitNode: (newNode: {
    type: "Node";
    nodeId: CircuitNodeId;
    nodeType: CircuitNodeType;
    inputs: CircuitNodePinId[];
    outputs: CircuitNodePinId[];
    coordinate: Coordinate;
    size: CircuitNodeSize;
  }) => void;
  deleteCircuitNode: (nodeId: CircuitNodeId) => void;
  addCircuitEdge: (newEdge: {
    type: "Edge";
    edgeId: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    waypoints: Coordinate[];
  }) => void;
  updateCircuitEdge: (newEdge: {
    type: "Edge";
    edgeId: CircuitEdgeId;
    from: CircuitNodePinId;
    to: CircuitNodePinId;
    waypoints: Coordinate[];
  }) => void;
  deleteCircuitEdge: (nodeId: CircuitEdgeId) => void;
}
